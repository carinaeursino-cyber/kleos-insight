# KLEOS INSIGHT™ MVP V1 — Developer Quick Start

**Guía de Desarrollo: Exactamente qué construir, sin ambigüedad**

---

## ANTES DE EMPEZAR

### 1. Lee Estos Docs (15 min)

```
ESSENTIAL (obligatorio):
├─ MVP_V1_PRD.md             ← Qué construir exactamente
├─ Este archivo (aquí)       ← Cómo construirlo
└─ MVP_V1_SIMPLIFIED_DESIGN.md ← Visual design

OPCIONAL:
├─ EXECUTIVE_SUMMARY_MVP_V1.md
└─ design/MVP_V1_SIMPLIFIED_DESIGN.md
```

### 2. Confirma Scope

**Construirás:**
- ✅ 4 pantallas (Landing, Diagnóstico, Procesamiento, Resultado)
- ✅ HTML5 semantic
- ✅ CSS3 (no Tailwind, no SCSS, vanilla)
- ✅ JavaScript vanilla ES6+
- ✅ localStorage (no backend, no API)

**NO construirás:**
- ❌ Login/Registro
- ❌ Backend
- ❌ Database
- ❌ Gemini API
- ❌ Stripe/Payments

---

## SETUP RÁPIDO (30 min)

### Estructura de Carpetas

```
kleos-insight-v1/
├── src/
│   ├── index.html           ← TODO el HTML (4 pantallas en 1 archivo)
│   └── assets/
│       ├── css/
│       │   └── styles.css   ← TODO el CSS
│       └── js/
│           └── main.js      ← TODO el JavaScript
├── design/
│   ├── MVP_V1_SIMPLIFIED_DESIGN.md
│   └── KLEOS_INSIGHT_Experience_Design.md (reference)
├── MVP_V1_PRD.md
├── EXECUTIVE_SUMMARY_MVP_V1.md
└── [Tu documentación anterior]
```

### Iniciar

```bash
# Crear estructura
mkdir -p kleos-insight-v1/src/assets/{css,js}
touch kleos-insight-v1/src/index.html
touch kleos-insight-v1/src/assets/css/styles.css
touch kleos-insight-v1/src/assets/js/main.js

# Servir locally
cd kleos-insight-v1/src
python -m http.server 8000
# Open: http://localhost:8000
```

---

## PASO 1: HTML STRUCTURE (4 horas)

### Archivo: `src/index.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KLEOS INSIGHT™ - Detecta tu brecha de percepción</title>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
    
    <!-- Styles -->
    <link rel="stylesheet" href="assets/css/styles.css">
