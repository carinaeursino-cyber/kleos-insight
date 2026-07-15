/* =========================================================
   KLEOS INSIGHT™ — Captura de diagnósticos
   ARQUITECTURA v2: Protocol-Agnostic + User-Centric

   El usuario es la entidad principal. Los diagnósticos son
   protocolos almacenados dentro de la cuenta del usuario.
   Cada protocolo tiene su propio estado independiente.
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
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  if (!creds()) {
    return res.status(200).json({ ok: false, stored: false });
  }

  const d = req.body || {};
  const clean = (s, n) => String(s == null ? "" : s).slice(0, n).trim();

  try {
    if (d.action === "event" || d.action === "question" || d.action === "partial" || d.action === "mark_paid") {
      res.status(200).json({ ok: true });
      return;
    }

    // 1. Normalizamos los datos de entrada
    const rawEmail = clean(d.email, 120).toLowerCase();
    const nombre = clean(d.nombre, 80);
    const empresa = clean(d.empresa, 80);
    const now = new Date().toISOString();

    if (!rawEmail) {
      return res.status(400).json({ error: "email_required" });
    }

    // 2. Gestionar la ENTIDAD USUARIO
    let userId;
    const userLookup = await redis(["GET", `kleos:email:${rawEmail}`]);
    
    if (userLookup && userLookup.result) {
      userId = userLookup.result;
      const userDataStr = await redis(["GET", `kleos:user:${userId}`]);
      if (userDataStr && userDataStr.result) {
         try {
             const userData = JSON.parse(userDataStr.result);
             userData.last_access = now;
             if (!userData.nombre && nombre) userData.nombre = nombre;
             if (!userData.empresa && empresa) userData.empresa = empresa;
             await redis(["SET", `kleos:user:${userId}`, JSON.stringify(userData)]);
         } catch(e) {}
      }
    } else {
      userId = "usr_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
      const newUser = {
        id: userId,
        email: rawEmail,
        nombre: nombre,
        empresa: empresa,
        created_at: now,
        last_access: now
      };
      await redis(["SET", `kleos:user:${userId}`, JSON.stringify(newUser)]);
      await redis(["SET", `kleos:email:${rawEmail}`, userId]);
    }

    // 3. Gestionar la ENTIDAD PROTOCOLO (Resultados)
    const protocolCode = "KIP-001";
    const resultId = `res_${protocolCode.toLowerCase().replace('-','')}_${userId}`;
    
    const protocolResult = {
      id: resultId,
      user_id: userId,
      protocol_code: protocolCode,
      created_at: now,
      respuestas: d.respuestas && typeof d.respuestas === "object" ? d.respuestas : {},
      kleosIndex: Math.max(0, Math.min(100, Math.round(d.kleosIndex || 0))),
      perceptionLevel: clean(d.perceptionLevel, 80),
      mainDiagnosis: clean(d.mainDiagnosis, 1000),
      priorityNumberOne: clean(d.priorityNumberOne, 600),
      insightDetected: clean(d.insightDetected, 800),
      dimensions: Array.isArray(d.dimensions) ? d.dimensions.slice(0, 5).map(x => ({
          name: clean(x.name, 30),
          score: Math.max(0, Math.min(20, Math.round(x.score || 0))),
      })) : [],
      paid: false, // Legacy: mantener para compatibilidad
    };

    const json = JSON.stringify(protocolResult);
    if (json.length > 20000) return res.status(400).json({ error: "too_large" });
    await redis(["SET", `kleos:result:${resultId}`, json]);

    // 4. Vincular el protocolo al historial del usuario (SET y LIST para compatibilidad)
    await redis(["SADD", `kleos:user:${userId}:protocols`, protocolCode]);
    await redis(["LPUSH", `kleos:user:${userId}:history`, resultId]);

    // 5. NUEVO v2: Crear estado individual del protocolo
    // Este es el estado que evoluciona de forma independiente por protocolo
    const protocolState = {
        completed: true,
        purchased: false,
        purchaseDate: null,
        purchaseOrderId: null,
        purchaseProvider: null,
        reportGenerated: false,
        reportId: resultId
    };
    await redis(["SET", `kleos:user:${userId}:protocol:${protocolCode}`, JSON.stringify(protocolState)]);

    // 6. Legacy: guardar registro adicional (compatibilidad con sistema anterior)
    const legacyId = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
    await redis(["SET", `kip001:rec:${legacyId}`, json]);

    res.status(200).json({ ok: true, user_id: userId, result_id: resultId });
  } catch (e) {
    console.error("capture error:", e);
    res.status(200).json({ ok: false });
  }
};
