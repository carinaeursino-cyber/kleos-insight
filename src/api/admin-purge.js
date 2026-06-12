/* =========================================================
   KLEOS INSIGHT™ — Limpieza de datos (panel admin)
   Protegido con ADMIN_KEY. Solo método POST.

   Acciones:
   - { action: "delete_record", id }      → borra UN diagnóstico
   - { action: "purge_analytics" }        → borra eventos, embudo,
                                            duraciones, índices, abandonos
   - { action: "purge_records" }          → borra TODOS los diagnósticos
   - { action: "purge_all" }              → todo lo anterior
   Nota: los informes pagados (kip001:report:*) NUNCA se tocan —
   son compras de clientes.
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
    headers: { Authorization: `Bearer ${c.token}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
  });
  return r.ok ? r.json() : null;
}

async function purgeAnalytics() {
  await redis(["DEL", "kip001:events"]);
  await redis(["DEL", "kip001:qanswered"]);
  await redis(["DEL", "kip001:durations"]);
  await redis(["DEL", "kip001:indices"]);
  await redis(["DEL", "kip001:partials"]);
}

async function purgeRecords() {
  const idsRes = await redis(["LRANGE", "kip001:ids", "0", "-1"]);
  const ids = (idsRes && idsRes.result) || [];
  for (const id of ids) {
    await redis(["DEL", `kip001:rec:${id}`]);
  }
  await redis(["DEL", "kip001:ids"]);
  return ids.length;
}

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) {
    res.status(503).json({ error: "admin_key_not_configured" });
    return;
  }

  const d = req.body || {};
  if (String(d.key || "") !== adminKey) {
    res.status(403).json({ error: "forbidden" });
    return;
  }

  if (!creds()) {
    res.status(503).json({ error: "storage_not_configured" });
    return;
  }

  try {
    /* ---- Borrar un diagnóstico individual ---- */
    if (d.action === "delete_record" && d.id) {
      const id = String(d.id).slice(0, 40);
      await redis(["DEL", `kip001:rec:${id}`]);
      await redis(["LREM", "kip001:ids", "0", id]);
      res.status(200).json({ ok: true, deleted: id });
      return;
    }

    /* ---- Purgar solo analítica ---- */
    if (d.action === "purge_analytics") {
      await purgeAnalytics();
      res.status(200).json({ ok: true, purged: "analytics" });
      return;
    }

    /* ---- Purgar solo diagnósticos ---- */
    if (d.action === "purge_records") {
      const n = await purgeRecords();
      res.status(200).json({ ok: true, purged: "records", count: n });
      return;
    }

    /* ---- Purga total ---- */
    if (d.action === "purge_all") {
      await purgeAnalytics();
      const n = await purgeRecords();
      res.status(200).json({ ok: true, purged: "all", records: n });
      return;
    }

    res.status(400).json({ error: "unknown_action" });
  } catch (e) {
    console.error("purge error:", e && e.message);
    res.status(500).json({ error: "internal" });
  }
};