</head>
<body>
    <!-- PANTALLA 1: LANDING PAGE -->
    <main data-page-content="home">
        <!-- Navbar minimalista -->
        <header class="header">
            <div class="header-content">
                <div class="logo">KLEOS INSIGHT™</div>
                <!-- opcional: navigation links -->
            </div>
        </header>

        <!-- HERO SECTION -->
        <section class="hero">
            <div class="hero-content">
                <h1>
                    <span class="text-white">¿Qué percepción</span>
                    <span class="text-gold">limita tu crecimiento?</span>
                </h1>
                <p class="hero-subtitle">
                    KLEOS INSIGHT™ detecta y transforma 
                    las limitaciones imperceptibles que frenan tu negocio
                </p>
                <div class="hero-ctas">
                    <button class="btn btn-primary" data-page="questions">
                        Iniciar Diagnóstico
                    </button>
                    <button class="btn btn-secondary" data-action="scroll-to-section">
                        Saber Más
                    </button>
                </div>
            </div>
        </section>

        <!-- FILOSOFÍA (3 COLUMNAS) -->
        <section class="filosofia">
            <h2 class="section-title">¿Por qué Kleos existe?</h2>
            <div class="filosofia-grid">
                <div class="filosofia-card">
                    <div class="card-number">01</div>
                    <h3>Percepción</h3>
                    <p>Tu mercado no compra lo que eres. Compra lo que PERCIBE.</p>
                </div>
                <div class="filosofia-card">
                    <div class="card-number">02</div>
                    <h3>Claridad</h3>
                    <p>Un mensaje claro te posiciona como autoridad indiscutible.</p>
                </div>
                <div class="filosofia-card">
                    <div class="card-number">03</div>
                    <h3>Confianza</h3>
                    <p>La incertidumbre es la razón #1 por la que no cierran deals.</p>
                </div>
            </div>
        </section>

        <!-- CÓMO FUNCIONA (4 PASOS) -->
        <section class="cómo-funciona">
            <h2 class="section-title">Kleos en 60 segundos</h2>
            <div class="timeline">
                <div class="timeline-item">
                    <div class="timeline-circle">01</div>
                    <div class="timeline-content">
                        <h4>Responde 12 preguntas</h4>
                        <p>Cuéntanos sobre tu negocio</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-circle">02</div>
                    <div class="timeline-content">
                        <h4>Nuestro sistema analiza</h4>
                        <p>Detecta percepciones del mercado</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-circle">03</div>
                    <div class="timeline-content">
                        <h4>Genera tu Índice Kleos</h4>
                        <p>Puntuación 0-100 de brecha</p>
                    </div>
                </div>
                <div class="timeline-item">
                    <div class="timeline-circle">04</div>
                    <div class="timeline-content">
                        <h4>Recibes diagnóstico</h4>
                        <p>Único e inmediato</p>
                    </div>
                </div>
            </div>
        </section>

        <!-- BENEFICIOS -->
        <section class="beneficios">
            <h2 class="section-title">¿Qué es el Índice Kleos?</h2>
            <div class="beneficios-grid">
                <div class="beneficio-card">
                    <h3>Sabes exactamente qué está frenando tu crecimiento</h3>
                    <p>No más adivinanzas estratégicas</p>
                </div>
                <div class="beneficio-card">
                    <h3>Tienes un plan claro para actuar inmediatamente</h3>
                    <p>No más confusión en prioridades</p>
                </div>
            </div>
        </section>

        <!-- CTA FINAL -->
        <section class="cta-final">
            <h2>¿Listo para saber la verdad?</h2>
            <button class="btn btn-primary" data-page="questions">
                Comenzar Diagnóstico
            </button>
        </section>

        <!-- Footer -->
        <footer class="footer">
            <p>&copy; 2026 KLEOS INSIGHT™ | Todos los derechos reservados</p>
        </footer>
    </main>

    <!-- PANTALLA 2: DIAGNÓSTICO (12 PREGUNTAS) -->
    <main data-page-content="questions">
        <!-- Barra de progreso -->
        <div class="progress-bar-container">
            <div class="progress-bar">
                <div class="progress-fill"></div>
            </div>
            <p class="progress-text">Pregunta <span id="question-number">1</span> de 12</p>
        </div>

        <!-- Contenedor de preguntas -->
        <div class="questions-container">
            <form id="questionnaire" class="questionnaire-form">
                <!-- Q1: Nombre empresa -->
                <div class="question-group" data-question="1">
                    <label class="question-label">Pregunta 1 de 12</label>
                    <h3 class="question-text">¿Cuál es el nombre de tu empresa?</h3>
                    <input type="text" name="q1_company" placeholder="Nombre de tu empresa" required>
                </div>

                <!-- Q2: Industria (Select) -->
                <div class="question-group" data-question="2">
                    <label class="question-label">Pregunta 2 de 12</label>
                    <h3 class="question-text">¿En qué industria operan?</h3>
                    <select name="q2_industry" required>
                        <option value="">Selecciona tu industria</option>
                        <option value="Tecnología">Tecnología</option>
                        <option value="Finanzas">Finanzas</option>
                        <option value="Consultoría">Consultoría</option>
                        <option value="Marketing">Marketing</option>
                        <option value="E-commerce">E-commerce</option>
                        <option value="Servicios">Servicios</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>

                <!-- Q3: Propuesta de valor -->
                <div class="question-group" data-question="3">
                    <label class="question-label">Pregunta 3 de 12</label>
                    <h3 class="question-text">¿Cuál es tu principal propuesta de valor?</h3>
                    <textarea name="q3_value_prop" placeholder="Describe brevemente" required></textarea>
                </div>

                <!-- Q4: Mayor desafío -->
                <div class="question-group" data-question="4">
                    <label class="question-label">Pregunta 4 de 12</label>
                    <h3 class="question-text">¿Cuál es tu mayor desafío en ventas?</h3>
                    <input type="text" name="q4_challenge" placeholder="Tu mayor desafío" required>
                </div>

                <!-- Q5: Percepción de clientes (CRÍTICA) -->
                <div class="question-group" data-question="5">
                    <label class="question-label">Pregunta 5 de 12</label>
                    <h3 class="question-text">¿Cómo describirían TUS CLIENTES tu empresa en 3 palabras?</h3>
                    <input type="text" name="q5_client_perception" placeholder="Ej: Confiable, Innovador, Premium" required>
                </div>

                <!-- Q6: Auto-percepción (CRÍTICA) -->
                <div class="question-group" data-question="6">
                    <label class="question-label">Pregunta 6 de 12</label>
                    <h3 class="question-text">¿Cómo TE DESCRIBES a ti mismo en 3 palabras?</h3>
                    <input type="text" name="q6_self_perception" placeholder="Ej: Especializado, Accesible" required>
                </div>

                <!-- Q7: Competidor principal -->
                <div class="question-group" data-question="7">
                    <label class="question-label">Pregunta 7 de 12</label>
                    <h3 class="question-text">¿Cuál es tu principal competidor?</h3>
                    <input type="text" name="q7_competitor" placeholder="Nombre o tipo" required>
                </div>

                <!-- Q8: Diferenciación -->
                <div class="question-group" data-question="8">
                    <label class="question-label">Pregunta 8 de 12</label>
                    <h3 class="question-text">¿Qué te diferencia de tu competencia?</h3>
                    <textarea name="q8_differentiation" placeholder="¿Por qué elegir tu empresa?" required></textarea>
                </div>

                <!-- Q9: Canales (Checkboxes) -->
                <div class="question-group" data-question="9">
                    <label class="question-label">Pregunta 9 de 12</label>
                    <h3 class="question-text">¿Cuáles son tus canales de venta? (Selecciona todos)</h3>
                    <div class="checkbox-group">
                        <label class="checkbox-item">
                            <input type="checkbox" name="q9_channels" value="Venta directa">
                            Venta directa
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" name="q9_channels" value="Canales digitales">
                            Canales digitales
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" name="q9_channels" value="Alianzas">
                            Alianzas y partners
                        </label>
                        <label class="checkbox-item">
                            <input type="checkbox" name="q9_channels" value="Inbound">
                            Inbound marketing
                        </label>
                    </div>
                </div>

                <!-- Q10: Presupuesto -->
                <div class="question-group" data-question="10">
                    <label class="question-label">Pregunta 10 de 12</label>
                    <h3 class="question-text">¿Cuál es tu presupuesto anual de marketing?</h3>
                    <select name="q10_budget" required>
                        <option value="">Selecciona rango</option>
                        <option value="$0-$10k">$0 - $10k</option>
                        <option value="$10k-$50k">$10k - $50k</option>
                        <option value="$50k-$100k">$50k - $100k</option>
                        <option value="$100k+">$100k+</option>
                    </select>
                </div>

                <!-- Q11: Objetivo -->
                <div class="question-group" data-question="11">
                    <label class="question-label">Pregunta 11 de 12</label>
                    <h3 class="question-text">¿Cuál es tu objetivo principal en los próximos 12 meses?</h3>
                    <textarea name="q11_objective" placeholder="Describe tu objetivo" required></textarea>
                </div>

                <!-- Q12: Email (opcional) -->
                <div class="question-group" data-question="12">
                    <label class="question-label">Pregunta 12 de 12</label>
                    <h3 class="question-text">Tu email para recibir el análisis (opcional)</h3>
                    <input type="email" name="q12_email" placeholder="tu@email.com">
                </div>
            </form>
        </div>

        <!-- Botones de navegación -->
        <div class="questions-footer">
            <button class="btn btn-secondary" id="btn-back" style="display:none;">
                ← Volver
            </button>
            <button class="btn btn-primary" id="btn-next">
                Siguiente
            </button>
        </div>
    </main>

    <!-- PANTALLA 3: PROCESAMIENTO -->
    <main data-page-content="analysis">
        <div class="processing-container">
            <div class="processing-content">
                <div class="logo-processing">KLEOS</div>
                
                <div class="spinner"></div>
                
                <p class="processing-message" id="processing-message">
                    Analizando percepciones...
                </p>
                
                <div class="progress-bar-thin">
                    <div class="progress-fill-thin"></div>
                </div>
                
                <p class="progress-percent" id="progress-percent">0%</p>
            </div>
        </div>
    </main>

    <!-- PANTALLA 4: RESULTADO -->
    <main data-page-content="results">
        <!-- Índice Kleos Hero -->
        <section class="result-hero">
            <h2 class="result-title">TU ÍNDICE KLEOS</h2>
            <div class="index-display">
                <div class="index-number" id="index-number">0</div>
                <div class="index-max">/ 100</div>
            </div>
            <p class="index-interpretation" id="index-interpretation">Calculando...</p>
            <div class="index-confidence">
                <p>Confianza del análisis: <span id="confidence-percent">0</span>%</p>
                <div class="confidence-bar">
                    <div class="confidence-fill" id="confidence-fill"></div>
                </div>
            </div>
        </section>

        <!-- Percepción Detectada (FREEMIUM) -->
        <section class="result-section perception-section">
            <h3>PERCEPCIÓN DETECTADA</h3>
            <p class="section-description">El mercado percibe tu negocio como:</p>
            <ul class="perception-list" id="perception-list">
                <li class="visible">• Premium</li>
                <li class="visible">• Confiable</li>
                <li class="hidden">• Bloqueado ••••••••••</li>
                <li class="hidden">• Bloqueado ••••••••••</li>
            </ul>
            <button class="btn btn-secondary" data-action="unlock">
                Desbloquear Análisis Completo
            </button>
        </section>

        <!-- Verdad Incómoda (FREEMIUM) -->
        <section class="result-section truth-section">
            <h3>LA VERDAD INCÓMODA</h3>
            <p class="section-description">De cada 100 clientes potenciales...</p>
            <p class="truth-number" id="truth-number">98</p>
            <p class="truth-text">NO comprenden tu diferenciador clave</p>
            <div class="truth-implications">
                <p class="implication visible">✗ Conversión baja</p>
                <p class="implication hidden">✗ Bloqueado •••••••</p>
                <p class="implication hidden">✗ Bloqueado •••••••</p>
            </div>
        </section>

        <!-- Diagnóstico Principal (FREEMIUM) -->
        <section class="result-section diagnosis-section">
            <h3>TU DIAGNÓSTICO PRINCIPAL</h3>
            <p class="diagnosis-headline" id="diagnosis-headline">
                Alinea tu narrativa de marketing con tu propuesta de valor real
            </p>
            <p class="diagnosis-description">
                Acceso completo incluye 5 recomendaciones accionables + timeline
            </p>
        </section>

        <!-- CTA Desbloquear (Sticky) -->
        <section class="unlock-cta">
            <button class="btn btn-primary btn-large" data-action="unlock">
                Desbloquear Análisis Completo
            </button>
            <div class="unlock-benefits">
                <p>✓ Análisis completo de percepciones</p>
                <p>✓ 5 recomendaciones accionables</p>
                <p>✓ Timeline de implementación</p>
                <p>✓ Exportar en PDF</p>
            </div>
            <p class="unlock-price">[Precio a definir]</p>
        </section>

        <!-- CTA Secundarias -->
        <section class="secondary-ctas">
            <button class="btn btn-secondary" id="btn-share">
                Compartir Resultado
            </button>
            <button class="btn btn-secondary" id="btn-download">
                Descargar Análisis
            </button>
            <button class="btn btn-secondary" id="btn-new">
                Nuevo Análisis
            </button>
        </section>
    </main>

    <!-- Scripts -->
    <script src="assets/js/main.js"></script>
