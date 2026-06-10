# KLEOS INSIGHT™ — MVP Web Application

**Premium Intelligence Analysis Platform**

Una aplicación web estática que detecta qué percepciones limitan el crecimiento de un negocio.

---

## 📁 Estructura del Proyecto

```
kleos-insight-v1/
├── src/
│   ├── index.html                 # Aplicación Principal (SPA)
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css         # Sistema de Diseño Completo
│   │   └── js/
│   │       └── main.js            # Lógica de Aplicación (Vanilla JS)
│   └── pages/                     # (Para referencia - todo está en index.html)
├── design/
│   └── KLEOS_INSIGHT_Experience_Design.md  # Especificación de Diseño
├── docs/
│   └── API_INTEGRATION.md         # Guía para integración con Gemini API
├── README.md
└── package.json                   # (Opcional, sin dependencias)
```

---

## 🚀 Cómo Ejecutar

### Opción 1: Live Server (VS Code)

1. Abre la carpeta `kleos-insight-v1` en VS Code
2. Instala la extensión **Live Server**
3. Click derecho en `src/index.html` → "Open with Live Server"
4. Se abrirá en `http://127.0.0.1:5500`

### Opción 2: Python Simple Server

```bash
cd kleos-insight-v1/src
python -m http.server 8000
```
Luego abre `http://localhost:8000`

### Opción 3: Node.js HTTP Server

```bash
cd kleos-insight-v1/src
npx http-server
```

---

## 🎯 Pantallas de la Aplicación

### 1️⃣ PANTALLA 1: LANDING PAGE

**Path:** `#home`

**Componentes:**
- Hero section con CTA principal
- 3 principios de KLEOS (filosofía)
- 4 pasos de proceso
- CTA final de conversión
- Footer

**Características:**
- Animaciones de entrada staggered
- Tipografía premium (Playfair Display + JetBrains Mono)
- Paleta Negro #050505 + Oro #C5A059
- Responsive (desktop, tablet, mobile)

---

### 2️⃣ PANTALLA 2: FORMULARIO DE 12 PREGUNTAS

**Path:** `#questions`

**Preguntas:**
1. Nombre de la empresa
2. Industria (select)
3. Propuesta de valor principal (textarea)
4. Cliente ideal (textarea)
5. Mayor desafío en ventas (radio)
6. Cómo describen clientes tu empresa (texto)
7. Cómo describes tu empresa (texto)
8. Principal competidor directo (texto)
9. Qué te diferencia (textarea)
10. Canales de ventas (checkboxes)
11. Presupuesto de marketing (select)
12. Objetivo principal 12 meses (textarea)

**Características:**
- Indicador de progreso visual (4 pasos)
- Validación en cliente
- Diseño minimalista y accesible
- Transiciones suaves entre preguntas
- Almacenamiento de respuestas en `window.kleosApp.userAnswers`

---

### 3️⃣ PANTALLA 3: PANTALLA DE ANÁLISIS

**Path:** `#analysis`

**Componentes:**
- Barra de progreso animada (0-95%)
- Spinner elegante de carga
- Porcentaje de progreso
- Texto de estado ("Procesando insights...")

**Características:**
- Animación de progreso realista
- Simula análisis de 2-3 segundos
- Redirección automática a resultados
- Preparado para recibir datos de Gemini API

**Datos Simulados:** Se generan automáticamente en `generateMockAnalysis()`

---

### 4️⃣ PANTALLA 4: RESULTADOS FINALES

**Path:** `#results`

**Secciones:**

**A. Insight Principal**
- Número grande animado (contador)
- Descripción del insight
- Nivel de confianza (94%)
- Diseño premium con borde oro

**B. Dimensiones Detectadas**
- Grid de 4 cards
- Cada card muestra:
  - Nombre de dimensión
  - Score en porcentaje (65%, 72%, etc.)
  - Trend respecto a mes anterior (+12%, +8%, etc.)
- Animación staggered de entrada

**C. Brecha de Percepción**
- 2 columnas
- Izquierda: "Lo que el mercado percibe"
- Derecha: "Lo que realmente eres"
- Nubes de palabras con tamaño variado

**D. Recomendaciones Accionables**
- 3 cards numeradas (01, 02, 03)
- Cada una contiene:
  - Título de acción
  - Descripción
  - Prioridad (P1 rojo, P2 amarillo, P3 verde)
  - Impacto estimado (% de mejora)
  - Timeline de implementación

**E. Botones de Acción**
- Descargar PDF (genera .txt con reporte)
- Compartir resultados
- Nuevo análisis (resetea la app)

---

## 💾 Flujo de Datos

```
Landing (home)
     ↓ [Click "Iniciar Diagnóstico"]
Preguntas (questions)
     ↓ [Completa 12 preguntas + Submit]
Análisis (analysis)
     ↓ [Progreso simula 2-3 seg + auto-redirect]
Resultados (results)
     ↓ [Puede descargar, compartir, o nuevo análisis]
```

