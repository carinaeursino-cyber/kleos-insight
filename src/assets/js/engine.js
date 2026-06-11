/* =========================================================
   KLEOS INSIGHT™ — Motor del protocolo KIP-001
   Modelo de cinco dimensiones · 0–20 por dimensión · Índice 0–100

   CONTRATO DE INTEGRACIÓN (Gemini V2):
   ------------------------------------------------
   KleosEngine.run(answers) → Promise<Reading>

   Reading = {
     index: number,                  // Índice Kleos 0–100
     level: { code, name },          // Nivel de percepción
     dimensions: [                   // Las 5 dimensiones del modelo
       { key, name, score, max, state: "visible" | "locked" }
     ],
     perception: string,             // Percepción detectada (personalizada)
     truth: string,                  // Verdad incómoda (parcial en freemium)
     diagnosis: string               // Lectura principal (bloqueada en freemium)
   }

   En V2, el cuerpo de run() se reemplaza por una llamada a un
   endpoint que consulta Gemini con las 12 entradas (incluidas
   las 4 abiertas: company, self_perception, client_perception,
   differentiator). El contrato de retorno no cambia y la
   interfaz no requiere modificaciones.
   ========================================================= */

const KleosEngine = (() => {

  const DIMENSIONS = [
    { key: "clarity", name: "Comprensión", question: "¿El mercado entiende qué hace?" },
    { key: "value", name: "Autoridad", question: "¿Lo perciben como una referencia?" },
    { key: "trust", name: "Confianza", question: "¿Genera suficiente seguridad para comprar?" },
    { key: "differentiation", name: "Diferenciación", question: "¿Por qué elegirlo a usted?" },
    { key: "journey", name: "Conversión", question: "¿Qué tan fácil es convertirse en su cliente?" },
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

  /* ---------- Lectura de la dimensión visible (la fortaleza) ---------- */
  const STRENGTH_READINGS = {
    clarity: (s) =>
      s >= 14
        ? "Su nivel de comprensión es alto. El mercado entiende qué hace sin esfuerzo — una base que la mayoría no tiene."
        : "La comprensión es hoy su dimensión más sólida. El mercado capta qué hace, aunque aún queda margen para que lo capte más rápido.",
    value: (s) =>
      s >= 14
        ? "Su autoridad percibida es alta. El mercado entiende que sabe lo que hace, y eso se refleja en cómo recibe su precio."
        : "La autoridad es hoy su dimensión más sólida. El mercado le reconoce criterio, aunque esa percepción aún no opera a su favor con toda su fuerza.",
    trust: (s) =>
      s >= 14
        ? "Su nivel de confianza es alto. Las señales que emite reducen el riesgo percibido antes de cualquier conversación."
        : "La confianza es hoy su dimensión más sólida. Genera seguridad suficiente para sostener la decisión, aunque todavía con margen de refuerzo.",
    differentiation: (s) =>
      s >= 14
        ? "Su diferenciación es alta. El mercado identifica por qué elegirlo — la ventaja más difícil de construir ya está operando."
        : "La diferenciación es hoy su dimensión más sólida. Existe una base de singularidad que el resto de su sistema aún no aprovecha del todo.",
    journey: (s) =>
      s >= 14
        ? "Su conversión es alta. El trayecto entre el interés y la decisión fluye sin fricciones significativas."
        : "La conversión es hoy su dimensión más sólida. El recorrido hacia la compra funciona, aunque aún filtra decisiones que podrían cerrarse antes.",
  };

  function weightOf(id, optIdx) {
    const q = KIP_PROTOCOL.find((q) => q.id === id);
    if (!q || !q.options || optIdx == null) return 0;
    const opt = q.options[optIdx];
    return opt ? opt.weight : 0;
  }

  /* ---------- Lecturas (simuladas en V1, Gemini en V2) ---------- */

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

  /* ---------- Prescripción: causa raíz, prioridad e impacto ----------
     Construida a partir de la dimensión más débil detectada.
     Determinista (no requiere IA): es el modelo KIP hablando. */
  const PRESCRIPTIONS = {
    clarity: {
      cause:
        "Su propuesta contiene demasiadas interpretaciones posibles. El mercado necesita comprender su valor más rápido de lo que hoy lo logra — y cada segundo de ambigüedad se paga en decisiones que se van hacia opciones más fáciles de entender.",
      priority:
        "Durante los próximos 30 días, concentre sus esfuerzos en reducir la ambigüedad de su propuesta: una sola frase, un solo significado, idéntica en todos los canales — antes de invertir en más visibilidad.",
      impacts: [
        "↑ Comprensión inmediata de su propuesta",
        "↑ Mayor conversión en primeras conversaciones",
        "↑ Ciclos de venta más cortos",
        "↑ Menor necesidad de explicar y justificar",
      ],
    },
    value: {
      cause:
        "Existe una brecha entre el valor que entrega y el valor que el mercado percibe. No es un problema de calidad: es un problema de traducción — lo que hace bien no está llegando en un formato que el mercado pueda valorar antes de comprar.",
      priority:
        "Durante los próximos 30 días, concentre sus esfuerzos en hacer visible el valor que hoy entrega en silencio: evidencia, resultados y criterio expuestos antes de la conversación de precio — y no toque sus tarifas hasta lograrlo.",
      impacts: [
        "↑ Mayor conversión",
        "↑ Mayor percepción de valor",
        "↑ Menor dependencia del precio",
        "↑ Más facilidad para generar confianza",
      ],
    },
    trust: {
      cause:
        "Su mensaje genera interés inicial, pero no transmite suficientes señales de credibilidad para reducir el riesgo percibido. El prospecto no duda de su oferta: duda de lo que no puede verificar antes de comprometerse.",
      priority:
        "Durante los próximos 30 días, concentre sus esfuerzos en construir señales de credibilidad verificables — prueba, respaldo y coherencia visible entre lo que promete y lo que su presencia comunica — antes de invertir más presupuesto en adquisición.",
      impacts: [
        "↑ Menos prospectos que desaparecen sin explicación",
        "↑ Decisiones de compra más rápidas",
        "↑ Menor exigencia de garantías y referencias",
        "↑ Mayor tasa de cierre en primeras conversaciones",
      ],
    },
    differentiation: {
      cause:
        "Su marca compite principalmente por similitud y no por singularidad. El mercado entiende lo que hace, pero no por qué debería elegirlo frente a otras alternativas — y cuando la diferencia no es visible, la decisión se traslada al precio.",
      priority:
        "Durante los próximos 30 días, concentre todos sus esfuerzos en fortalecer la diferenciación — una afirmación que solo usted pueda sostener — antes de invertir más presupuesto en adquisición.",
      impacts: [
        "↑ Menos comparación por precio",
        "↑ Preferencia frente a alternativas similares",
        "↑ Mayor poder de negociación",
        "↑ Recordación de marca",
      ],
    },
    journey: {
      cause:
        "Sus clientes encuentran fricción entre el interés y la compra. La intención existe — el recorrido la desgasta: cada paso confuso, cada duda sin responder y cada comparación innecesaria filtra decisiones que ya estaban a su favor.",
      priority:
        "Durante los próximos 30 días, concentre sus esfuerzos en eliminar la fricción entre el interés y la decisión: menos pasos, menos dudas abiertas, un camino inequívoco — antes de buscar más tráfico.",
      impacts: [
        "↑ Más clientes que llegan decididos",
        "↑ Mayor conversión del interés ya existente",
        "↑ Menor costo por cliente adquirido",
        "↑ Recorridos de compra más cortos",
      ],
    },
  };

  function buildPrescription(dimensions) {
    const lowest = [...dimensions].sort((a, b) => a.score - b.score)[0];
    const p = PRESCRIPTIONS[lowest.key] || PRESCRIPTIONS.clarity;
    return {
      dimension: lowest.name,
      cause: p.cause,
      priority: p.priority,
      impacts: p.impacts,
    };
  }

  /* ---------- Fragmento oculto: "lo que el protocolo detectó" ----------
     Frases reales del caso, cortadas en el punto de máxima tensión.
     Construidas con la dimensión más débil + datos declarados. */
  const HIDDEN_FRAGMENTS = {
    clarity: (ctx) =>
      `Su principal punto de fuga no está en la visibilidad. Está en lo que ocurre dentro de la mente de su prospecto durante los primeros segundos: el protocolo identificó el momento exacto en que ${ctx.company} pierde la atención calificada, y la palabra específica de su propuesta que lo está provocando`,
    value: (ctx) =>
      `Su principal punto de fuga no está en el precio. Está en el orden en que ${ctx.company} presenta la evidencia de su valor: el protocolo identificó qué señal falta antes de la conversación de precio, y por qué su ausencia convierte cada tarifa en un número negociable`,
    trust: (ctx) =>
      `Su principal punto de fuga no está en la adquisición. Está en la forma en que el mercado interpreta las señales que ${ctx.company} emite antes de cualquier conversación: el protocolo identificó cuál de esas señales está contradiciendo su nivel real, y en qué punto del recorrido`,
    differentiation: (ctx) =>
      `Su principal punto de fuga no está en la competencia. Está en que el mercado archivó a ${ctx.company} en una categoría mental donde la única variable de decisión es el precio: el protocolo identificó qué afirmación podría sacarlo de esa categoría, y qué la está bloqueando hoy`,
    journey: (ctx) =>
      `Su principal punto de fuga no está en el interés. Está en un punto específico entre la intención y la decisión donde ${ctx.company} pierde compradores que ya estaban convencidos: el protocolo identificó ese punto, y el patrón de fricción que lo produce`,
  };

  function buildHiddenFragment(dimensions, answers) {
    const lowest = [...dimensions].sort((a, b) => a.score - b.score)[0];
    const ctx = { company: String(answers.company || "su negocio").trim() };
    const builder = HIDDEN_FRAGMENTS[lowest.key] || HIDDEN_FRAGMENTS.clarity;
    return builder(ctx);
  }

  /* ---------- Patrón detectado: identidad reconocible ----------
     5 patrones memorables asignados por la dimensión dominante.
     Sin números, sin cálculos visibles: interpretación. */
  const PATTERNS = {
    clarity: {
      name: "Señal Dispersa",
      text:
        "Su negocio emite varias señales a la vez, y el mercado no logra componer una sola idea con ellas. Lo que ofrece es sólido, pero llega fragmentado: cada canal cuenta una versión ligeramente distinta, y esa dispersión obliga al prospecto a hacer un esfuerzo de interpretación que la mayoría no está dispuesta a hacer.",
    },
    value: {
      name: "Experto Invisible",
      text:
        "Su negocio parece tener capacidad real para generar resultados, pero el mercado no percibe esa capacidad con suficiente claridad. El problema no parece estar en la calidad de lo que hace, sino en cómo esa calidad llega a los demás.",
    },
    trust: {
      name: "Autoridad Frágil",
      text:
        "El mercado muestra señales de interés, pero todavía existen dudas suficientes como para retrasar o bloquear decisiones de compra. La atención se consigue; la convicción se pierde en el camino.",
    },
    differentiation: {
      name: "Oferta Diluida",
      text:
        "Su propuesta compite en un espacio donde muchas alternativas parecen similares. El mercado entiende lo que hace, pero no identifica rápidamente por qué debería elegirlo.",
    },
    journey: {
      name: "Crecimiento con Fricción",
      text:
        "Existen señales de demanda, pero el recorrido entre el interés y la conversión contiene demasiados puntos de fuga. La oportunidad no se pierde por falta de atracción: se desgasta en el trayecto.",
    },
  };

  /* ---------- Hallazgo central: la dimensión más baja y su significado ---------- */
  const WEAKEST_MEANINGS = {
    clarity:
      "Esto significa que probablemente está perdiendo oportunidades antes de que el mercado termine de entender qué ofrece.",
    value:
      "Esto significa que probablemente el mercado está pagando por su trabajo menos de lo que su nivel real justifica.",
    trust:
      "Esto significa que probablemente está perdiendo decisiones de compra en el momento de la verificación — cuando el prospecto evalúa si puede creerle.",
    differentiation:
      "Esto significa que probablemente está compitiendo por precio en decisiones que podría ganar por preferencia.",
    journey:
      "Esto significa que probablemente está perdiendo oportunidades antes de llegar al cierre.",
  };

  function buildWeakestFinding(dimensions) {
    const lowest = [...dimensions].sort((a, b) => a.score - b.score)[0];
    return {
      name: lowest.name,
      meaning: WEAKEST_MEANINGS[lowest.key] || WEAKEST_MEANINGS.clarity,
    };
  }

  /* ---------- Ruta KLEOS: el siguiente protocolo recomendado ----------
     KIP-001 no vende información: vende el siguiente paso. */
  const KIP_ROUTE = [
    { code: "KIP-001", name: "Percepción" },
    { code: "KIP-002", name: "Conversión" },
    { code: "KIP-003", name: "Oferta" },
    { code: "KIP-004", name: "Operaciones" },
    { code: "KIP-005", name: "Escalabilidad" },
  ];

  const NEXT_PROTOCOL = {
    journey: {
      code: "KIP-002",
      name: "Diagnóstico de Conversión",
      objective: "Detectar por qué los prospectos no se transforman en clientes.",
    },
    trust: {
      code: "KIP-002",
      name: "Diagnóstico de Conversión",
      objective: "Detectar en qué punto del recorrido sus prospectos dejan de avanzar — y qué señal lo provoca.",
    },
    clarity: {
      code: "KIP-003",
      name: "Diagnóstico de Oferta",
      objective: "Detectar por qué su propuesta no se comprende con la velocidad que el mercado exige.",
    },
    differentiation: {
      code: "KIP-003",
      name: "Diagnóstico de Oferta",
      objective: "Detectar por qué su propuesta no genera preferencia frente a alternativas similares.",
    },
    value: {
      code: "KIP-003",
      name: "Diagnóstico de Oferta",
      objective: "Detectar por qué el mercado no traduce su nivel real en disposición a pagar.",
    },
  };

  function buildNextProtocol(dimensions) {
    const lowest = [...dimensions].sort((a, b) => a.score - b.score)[0];
    const next = NEXT_PROTOCOL[lowest.key] || NEXT_PROTOCOL.journey;
    return {
      ...next,
      route: KIP_ROUTE.map((k) => ({
        ...k,
        done: k.code === "KIP-001",
        recommended: k.code === next.code,
      })),
    };
  }

  function buildPattern(dimensions) {
    const sorted = [...dimensions].sort((a, b) => a.score - b.score);
    const lowest = sorted[0];
    const second = sorted[1];
    const p = PATTERNS[lowest.key] || PATTERNS.clarity;

    // Nivel de coincidencia: qué tan dominante es el patrón
    // (distancia entre la dimensión crítica y la siguiente — nunca porcentajes)
    const gap = second.score - lowest.score;
    const match = gap >= 4 ? "Alta" : gap >= 2 ? "Elevada" : "Significativa";

    return { name: p.name, text: p.text, match };
  }

  /* ---------- Insight detectado: el momento eureka ----------
     generateInsight() cruza respuestas entre sí buscando la
     CONTRADICCIÓN más reveladora del caso. Reglas en orden de
     prioridad: la primera que aplica, gana. ---------- */
  function generateInsight(answers, dimensions) {
    const a = answers;
    const norm = (s) =>
      String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const selfW = norm(a.self_perception).split(/[\s,]+/).filter(Boolean);
    const clientW = norm(a.client_perception).split(/[\s,]+/).filter(Boolean);
    const overlap = selfW.filter((w) => clientW.includes(w)).length;
    const negClient = ["caro", "lento", "distante", "imprecisо", "impreciso", "comun", "complicado", "frio"]
      .some((w) => clientW.includes(w));
    const aspSelf = ["exclusivo", "premium", "precision", "innovador", "profesional"]
      .some((w) => selfW.includes(w));

    const RULES = [
      {
        // Declara afirmación única pero su mensaje es intercambiable
        when: () => (a.differentiator_type === 0 || a.differentiator_type === 1) && a.diff_1 >= 2,
        text: "Usted posee una afirmación que ningún competidor puede hacer — y sin embargo su mensaje podría firmarlo cualquiera de ellos. La ventaja existe; el mercado nunca la recibió. Está pagando el costo de ser común teniendo los argumentos para no serlo.",
      },
      {
        // Aceptan su precio pero no lo sube por miedo
        when: () => a.value_2 === 2 && (a.value_1 === 0 || a.value_1 === 1),
        text: "El mercado acepta su precio con menos resistencia de la que usted imagina, y aun así no lo ha subido por percepción de riesgo. La resistencia que teme no proviene de sus clientes: proviene de su propia lectura del mercado. El techo es interno.",
      },
      {
        // Le piden descuento + su presencia no respalda el precio
        when: () => a.value_1 >= 2 && a.trust_2 >= 2,
        text: "La negociación de precio que enfrenta en cada venta no es una discusión sobre el precio. Es la respuesta del mercado a una presencia que comunica un nivel inferior a su tarifa. Mientras esa señal no cambie, cada descuento solicitado es predecible.",
      },
      {
        // Autopercepción aspiracional vs mercado que lo describe en negativo
        when: () => aspSelf && negClient && overlap === 0,
        text: "Existe una contradicción directa entre cómo define su negocio y cómo el mercado lo interpreta — y ambas descripciones no pueden ser ciertas a la vez para el comprador. Hoy, en cada decisión de compra, está ganando la versión del mercado.",
      },
      {
        // Llegan comparando + prospectos que se enfrían: problema de conversión, no de demanda
        when: () => a.journey_1 >= 1 && a.trust_1 >= 2,
        text: "Su principal obstáculo no parece ser la generación de demanda, sino la conversión de la demanda que ya existe. Atraer más interesados con el recorrido actual solo aumentaría el volumen de oportunidades que se enfrían en el mismo punto.",
      },
      {
        // Propuesta sin documentar + el interlocutor no entiende rápido
        when: () => a.clarity_2 >= 2 && a.clarity_1 >= 1,
        text: "Su propuesta de valor vive en su cabeza, y eso tiene una consecuencia medible: cada conversación comercial empieza desde cero. El mercado no está rechazando su oferta — está recibiendo una versión distinta de ella cada vez.",
      },
      {
        // Sin afirmación única + mercado lo describe como común/comparable
        when: () => a.differentiator_type === 3,
        text: "Su negocio todavía no posee una afirmación que nadie más pueda hacer — y ese dato explica más de su situación comercial que cualquier otro. Sin esa afirmación, el mercado solo dispone de una variable para decidir: el precio.",
      },
    ];

    for (const rule of RULES) {
      try {
        if (rule.when()) return rule.text;
      } catch { /* noop */ }
    }

    // Respaldo: insight desde la dimensión crítica
    const lowest = [...dimensions].sort((x, y) => x.score - y.score)[0];
    const fallback = {
      clarity: "La fricción que percibe en sus ventas comienza antes de la venta: en los segundos en que el mercado intenta entender qué ofrece y a qué categoría pertenece. Lo que parece un problema comercial es un problema de interpretación.",
      value: "El mercado no está evaluando su trabajo: está evaluando las señales que llegan antes que su trabajo. La brecha entre lo que entrega y lo que le pagan se abre en esa antesala.",
      trust: "Las decisiones que se enfrían después de la primera conversación no se pierden en la conversación: se pierden en lo que el prospecto verifica después de ella. Ese momento, que usted no presencia, es donde hoy se define su tasa de cierre.",
      differentiation: "El mercado entiende lo que hace, pero no logra nombrar por qué elegirlo. Y lo que el comprador no puede nombrar, no puede defender frente a otras opciones — ni frente a su propio presupuesto.",
      journey: "La demanda que necesita probablemente ya lo encontró. El punto crítico no está en ser descubierto: está en el trayecto entre el interés y la decisión, donde hoy se filtran compradores que ya estaban convencidos.",
    };
    return fallback[lowest.key] || fallback.clarity;
  }

  /* ---------- Ejecución del protocolo ---------- */

  /* Declaraciones textuales: las 8 respuestas cerradas tal como el
     usuario las eligió. Son el "dolor activo" declarado — el insumo
     que hace que la lectura hable de SU caso y no de un caso. */
  function buildDeclarations(answers) {
    return KIP_PROTOCOL
      .filter((q) => q.type === "choice" && answers[q.id] != null)
      .map((q) => ({
        q: q.text,
        a: q.options[answers[q.id]] ? q.options[answers[q.id]].label : "",
      }))
      .filter((d) => d.a);
  }

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
      Math.round(
        weightOf("diff_1", answers.diff_1) +
          weightOf("differentiator_type", answers.differentiator_type) +
          textScore(answers.differentiator) * 0.5
      ),
      0, 20
    );
    const journey = clamp(
      weightOf("journey_1", answers.journey_1) +
        alignmentScore(answers.self_perception, answers.client_perception),
      0, 20
    );

    const raw = { clarity, value, trust, differentiation, journey };

    // Solo la dimensión más alta (la fortaleza) se muestra completa.
    // Las otras cuatro quedan reservadas — curiosidad máxima.
    const highestKey = Object.keys(raw).reduce((a, b) => (raw[b] > raw[a] ? b : a));

    const dimensions = DIMENSIONS.map((d) => ({
      key: d.key,
      name: d.name,
      question: d.question,
      score: raw[d.key],
      max: 20,
      state: d.key === highestKey ? "visible" : "locked",
      reading:
        d.key === highestKey
          ? (STRENGTH_READINGS[d.key] || STRENGTH_READINGS.clarity)(raw[d.key])
          : null,
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
      declarations: buildDeclarations(answers),
    });

    const texts = ai || local;

    return {
      index,
      level: { code: level.code, name: level.name },
      dimensions,
      perception: texts.perception,
      truth: texts.truth,
      diagnosis: texts.diagnosis,
      prescription: buildPrescription(dimensions),
      pattern: buildPattern(dimensions),
      weakestFinding: buildWeakestFinding(dimensions),
      nextProtocol: buildNextProtocol(dimensions),
      insight: generateInsight(answers, dimensions),
      hiddenFragment: buildHiddenFragment(dimensions, answers),
      declarations: buildDeclarations(answers),
      source: ai ? "gemini" : "local",
    };
  }

  return { run };
})();