</body>
</html>
```

---

## PASO 2: CSS (2 horas)

### Archivo: `src/assets/css/styles.css`

```css
/* VARIABLES */
:root {
    --color-black: #050505;
    --color-gold: #C5A059;
    --color-white: #F5F5F5;
    --color-gray-dark: #1A1A1A;
    --color-gray-medium: #2D2D2D;
    
    --font-display: 'Playfair Display', serif;
    --font-mono: 'JetBrains Mono', monospace;
    
    --transition-fast: 200ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-medium: 300ms cubic-bezier(0.4, 0, 0.2, 1);
    --transition-slow: 600ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* RESET */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    background-color: var(--color-black);
    color: var(--color-white);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    font-size: 16px;
    line-height: 1.6;
}

/* HIDE/SHOW PAGES */
main[data-page-content] {
    display: none;
    animation: fadeIn var(--transition-medium);
}

main[data-page-content].active {
    display: block;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

/* HEADER */
.header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    height: 72px;
    background: var(--color-black);
    border-bottom: 1px solid var(--color-gray-medium);
    z-index: 100;
    display: none;  /* Hidden for MVP */
}

/* BUTTONS */
.btn {
    padding: 12px 32px;
    font-family: var(--font-display);
    font-size: 16px;
    border: none;
    cursor: pointer;
    transition: all var(--transition-medium);
    border-radius: 0;
}

