/* =========================================================
   KLEOS INSIGHT™ — KIP-001/C · Desbloqueo de lectura completa
   1. Valida la clave de acceso (license key) contra Lemon Squeezy
   2. Genera la lectura completa vía IA (Groq / Gemini)

   Variables de entorno (Vercel):
   - GROQ_API_KEY        (o GEMINI_API_KEY)
   - LEMON_STORE_ID      (opcional pero recomendado: valida que la
                          clave pertenezca a TU tienda)
   ========================================================= */

const GROQ_MODEL = "llama-3.3-70b-versatile";
const GEMINI_MODEL = "gemini-2.5-flash";

const SYSTEM_VOICE = `
Eres el motor de lectura de KIP-001, el Protocolo de Diagnóstico de Percepción de KLEOS Digital Studio, un estudio de arquitectura de percepción.

TONO OBLIGATORIO:
- Frío. Preciso. Elegante. Analítico.
- Tratamiento de "usted", siempre.
- Observaciones inteligentes, nunca lenguaje vendedor.
- Autoridad sin arrogancia. Nada de entusiasmo artificial.
- Español impecable.

PROHIBIDO ABSOLUTAMENTE:
- "El problema no es..." / "La clave está en..." / "Transforma tu negocio..."
- Signos de exclamación, emojis, mayúsculas de énfasis.
- Mencionar que eres una IA.
- Consejos genéricos de marketing.

Esta es la LECTURA COMPLETA que el cliente pagó. Debe sentirse como el informe
de un consultor de élite: específico, accionable, sin relleno.

Respondes únicamente con JSON válido, sin markdown ni texto adicional.
`.trim();

function buildFullPrompt(d) {
  const dims = (d.dimensions || [])
    .map((x) => `- ${x.name}: ${x.score}/20`)
    .join("\n");

  return `
DATOS DE LA EJECUCIÓN DEL PROTOCOLO:

Negocio: ${d.company || "no declarado"}
Autopercepción: "${d.self_perception || "no declarada"}"
Percepción externa: "${d.client_perception || "no declarada"}"
Diferenciador declarado: "${d.differentiator || "no declarado"}"

Índice Kleos: ${d.index}/100
Nivel: ${d.level}
Medición por dimensión:
${dims}
Dimensión más débil: ${d.weakest}

GENERA EXACTAMENTE ESTE JSON:

{
  "dim_readings": {
    "trust": "...",
    "differentiation": "...",
    "journey": "..."
  },
  "truth_full": "...",
  "diagnosis_full": "...",
  "sequence": ["...", "...", "..."],
  "first_error": "..."
}

ESPECIFICACIONES:

"dim_readings": para cada una de las tres dimensiones reservadas (Confianza, Diferenciación, Recorrido), 1-2 frases que interpreten SU puntaje específico conectado con los datos declarados del negocio. No definiciones genéricas: lectura del caso.

"truth_full": la observación crítica COMPLETA (3-4 frases). Identifica el punto exacto donde el negocio pierde la decisión del comprador y la señal específica que lo provoca. Sin cortar, sin puntos suspensivos. Debe sentirse reveladora.

"diagnosis_full": la lectura principal completa (3-5 frases). El diagnóstico central: qué categoría mental ocupa hoy el negocio, por qué esa categoría limita su precio, y qué reposicionamiento estructural corresponde.

"sequence": exactamente 3 movimientos de corrección, en orden de ejecución. Cada uno: una frase imperativa precisa y accionable (ej. "Reescriba su propuesta de valor en una sola frase verificable y úsela idéntica en todos los canales."). Específicos para este caso.

"first_error": el error que NO debe cometer primero (1-2 frases). El movimiento tentador que la mayoría hace y que empeora la percepción.

Todo en español. Solo el JSON.
`.trim();
}

