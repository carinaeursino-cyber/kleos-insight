/* =========================================================
   KLEOS INSIGHT™ — KIP-001 · Función serverless (Vercel)
   Genera la lectura personalizada vía IA.

   PROVEEDORES SOPORTADOS (usa el primero disponible):
   1. GROQ_API_KEY    → Groq (Llama 3.3 70B) · gratis, sin tarjeta
   2. GEMINI_API_KEY  → Google Gemini 2.5 Flash

   Las keys viven en Vercel → Settings → Environment Variables.
   Nunca se exponen al navegador.
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
- Español impecable, sin anglicismos innecesarios.

PROHIBIDO ABSOLUTAMENTE:
- "El problema no es..." / "La clave está en..." / "Transforma tu negocio..."
- "Lleva tu empresa al siguiente nivel" / "Soluciones innovadoras"
- Signos de exclamación, emojis, mayúsculas de énfasis.
- Mencionar que eres una IA o un modelo de lenguaje.
- Consejos genéricos de marketing.

ESTILO DE REFERENCIA:
"Mientras otros compiten por atención, algunas marcas generan confianza antes de pronunciar una sola palabra."

Respondes únicamente con JSON válido, sin markdown, sin backticks, sin texto adicional.
`.trim();

function buildPrompt(d) {
  const dims = (d.dimensions || [])
    .map((x) => `- ${x.name}: ${x.score}/20`)
    .join("\n");

  const decls = (d.declarations || [])
    .map((x, i) => `${i + 1}. ${x.q} → "${x.a}"`)
    .join("\n");

  return `
DATOS DE LA EJECUCIÓN DEL PROTOCOLO:

Negocio: ${d.company || "no declarado"}
Autopercepción (cómo se define el dueño): "${d.self_perception || "no declarada"}"
Percepción externa (cómo lo describen sus clientes): "${d.client_perception || "no declarada"}"
Diferenciador declarado: "${d.differentiator || "no declarado"}"

Índice Kleos: ${d.index}/100
Nivel: ${d.level}
Medición por dimensión:
${dims}
Dimensión más débil: ${d.weakest}

DECLARACIONES DEL CLIENTE (respuestas exactas que eligió):
${decls || "(no disponibles)"}

GENERA EXACTAMENTE ESTE JSON:

{
  "perception": "...",
  "truth": "...",
  "diagnosis": "..."
}

ESPECIFICACIONES:

"perception" (PERCEPCIÓN DETECTADA — visible completa, es el espejo que impacta):
2 o 3 frases. Debe citar textualmente las palabras de autopercepción y percepción externa del usuario (entre comillas angulares « ») y nombrar la distancia entre ambas como el hallazgo central. Si coinciden mucho, señalar qué revela esa coincidencia. Personalizada con el nombre del negocio.

"truth" (OBSERVACIÓN CRÍTICA — se muestra solo el inicio, debe doler un poco):
1 o 2 frases sobre la dimensión más débil, conectadas con los datos reales declarados. Debe cortarse en el punto de máxima tensión, terminando con "…". No resolver nada: solo abrir la herida con precisión.

"diagnosis" (LECTURA PRINCIPAL — aparece difuminada/bloqueada):
2 o 3 frases que anticipen la lectura completa: nombrar la dimensión que gobierna el techo de crecimiento, insinuar que existe una secuencia de corrección en tres movimientos y un error que no conviene cometer primero. Terminar con "…".

Todo en español. Solo el JSON.
`.trim();
}

/* ---------- Proveedor: Groq (OpenAI-compatible) ---------- */
async function callGroq(key, prompt) {
  const r = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: GROQ_MODEL,
      temperature: 0.8,
      max_tokens: 1024,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_VOICE },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!r.ok) {
    const errText = await r.text();
    console.error("Groq error:", r.status, errText.slice(0, 300));
    return null;
  }
  const json = await r.json();
  return json?.choices?.[0]?.message?.content || null;
}

/* ---------- Proveedor: Google Gemini ---------- */
async function callGemini(key, prompt) {
  const r = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": key,
      },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_VOICE }] },
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.8,
          maxOutputTokens: 1024,
          responseMimeType: "application/json",
        },
      }),
    }
  );
  if (!r.ok) {
    const errText = await r.text();
    console.error("Gemini error:", r.status, errText.slice(0, 300));
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

  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY;

  if (!groqKey && !geminiKey) {
    res.status(503).json({ error: "missing_key" });
    return;
  }

  try {
    const d = req.body || {};

    if (typeof d.index !== "number" || !Array.isArray(d.dimensions)) {
      res.status(400).json({ error: "bad_request" });
      return;
    }

    // Sanitizar entradas (longitud máxima defensiva)
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
      declarations: (Array.isArray(d.declarations) ? d.declarations : [])
        .slice(0, 12)
        .map((x) => ({ q: clean(x.q, 200), a: clean(x.a, 200) })),
    };

    const prompt = buildPrompt(data);

    // Cadena de proveedores: Groq primero, Gemini como respaldo
    let text = null;
    if (groqKey) text = await callGroq(groqKey, prompt);
    if (!text && geminiKey) text = await callGemini(geminiKey, prompt);

    if (!text) {
      res.status(502).json({ error: "provider_error" });
      return;
    }

    let reading;
    try {
      reading = JSON.parse(text);
    } catch {
      const m = text.match(/\{[\s\S]*\}/);
      reading = m ? JSON.parse(m[0]) : null;
    }

    if (
      !reading ||
      typeof reading.perception !== "string" ||
      typeof reading.truth !== "string" ||
      typeof reading.diagnosis !== "string"
    ) {
      res.status(502).json({ error: "bad_generation" });
      return;
    }

    res.status(200).json({
      perception: reading.perception.trim(),
      truth: reading.truth.trim(),
      diagnosis: reading.diagnosis.trim(),
    });
  } catch (e) {
    console.error("diagnose error:", e && e.message);
    res.status(500).json({ error: "internal" });
  }
};