.btn-primary {
    background-color: var(--color-gold);
    color: var(--color-black);
    font-weight: 700;
}

.btn-primary:hover {
    filter: brightness(1.15);
    box-shadow: 0 4px 16px rgba(197, 160, 89, 0.3);
}

.btn-primary:active {
    filter: brightness(1.25);
}

.btn-secondary {
    background-color: transparent;
    color: var(--color-gold);
    border: 1px solid var(--color-gold);
}

.btn-secondary:hover {
    background-color: rgba(197, 160, 89, 0.1);
}

.btn-large {
    width: 100%;
    padding: 16px 32px;
    font-size: 18px;
}

/* INPUTS */
input[type="text"],
input[type="email"],
textarea,
select {
    width: 100%;
    background-color: transparent;
    border: none;
    border-bottom: 1px solid var(--color-gray-medium);
    color: var(--color-white);
    font-family: inherit;
    font-size: 16px;
    padding: 12px 0;
    outline: none;
    transition: border-color var(--transition-fast);
}

input[type="text"]:focus,
input[type="email"]:focus,
textarea:focus,
select:focus {
    border-bottom-color: var(--color-gold);
    border-bottom-width: 2px;
    box-shadow: 0 4px 16px rgba(197, 160, 89, 0.15);
}

input::placeholder,
textarea::placeholder {
    color: rgba(245, 245, 245, 0.5);
}

textarea {
    resize: vertical;
    min-height: 100px;
    padding: 12px;
    border: 1px solid var(--color-gray-medium);
}

/* PANTALLA 1: LANDING */
.hero {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    background-color: var(--color-black);
}

.hero-content {
    max-width: 800px;
    padding: 0 24px;
}

.hero-content h1 {
    font-family: var(--font-display);
    font-size: 56px;
    line-height: 1.2;
    margin-bottom: 24px;
    font-weight: 700;
}

.text-white {
    color: var(--color-white);
}

.text-gold {
    color: var(--color-gold);
}

.hero-subtitle {
    font-size: 24px;
    color: var(--color-gray-medium);
    margin-bottom: 48px;
    line-height: 1.4;
}

.hero-ctas {
    display: flex;
    gap: 16px;
    justify-content: center;
}

.section-title {
    font-family: var(--font-display);
    font-size: 42px;
    text-align: center;
    margin-bottom: 48px;
    color: var(--color-gold);
}

/* SECCIONES */
section {
    padding: 80px 48px;
    max-width: 1200px;
    margin: 0 auto;
}

.filosofia,
.cómo-funciona,
.beneficios {
    background-color: var(--color-black);
}

.filosofia-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 64px;
}

.filosofia-card {
    text-align: left;
}

.card-number {
    font-family: var(--font-mono);
    font-size: 48px;
    color: var(--color-gold);
    margin-bottom: 16px;
    opacity: 0.3;
}

.filosofia-card h3 {
    font-family: var(--font-display);
    font-size: 20px;
    margin-bottom: 12px;
    border-top: 2px solid var(--color-gold);
    padding-top: 12px;
}

