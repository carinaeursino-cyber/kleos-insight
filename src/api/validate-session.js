/* =========================================================
   KLEOS INSIGHT™ — Validate Session
   ARQUITECTURA v2: Protocol-Agnostic + Sliding Expiration
   
   Responsabilidades:
   1. Validar token de sesión contra Redis
   2. Renovar TTL a 30 días (sliding expiration)
   3. Devolver información básica del usuario y perfil
   4. Si sesión inválida, devolver valid: false
   
   Principio: La sesión pertenece al Perfil KLEOS, nunca a un protocolo individual.
   ========================================================= */

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
  if (req.method !== "POST") {
    return res.status(405).json({ error: "method_not_allowed" });
  }

  try {
    const { token } = req.body || {};
    const cleanToken = String(token || "").trim();

    if (!cleanToken) {
      return res.status(200).json({ valid: false, message: "Token requerido" });
    }

    const c = creds();

    // ── MODO MOCK (desarrollo local sin Redis) ──────────
    if (!c) {
      console.log("[validate-session] Redis no configurado. Usando modo mock.");
      if (cleanToken === "mock-user-token-12345") {
        return res.status(200).json({
          valid: true,
          userId: "usr_mock123",
          email: "test@kleos.com",
          protocols: ["KIP-001"],
          protocolsState: [{
            code: "KIP-001",
            completed: true,
            purchased: true,
            purchaseDate: "2026-07-15T10:00:00Z",
            purchaseOrderId: "mock-order-123",
            purchaseProvider: "lemon_squeezy",
            reportGenerated: true,
            reportId: "res_kip001_usr_mock123"
          }],
          expiresAt: Date.now() + (SESSION_TTL * 1000),
          message: "Sesión válida (modo desarrollo)"
        });
      }
      return res.status(200).json({ valid: false, message: "Token no reconocido (modo desarrollo)" });
    }

    // ── PRODUCCIÓN: Validar sesión ──────────────────────

    // 1. Validar token de sesión
    const tResp = await redis(["GET", `kleos:session:${cleanToken}`]);
    const userId = tResp && tResp.result;
    
    if (!userId) {
      return res.status(200).json({ valid: false, message: "Sesión expirada o inválida" });
    }

    // 2. Renovar TTL (sliding expiration)
    await redis(["EXPIRE", `kleos:session:${cleanToken}`, SESSION_TTL]);
    console.log(`[validate-session] ✓ TTL renovado a 30 días para sesión: ${cleanToken.substring(0, 8)}...`);

    // 3. Obtener datos del usuario
    const userResp = await redis(["GET", `kleos:user:${userId}`]);
    const userData = userResp && userResp.result ? JSON.parse(userResp.result) : null;

    if (!userData) {
      return res.status(200).json({ valid: false, message: "Usuario no encontrado" });
    }

    // 4. Obtener lista de protocolos completados
    const protocolsResp = await redis(["SMEMBERS", `kleos:user:${userId}:protocols`]);
    const userProtocols = (protocolsResp && protocolsResp.result) || [];

    // 5. Obtener estado individual de cada protocolo
    const protocolsState = [];
    for (const protocolCode of userProtocols) {
      const stateResp = await redis(["GET", `kleos:user:${userId}:protocol:${protocolCode}`]);
      const state = stateResp && stateResp.result ? JSON.parse(stateResp.result) : null;
      
      protocolsState.push({
        code: protocolCode,
        completed: state?.completed ?? true,
        purchased: state?.purchased ?? false,
        purchaseDate: state?.purchaseDate ?? null,
        purchaseOrderId: state?.purchaseOrderId ?? null,
        purchaseProvider: state?.purchaseProvider ?? null,
        reportGenerated: state?.reportGenerated ?? false,
        reportId: state?.reportId ?? null
      });
    }

    // 6. Calcular expiración restante
    const ttlResp = await redis(["TTL", `kleos:session:${cleanToken}`]);
    const ttlSeconds = ttlResp && ttlResp.result ? ttlResp.result : SESSION_TTL;
    const expiresAt = Date.now() + (ttlSeconds * 1000);

    // 7. Devolver respuesta completa
    return res.status(200).json({
      valid: true,
      userId: userData.id,
      email: userData.email,
      name: userData.nombre || userData.name,
      protocols: userProtocols,
      protocolsState: protocolsState,
      expiresAt: expiresAt,
      message: "Sesión válida"
    });

  } catch (e) {
    console.error("validate-session error:", e);
    return res.status(500).json({ valid: false, message: "Error interno del ecosistema" });
  }
};
