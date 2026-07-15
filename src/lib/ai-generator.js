/**
 * KLEOS INSIGHT™ — AI Generator Library
 * 
 * Lógica centralizada de generación de informes IA.
 * Este módulo es reutilizable y desacoplado del contexto (Redis, webhooks, etc.)
 * 
 * Responsabilidades:
 * - Generar contenido IA basado en datos del diagnóstico
 * - Soportar múltiples proveedores (Groq, Gemini)
 * - Devolver contenido estructurado con metadatos
 * 
 * En el futuro, si se necesita un worker, este módulo puede desacoplarse sin cambios.
 */

const GROQ_MODEL = "llama-3.3-70b-versatile";
const GEMINI_MODEL = "gemini-2.5-flash";
const AI_VERSION = "1.0";

/**
 * System prompt para KIP-001: Diagnóstico Estratégico
 */
const SYSTEM_PROMPT_KIP001 = `Eres un consultor experto en estrategia de posicionamiento y percepción de marca.

Tu tarea es generar un informe estratégico completo basado en los datos de un diagnóstico de percepción.

REGLAS ESTRICTAS:
1. Usa un tono profesional, directo y consultivo
2. Evita clichés como "en el mundo actual", "en resumen", "es importante destacar"
3. Sé específico y basado en datos, no genérico
4. Usa las dimensiones exactas del diagnóstico: Comprensión, Autoridad, Confianza, Diferenciación, Conversión
5. Genera contenido accionable y estratégico, no descriptivo
6. Cada sección debe aportar valor único, no repetir información
7. Usa lenguaje claro y directo, sin rodeos

FORMATO DE RESPUESTA:
Debes devolver UN ÚNICO objeto JSON con la siguiente estructura exacta:

{
  "truth_title": "string (máx 80 caracteres)",
  "truth_body": "string (2-3 párrafos)",
  "truth_consequence": "string (1 párrafo)",
  "cost_items": ["string", "string", "string"],
  "opportunity_items": ["string", "string", "string"],
  "diagnosis_executive": "string (3-4 párrafos)",
  "insight_main": "string (1 párrafo contundente)",
  "priority_description": "string (2-3 párrafos)",
  "leak_description": "string (1-2 párrafos)"
}

NO incluyas texto fuera del JSON. NO uses markdown. SOLO el objeto JSON.`;

/**
 * Genera el prompt específico para un diagnóstico
 * @param {object} diagnosticData - Datos del diagnóstico
 * @returns {string} - Prompt completo para la IA
 */
function buildPrompt(diagnosticData) {
    const {
        respuestas,
        dimensions,
        kleosIndex,
        perceptionLevel,
        mainDiagnosis,
        priorityNumberOne,
        insightDetected
    } = diagnosticData;

    const dimensionsText = dimensions
        .map(d => `- ${d.name}: ${d.score}/20`)
        .join('\n');

    return `Genera un informe estratégico completo basado en los siguientes datos de diagnóstico:

DATOS DEL DIAGNÓSTICO:

Empresa: ${respuestas.company || 'No especificada'}
Autopercepción: ${respuestas.self_perception || 'No especificada'}
Percepción del cliente: ${respuestas.client_perception || 'No especificada'}

Índice KLEOS: ${kleosIndex}/100
Nivel de percepción: ${perceptionLevel}

Dimensiones evaluadas:
${dimensionsText}

Diagnóstico principal detectado: ${mainDiagnosis || 'No disponible'}
Prioridad #1 identificada: ${priorityNumberOne || 'No disponible'}
Insight detectado: ${insightDetected || 'No disponible'}

INSTRUCCIONES ESPECÍFICAS:

1. truth_title: Título impactante sobre la verdad incómoda del diagnóstico (máx 80 caracteres)
2. truth_body: Desarrollo de la verdad incómoda en 2-3 párrafos. Debe ser directo, basado en datos y accionable.
3. truth_consequence: Consecuencia principal de no abordar la verdad incómoda (1 párrafo)
4. cost_items: 3 costos específicos de la inacción (strings concisos y específicos)
5. opportunity_items: 3 oportunidades específicas al tomar acción (strings concisos y específicos)
6. diagnosis_executive: Diagnóstico ejecutivo completo en 3-4 párrafos. Debe sintetizar el estado actual y las implicaciones estratégicas.
7. insight_main: Insight principal contundente en 1 párrafo. Debe ser revelador y accionable.
8. priority_description: Descripción detallada de la prioridad #1 en 2-3 párrafos. Debe explicar por qué es la prioridad y qué hacer.
9. leak_description: Descripción de la fuga de crecimiento en 1-2 párrafos. Debe explicar dónde se pierde valor.

RECUERDA:
- Usa las dimensiones exactas: Comprensión, Autoridad, Confianza, Diferenciación, Conversión
- Sé específico basado en los datos proporcionados
- Evita lenguaje genérico o clichés
- Cada sección debe aportar valor único
- Devuelve SOLO el objeto JSON, sin texto adicional`;
}