.filosofia-card p {
    font-size: 14px;
    color: var(--color-gray-medium);
    line-height: 1.6;
}

/* TIMELINE */
.timeline {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.timeline-item {
    display: flex;
    gap: 32px;
    align-items: center;
}

.timeline-circle {
    font-family: var(--font-mono);
    font-size: 32px;
    color: var(--color-gold);
    width: 80px;
    height: 80px;
    border: 2px solid var(--color-gold);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.timeline-content h4 {
    font-family: var(--font-display);
    font-size: 20px;
    margin-bottom: 4px;
}

.timeline-content p {
    font-size: 14px;
    color: var(--color-gray-medium);
}

/* BENEFICIOS */
.beneficios-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
}

.beneficio-card {
    border: 1px solid var(--color-gold);
    padding: 32px;
    background-color: rgba(197, 160, 89, 0.05);
}

.beneficio-card h3 {
    font-family: var(--font-display);
    font-size: 24px;
    margin-bottom: 12px;
}

.beneficio-card p {
    font-size: 14px;
    color: var(--color-gray-medium);
}

/* CTA FINAL */
.cta-final {
    text-align: center;
    padding: 80px 48px;
}

.cta-final h2 {
    font-family: var(--font-display);
    font-size: 42px;
    margin-bottom: 32px;
}

/* FOOTER */
.footer {
    text-align: center;
    padding: 32px;
    border-top: 1px solid var(--color-gray-medium);
    font-size: 12px;
    color: var(--color-gray-medium);
}

/* PANTALLA 2: DIAGNÓSTICO */
.progress-bar-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    background-color: var(--color-black);
    padding: 12px 24px;
}

.progress-bar {
    width: 100%;
    height: 4px;
    background-color: var(--color-gray-medium);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 8px;
}

.progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #FF8C42, var(--color-gold));
    width: 0%;
    transition: width var(--transition-slow);
}

.progress-text {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-gray-medium);
}

.questions-container {
    padding: 120px 48px 80px;
    max-width: 800px;
    margin: 0 auto;
}

.question-group {
    display: none;
    margin-bottom: 48px;
}

.question-group.active {
    display: block;
    animation: slideUp var(--transition-medium);
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.question-label {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-gold);
    text-transform: uppercase;
    margin-bottom: 8px;
    display: block;
}

.question-text {
    font-family: var(--font-display);
    font-size: 28px;
    margin-bottom: 24px;
    line-height: 1.3;
}

input[type="text"],
input[type="email"],
textarea,
select {
    margin-bottom: 12px;
}

.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.checkbox-item,
.radio-item {
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    font-size: 14px;
}

input[type="checkbox"],
input[type="radio"] {
    width: 18px;
    height: 18px;
    cursor: pointer;
    accent-color: var(--color-gold);
}

.questions-footer {
    display: flex;
    gap: 16px;
    justify-content: space-between;
    position: fixed;
    bottom: 32px;
    left: 32px;
    right: 32px;
    max-width: 800px;
    margin: 0 auto;
}

/* PANTALLA 3: PROCESAMIENTO */
.processing-container {
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: var(--color-black);
}

.processing-content {
    text-align: center;
}

.logo-processing {
    font-family: var(--font-display);
    font-size: 48px;
    color: var(--color-white);
    margin-bottom: 32px;
}

