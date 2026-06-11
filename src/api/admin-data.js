/* =========================================================
   KLEOS INSIGHT™ — Datos para el panel administrador
   Protegido con clave: variable de entorno ADMIN_KEY (Vercel).

   GET /api/admin-data?key=XXX            → lista resumida
   GET /api/admin-data?key=XXX&id=YYY     → registro completo
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
  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    res.status(503).json({ error: "admin_key_not_configured" });
    return;
  }

  const url = new URL(req.url, "http://x");
  const key = url.searchParams.get("key") || "";
  if (key !== adminKey) {
    res.status(403).json({ error: "forbidden" });
    return;
  }

  if (!creds()) {
    res.status(503).json({ error: "storage_not_configured" });
    return;
  }

  try {
    const id = url.searchParams.get("id");

    /* ---- Detalle de un registro ---- */
    if (id) {
      const g = await redis(["GET", `kip001:rec:${String(id).slice(0, 40)}`]);
      if (!g || !g.result) {
        res.status(404).json({ error: "not_found" });
        return;
      }
      res.status(200).json(JSON.parse(g.result));
      return;
    }

    /* ---- Embudo de conversión ---- */
    const evRes = await redis(["HGETALL", "kip001:events"]);
    const evArr = (evRes && evRes.result) || [];
    const events = {};
    for (let i = 0; i < evArr.length; i += 2) {
      events[evArr[i]] = parseInt(evArr[i + 1], 10) || 0;
    }
    const partialsRes = await redis(["LLEN", "kip001:partials"]);
    const partials = (partialsRes && partialsRes.result) || 0;

    /* ---- Lista resumida (últimos 200) ---- */
    const idsRes = await redis(["LRANGE", "kip001:ids", "0", "199"]);
    const ids = (idsRes && idsRes.result) || [];
    if (!ids.length) {
      res.status(200).json({ total: 0, records: [], events, partials });
      return;
    }

    const keys = ids.map((i) => `kip001:rec:${i}`);
    const mg = await redis(["MGET", ...keys]);
    const rows = ((mg && mg.result) || [])
      .filter(Boolean)
      .map((j) => {
        try {
          const r = JSON.parse(j);
          return {
            id: r.id,
            fecha: r.fecha,
            empresa: r.empresa,
            nombre: r.nombre,
            email: r.email,
            kleosIndex: r.kleosIndex,
            perceptionLevel: r.perceptionLevel,
            pattern: r.pattern,
            paid: !!r.paid,
          };
        } catch {
          return null;
        }
      })
      .filter(Boolean);

    res.status(200).json({ total: rows.length, records: rows, events, partials });
  } catch (e) {
    console.error("admin-data error:", e && e.message);
    res.status(500).json({ error: "internal" });
  }
};
