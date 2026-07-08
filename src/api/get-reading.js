/* =========================================================
   KLEOS INSIGHT™ — Get Reading
   NUEVA ARQUITECTURA: USER-CENTRIC (Fase 1.5)
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
  if (req.method !== "POST") return res.status(405).json({ error: "method_not_allowed" });

  try {
    const { token, protocol = "KIP-001" } = req.body || {};
    const cleanToken = String(token || "").trim();

    if (!cleanToken) {
      return res.status(400).json({ success: false, message: "Token requerido" });
    }

    const c = creds();
    if (!c) {
      if (cleanToken === "mock-user-token-12345") {
        const mockReading = {
            id: "mock123", user_id: "usr_mock123", protocol_code: protocol,
            respuestas: { company: "Empresa Test", self_perception: "premium, profesional, innovador", client_perception: "complicado, caro, frio" },
            kleosIndex: 63, perceptionLevel: "NIVEL II — PERCEPCIÓN DIFUSA", mainDiagnosis: "El mercado no te entiende", priorityNumberOne: "Aclara tu propuesta",
            dimensions: [
                {name: "Comprensión", score: 15}, {name: "Autoridad", score: 14}, {name: "Confianza", score: 13}, {name: "Diferenciación", score: 8}, {name: "Conversión", score: 13}
            ]
        };
        return res.status(200).json({ success: true, reading: mockReading });
      }
      return res.status(401).json({ success: false, message: "Sesión de usuario inválida" });
    }

    const tResp = await redis(["GET", `kleos:session:${cleanToken}`]);
    const userId = tResp && tResp.result;

    if (!userId) return res.status(401).json({ success: false, message: "La sesión del portal expiró" });

    const protocolsResp = await redis(["SISMEMBER", `kleos:user:${userId}:protocols`, protocol]);
    if (!protocolsResp || protocolsResp.result !== 1) return res.status(403).json({ success: false, message: "No posee acceso a este protocolo" });

    const histResp = await redis(["LRANGE", `kleos:user:${userId}:history`, "0", "-1"]);
    const history = (histResp && histResp.result) || [];
    
    let latestResultId = null;
    const protocolPrefix = `res_${protocol.toLowerCase().replace('-','')}_`;
    for (const rid of history) {
        if (rid.startsWith(protocolPrefix)) {
            latestResultId = rid; break;
        }
    }

    if (!latestResultId) return res.status(404).json({ success: false, message: "No hay resultados para este protocolo" });

    const dResp = await redis(["GET", `kleos:result:${latestResultId}`]);
    const dResult = dResp && dResp.result;

    if (!dResult) return res.status(404).json({ success: false, message: "Resultado no encontrado" });

    return res.status(200).json({ success: true, reading: JSON.parse(dResult) });

  } catch (e) {
    console.error("get-reading error:", e);
    return res.status(500).json({ success: false, message: "Error interno del ecosistema" });
  }
};