.spinner {
    width: 60px;
    height: 60px;
    border: 4px solid transparent;
    border-top: 4px solid var(--color-gold);
    border-radius: 50%;
    animation: spin 1.8s linear infinite;
    margin: 0 auto 32px;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.processing-message {
    font-family: var(--font-display);
    font-size: 24px;
    margin-bottom: 24px;
    color: var(--color-white);
    min-height: 32px;
}

.progress-bar-thin {
    width: 200px;
    height: 4px;
    background-color: var(--color-gray-medium);
    margin: 0 auto 12px;
    border-radius: 2px;
    overflow: hidden;
}

.progress-fill-thin {
    height: 100%;
    background: linear-gradient(90deg, #FF8C42, var(--color-gold));
    width: 0%;
    transition: width var(--transition-slow);
}

.progress-percent {
    font-family: var(--font-mono);
    font-size: 12px;
    color: var(--color-gray-medium);
}

/* PANTALLA 4: RESULTADO */
.result-hero {
    padding: 80px 48px;
    text-align: center;
    background-color: var(--color-black);
}

.result-title {
    font-family: var(--font-display);
    font-size: 32px;
    color: var(--color-gold);
    margin-bottom: 32px;
    letter-spacing: 2px;
}

.index-display {
    display: flex;
    align-items: baseline;
    justify-content: center;
    gap: 12px;
    margin-bottom: 24px;
}

.index-number {
    font-family: var(--font-mono);
    font-size: 96px;
    color: var(--color-gold);
    line-height: 1;
}

.index-max {
    font-family: var(--font-mono);
    font-size: 48px;
    color: var(--color-gray-medium);
}

.index-interpretation {
    font-family: var(--font-display);
    font-size: 20px;
    margin-bottom: 24px;
    color: var(--color-white);
}

.index-confidence {
    max-width: 200px;
    margin: 0 auto;
}

.index-confidence p {
    font-family: var(--font-mono);
    font-size: 12px;
    margin-bottom: 8px;
    color: var(--color-gray-medium);
}

.confidence-bar {
    width: 100%;
    height: 4px;
    background-color: var(--color-gray-medium);
    border-radius: 2px;
    overflow: hidden;
}

.confidence-fill {
    height: 100%;
    background-color: #4ADE80;
    width: 0%;
    transition: width var(--transition-slow);
}

/* RESULT SECTIONS */
.result-section {
    padding: 48px 48px;
    max-width: 800px;
    margin: 0 auto;
    border: 1px solid var(--color-gray-medium);
    margin-bottom: 32px;
    background-color: rgba(26, 26, 26, 0.5);
}

.result-section h3 {
    font-family: var(--font-display);
    font-size: 24px;
    color: var(--color-gold);
    margin-bottom: 16px;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.section-description {
    font-family: var(--font-display);
    font-size: 16px;
    color: var(--color-gray-medium);
    margin-bottom: 16px;
}

.perception-list,
.truth-implications {
    list-style: none;
    margin-bottom: 24px;
}

.perception-list li,
.truth-implications p {
    font-size: 14px;
    margin-bottom: 8px;
    font-family: var(--font-display);
}

.perception-list .visible,
.truth-implications .visible {
    color: var(--color-white);
}

.perception-list .hidden,
.truth-implications .hidden {
    color: var(--color-gray-medium);
}

.truth-number {
    font-family: var(--font-mono);
    font-size: 64px;
    color: var(--color-gold);
    margin: 16px 0;
}

.truth-text {
    font-family: var(--font-display);
    font-size: 20px;
    color: var(--color-white);
    margin-bottom: 24px;
}

.diagnosis-headline {
    font-family: var(--font-display);
    font-size: 20px;
    color: var(--color-white);
    margin-bottom: 16px;
    font-weight: 700;
}

.diagnosis-description {
    font-size: 14px;
    color: var(--color-gray-medium);
}

/* CTA DESBLOQUEAR */
.unlock-cta {
    padding: 64px 48px;
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
    border: 1px solid var(--color-gold);
    background-color: rgba(197, 160, 89, 0.05);
}

.unlock-benefits {
    margin: 24px 0;
    text-align: left;
    display: inline-block;
}

.unlock-benefits p {
    font-size: 14px;
    margin: 8px 0;
    color: var(--color-white);
}

.unlock-price {
    font-family: var(--font-mono);
    font-size: 20px;
    color: var(--color-gold);
    margin-top: 24px;
    font-weight: 700;
}

/* CTA SECUNDARIAS */
.secondary-ctas {
    padding: 48px 48px;
    max-width: 800px;
    margin: 0 auto;
    display: flex;
    gap: 16px;
    justify-content: center;
    flex-wrap: wrap;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
    section {
        padding: 48px 32px;
    }

    .hero-content h1 {
        font-size: 42px;
    }

    .section-title {
        font-size: 32px;
    }

    .filosofia-grid {
        grid-template-columns: 1fr;
        gap: 32px;
    }

    .beneficios-grid {
        grid-template-columns: 1fr;
    }

    .hero-ctas {
        flex-direction: column;
    }
}

@media (max-width: 768px) {
    .hero-content h1 {
        font-size: 32px;
    }

    .hero-subtitle {
        font-size: 16px;
    }

    .section-title {
        font-size: 24px;
    }

    .questions-container {
        padding: 100px 16px 80px;
    }

    .question-text {
        font-size: 20px;
    }

    .result-hero {
        padding: 48px 16px;
    }

    .index-number {
        font-size: 64px;
    }

    .result-section {
        padding: 24px 16px;
    }

    .secondary-ctas {
        flex-direction: column;
    }

    .questions-footer {
        flex-direction: column;
    }

    .btn {
        width: 100%;
    }
}
```

---

## PASO 3: JAVASCRIPT (4 horas)

### Archivo: `src/assets/js/main.js`

```javascript
class KleosInsight {
    constructor() {
        this.currentPage = 'home';
        this.currentQuestion = 1;
        this.totalQuestions = 12;
        this.answers = {};
        this.result = null;
        this.init();
    }

    init() {
        this.loadPage('home');
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Navigation buttons with data-page attribute
        document.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                this.loadPage(btn.dataset.page);
            });
        });

        // Questions form
        const form = document.getElementById('questionnaire');
        if (form) {
            this.setupQuestions();
        }

        // Action buttons
        document.querySelectorAll('[data-action]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = btn.dataset.action;
                if (action === 'unlock') {
                    this.showUnlockModal();
                } else if (action === 'scroll-to-section') {
                    // Scroll to next section
                }
            });
        });
    }

    loadPage(page) {
        // Hide all pages
        document.querySelectorAll('main[data-page-content]').forEach(m => {
            m.classList.remove('active');
        });

        // Show target page
        const target = document.querySelector(`main[data-page-content="${page}"]`);
        if (target) {
            target.classList.add('active');
        }

        this.currentPage = page;

        // Page-specific initialization
        if (page === 'questions') {
            this.initQuestionsPage();
        } else if (page === 'analysis') {
            this.startAnalysis();
        } else if (page === 'results') {
            this.initResultsPage();
        }

        // Scroll to top
        window.scrollTo(0, 0);
    }

    setupQuestions() {
        // Show first question
        this.showQuestion(1);

        // Navigation buttons
        const btnNext = document.getElementById('btn-next');
        const btnBack = document.getElementById('btn-back');

        if (btnNext) {
            btnNext.addEventListener('click', () => this.nextQuestion());
        }

        if (btnBack) {
            btnBack.addEventListener('click', () => this.previousQuestion());
        }
    }

    initQuestionsPage() {
        this.currentQuestion = 1;
        this.showQuestion(1);
    }

    showQuestion(num) {
        if (num < 1 || num > this.totalQuestions) return;

        this.currentQuestion = num;

        // Hide all questions
        document.querySelectorAll('.question-group').forEach(g => {
            g.classList.remove('active');
        });

        // Show current question
        const question = document.querySelector(`.question-group[data-question="${num}"]`);
        if (question) {
            question.classList.add('active');
            const input = question.querySelector('input, textarea, select');
            if (input) input.focus();
        }

        // Update progress
        const fill = document.querySelector('.progress-fill');
        const progress = (num / this.totalQuestions) * 100;
        if (fill) fill.style.width = progress + '%';

        const progressNum = document.getElementById('question-number');
        if (progressNum) progressNum.textContent = num;

        // Update button states
        const btnBack = document.getElementById('btn-back');
        const btnNext = document.getElementById('btn-next');

        if (btnBack) {
            btnBack.style.display = num === 1 ? 'none' : 'block';
        }

        if (btnNext) {
            btnNext.textContent = num === this.totalQuestions ? 'Analizar →' : 'Siguiente';
        }

        // Auto-focus
        const inputElement = question?.querySelector('input, textarea, select');
        if (inputElement) {
            inputElement.focus();
        }
    }

    nextQuestion() {
        if (this.currentQuestion < this.totalQuestions) {
            this.currentQuestion++;
            this.showQuestion(this.currentQuestion);
        } else {
            // Last question - submit
            this.submitForm();
        }
    }

    previousQuestion() {
        if (this.currentQuestion > 1) {
            this.currentQuestion--;
            this.showQuestion(this.currentQuestion);
        }
    }

    submitForm() {
        // Validate all fields
        const form = document.getElementById('questionnaire');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        // Collect answers
        const formData = new FormData(form);
        this.answers = {};
        for (let [key, value] of formData.entries()) {
            if (key === 'q9_channels') {
                if (!this.answers[key]) this.answers[key] = [];
                this.answers[key].push(value);
            } else {
                this.answers[key] = value;
            }
        }

        // Save to localStorage
        localStorage.setItem('kleosAnswers', JSON.stringify(this.answers));

        // Go to analysis page
        this.loadPage('analysis');
    }

    startAnalysis() {
        // Random duration 3-6 seconds
        const duration = Math.random() * 3000 + 3000;

        // Messages
        const messages = [
            'Analizando percepciones...',
            'Detectando patrones...',
            'Construyendo Índice Kleos...',
            'Generando diagnóstico...'
        ];

        const messageEl = document.getElementById('processing-message');
        const progressFill = document.querySelector('.progress-fill-thin');
        const progressPercent = document.getElementById('progress-percent');

        let currentMessage = 0;
        const messageInterval = setInterval(() => {
            if (currentMessage < messages.length) {
                if (messageEl) messageEl.textContent = messages[currentMessage];
                currentMessage++;
            }
        }, duration / messages.length);

        // Animate progress
        if (progressFill) {
            progressFill.style.transition = `width ${duration}ms linear`;
            progressFill.style.width = '95%';
        }

        if (progressPercent) {
            const percentInterval = setInterval(() => {
                const current = parseInt(progressPercent.textContent);
                if (current < 95) {
                    progressPercent.textContent = current + Math.ceil(Math.random() * 5);
                }
            }, duration / 20);
        }

        // Auto-advance after duration
        setTimeout(() => {
            clearInterval(messageInterval);
            this.generateAnalysisResults();
            this.loadPage('results');
        }, duration);
    }

    generateAnalysisResults() {
        const answers = this.answers;

        // Calculate gap (brecha de percepción)
        const selfWords = answers.q6_self_perception
            ?.split(',')
            .map(w => w.trim().toLowerCase()) || [];
        const clientWords = answers.q5_client_perception
            ?.split(',')
            .map(w => w.trim().toLowerCase()) || [];

        const matches = selfWords.filter(w => clientWords.includes(w)).length;
        const maxLength = Math.max(selfWords.length, clientWords.length);
        const matchPercent = (matches / Math.max(maxLength, 1)) * 100;
        const gapScore = Math.max(0, 100 - matchPercent);

        // Kleos Index (75-100 for MVP)
        const kleosIndex = Math.round(Math.max(75, gapScore * 0.8 + Math.random() * 20));
        const confidence = 85 + Math.random() * 10;
        const clientsUnaware = Math.round(gapScore);

        // Simulated perceptions
        const allPerceptions = [
            clientWords[0] || 'Premium',
            clientWords[1] || 'Confiable',
            clientWords[2] || 'Moderno',
            'Accesible',
            'Especializado'
        ];

        this.result = {
            kleosIndex: Math.round(kleosIndex),
            confidence: Math.round(confidence),
            clientsUnaware: Math.min(98, Math.round(clientsUnaware)),
            perceptions: allPerceptions,
            diagnosis: `Alinea tu narrativa de marketing con tu propuesta de valor: "${answers.q3_value_prop}"`
        };

        localStorage.setItem('kleosResult', JSON.stringify(this.result));
    }

    initResultsPage() {
        const result = JSON.parse(localStorage.getItem('kleosResult') || '{}');

        // Index number animation
        const indexEl = document.getElementById('index-number');
        if (indexEl) {
            this.animateCountUp(indexEl, 0, result.kleosIndex, 1500);
        }

        // Confidence
        const confEl = document.getElementById('confidence-percent');
        if (confEl) {
            this.animateCountUp(confEl, 0, result.confidence, 1500);
        }

        const confFill = document.getElementById('confidence-fill');
        if (confFill) {
            confFill.style.width = result.confidence + '%';
        }

        // Interpretation
        const interpEl = document.getElementById('index-interpretation');
        if (interpEl) {
            if (result.kleosIndex >= 75) {
                interpEl.textContent = 'Tu brecha de percepción es crítica';
            } else if (result.kleosIndex >= 50) {
                interpEl.textContent = 'Tu brecha de percepción es significativa';
            } else {
                interpEl.textContent = 'Tu brecha de percepción es moderada';
            }
        }

        // Perceptions
        const perceptionEl = document.getElementById('perception-list');
        if (perceptionEl) {
            perceptionEl.innerHTML = `
                <li class="visible">• ${result.perceptions[0] || '(bloqueado)'}</li>
                <li class="visible">• ${result.perceptions[1] || '(bloqueado)'}</li>
                <li class="hidden">• Bloqueado ••••••••••</li>
                <li class="hidden">• Bloqueado ••••••••••</li>
            `;
        }

        // Truth number
        const truthEl = document.getElementById('truth-number');
        if (truthEl) {
            this.animateCountUp(truthEl, 0, result.clientsUnaware, 1000);
        }

        // Diagnosis
        const diagEl = document.getElementById('diagnosis-headline');
        if (diagEl) {
            diagEl.textContent = result.diagnosis;
        }
    }

    animateCountUp(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;

        const timer = setInterval(() => {
            current += increment;
            if (current >= end) {
                element.textContent = Math.round(end);
                clearInterval(timer);
            } else {
                element.textContent = Math.round(current);
            }
        }, 16);
    }

    showUnlockModal() {
        // Future: Show checkout modal
        alert('Desbloquear análisis completo - [Checkout futuro]');
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.kleosApp = new KleosInsight();
});
```

---

## DEPLOYMENT (30 min)

### Option 1: Netlify (Recomendado)

```bash
# Instala CLI
npm install -g netlify-cli

