# KLEOS INSIGHT™ — Gemini API Integration Guide

**Cómo conectar KLEOS con Google Gemini API para análisis inteligente real**

---

## 📋 Índice

1. [Setup de Gemini API](#setup)
2. [Arquitectura de Integración](#arquitectura)
3. [Implementación en Frontend](#frontend)
4. [Backend en Node.js](#backend)
5. [Formato de Prompts](#prompts)
6. [Manejo de Errores](#errores)
7. [Rate Limiting](#rate-limiting)
8. [Testing](#testing)

---

## 🔧 Setup de Gemini API {#setup}

### Paso 1: Crear Proyecto en Google Cloud

1. Ve a [Google Cloud Console](https://console.cloud.google.com)
2. Crea un nuevo proyecto o selecciona uno existente
3. Habilita la API: **Google AI Studio** o **Vertex AI**

### Paso 2: Obtener API Key

**Opción A: Google AI Studio (Más simple)**
1. Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click en "Create API key"
3. Copia la clave (nunca la compartas públicamente)

**Opción B: Vertex AI (Más enterprise)**
1. Ve a Google Cloud Console
2. Navega a Vertex AI → Generative AI
3. Habilita Vertex AI API
4. Crea credenciales de servicio (JSON)

### Paso 3: Variables de Entorno

**En Backend (.env):**
```env
# Para Google AI Studio
GEMINI_API_KEY=your-api-key-here

# O para Vertex AI
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account-key.json
VERTEX_AI_PROJECT_ID=your-project-id
VERTEX_AI_LOCATION=us-central1
```

**Nunca expongas la API key en frontend directamente.**

---

## 🏗️ Arquitectura de Integración {#arquitectura}

### Diagrama de Flujo

```
┌─────────────────────────────────────────────────────────┐
│ FRONTEND (src/index.html + main.js)                     │
│ - Captura 12 preguntas                                  │
│ - Envía a backend                                       │
│ - Muestra pantalla de análisis                          │
└──────────────────┬──────────────────────────────────────┘
                   │ HTTP POST
                   ↓
┌──────────────────────────────────────────────────────────┐
│ BACKEND (Node.js Express)                               │
│ - Recibe preguntas                                      │
│ - Construye prompt para Gemini                          │
│ - Llama a Gemini API                                    │
│ - Procesa respuesta                                     │
│ - Retorna análisis estructurado                         │
└──────────────────┬──────────────────────────────────────┘
                   │ JSON Response
                   ↓
┌──────────────────────────────────────────────────────────┐
│ FRONTEND (results page)                                 │
│ - Recibe datos del análisis                             │
│ - Renderiza resultados con animaciones                  │
│ - Muestra recomendaciones                               │
└──────────────────────────────────────────────────────────┘
```

### Datos en Tránsito

```
Request (Frontend → Backend):
{
  "companyName": "Tech Startup XYZ",
  "industry": "tech",
  "valueProposition": "Plataforma de IA para automación empresarial",
  "targetAudience": "SMEs de 50-500 empleados",
  "salesChallenge": "positioning",
  "clientPerception": "Complejo, Costoso, Innovador",
  "selfPerception": "Accesible, Poderoso, Support Excellent",
  "mainCompetitor": "Microsoft Copilot",
  "differentiation": "Especialización en español, pre-configurado",
  "salesChannels": ["direct", "partners"],
  "marketingBudget": "50-100k",
  "objectives": "Crecer 200% usuarios en 12 meses"
}

Response (Backend → Frontend):
{
  "success": true,
  "businessName": "Tech Startup XYZ",
  "mainInsight": 85,
  "mainInsightText": "De cada 100 prospectos, 85 no entienden cómo te diferencias de Microsoft...",
  "confidence": 92,
  "perception": {
    "marketPerception": ["Complejo", "Costoso", "Español"],
    "businessReality": ["Accesible", "Powerful", "Local"],
    "gapScore": 73
  },
  "dimensions": [
    {
      "name": "Accessibilidad vs Complexity",
      "score": 62,
      "trend": "+15%",
      "insight": "El mercado aún percibe tu producto como complejo..."
    },
    // ... más dimensiones
  ],
  "recommendations": [
    {
      "priority": "P1",
      "title": "Simplificar narrative en website",
      "description": "Enfatizar casos de uso simples antes de features",
      "impact": "↑ 38% en engagement",
      "timeline": "2 semanas"
    },
    // ... más recomendaciones
  ]
}
```

---

## 💻 Implementación en Frontend {#frontend}

### Modificar `src/assets/js/main.js`

Reemplazar el método `generateMockAnalysis()` con una llamada al backend:

```javascript
async generateAnalysisResults() {
  try {
    const response = await fetch('/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        companyName: this.userAnswers.company_name,
        industry: this.userAnswers.industry,
        valueProposition: this.userAnswers.value_proposition,
        targetAudience: this.userAnswers.target_audience,
        salesChallenge: this.userAnswers.sales_challenge,
        clientPerception: this.userAnswers.client_perception,
        selfPerception: this.userAnswers.self_perception,
        mainCompetitor: this.userAnswers.main_competitor,
        differentiation: this.userAnswers.differentiation,
        salesChannels: this.userAnswers.sales_channels,
        marketingBudget: this.userAnswers.marketing_budget,
        objectives: this.userAnswers.objectives
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Unknown error');
    }

    this.analysisData = {
      businessName: data.businessName,
      mainInsight: data.mainInsight,
      mainInsightText: data.mainInsightText,
      confidence: data.confidence,
      perception: data.perception,
      dimensions: data.dimensions,
      recommendations: data.recommendations,
      timestamp: new Date().toLocaleDateString('es-ES')
    };

  } catch (error) {
    console.error('Error en análisis:', error);
    this.showToast('Error al procesar análisis. Intenta de nuevo.', 'error');
    // Fallback a datos simulados
    this.analysisData = this.generateMockAnalysis();
  }
}
```

---

## 🖥️ Backend en Node.js {#backend}

### Estructura Backend

```
backend/
├── server.js              # Entrada principal
├── config/
│   └── env.js            # Variables de entorno
├── routes/
│   └── api.js            # Rutas API
├── controllers/
│   └── analysisController.js
├── services/
│   └── geminiService.js   # Lógica de Gemini
├── middleware/
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   └── validation.js
├── .env
├── .env.example
├── package.json
└── README.md
```

### Instalación

```bash
# Crear directorio backend
mkdir backend && cd backend

# Inicializar proyecto
npm init -y

# Instalar dependencias
npm install express cors dotenv @google/generative-ai express-rate-limit
npm install --save-dev nodemon

# Crear archivos
touch server.js .env .env.example
```

### `server.js`

```javascript
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const geminiService = require('./services/geminiService');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 10, // 10 requests por ventana
  message: 'Demasiadas solicitudes, intenta después'
});

app.use('/api/', limiter);

// Routes
app.post('/api/analyze', async (req, res) => {
  try {
    const { 
      companyName, 
      industry, 
      valueProposition,
      targetAudience,
      salesChallenge,
      clientPerception,
      selfPerception,
      mainCompetitor,
      differentiation,
      marketingBudget,
      objectives
    } = req.body;

    // Validación básica
    if (!companyName || !industry || !valueProposition) {
      return res.status(400).json({ 
        success: false, 
        error: 'Parámetros requeridos faltantes' 
      });
    }

    // Llamar a servicio de Gemini
    const analysis = await geminiService.analyzePerception({
      companyName,
      industry,
      valueProposition,
      targetAudience,
      salesChallenge,
      clientPerception,
      selfPerception,
      mainCompetitor,
      differentiation,
      marketingBudget,
      objectives
    });

    res.json({ success: true, ...analysis });

  } catch (error) {
    console.error('Error en análisis:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Error procesando análisis' 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`KLEOS Backend running on port ${PORT}`);
});
```

### `services/geminiService.js`

```javascript
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzePerception(data) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = buildAnalysisPrompt(data);

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Parsear respuesta JSON
    const analysis = parseGeminiResponse(text);
    
    return {
      businessName: data.companyName,
      mainInsight: analysis.mainInsight,
      mainInsightText: analysis.mainInsightText,
      confidence: analysis.confidence,
      perception: analysis.perception,
      dimensions: analysis.dimensions,
      recommendations: analysis.recommendations
    };

  } catch (error) {
    console.error('Error calling Gemini:', error);
    throw error;
  }
}

function buildAnalysisPrompt(data) {
  return `
Eres un estratega de marketing y posicionamiento experto. Analiza la brecha entre la percepción del mercado y la realidad de este negocio:

INFORMACIÓN DE LA EMPRESA:
- Nombre: ${data.companyName}
- Industria: ${data.industry}
- Propuesta de Valor: ${data.valueProposition}
- Audiencia Objetivo: ${data.targetAudience}
- Diferenciador Principal: ${data.differentiation}
- Competidor Directo: ${data.mainCompetitor}

PERCEPCIONES Y REALIDADES:
- Cómo el MERCADO nos percibe: ${data.clientPerception}
- Cómo nos DESCRIBEN a NOSOTROS: ${data.selfPerception}
- Desafío Sales principal: ${data.salesChallenge}
- Objetivo 12 meses: ${data.objectives}

Por favor, genera un análisis estructurado en JSON con:

{
  "mainInsight": (número 0-100 indicando % de mercado que no entiende el diferenciador),
  "mainInsightText": "texto descriptivo del insight principal",
  "confidence": (número 0-100 de confianza del análisis),
  "perception": {
    "marketPerception": [array de 4-5 palabras clave como el mercado percibe],
    "businessReality": [array de 4-5 palabras clave que mejor describes],
    "gapScore": (número 0-100 del gap)
  },
  "dimensions": [
    {
      "name": "Dimensión de análisis",
      "score": número 0-100,
      "trend": "cambio estimado vs mes anterior ej: +12%",
      "insight": "descripción del hallazgo"
    }
  ],
  "recommendations": [
    {
      "priority": "P1|P2|P3",
      "title": "título accionable",
      "description": "descripción clara",
      "impact": "impacto estimado ej: ↑ 34% en conversión",
      "timeline": "timeframe ej: 30 días"
    }
  ]
}

Asegúrate de que el JSON sea válido y completamente parseable.
`;
}

function parseGeminiResponse(text) {
  try {
    // Extraer JSON del response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error parsing Gemini response:', error);
    // Return fallback structure
    return generateFallbackAnalysis();
  }
}

function generateFallbackAnalysis() {
  return {
    mainInsight: 75,
    mainInsightText: 'Análisis pendiente - error en procesamiento',
    confidence: 0,
    perception: {
      marketPerception: ['Premium', 'Complejo'],
      businessReality: ['Innovador', 'Accesible'],
      gapScore: 65
    },
    dimensions: [],
    recommendations: []
  };
}

module.exports = { analyzePerception };
```

### `.env.example`

```env
# Backend
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Gemini API
GEMINI_API_KEY=your-api-key-here

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=10
```

### `package.json` scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest"
  }
}
```

---

## 📝 Formato de Prompts Optimizados {#prompts}

### Prompt para Análisis de Percepción

```
Eres un consultor estratégico especializado en posicionamiento de mercado.

CONTEXTO:
- Empresa: [Name]
- Industria: [Industry]
- Mercado objetivo: [Target]

PREGUNTA CLAVE:
¿Cuál es la brecha entre cómo el mercado percibe esta empresa y cómo realmente es?

DATOS:
- Mercado percibe como: [Client Perception]
- Empresa se describe como: [Self Perception]
- Diferenciador: [Differentiation]

Genera un análisis que incluya:
1. Un número que representa % del mercado que NO entiende el diferenciador
2. Las palabras clave de la percepción vs realidad
3. 4 dimensiones de análisis con scores
4. 3 recomendaciones priorizadas

Responde en JSON válido.
```

### Prompt para Generar Recomendaciones

```
Basándome en este análisis de brecha de percepción:
- Gap Score: [X]%
- Mercado percibe: [words]
- Realidad es: [words]

¿Cuáles son los 3 cambios más accionables (y con mayor ROI) que esta empresa debería hacer en los próximos 90 días para cerrar la brecha de percepción?

Para cada recomendación incluye:
- Acción específica
- Por qué funciona
- Impacto estimado en conversión/ventas
- Timeframe realista
```

---

## 🚨 Manejo de Errores {#errores}

### Errores Comunes y Soluciones

**1. Invalid API Key**
```javascript
// Validar en startup
if (!process.env.GEMINI_API_KEY) {
  console.error('GEMINI_API_KEY no configurada');
  process.exit(1);
}
```

**2. Rate Limit Exceeded**
```javascript
// Implementar backoff exponencial
async function callWithRetry(fn, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}
```

**3. Invalid JSON Response**
```javascript
// Usar fallback a mock data
function parseOrFallback(json) {
  try {
    return JSON.parse(json);
  } catch {
    return generateFallbackAnalysis();
  }
}
```

**4. Timeout**
```javascript
// Agregar timeout
const timeoutPromise = new Promise((_, reject) => 
  setTimeout(() => reject(new Error('Timeout')), 30000)
);
await Promise.race([apiCall, timeoutPromise]);
```

---

## 📊 Rate Limiting {#rate-limiting}

### Configuración

```javascript
const rateLimit = require('express-rate-limit');

const analysisLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,    // 15 min
  max: 10,                       // 10 requests
  message: 'Demasiadas solicitudes',
  standardHeaders: true,         // Return info en headers
  legacyHeaders: false           // Disable X-RateLimit-*
});

app.post('/api/analyze', analysisLimiter, async (req, res) => {
  // ...
});
```

### Headers Retornados

```
RateLimit-Limit: 10
RateLimit-Remaining: 9
RateLimit-Reset: 1234567890
Retry-After: 60
```

---

## 🧪 Testing {#testing}

### Test Manual con cURL

```bash
curl -X POST http://localhost:3001/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "companyName": "Test Company",
    "industry": "tech",
    "valueProposition": "Platform de IA",
    "targetAudience": "Startups",
    "salesChallenge": "positioning",
    "clientPerception": "Complejo, Moderno",
    "selfPerception": "Accesible, Powerful",
    "mainCompetitor": "Competitor X",
    "differentiation": "Specialized in spanish",
    "marketingBudget": "50-100k",
    "objectives": "Grow 200%"
  }'
```

### Test con Jest

```javascript
// __tests__/api.test.js
const request = require('supertest');
const app = require('../server');

describe('POST /api/analyze', () => {
  it('should return analysis with valid input', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({
        companyName: 'Test',
        industry: 'tech',
        valueProposition: 'Test'
        // ... más campos
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.mainInsight).toBeDefined();
  });

  it('should return 400 with missing required fields', async () => {
    const res = await request(app)
      .post('/api/analyze')
      .send({ companyName: 'Test' });

    expect(res.statusCode).toBe(400);
  });
});
```

### Environment para Testing

```env.test
GEMINI_API_KEY=test-key-do-not-use
NODE_ENV=test
RATE_LIMIT_MAX_REQUESTS=1000
```

---

## 🔐 Consideraciones de Seguridad

### Antes de Producción

- [ ] Usar HTTPS siempre
- [ ] Validar y sanitizar todos los inputs
- [ ] Implementar autenticación (JWT)
- [ ] Usar rate limiting agresivo
- [ ] Loguear todas las llamadas a API
- [ ] Encriptar datos en tránsito
- [ ] Implementar WAF (Web Application Firewall)
- [ ] Usar API keys rotables
- [ ] Implementar CORS correctamente
- [ ] Monitorizá alertas de abuse

### Ejemplo con Validación

```javascript
const { body, validationResult } = require('express-validator');

app.post('/api/analyze',
  body('companyName').trim().isLength({ min: 2, max: 100 }),
  body('industry').isIn(['tech', 'finance', 'consulting', /* ... */]),
  body('valueProposition').trim().isLength({ min: 10, max: 500 }),
  // ... más validaciones
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    // ... continuar
  }
);
```

---

## 📈 Monitoreo y Logs

### Winston Logger

```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  defaultMeta: { service: 'kleos-insight' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Uso
logger.info('Analysis completed', { 
  businessName: 'Company X',
  confidence: 92,
  processingTime: 2341
});
```

---

## 🚀 Deployment

### Docker

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

### Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "3001:3001"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY}
      - NODE_ENV=production
    restart: unless-stopped

  frontend:
    build: ./src
    ports:
      - "3000:3000"
    environment:
      - BACKEND_URL=http://backend:3001
    depends_on:
      - backend
```

---

## 📚 Recursos

- [Google Generative AI SDK](https://github.com/google/generative-ai-js)
- [Gemini API Documentation](https://ai.google.dev)
- [Express.js Guide](https://expressjs.com)
- [Rate Limiting Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)

---

**KLEOS INSIGHT™ — Ready for Intelligent Analysis**

*Integra Gemini y empieza a generar insights reales.*
