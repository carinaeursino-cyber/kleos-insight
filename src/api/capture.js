/* =========================================================
   KLEOS INSIGHT™ — Captura de diagnósticos
   Guarda cada ejecución de KIP-001 en Upstash Redis (Vercel).

   Variables de entorno (se inyectan solas al conectar
   Upstash Redis desde Vercel → Storage):
   - KV_REST_API_URL  / KV_REST_API_TOKEN        (Vercel KV)
   - UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN (Upstash)
   Soporta ambos nombres.

   Si el storage no está configurado, responde ok:false sin
   romper la experiencia del usuario.
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
  if (!r.ok) {
    console.error("redis error:", r.status, (await r.text()).slice(0, 200));
    return null;
  }
  return r.json();
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  if (!creds()) {
    // Storage aún no configurado: no romper la UX
    res.status(200).json({ ok: false, stored: false });
    return;
  }

  const d = req.body || {};
  const clean = (s, n) => String(s == null ? "" : s).slice(0, n).trim();

  try {
    /* ---- Marcar un registro como pagado (tras desbloqueo) ---- */
    if (d.action === "mark_paid" && d.id) {
      const id = clean(d.id, 40);
      const g = await redis(["GET", `kip001:rec:${id}`]);
      if (g && g.result) {
        try {
          const rec = JSON.parse(g.result);
          rec.paid = true;
          rec.paidAt = new Date().toISOString();
          await redis(["SET", `kip001:rec:${id}`, JSON.stringify(rec)]);
        } catch { /* noop */ }
      }
      res.status(200).json({ ok: true });
      return;
    }

    /* ---- Crear registro de diagnóstico ---- */
    const id =
      Date.now().toString(36) + Math.random().toString(36).slice(2, 8);

    const rec = {
      id,
      fecha: new Date().toISOString(),
      nombre: clean(d.nombre, 80),
      email: clean(d.email, 120),
      empresa: clean(d.empresa, 80),
      respuestas:
        d.respuestas && typeof d.respuestas === "object" ? d.respuestas : {},
      declaraciones: Array.isArray(d.declaraciones)
        ? d.declaraciones.slice(0, 12).map((x) => ({
            q: clean(x.q, 200),
            a: clean(x.a, 200),
          }))
        : [],
      kleosIndex: Math.max(0, Math.min(100, Math.round(d.kleosIndex || 0))),
      perceptionLevel: clean(d.perceptionLevel, 80),
      pattern: clean(d.pattern, 60),
      mainDiagnosis: clean(d.mainDiagnosis, 1000),
      priorityNumberOne: clean(d.priorityNumberOne, 600),
      insightDetected: clean(d.insightDetected, 800),
      dimensions: Array.isArray(d.dimensions)
        ? d.dimensions.slice(0, 5).map((x) => ({
            name: clean(x.name, 30),
            score: Math.max(0, Math.min(20, Math.round(x.score || 0))),
          }))
        : [],
      paid: false,
    };

    const json = JSON.stringify(rec);
    if (json.length > 20000) {
      res.status(400).json({ error: "too_large" });
      return;
    }

    await redis(["SET", `kip001:rec:${id}`, json]);
    await redis(["LPUSH", "kip001:ids", id]);

    res.status(200).json({ ok: true, id });
  } catch (e) {
    console.error("capture error:", e && e.message);
    // Nunca romper la experiencia del usuario por un fallo de captura
    res.status(200).json({ ok: false });
  }
};