# Deploy
cd src
netlify deploy --prod

# Listo en 30 segundos
# URL: https://kleos-insight-v1.netlify.app
```

### Option 2: GitHub Pages

```bash
git add .
git commit -m "MVP V1"
git push

# Automático en https://tuusername.github.io/kleos-insight-v1
```

### Option 3: Python local

```bash
cd src
python -m http.server 8000
# http://localhost:8000
```

---

## TESTING CHECKLIST

- [ ] Landing página scrollea normalmente
- [ ] Click "INICIAR" lleva a form
- [ ] Form muestra preguntas 1-12 en orden
- [ ] Progreso se actualiza (1/12 → 2/12 → etc)
- [ ] Volver regresa sin perder datos
- [ ] Botón ANALIZAR genera análisis
- [ ] Análisis dura 3-6 segundos (variable)
- [ ] Contador anima 0 → 98
- [ ] Bloqueado muestra placeholder
- [ ] CTA Desbloquear visible
- [ ] Mobile: sin overflow horizontal
- [ ] Colores: oro #C5A059, negro #050505
- [ ] Tipografía: Playfair + JetBrains Mono
- [ ] Sin errores en Console

---

## TIMELINE REALISTA

```
Hora 0-1:      Setup + leer docs
Hora 1-5:      HTML structure completo
Hora 5-7:      CSS styling
Hora 7-11:     JavaScript logic
Hora 11-12:    Testing + deployment
Total:         12 horas
```

---

## COMANDOS ÚTILES

```bash
# Abrir en navegador
start http://localhost:8000  # Windows
open http://localhost:8000   # Mac
xdg-open http://localhost:8000  # Linux

# Serve con Python
python -m http.server 8000

# Deploy a Netlify
netlify deploy --prod

# Ver localStorage
localStorage.getItem('kleosAnswers')
localStorage.getItem('kleosResult')

# Clear localStorage (reset)
localStorage.clear()
```

---

## ¿TIENES DUDAS?

Revisa:
1. MVP_V1_PRD.md → Spec completo
2. MVP_V1_SIMPLIFIED_DESIGN.md → Visual reference
3. Este archivo → Código exacto

No hay ambigüedad. Solo construye.

---

**Ready to code. Good luck! 🚀**

