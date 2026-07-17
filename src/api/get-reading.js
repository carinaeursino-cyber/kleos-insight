/* =========================================================
   KLEOS INSIGHT™ — Get Reading
   ARQUITECTURA v2: Protocol-Agnostic + Generación Lazy + Sliding Expiration

   Responsabilidades:
   1. Validar token de sesión
   2. Renovar TTL a 30 días (sliding expiration)
   3. Verificar que el protocolo está comprado (purchased: true)
   4. Cargar resultado del diagnóstico
   5. Si purchased y NO hay informe IA → generar lazy + guardar
   6. Si purchased y SÍ hay informe IA → cargar desde Redis
   7. Devolver datos básicos + informe IA
   
   Principio: La sesión pertenece al Perfil KLEOS, nunca a un protocolo individual.
   ========================================================= */

const { generateReport } = require('../lib/ai-generator');

const SESSION_TTL = 2592000; // 30 días en segundos

function creds() {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
  return url && token ? { url, token } : null;
}

async function redis(cmd) {
  const c = creds();
  if (!c) return null;
  const r = await fetch(c.url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${c.token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(cmd),
  });
  if (!r.ok) return null;
  return r.json();
}

module.exports = async (req, res) => {
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  try {
    const { token, protocol = "KIP-001" } = req.body || {};
    const cleanToken = String(token || "").trim();

    if (!cleanToken) {
      return res.status(400).json({ success: false, message: "Token requerido" });
    }

    const c = creds();

    // ── MODO MOCK (desarrollo local sin Redis) ──────────
    if (!c) {
      console.log("[get-reading] Redis no configurado. Usando modo mock.");
      if (cleanToken === "mock-user-token-12345") {
        const mockReading = {
          id: "mock123", user_id: "usr_mock123", protocol_code: protocol,
          respuestas: { company: "Empresa Test", self_perception: "premium, profesional, innovador", client_perception: "complicado, caro, frio" },
          kleosIndex: 63, perceptionLevel: "NIVEL II — PERCEPCIÓN DIFUSA", mainDiagnosis: "El mercado no te entiende", priorityNumberOne: "Aclara tu propuesta",
          dimensions: [
            {name: "Comprensión", score: 15}, {name: "Autoridad", score: 14}, {name: "Confianza", score: 13}, {name: "Diferenciación", score: 8}, {name: "Conversión", score: 13}
          ]
        };

        // Mock de informe IA (para pruebas locales)
        const mockAiReport = {
          truth_title: "Tu mercado no te percibe como crees",
          truth_body: "Existe una brecha significativa entre cómo te ves y cómo te perciben. Mientras te defines como premium e innovador, tu mercado te ve como complicado y frío. Esta desconexión está costando oportunidades.",
          truth_consequence: "Cada día que pasa sin cerrar esta brecha, pierdes clientes que podrían elegirte si entendieran tu valor real.",
          cost_items: [
            "Pérdida de clientes potenciales que no comprenden tu propuesta",
            "Comparación directa con competidores de menor valor pero mayor claridad",
            "Dependencia creciente de descuentos para cerrar ventas"
          ],
          opportunity_items: [
            "Aumento del valor percibido sin cambiar el producto",
            "Reducción del ciclo de venta al generar claridad inmediata",
            "Posicionamiento como la opción obvia en tu categoría"
          ],
          diagnosis_executive: "Tu negocio opera en una categoría mental de proveedor competente pero intercambiable. El mercado te reconoce capacidad técnica pero no te diferencia. Esto fija un techo invisible a tu precio y te obliga a competir por atención en lugar de por valor.",
          insight_main: "La percepción de tu negocio es superior a su capacidad de diferenciarse. El problema no está en lo que haces, sino en cómo lo comunicas.",
          priority_description: "Antes de invertir más en difusión, necesitas reformular tu diferenciación. El mercado debe entender en menos de 5 segundos por qué elegirte es la decisión lógica.",
          leak_description: "Tu principal fuga de crecimiento está en la diferenciación. Con un puntaje de 8/20, esta dimensión está limitando el impacto de todas tus demás fortalezas.",
          generatedAt: new Date().toISOString(),
          version: "1.0",
          engine: "mock-local"
        };

        return res.status(200).json({
          success: true,
          reading: mockReading,
          purchased: true,
          ai_report: mockAiReport
        });
      }
      return res.status(401).json({ success: false, message: "Token no reconocido (modo desarrollo). Use 'mock-user-token-12345'." });
    }

    // ── PRODUCCIÓN: Flujo completo ──────────────────────

    // 1. Validar token de sesión
    const tResp = await redis(["GET", `kleos:session:${cleanToken}`]);
    const userId = tResp && tResp.result;
    if (!userId) {
      return res.status(401).json({ success: false, message: "La sesión del portal expiró" });
    }

    // 2. NUEVO: Renovar TTL (sliding expiration)
    await redis(["EXPIRE", `kleos:session:${cleanToken}`, SESSION_TTL]);
    console.log(`[get-reading] ✓ TTL renovado a 30 días para sesión: ${cleanToken.substring(0, 8)}...`);

    // 3. Verificar que el protocolo existe en el perfil del usuario
    const protocolsResp = await redis(["SISMEMBER", `kleos:user:${userId}:protocols`, protocol]);
    if (!protocolsResp || protocolsResp.result !== 1) {
      return res.status(403).json({ success: false, message: "No posee acceso a este protocolo" });
    }

    // 4. NUEVO v2: Leer estado individual del protocolo
    const stateResp = await redis(["GET", `kleos:user:${userId}:protocol:${protocol}`]);
    const protocolState = stateResp && stateResp.result ? JSON.parse(stateResp.result) : null;

    const isPurchased = protocolState?.purchased ?? false;
    const isReportGenerated = protocolState?.reportGenerated ?? false;
    const reportId = protocolState?.reportId ?? null;

    // 5. Obtener el resultado del diagnóstico
    const histResp = await redis(["LRANGE", `kleos:user:${userId}:history`, "0", "-1"]);
    const history = (histResp && histResp.result) || [];
    
    let latestResultId = reportId;
    if (!latestResultId) {
        const protocolPrefix = `res_${protocol.toLowerCase().replace('-','')}_`;
        for (const rid of history) {
            if (rid.startsWith(protocolPrefix)) {
                latestResultId = rid; break;
            }
        }
    }

    if (!latestResultId) {
      return res.status(404).json({ success: false, message: "No hay resultados para este protocolo" });
    }

    const dResp = await redis(["GET", `kleos:result:${latestResultId}`]);
    const dResult = dResp && dResp.result;

    if (!dResult) {
      return res.status(404).json({ success: false, message: "Resultado no encontrado" });
    }

    const reading = JSON.parse(dResult);
    let aiReport = null;

    // 6. Si el protocolo está comprado, gestionar informe IA
    if (isPurchased) {
        if (isReportGenerated && reportId) {
            // 6a. Informe ya existe → cargar desde Redis
            console.log(`[get-reading] Cargando informe existente: kleos:report:${reportId}`);
            const reportResp = await redis(["GET", `kleos:report:${reportId}`]);
            if (reportResp && reportResp.result) {
                aiReport = JSON.parse(reportResp.result);
                console.log(`[get-reading] ✓ Informe cargado desde caché`);
            } else {
                console.warn(`[get-reading] Informe marcado como generado pero no encontrado. Regenerando...`);
            }
        }

        if (!aiReport) {
            // 6b. Informe NO existe → generar lazy
            console.log(`[get-reading] Generando informe IA para ${protocol}...`);
            
            const generated = await generateReport(reading);
            
            if (generated) {
                // Generar ID único para el informe
                const newReportId = `report_${protocol.toLowerCase().replace('-','')}_${userId}_${Date.now().toString(36)}`;
                
                // Guardar informe como recurso independiente
                const reportJson = JSON.stringify(generated);
                await redis(["SET", `kleos:report:${newReportId}`, reportJson]);
                console.log(`[get-reading] ✓ Informe guardado: kleos:report:${newReportId}`);
                
                // Actualizar estado del protocolo
                if (protocolState) {
                    protocolState.reportGenerated = true;
                    protocolState.reportId = newReportId;
                    await redis(["SET", `kleos:user:${userId}:protocol:${protocol}`, JSON.stringify(protocolState)]);
                    console.log(`[get-reading] ✓ Estado del protocolo actualizado`);
                }
                
                aiReport = generated;
            } else {
                console.error(`[get-reading] ✗ Error generando informe IA`);
                // Devolver lectura sin informe IA (el frontend mostrará error graceful)
            }
        }
    }

    // 7. Devolver respuesta completa
    return res.status(200).json({
      success: true,
      reading: reading,
      purchased: isPurchased,
      ai_report: aiReport
    });

  } catch (e) {
    console.error("get-reading error:", e);
    return res.status(500).json({ success: false, message: "Error interno del ecosistema" });
  }
};
