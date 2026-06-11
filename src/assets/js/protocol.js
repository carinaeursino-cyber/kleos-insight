/* =========================================================
   KLEOS INSIGHT™ — KIP-001 · Diagnóstico de Percepción
   Protocolo de 12 entradas: 8 cerradas + 4 abiertas.

   Las entradas cerradas alimentan el motor de 5 dimensiones.
   Las entradas abiertas aportan contexto estratégico y
   alimentarán el análisis generado por Gemini en V2.
   ========================================================= */

const KIP_PROTOCOL = [
  {
    id: "company",
    type: "text",
    category: "IDENTIFICACIÓN",
    text: "¿Cómo se llama su negocio?",
    hint: "El protocolo personaliza la lectura con este dato.",
    placeholder: "Nombre del negocio",
    maxLength: 60,
  },
  {
    id: "clarity_1",
    type: "choice",
    dimension: "clarity",
    category: "CLARIDAD",
    text: "Cuando explica qué hace su negocio, ¿qué ocurre en los primeros segundos?",
    options: [
      { label: "El interlocutor lo entiende sin necesidad de aclaraciones", weight: 10 },
      { label: "Lo entiende, pero suele hacer una o dos preguntas", weight: 7 },
      { label: "Necesita reformularlo de varias maneras", weight: 3 },
      { label: "Percibe que el interlocutor asiente sin haber entendido", weight: 0 },
    ],
  },
  {
    id: "clarity_2",
    type: "choice",
    dimension: "clarity",
    category: "CLARIDAD",
    text: "Su propuesta de valor, escrita en una sola frase, hoy:",
    options: [
      { label: "Existe, está documentada y se usa en toda la comunicación", weight: 10 },
      { label: "Existe, pero cada canal la expresa de forma distinta", weight: 6 },
      { label: "Existe solo en su cabeza", weight: 3 },
      { label: "No existe como tal", weight: 0 },
    ],
  },
  {
    id: "self_perception",
    type: "chips",
    category: "AUTOPERCEPCIÓN",
    text: "Seleccione las tres palabras que mejor definen su negocio.",
    hint: "Las que usted elegiría. No las que usa en su publicidad.",
    pick: 3,
    words: [
      "precisión", "calidad", "confiable", "cercano", "exclusivo", "accesible",
      "moderno", "clásico", "rápido", "flexible", "profesional", "creativo",
      "serio", "innovador", "artesanal", "eficiente", "premium", "honesto",
    ],
  },
  {
    id: "value_1",
    type: "choice",
    dimension: "value",
    category: "VALOR PERCIBIDO",
    text: "Cuando presenta su precio, la reacción más frecuente es:",
    options: [
      { label: "Aceptación sin negociación", weight: 10 },
      { label: "Negociación moderada que suele cerrarse a su favor", weight: 7 },
      { label: "Solicitud sistemática de descuento", weight: 3 },
      { label: "Comparación inmediata con opciones más baratas", weight: 0 },
    ],
  },
  {
    id: "value_2",
    type: "choice",
    dimension: "value",
    category: "VALOR PERCIBIDO",
    text: "En los últimos doce meses, sus precios:",
    options: [
      { label: "Subieron y el mercado lo aceptó", weight: 10 },
      { label: "Se mantuvieron estables por decisión propia", weight: 6 },
      { label: "Se mantuvieron porque subirlos parecía arriesgado", weight: 3 },
      { label: "Bajaron para sostener el volumen", weight: 0 },
    ],
  },
  {
    id: "client_perception",
    type: "chips",
    category: "PERCEPCIÓN EXTERNA",
    text: "¿Qué tres palabras usaría un cliente para describir su negocio?",
    hint: "Las que diría un cliente real. No las que usted desearía escuchar.",
    pick: 3,
    words: [
      "confiable", "caro", "barato", "lento", "rápido", "profesional",
      "correcto", "distante", "cercano", "cumplidor", "impreciso", "detallista",
      "común", "diferente", "complicado", "claro", "atento", "frío",
    ],
  },
  {
    id: "trust_1",
    type: "choice",
    dimension: "trust",
    category: "CONFIANZA",
    text: "Después de una primera conversación comercial, lo habitual es que el prospecto:",
    options: [
      { label: "Avance por decisión propia, sin seguimiento", weight: 10 },
      { label: "Avance tras solicitar referencias o garantías", weight: 7 },
      { label: "Se enfríe y requiera insistencia", weight: 3 },
      { label: "Desaparezca sin dar explicación", weight: 0 },
    ],
  },
  {
    id: "trust_2",
    type: "choice",
    dimension: "trust",
    category: "CONFIANZA",
    text: "Su presencia digital actual, frente al precio que cobra:",
    options: [
      { label: "Lo respalda: comunica el mismo nivel que su tarifa", weight: 10 },
      { label: "Es correcta, pero no sostiene una tarifa superior", weight: 6 },
      { label: "Está por debajo de lo que su trabajo justifica", weight: 3 },
      { label: "Contradice abiertamente el nivel que pretende cobrar", weight: 0 },
    ],
  },
  {
    id: "differentiator_type",
    type: "choice",
    dimension: "differentiation",
    category: "DIFERENCIACIÓN",
    text: "¿Qué puede afirmar su negocio que ningún competidor directo puede afirmar?",
    hint: "Elija el tipo de afirmación que hoy puede sostener con evidencia.",
    options: [
      { label: "Garantizo un resultado concreto y medible", weight: 4 },
      { label: "Soy el único que ofrece algo específico en mi mercado", weight: 4 },
      { label: "Tengo un método o proceso propio con nombre", weight: 3 },
      { label: "Todavía no tengo una afirmación que nadie más pueda hacer", weight: 0 },
    ],
    followUp: {
      id: "differentiator",
      text: "Precísela en una línea (opcional).",
      placeholder: "Ej.: entrega en 30 días o no se cobra",
      maxLength: 160,
      skippable: true,
    },
  },
  {
    id: "diff_1",
    type: "choice",
    dimension: "differentiation",
    category: "DIFERENCIACIÓN",
    text: "Si un competidor publicara su mensaje con otro logotipo, el mercado:",
    options: [
      { label: "Lo detectaría: el mensaje es inseparable de su marca", weight: 12 },
      { label: "Notaría algo extraño, sin identificar qué", weight: 8 },
      { label: "No percibiría la diferencia", weight: 4 },
      { label: "Probablemente le atribuiría el mensaje al competidor", weight: 0 },
    ],
  },
  {
    id: "journey_1",
    type: "choice",
    dimension: "journey",
    category: "RECORRIDO",
    text: "Sus clientes nuevos llegan, principalmente:",
    options: [
      { label: "Buscándolo de forma específica, con decisión tomada", weight: 14 },
      { label: "Por recomendación, pero comparando antes de decidir", weight: 9 },
      { label: "Por canales donde es una opción entre varias", weight: 4 },
      { label: "Por precio o disponibilidad", weight: 0 },
    ],
  },
];

/* Mensajes de la fase de análisis */
const KIP_ANALYSIS_MESSAGES = [
  "Procesando entradas del protocolo",
  "Midiendo las cinco dimensiones",
  "Calculando Índice Kleos",
  "Componiendo lectura",
];