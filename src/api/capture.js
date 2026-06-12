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
    /* ---- Eventos de negocio (embudo de conversión) ---- */
    if (d.action === "event" && d.event) {
      const ALLOWED = [
        "startedProtocol",
        "completedProtocol",
        "openedResults",
        "clickedUnlock",
        "paid",
        "downloadedPdf",
        "abandonedProtocol",
        "resultGenerated",
        "clickedAdvisory",
        "clickedNextProtocol",
      ];
      const ev = clean(d.event, 30);
      if (ALLOWED.includes(ev)) {
        await redis(["HINCRBY", "kip001:events", ev, "1"]);

        // Duración total al completar (segundos)
        if (ev === "completedProtocol" && typeof d.duration === "number") {
          const dur = Math.max(0, Math.min(7200, Math.round(d.duration)));
          await redis(["LPUSH", "kip001:durations", String(dur)]);
          await redis(["LTRIM", "kip001:durations", "0", "999"]);
        }
        // Índice calculado al generar resultado
        if (ev === "resultGenerated" && typeof d.index === "number") {
          const idx = Math.max(0, Math.min(100, Math.round(d.index)));
          await redis(["LPUSH", "kip001:indices", String(idx)]);
          await redis(["LTRIM", "kip001:indices", "0", "999"]);
        }
      }
      res.status(200).json({ ok: true });
      return;
    }

    /* ---- Avance por pregunta (tracking granular) ---- */
    if (d.action === "question") {
      const n = Math.max(1, Math.min(12, Math.round(d.n || 0)));
      if (n >= 1) {
        await redis(["HINCRBY", "kip001:qanswered", `q${String(n).padStart(2, "0")}`, "1"]);
      }
      res.status(200).json({ ok: true });
      return;
    }

    /* ---- Estado parcial (abandono a mitad del protocolo) ---- */
    if (d.action === "partial") {
      const partial = {
        fecha: new Date().toISOString(),
        empresa: clean(d.empresa, 80),
        gate: !!d.gate, // true = abandonó en la pantalla de email (terminó las 12)
        entrada: Math.max(0, Math.min(12, Math.round(d.entrada || 0))),       // última vista
        respondidas: Math.max(0, Math.min(12, Math.round(d.respondidas || 0))), // últimas respondidas
        elapsed: Math.max(0, Math.min(7200, Math.round(d.elapsed || 0))),     // segundos transcurridos
        respuestas:
          d.respuestas && typeof d.respuestas === "object" ? d.respuestas : {},
      };
      const json = JSON.stringify(partial);
      if (json.length <= 8000) {
        await redis(["LPUSH", "kip001:partials", json]);
        await redis(["LTRIM", "kip001:partials", "0", "499"]); // máx 500
      }
      res.status(200).json({ ok: true });
      return;
    }

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
      await redis(["HINCRBY", "kip001:events", "paid", "1"]);
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
