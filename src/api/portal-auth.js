/* =========================================================
   KLEOS INSIGHT™ — Portal Auth
   ARQUITECTURA v2: Protocol-Agnostic + User-Centric + Sliding Expiration
   
   Autentica al usuario por email y devuelve el estado
   completo de cada protocolo en su Perfil KLEOS.
   
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
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  try {
    const { email } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(200).json({ success: false, exists: false, message: "No se proporcionó un correo electrónico válido." });
    }

    const c = creds();
    if (!c) {
      // Modo mock para desarrollo local
      if (normalizedEmail === "test@kleos.com" || normalizedEmail === "carina@kleos.com") {
        return res.status(200).json({
          success: true,
          exists: true,
          user: { id: "usr_mock123", email: normalizedEmail, name: "Usuario" },
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
          token: "mock-user-token-12345",
          expiresAt: Date.now() + (SESSION_TTL * 1000)
        });
      }
      return res.status(200).json({ success: false, exists: false, message: "No se encontró ninguna cuenta asociada a este correo." });
    }

    // 1. Buscar usuario por email
    const idResp = await redis(["GET", `kleos:email:${normalizedEmail}`]);
    const userId = idResp && idResp.result;

    if (!userId) {
      return res.status(200).json({ success: false, exists: false, message: "No se encontró ninguna cuenta asociada a este correo en el ecosistema KLEOS." });
    }

    // 2. Obtener datos del usuario
    const userResp = await redis(["GET", `kleos:user:${userId}`]);
    const userData = userResp && userResp.result ? JSON.parse(userResp.result) : null;

    if (!userData) {
      return res.status(200).json({ success: false, exists: false, message: "Error recuperando la cuenta del usuario." });
    }

    // 3. Obtener lista de protocolos completados (SET, compatibilidad)
    const protocolsResp = await redis(["SMEMBERS", `kleos:user:${userId}:protocols`]);
    const userProtocols = (protocolsResp && protocolsResp.result) || [];

    if (userProtocols.length === 0) {
      return res.status(200).json({ success: false, exists: false, message: "Esta cuenta no posee protocolos activos." });
    }

    // 4. NUEVO v2: Leer estado individual de cada protocolo
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

    // 5. Generar token de sesión con sliding expiration de 30 días
    const token = Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
    await redis(["SET", `kleos:session:${token}`, userId, "EX", SESSION_TTL.toString()]);
    
    const expiresAt = Date.now() + (SESSION_TTL * 1000);
    console.log(`[portal-auth] ✓ Sesión creada con TTL de 30 días para usuario: ${userId}`);

    return res.status(200).json({
      success: true,
      exists: true,
      user: { id: userData.id, name: userData.nombre, email: userData.email },
      protocols: userProtocols,           // Legacy: array de strings (compatibilidad)
      protocolsState: protocolsState,      // NUEVO v2: array de objetos con estado completo
      token: token,
      expiresAt: expiresAt                // NUEVO: timestamp de expiración
    });

  } catch (error) {
    console.error("portal-auth error:", error);
    return res.status(500).json({ success: false, exists: false, message: "Error interno al procesar la solicitud." });
  }
};
