/* =========================================================
   KLEOS INSIGHT™ — Recuperación del informe por token seguro
   GET /api/report?t=TOKEN  →  informe completo (JSON)

   El token es impredecible (no adivinable) y permanente:
   el cliente pagó, su informe queda disponible.
   También registra el evento downloadedPdf (primer acceso del día).
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

module.exports = async (req, res) => {
  if (!creds()) {
    res.status(503).json({ error: "storage_not_configured" });
    return;
  }

  const url = new URL(req.url, "http://x");
  const t = String(url.searchParams.get("t") || "").slice(0, 60);

  if (!t || t.length < 20) {
    res.status(400).json({ error: "missing_token" });
    return;
  }

  try {
    const g = await redis(["GET", `kip001:report:${t}`]);
    if (!g || !g.result) {
      res.status(404).json({ error: "not_found" });
      return;
    }

    // Evento de embudo: acceso al informe
    redis(["HINCRBY", "kip001:events", "downloadedPdf", "1"]).catch?.(() => {});

    res.setHeader("Cache-Control", "no-store");
    res.status(200).json(JSON.parse(g.result));
  } catch (e) {
    console.error("report error:", e && e.message);
    res.status(500).json({ error: "internal" });
  }
};