/**
 * Llama a la API de Groq para generar contenido IA
 * @param {string} prompt - Prompt completo
 * @returns {Promise<object|null>} - Contenido generado o null si falla
 */
async function callGroq(prompt) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        console.error('[AI Generator] GROQ_API_KEY no configurada');
        return null;
    }

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT_KIP001 },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.7,
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            console.error('[AI Generator] Error en Groq API:', response.status, await response.text());
            return null;
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;

        if (!content) {
            console.error('[AI Generator] Respuesta vacía de Groq');
            return null;
        }

        // Parsear JSON de la respuesta
        try {
            return JSON.parse(content);
        } catch (parseError) {
            console.error('[AI Generator] Error parseando JSON de Groq:', parseError);
            console.error('[AI Generator] Contenido recibido:', content);
            return null;
        }

    } catch (error) {
        console.error('[AI Generator] Error llamando a Groq:', error);
        return null;
    }
}

/**
 * Llama a la API de Gemini para generar contenido IA (fallback)
 * @param {string} prompt - Prompt completo
 * @returns {Promise<object|null>} - Contenido generado o null si falla
 */
async function callGemini(prompt) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        console.error('[AI Generator] GEMINI_API_KEY no configurada');
        return null;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: `${SYSTEM_PROMPT_KIP001}\n\n${prompt}`
                    }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4000
                }
            })
        });

        if (!response.ok) {
            console.error('[AI Generator] Error en Gemini API:', response.status, await response.text());
            return null;
        }

        const data = await response.json();
        const content = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!content) {
            console.error('[AI Generator] Respuesta vacía de Gemini');
            return null;
        }

        // Parsear JSON de la respuesta
        try {
            return JSON.parse(content);
        } catch (parseError) {
            console.error('[AI Generator] Error parseando JSON de Gemini:', parseError);
            console.error('[AI Generator] Contenido recibido:', content);
            return null;
        }

    } catch (error) {
        console.error('[AI Generator] Error llamando a Gemini:', error);
        return null;
    }
}

/**
 * Valida que el contenido generado tenga la estructura correcta
 * @param {object} content - Contenido generado por la IA
 * @returns {boolean}
 */
function validateContent(content) {
    if (!content || typeof content !== 'object') return false;

    const requiredFields = [
        'truth_title',
        'truth_body',
        'truth_consequence',
        'cost_items',
        'opportunity_items',
        'diagnosis_executive',
        'insight_main',
        'priority_description',
        'leak_description'
    ];

    for (const field of requiredFields) {
        if (!(field in content)) {
            console.error(`[AI Generator] Campo faltante: ${field}`);
            return false;
        }
    }

    // Validar arrays
    if (!Array.isArray(content.cost_items) || content.cost_items.length !== 3) {
        console.error('[AI Generator] cost_items debe ser array de 3 elementos');
        return false;
    }

    if (!Array.isArray(content.opportunity_items) || content.opportunity_items.length !== 3) {
        console.error('[AI Generator] opportunity_items debe ser array de 3 elementos');
        return false;
    }

    return true;
}

/**
 * Genera informe IA completo para un diagnóstico
 * Intenta con Groq primero, luego Gemini como fallback
 * 
 * @param {object} diagnosticData - Datos del diagnóstico desde Redis
 * @returns {Promise<object|null>} - Informe completo con metadatos o null si falla
 */
async function generateReport(diagnosticData) {
    console.log('[AI Generator] Iniciando generación de informe IA...');

    const prompt = buildPrompt(diagnosticData);
    let content = null;
    let engine = null;

    // Intentar con Groq primero
    console.log('[AI Generator] Intentando con Groq...');
    content = await callGroq(prompt);
    if (content && validateContent(content)) {
        engine = `groq-${GROQ_MODEL}`;
        console.log('[AI Generator] ✓ Informe generado con Groq');
    }

    // Fallback a Gemini si Groq falla
    if (!content) {
        console.log('[AI Generator] Groq falló, intentando con Gemini...');
        content = await callGemini(prompt);
        if (content && validateContent(content)) {
            engine = `gemini-${GEMINI_MODEL}`;
            console.log('[AI Generator] ✓ Informe generado con Gemini');
        }
    }

    // Si ambos fallan, retornar null
    if (!content) {
        console.error('[AI Generator] ✗ Todos los proveedores fallaron');
        return null;
    }

    // Agregar metadatos
    const report = {
        ...content,
        generatedAt: new Date().toISOString(),
        version: AI_VERSION,
        engine: engine
    };

    console.log('[AI Generator] ✓ Informe completo con metadatos');
    return report;
}

module.exports = {
    generateReport,
    validateContent,
    buildPrompt
};
