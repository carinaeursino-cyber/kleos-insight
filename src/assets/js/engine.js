/* =========================================================
   KLEOS INSIGHT™ — Motor del protocolo KIP-001
   Modelo de cinco dimensiones · 0–20 por dimensión · Índice 0–100

   El índice y las dimensiones se calculan localmente
   (deterministas y justos). Los textos de la lectura se
   generan vía Gemini (/api/diagnose) con respaldo local
   garantizado si la API no responde.
   ========================================================= */

const KleosEngine = (() => {

  const DIMENSIONS = [
    { key: "clarity", name: "Claridad", state: "visible" },
    { key: "value", name: "Valor Percibido", state: "visible" },
    { key: "trust", name: "Confianza", state: "locked" },
    { key: "differentiation", name: "Diferenciación", state: "locked" },
    { key: "journey", name: "Recorrido", state: "locked" },
  ];

  const LEVELS = [
    { min: 0, max: 34, code: "NIVEL I", name: "PERCEPCIÓN NO CONSTRUIDA" },
    { min: 35, max: 54, code: "NIVEL II", name: "PERCEPCIÓN DIFUSA" },
    { min: 55, max: 74, code: "NIVEL III", name: "PERCEPCIÓN SUBVALORADA" },
    { min: 75, max: 100, code: "NIVEL IV", name: "PERCEPCIÓN EN CONSOLIDACIÓN" },
  ];

  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  /* Densidad informativa de un campo abierto (0–8).
     No premia la longitud: premia la presencia de sustancia. */
  function textScore(text) {
    const t = String(text || "").trim();
    if (!t) return 0;
    const words = t.split(/\s+/).filter(Boolean).length;
    const specific = /\d|%|único|única|sólo|solo nosotros|primer|garantiz/i.test(t) ? 2 : 0;
    return clamp(Math.round(words * 0.9) + specific, 1, 8);
  }

  /* Alineación entre autopercepción y percepción externa (0–6).
     Coincidencia de vocabulario = recorrido coherente. */
  function alignmentScore(selfWords, clientWords) {
    const norm = (s) =>
      String(s || "")
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .split(/[\s,;·]+/)
        .filter((w) => w.length > 2);
    const a = norm(selfWords);
    const b = new Set(norm(clientWords));
    if (!a.length || !b.size) return 2;
    const overlap = a.filter((w) => b.has(w)).length;
    return clamp(2 + overlap * 2, 0, 6);
  }

  function weightOf(id, optIdx) {
    const q = KIP_PROTOCOL.find((q) => q.id === id);
    if (!q || !q.options || optIdx == null) return 0;
    const opt = q.options[optIdx];
    return opt ? opt.weight : 0;
  }

  /* ---------- Lecturas locales (respaldo garantizado) ---------- */

  function buildPerception(scores, answers) {
    const self = String(answers.self_perception || "").trim();
    const client = String(answers.client_perception || "").trim();
    const company = String(answers.company || "su negocio").trim();

    if (self && client) {
      return `${company} se define internamente como «${self}». El mercado lo describe como «${client}». La distancia entre ambas descripciones es la brecha que este protocolo mide — y hoy está operando sobre su precio.`;
    }
    return `Existe una distancia medible entre el valor que ${company} entrega y la categoría mental en la que el mercado lo ubica. Esa distancia, no la calidad del trabajo, es lo que el protocolo detecta.`;
  }

  function buildTruth(scores, answers) {
    const lowest = [...scores].sort((a, b) => a.score - b.score)[0];
    const truths = {
      clarity:
        "Cada explicación adicional que su propuesta necesita funciona como un descuento que el mercado aplica en silencio…",
      value:
        "El mercado no está cuestionando su precio. Está cuestionando la categoría en la que lo ha ubicado, y desde esa categoría su tarifa siempre parecerá alta…",
      trust:
        "Los prospectos que desaparecen sin explicación ya tomaron una decisión. La tomaron sobre señales que su presencia emite antes de cualquier conversación…",
      differentiation:
        "Su mensaje actual podría firmarlo un competidor sin que el mercado lo note. Esa intercambiabilidad tiene un costo que se cobra en cada negociación…",
      journey:
        "Sus clientes no llegan decididos: llegan comparando. La diferencia entre ambas llegadas no es de tráfico, es de posición previa en la mente del comprador…",
    };
    return truths[lowest.key] || truths.clarity;
  }

  function buildDiagnosis(scores) {
    const lowest = [...scores].sort((a, b) => a.score - b.score)[0];
    return `La dimensión que hoy gobierna su techo de crecimiento es ${lowest.name.toLowerCase()}. La lectura completa establece la secuencia de corrección en tres movimientos, el orden en que deben ejecutarse y el error que conviene no cometer primero…`;
  }

  /* ---------- Ejecución del protocolo ---------- */

  /* Capa Gemini: pide los textos personalizados a /api/diagnose.
     Si falla (sin conexión, sin key, error del modelo), retorna null
     y la experiencia continúa con los textos del motor local. */
  async function fetchAiReading(payload) {
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 12000); // máx 12s
      const r = await fetch("/api/diagnose", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (!r.ok) return null;
      const j = await r.json();
      if (!j.perception || !j.truth || !j.diagnosis) return null;
      return j;
    } catch {
      return null;
    }
  }

  async function run(answers) {
    const clarity = clamp(
      weightOf("clarity_1", answers.clarity_1) + weightOf("clarity_2", answers.clarity_2),
      0, 20
    );
    const value = clamp(
      weightOf("value_1", answers.value_1) + weightOf("value_2", answers.value_2),
      0, 20
    );
    const trust = clamp(
      weightOf("trust_1", answers.trust_1) + weightOf("trust_2", answers.trust_2),
      0, 20
    );
    const differentiation = clamp(
      weightOf("diff_1", answers.diff_1) + textScore(answers.differentiator),
      0, 20
    );
    const journey = clamp(
      weightOf("journey_1", answers.journey_1) +
        alignmentScore(answers.self_perception, answers.client_perception),
      0, 20
    );

    const raw = { clarity, value, trust, differentiation, journey };

    const dimensions = DIMENSIONS.map((d) => ({
      key: d.key,
      name: d.name,
      score: raw[d.key],
      max: 20,
      state: d.state,
    }));

    const index = clamp(clarity + value + trust + differentiation + journey, 0, 100);
    const level = LEVELS.find((l) => index >= l.min && index <= l.max) || LEVELS[1];
    const weakest = [...dimensions].sort((a, b) => a.score - b.score)[0];

    // Textos locales (respaldo garantizado)
    const local = {
      perception: buildPerception(dimensions, answers),
      truth: buildTruth(dimensions, answers),
      diagnosis: buildDiagnosis(dimensions),
    };

    // Intento de lectura generada por Gemini
    const ai = await fetchAiReading({
      company: answers.company,
      self_perception: answers.self_perception,
      client_perception: answers.client_perception,
      differentiator: answers.differentiator,
      index,
      level: `${level.code} — ${level.name}`,
      weakest: weakest.name,
      dimensions: dimensions.map((d) => ({ name: d.name, score: d.score })),
    });

    const texts = ai || local;

    return {
      index,
      level: { code: level.code, name: level.name },
      dimensions,
      perception: texts.perception,
      truth: texts.truth,
      diagnosis: texts.diagnosis,
      source: ai ? "gemini" : "local",
    };
  }

  return { run };
})();