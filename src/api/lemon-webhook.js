/**
 * KLEOS INSIGHT™ — Lemon Squeezy Webhook
 * 
 * Endpoint: POST /api/lemon-webhook
 * 
 * Responsabilidades:
 * 1. Validar firma HMAC de Lemon Squeezy (seguridad)
 * 2. Extraer datos del evento de compra
 * 3. Mapear producto → protocolo KIP
 * 4. Actualizar estado del protocolo en el Perfil KLEOS
 * 5. Responder 200 OK rápidamente (sin generar IA)
 * 
 * La generación del informe IA ocurre lazy en get-reading.js
 */

const crypto = require('crypto');
const { getProtocolCode } = require('../config/product-mapping');

// Deshabilitar body parser automático de Vercel para recibir body raw
export const config = {
    api: {
        bodyParser: false
    }
};

/**
 * Lee el body raw de la request como string
 */
async function getRawBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            resolve(body);
        });
        req.on('error', reject);
    });
}

/**
 * Conecta a Redis usando variables de entorno de Vercel KV
 */
function getRedisClient() {
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;

    if (!kvUrl || !kvToken) {
        throw new Error('Variables de entorno KV_REST_API_URL o KV_REST_API_TOKEN no configuradas');
    }

    return {
        async get(key) {
            const response = await fetch(`${kvUrl}/get/${encodeURIComponent(key)}`, {
                headers: { 'Authorization': `Bearer ${kvToken}` }
            });
            if (!response.ok) return null;
            const data = await response.json();
            return data.result ? JSON.parse(data.result) : null;
        },

        async set(key, value) {
            const response = await fetch(`${kvUrl}/set/${encodeURIComponent(key)}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${kvToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(value)
            });
            return response.ok;
        }
    };
}

/**
 * Valida la firma HMAC de Lemon Squeezy
 * @param {string} payload - Body raw de la petición
 * @param {string} signature - Header X-Signature
 * @returns {boolean}
 */
function validateSignature(payload, signature) {
    const secret = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET;
    if (!secret) {
        console.error('[Webhook] LEMON_SQUEEZY_WEBHOOK_SECRET no configurada');
        return false;
    }

    const hmac = crypto.createHmac('sha256', secret);
    const digest = hmac.update(payload).digest('hex');
    
    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(digest)
    );
}

/**
 * Handler principal del webhook
 */
module.exports = async (req, res) => {
    console.log('[Webhook] Recibido evento de Lemon Squeezy');

    // Solo permitir POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        // 1. Leer body raw (ANTES de parsear)
        const rawBody = await getRawBody(req);
        console.log('[Webhook] Body raw length:', rawBody.length);

        // 2. Validar firma HMAC sobre body raw
        const signature = req.headers['x-signature'];
        if (!signature) {
            console.error('[Webhook] Falta header X-Signature');
            return res.status(401).json({ error: 'Missing signature' });
        }

        if (!validateSignature(rawBody, signature)) {
            console.error('[Webhook] Firma HMAC inválida');
            console.error('[Webhook] Signature recibida:', signature);
            console.error('[Webhook] Body raw (primeros 200 chars):', rawBody.substring(0, 200));
            return res.status(401).json({ error: 'Invalid signature' });
        }

        console.log('[Webhook] ✓ Firma validada');

        // 3. Parsear JSON manualmente
        const event = JSON.parse(rawBody);
        const eventName = event.meta?.event_name;
        console.log('[Webhook] Evento:', eventName);

        // Solo procesar eventos de orden creada
        if (eventName !== 'order_created') {
            console.log('[Webhook] Evento ignorado (solo procesamos order_created)');
            return res.status(200).json({ status: 'ignored' });
        }

        const orderData = event.data?.attributes;
        if (!orderData) {
            console.error('[Webhook] Estructura de evento inválida');
            return res.status(400).json({ error: 'Invalid event structure' });
        }

        const customerEmail = orderData.user_email;
        const productId = event.data?.relationships?.['first-order-item']?.data?.['product_id'];
        const orderId = event.data?.id;

        if (!customerEmail || !productId || !orderId) {
            console.error('[Webhook] Datos incompletos:', { customerEmail, productId, orderId });
            return res.status(400).json({ error: 'Missing order data' });
        }

        console.log('[Webhook] Datos extraídos:', { customerEmail, productId, orderId });

        // 4. Mapear producto → protocolo KIP
        const protocolCode = getProtocolCode(String(productId));
        if (!protocolCode) {
            console.error('[Webhook] Producto no mapeado:', productId);
            return res.status(400).json({ error: 'Unknown product' });
        }

        console.log('[Webhook] Protocolo KIP:', protocolCode);

        // 5. Buscar usuario por email
        const redis = getRedisClient();
        const userId = await redis.get(`kleos:email:${customerEmail}`);

        if (!userId) {
            console.error('[Webhook] Usuario no encontrado:', customerEmail);
            // Retornar 200 para que Lemon Squeezy no reintente
            // El usuario puede no haber completado el diagnóstico aún
            return res.status(200).json({ status: 'user_not_found' });
        }

        console.log('[Webhook] Usuario encontrado:', userId);

        // 6. Actualizar estado del protocolo
        const protocolKey = `kleos:user:${userId}:protocol:${protocolCode}`;
        let protocolState = await redis.get(protocolKey);

        if (!protocolState) {
            // Si no existe el estado del protocolo, crearlo
            // Esto puede pasar si el usuario pagó antes de completar el diagnóstico
            protocolState = {
                completed: false,
                purchased: false,
                purchaseDate: null,
                purchaseOrderId: null,
                purchaseProvider: null,
                reportGenerated: false,
                reportId: null
            };
        }

        // Actualizar campos de compra
        protocolState.purchased = true;
        protocolState.purchaseDate = new Date().toISOString();
        protocolState.purchaseOrderId = orderId;
        protocolState.purchaseProvider = 'lemon_squeezy';

        // Guardar estado actualizado
        const saved = await redis.set(protocolKey, protocolState);
        if (!saved) {
            console.error('[Webhook] Error guardando estado del protocolo');
            return res.status(500).json({ error: 'Failed to update protocol state' });
        }

        console.log('[Webhook] ✓ Estado del protocolo actualizado:', protocolCode);

        // 7. Responder 200 OK rápidamente
        // NO generamos el informe IA aquí (lo hará get-reading.js lazy)
        return res.status(200).json({
            status: 'success',
            userId: userId,
            protocolCode: protocolCode,
            orderId: orderId
        });

    } catch (error) {
        console.error('[Webhook] Error procesando evento:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