**Almacenamiento:**
```javascript
window.kleosApp.userAnswers = {
  'company_name': 'Mi Empresa',
  'industry': 'tech',
  'value_proposition': '...',
  // ... más respuestas
}

window.kleosApp.analysisData = {
  businessName: 'Tu Empresa',
  mainInsight: 98,
  dimensions: [...],
  recommendations: [...],
  perception: {...}
}
```

---

## 🎨 Sistema de Diseño

### Colores
```css
--color-black: #050505              /* Fondo principal */
--color-gold: #C5A059               /* Acento premium */
--color-white: #F5F5F5              /* Texto principal */
--color-gray-dark: #1A1A1A          /* Elementos secundarios */
--color-gray-medium: #2D2D2D        /* Divisores, texto secundario */
```

### Tipografía
- **Playfair Display:** Titulación, narrativa, elegancia
- **JetBrains Mono:** Números, datos, técnico
- **System Font:** Cuerpo general (accesibilidad)

### Transiciones
```css
--transition-fast: 200ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-medium: 300ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 600ms cubic-bezier(0.4, 0, 0.2, 1)
```

### Espaciado (Basado en 8px)
- Tamaño 2: 16px
- Tamaño 3: 24px
- Tamaño 4: 32px
- Tamaño 6: 48px
- Tamaño 8: 64px

---

## 🔌 Preparación para Integración con Gemini API

### Cómo conectar con la API:

**En `src/assets/js/main.js`, reemplazar `generateMockAnalysis()` con:**

```javascript
async generateAnalysisResults() {
  try {
    const response = await fetch('YOUR_API_ENDPOINT', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${YOUR_API_KEY}`
      },
      body: JSON.stringify({
        questions: this.userAnswers,
        businessType: this.userAnswers.industry
      })
    });

    const data = await response.json();
    this.analysisData = {
      businessName: data.company_name,
      mainInsight: data.insight_score,
      mainInsightText: data.insight_text,
      perception: {
        marketPerception: data.market_perception,
        businessReality: data.business_reality,
        gapScore: data.gap_score,
        confidence: data.confidence
      },
      dimensions: data.dimensions,
      recommendations: data.recommendations,
      timestamp: new Date().toLocaleDateString('es-ES')
    };
  } catch (error) {
    console.error('Error en análisis:', error);
    this.showToast('Error al procesar análisis', 'error');
  }
}
```

Ver `docs/API_INTEGRATION.md` para detalles completos.

---

## 📱 Responsive Design

### Breakpoints

| Device | Width | Cambios |
|--------|-------|---------|
| Desktop | > 1024px | Diseño full |
| Tablet | 768px - 1024px | Grid 2 cols, padding reducido |
| Mobile | < 768px | Grid 1 col, botones full-width |

### Mobile First
- H1: 56px (desktop) → 40px (tablet) → 28px (mobile)
- H2: 42px (desktop) → 32px (tablet) → 24px (mobile)
- Padding: 48px (desktop) → 32px (tablet) → 16px (mobile)

---

## ⌨️ Funcionalidades JavaScript

### Clase Principal: `KleosInsight`

```javascript
// Propiedades
window.kleosApp.currentPage          // Página actual
window.kleosApp.userAnswers          // Respuestas del formulario
window.kleosApp.analysisData         // Datos de análisis