/* ---------- Validación de licencia (Lemon Squeezy) ---------- */
async function validateLicense(licenseKey) {
  // 1º intento: activar (marca la clave como usada la primera vez)
  const tryCall = async (endpoint, body) => {
    const r = await fetch(`https://api.lemonsqueezy.com/v1/licenses/${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(body),
    });
    return r.json().catch(() => null);
  };

  let res = await tryCall("activate", {
    license_key: licenseKey,
    instance_name: "KIP-001-C",
  });

  // Si ya estaba activada (límite alcanzado), validar en su lugar
  if (!res || res.activated !== true) {
    res = await tryCall("validate", { license_key: licenseKey });
    if (!res || res.valid !== true) return { ok: false };
  }

  const meta = res.meta || {};
  const status = res.license_key && res.license_key.status;

  // Verificación de tienda (si está configurada)
  const storeId = process.env.LEMON_STORE_ID;
  if (storeId && String(meta.store_id) !== String(storeId)) {
    return { ok: false };
  }

  if (status && status !== "active") return { ok: false };

  return { ok: true };
}

/* ---------- Proveedores IA ---------- */
async function callGroq(key, prompt) {
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.75,
      max_tokens: 2048,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_VOICE },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!r.ok) {
    console.error("Groq error:", r.status, (await r.text()).slice(0, 300));
    return null;
  }
  const json = await r.json();
  return json?.choices?.[0]?.message?.content || null;
}

async function callGemini(key, prompt) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": key },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_VOICE }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.75,
          maxOutputTokens: 2048,
          responseMimeType: "application/json",
        },
      }),
    }
  );
  if (!r.ok) {
    console.error("Gemini error:", r.status, (await r.text()).slice(0, 300));
    return null;
  }
  const json = await r.json();
  return json?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

/* ---------- Handler ---------- */
module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "method_not_allowed" });
    return;
  }

  try {
    const d = req.body || {};
    const licenseKey = String(d.license_key || "").trim();

    if (!licenseKey || licenseKey.length < 10) {
      res.status(400).json({ error: "missing_license" });
      return;
    }
    if (typeof d.index !== "number" || !Array.isArray(d.dimensions)) {
      res.status(400).json({ error: "bad_request" });
      return;
    }

    // 1. Validar la compra
    const lic = await validateLicense(licenseKey);
    if (!lic.ok) {
      res.status(403).json({ error: "invalid_license" });
      return;
    }

    // 2. Generar la lectura completa
    const clean = (s, max) => String(s || "").slice(0, max).trim();
    const data = {
      company: clean(d.company, 80),
      self_perception: clean(d.self_perception, 100),
      client_perception: clean(d.client_perception, 100),
      differentiator: clean(d.differentiator, 300),
      index: Math.max(0, Math.min(100, Math.round(d.index))),
      level: clean(d.level, 80),
      weakest: clean(d.weakest, 40),
      dimensions: d.dimensions.slice(0, 5).map((x) => ({
        name: clean(x.name, 30),
        score: Math.max(0, Math.min(20, Math.round(x.score || 0))),
      })),
    };

    const prompt = buildFullPrompt(data);
    const groqKey = process.env.GROQ_API_KEY;
    const geminiKey = process.env.GEMINI_API_KEY;

    let text = null;
    if (groqKey) text = await callGroq(groqKey, prompt);
    if (!text && geminiKey) text = await callGemini(geminiKey, prompt);

    if (!text) {
      res.status(502).json({ error: "provider_error" });
      return;
    }

    let full;
    try {
      full = JSON.parse(text);
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      full = m ? JSON.parse(m[0]) : null;
    }

    if (
      !full ||
      !full.dim_readings ||
      typeof full.truth_full !== "string" ||
      typeof full.diagnosis_full !== "string" ||
      !Array.isArray(full.sequence)
    ) {
      res.status(502).json({ error: "bad_generation" });
      return;
    }

    res.status(200).json({
      dim_readings: {
        trust: String(full.dim_readings.trust || "").trim(),
        differentiation: String(full.dim_readings.differentiation || "").trim(),
        journey: String(full.dim_readings.journey || "").trim(),
      },
      truth_full: full.truth_full.trim(),
      diagnosis_full: full.diagnosis_full.trim(),
      sequence: full.sequence.slice(0, 3).map((s) => String(s).trim()),
      first_error: String(full.first_error || "").trim(),
    });
  } catch (e) {
    console.error("unlock error:", e && e.message);
    res.status(500).json({ error: "internal" });
  }
};