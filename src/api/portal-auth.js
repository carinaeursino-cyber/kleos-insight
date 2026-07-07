/* =========================================================
   KLEOS INSIGHT™ — Portal Auth
   NUEVA ARQUITECTURA: USER-CENTRIC (Fase 1.5)
   
   Identifica al Usuario y comprueba qué protocolos posee.
   ========================================================= */

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
    const { email } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(200).json({ 
        success: false, 
        exists: false, 
        message: "No se proporcionó un correo electrónico válido." 
      });
    }

    const c = creds();
    if (!c) {
      // Mock para testeo local
      if (normalizedEmail === "test@kleos.com" || normalizedEmail === "carina@kleos.com") {
        return res.status(200).json({
          success: true,
          exists: true,
          user: { id: "usr_mock123", email: normalizedEmail, name: "Usuario" },
          protocols: ["KIP-001"],
          token: "mock-user-token-12345"
        });
      }
      return res.status(200).json({
          success: false,
          exists: false,
          message: "No se encontró ninguna cuenta asociada a este correo."
      });
    }

    // 1. Encontrar el USUARIO por su correo
    const idResp = await redis(["GET", `kleos:email:${normalizedEmail}`]);
    const userId = idResp && idResp.result;

    if (!userId) {
      // Verificamos si existe en el modelo legacy (para migraciones suaves)
      const legacyResp = await redis(["GET", `kip001:email:${normalizedEmail}`]);
      if (!legacyResp || !legacyResp.result) {
         return res.status(200).json({ 
           success: false, 
           exists: false, 
           message: "No se encontró ninguna cuenta asociada a este correo en el ecosistema KLEOS." 
         });
      }
      return res.status(200).json({ 
        success: false, 
        exists: false, 
        message: "Su cuenta se encuentra en un sistema heredado. Por favor contacte a soporte." 
      });
    }

    // 2. Traer la Entidad Usuario
    const userResp = await redis(["GET", `kleos:user:${userId}`]);
    const userData = userResp && userResp.result ? JSON.parse(userResp.result) : null;

    if (!userData) {
      return res.status(200).json({ 
        success: false, 
        exists: false, 
        message: "Error recuperando la cuenta del usuario." 
      });
    }

    // 3. Traer los Protocolos del Usuario
    const protocolsResp = await redis(["SMEMBERS", `kleos:user:${userId}:protocols`]);
    const userProtocols = (protocolsResp && protocolsResp.result) || [];

    if (userProtocols.length === 0) {
      return res.status(200).json({ 
        success: false, 
        exists: false, 
        message: "Esta cuenta no posee protocolos activos." 
      });
    }

    // 4. Generar Token de Sesión de Usuario (No de un diagnóstico específico)
    // El token ahora otorga acceso al USUARIO a su portal completo
    const token = Date.now().toString(36) + Math.random().toString(36).slice(2, 12);
    await redis(["SET", `kleos:session:${token}`, userId, "EX", "7200"]); // 2 horas

    // 5. Devolvemos el estado del Portal del usuario
    return res.status(200).json({
      success: true,
      exists: true,
      user: {
          id: userData.id,
          name: userData.nombre,
          email: userData.email
      },
      protocols: userProtocols,
      token: token
    });

  } catch (error) {
    console.error("portal-auth error:", error);
    return res.status(500).json({ 
      success: false, 
      exists: false, 
      message: "Error interno al procesar la solicitud." 
    });
  }
};