// Métodos principales
window.kleosApp.loadPage(page)       // Navegar entre pantallas
window.kleosApp.handleFormSubmit()   // Procesar formulario
window.kleosApp.startAnalysis()      // Iniciar análisis
window.kleosApp.displayResults()     // Mostrar resultados
window.kleosApp.downloadResults()    // Descargar reporte
window.kleosApp.shareResults()       // Compartir resultados
```

### Animaciones Incluidas

- **Fade In:** Entrada suave de elementos
- **Slide Up:** Movimiento vertical elegante
- **Count Up:** Animación de números
- **Spin:** Spinner de carga
- **Pulse:** Efecto de pulso
- **Stagger:** Entrada secuencial de elementos

---

## 🔍 Validación y Errores

### Validación de Formulario
- Campos requeridos (`required`)
- Validación en cliente (HTML5)
- Mensaje de error visual si falta campo

### Toasts (Notificaciones)
```javascript
window.kleosApp.showToast('Mensaje', 'success|error|warning')
```

Estilos incluidos para:
- ✅ Success (verde)
- ❌ Error (rojo)
- ⚠️ Warning (naranja)

---

## 📊 Datos Simulados

El MVP incluye datos simulados realistas:

```javascript
// Ejemplo de análisis generado
{
  mainInsight: 98,
  mainInsightText: "De cada 100 clientes potenciales, 98 no comprenden tu diferenciador clave",
  perception: {
    marketPerception: ['Premium', 'Costoso', 'Exclusivo', 'Moderno', 'Confiable'],
    businessReality: ['Innovador', 'Accesible', 'Establecido', 'Confiable', 'Profesional']
  },
  dimensions: [
    { name: 'Calidad vs Precio', score: 65, trend: '+12%' },
    { name: 'Innovación vs Tradición', score: 72, trend: '+8%' },
    // ...
  ],
  recommendations: [
    {
      priority: 'P1',
      title: 'Alinear narrativa de marketing',
      impact: '↑ 34% en conversión',
      timeline: '30 días'
    },
    // ...
  ]
}
```

---

## 🎬 Flujo de Animaciones

### Landing Page
1. H1 fade-in + slide-up (0ms)
2. Subtitle fade-in + slide-up (200ms)
3. CTA fade-in + slide-up (400ms)
4. Principios stagger (0-300ms)
5. Steps stagger (0-450ms)

### Questions Page
1. Form fade-in (300ms)
2. Progress update en cada cambio
3. Validación con feedback visual

### Analysis Page
1. Barra de progreso (anima 0-95% en 2-3 seg)
2. Spinner rotación constante
3. Auto-redirección a resultados

### Results Page
1. Progress completado (tic marks)
2. Main insight con número animado (contador 0-98)
3. Dimensions cards stagger (100ms entre cada)
4. Recommendations stagger (100ms entre cada)
5. Perception comparison revelar con fade-in

---

## 🛠️ Personalización

### Cambiar Colores
Editar variables en `src/assets/css/styles.css`:
```css
:root {
  --color-black: #050505;
  --color-gold: #C5A059;
  /* ... más variables */
}
```

### Cambiar Tipografía
Las fuentes se cargan de Google Fonts. Editar en `styles.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap');
```

### Cambiar Cantidad de Preguntas
Editar `src/index.html` (form section) y ajustar validación en `main.js`.

### Ajustar Duración de Análisis
En `src/assets/js/main.js`, método `startAnalysis()`:
```javascript
// Cambiar duraciones
const interval = setInterval(() => { /* ... */ }, 300); // Intervalo
setTimeout(() => { this.completeAnalysis(); }, 1000); // Delay final
```

---

## 📈 Performance

### Optimización Incluida
- CSS inline critical (menos HTTP requests)
- JavaScript vanilla (sin dependencias)
- Animaciones GPU-accelerated (transform, opacity)
- Lazy loading ready
- Mobile-first approach

### Métricas Esperadas
- First Paint: < 500ms
- Largest Contentful Paint: < 1.5s
- Interaction to Next Paint: < 100ms
- Cumulative Layout Shift: < 0.1

---

## 🔒 Consideraciones de Seguridad

### Antes de Producción
- [ ] Validar entrada en servidor (backend)
- [ ] Sanitizar datos del usuario
- [ ] Usar HTTPS para todas las conexiones
- [ ] Implementar CORS policies
- [ ] Agregar rate limiting en API
- [ ] Encriptar datos sensibles
- [ ] Implementar autenticación/autorizacion

### Datos de Usuario
- Actualmente almacenados en `window` (memoria)
- Para producción: Migrar a localStorage/sessionStorage con encriptación
- O enviar directamente a backend

---

## 📚 Recursos Incluidos

- `design/KLEOS_INSIGHT_Experience_Design.md` — Especificación de diseño completa
- `docs/API_INTEGRATION.md` — Guía de integración con Gemini API
- `src/index.html` — Aplicación completa
- `src/assets/css/styles.css` — Sistema de diseño
- `src/assets/js/main.js` — Lógica de aplicación

---

## 🚀 Próximas Fases

### Fase 2: Backend & API
- [ ] Crear endpoint backend para procesamiento
- [ ] Integrar Gemini API o similar
- [ ] Implementar autenticación
- [ ] Base de datos para análisis históricos

### Fase 3: Features Avanzadas
- [ ] Reportes en PDF descargables
- [ ] Exportar a PowerPoint
- [ ] Dashboard de historial
- [ ] Comparativa de análisis
- [ ] Alertas de cambios en percepción

### Fase 4: Monetización
- [ ] Sistema de planes (Free, Pro, Enterprise)
- [ ] Pagos con Stripe
- [ ] Team collaboration
- [ ] API pública para partners

---

## 👨‍💻 Tecnología Stack

**MVP:**
- HTML5 (Semántico, accesible)
- CSS3 (Variables, Grid, Flexbox, Animations)
- JavaScript Vanilla (ES6+)
- Google Fonts (Playfair Display, JetBrains Mono)

**Sin dependencias externas** ✅

---

## 📄 Licencia

© 2026 KLEOS INSIGHT™ — Todos los derechos reservados.

---

## 📞 Soporte

Para integraciones, personalizaciones o preguntas:
- Documentación: Ver `docs/`
- Especificación de diseño: Ver `design/`
- Código: Ver `src/`

---

**KLEOS INSIGHT™ — Where Perception Meets Strategy**

*Detectando la claridad que transforma mercados.*
