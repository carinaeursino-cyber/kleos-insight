# KLEOS INSIGHT™ MVP V1 — PRD (Product Requirements Document)

**Autor:** PM Senior  
**Fecha:** 10 Junio 2026  
**Versión:** 1.0  
**Objetivo:** Validar mercado con 4 pantallas y modelo freemium

---

## EXECUTIVE SUMMARY

Construiremos una aplicación de una sola página que:

1. ✅ Genera curiosidad en landing
2. ✅ Captura 12 datos críticos en form
3. ✅ Dramatiza procesamiento (3-6 seg)
4. ✅ Muestra resultado + desbloquea premium

**Scope:** 4 pantallas  
**Duración estimada:** 2-3 días (1 dev senior)  
**Dependencias externas:** 0 (no API, no DB, no backend)  
**Costo:** $0 infraestructura (host estático)

---

## I. SCOPE DEFINICIÓN

### ✅ INCLUIR

**Frontend:**
- Landing page (scrollable)
- Formulario 12 preguntas (SPA)
- Procesamiento (animación)
- Resultado + freemium (bloqueado)

**Datos:**
- Captura 12 respuestas
- Almacena en localStorage
- Genera índice local (sin API)

**Experiencia:**
- Responsive (mobile + desktop)
- Transiciones animadas
- Premium design system (existente)

---

### ❌ NO INCLUIR (Eliminar del backlog anterior)

| Feature | Por qué | Fase |
|---------|--------|------|
| Autenticación | MVP no requiere users | V2 |
| Dashboard | Solo 4 pantallas | V2 |
| Historial | Primera experiencia | V2 |
| Reportes | PDF futuro | V2 |
| Membresías | Lógica local ahora | V2 |
| Notificaciones | No hay multi-user | V2 |
| Base de datos | localStorage MVP | V2 |
| Gemini API | Lógica local es suficiente | V2 |
| Multi-idioma | Español solo | V2 |

---

## II. ARQUITECTURA TÉCNICA

### Stack

```
Frontend:
├── HTML5 (semántico)
├── CSS3 (custom properties + media queries)
└── JavaScript ES6+ (vanilla, sin frameworks)

Hosting: Static file server
├── Netlify / Vercel / GitHub Pages
├── O servidor local (no requiere Node backend)

Data storage: localStorage API
├── 12 respuestas del form
└── Índice calculado localmente

No requiere:
❌ Node.js
❌ Base de datos
❌ API backend
❌ Autenticación
```

---

### Diagrama de Flujo

```
User lands on landing.html
   ↓
[Landing Page] — scroll + navegación
   ↓ Click "INICIAR DIAGNÓSTICO"
   ↓
[Questions Page] — 12 preguntas SPA
   ├─ Q1-4: Datos empresa
   ├─ Q5-7: Percepciones
   ├─ Q8-10: Competencia
   └─ Q11-12: Objetivo
   ↓ Click "ANALIZAR"
   ↓ Guardas 12 respuestas en localStorage
   ↓
[Processing Page] — 3-6 segundos
   ├─ 4 mensajes dinámicos
   ├─ Barra progreso 0→95%
   └─ Auto-avanza
   ↓
[Results Page] — Mostrar + Freemium
   ├─ Índice Kleos calculado
   ├─ 3 percepciones (1 visible + 2 bloqueados)
   ├─ Verdad incómoda
   ├─ Diagnóstico principal
   └─ CTA "DESBLOQUEAR"
   ↓ User click "DESBLOQUEAR"
   ↓ [Futuro: Checkout]
```

---

## III. PANTALLA 1: LANDING PAGE

### Objetivo

Convertir visitante curioso → iniciador de diagnóstico

**Target:** Directores/Founders/CMOs de empresas 20-500 personas

### Requisitos

**R1.1 Hero Section**
- Debe tener pregunta provocadora: "¿Qué percepción limita tu crecimiento?"
- Subtítulo: "KLEOS INSIGHT™ detecta..."
- CTA primaria: "INICIAR DIAGNÓSTICO" (botón oro)
- CTA secundaria: "SABER MÁS" (texto/borde)
- Animación: Fade-in staggered al cargar

**R1.2 Filosofía Section**
- 3 columnas con número + concepto
- Contenido: "Percepción determina valor", etc.
- Animación: Fade-in staggered al scroll

**R1.3 Cómo Funciona**
- Timeline vertical 4 pasos
- Contenido: Q1→A1→Q2→A2 process
- Interacción: Hover en puntos → anima

**R1.4 Beneficios**
- 2 cards: "Sabes exactamente..." + "Tienes plan..."
- Fade-in al scroll

**R1.5 CTA Final**
- Mínimalista
- "¿Listo para saber la verdad?"
- Botón "COMENZAR DIAGNÓSTICO"

**R1.6 Responsive**
- Desktop (1024px+): 4-5 columnas, spacing 64px
- Tablet (768px-1024px): 2 columnas, spacing 32px
- Mobile (< 768px): 1 columna, spacing 16px

---

## IV. PANTALLA 2: DIAGNÓSTICO

### Objetivo

Capturar 12 datos sin fricción + mantener engagement

### Requisitos

**R2.1 Barra de Progreso**
- Posición: Fixed top
- Muestra: "Pregunta X de 12"
- Visualización: Barra horizontal, fill % = X/12
- Animación: Smooth 400ms al avanzar

**R2.2 Preguntas (12 total)**

```
Q1: Empresa (text input)
    "¿Cuál es el nombre de tu empresa?"

Q2: Industria (select dropdown)
    "¿En qué industria operan?"
    Options: Tech, Finance, Consulting, Marketing, E-commerce, Services, Other

Q3: Propuesta (textarea)
    "¿Cuál es tu principal propuesta de valor?"

Q4: Desafío (text input)
    "¿Cuál es tu mayor desafío?"

Q5: Percepciones Clientes (text input)
    "¿Cómo describirían TUS CLIENTES tu empresa?"
    Placeholder: "Ej: Confiable, Innovador, Premium"

Q6: Auto-Percepción (text input)
    "¿Cómo TE DESCRIBES a ti mismo?"
    Placeholder: "Ej: Especializado, Accesible"

Q7: Competidor (text input)
    "¿Cuál es tu principal competidor?"

Q8: Diferenciador (textarea)
    "¿Qué te diferencia de tu competencia?"

Q9: Canales (checkbox multiple)
    "¿Cuáles son tus canales de venta?"
    ☐ Venta directa
    ☐ Canales digitales
    ☐ Alianzas
    ☐ Inbound marketing

Q10: Presupuesto (select)
    "¿Presupuesto anual de marketing?"
    $0-$10k, $10k-$50k, $50k-$100k, $100k+

Q11: Objetivo (textarea)
    "¿Objetivo principal 12 meses?"

Q12: Confirmación (text input)
    "Tu email para resultados (opcional)"
```

**R2.3 Validación**
- Todos campos required (excepto Q12 email que es opcional)
- Email: Validar formato si se proporciona
- Checkboxes: Mínimo 1 seleccionado
- Error visual: Borde rojo + mensaje bajo campo
- Validación en tiempo real (al cambiar de campo)

**R2.4 UX Interacción**
- Auto-focus en primer input
- Enter key = siguiente pregunta
- Botón "VOLVER" para retroceder
- Datos persisten al volver (localStorage)
- Botón "SIGUIENTE" cambia a "ANALIZAR" en Q12
- Animación: Fade-out q-actual + fade-in q-siguiente

**R2.5 Datos Capturados**
```javascript
const answers = {
  q1_company: string,
  q2_industry: string,
  q3_value_prop: string,
  q4_challenge: string,
  q5_client_perception: string,
  q6_self_perception: string,
  q7_competitor: string,
  q8_differentiation: string,
  q9_channels: string[],
  q10_budget: string,
  q11_objective: string,
  q12_email: string (optional)
}
```

---

## V. PANTALLA 3: PROCESAMIENTO

### Objetivo

Generar expectativa + dramatizar decisión importante

### Requisitos

**R3.1 Layout**
- Centrado vertical (100vh)
- Fondo: Negro absoluto
- Contenido:
  - Logo KLEOS (80x80px blanco + línea oro)
  - Spinner elegante (60x60px)
  - Mensaje dinámico (Playfair 24px)
  - Barra progreso (4px height)
  - Porcentaje (JetBrains 12px)

**R3.2 Timeline**
- 4 mensajes rotativos (1.5s cada uno):
  1. "Analizando percepciones..."
  2. "Detectando patrones..."
  3. "Construyendo Índice Kleos..."
  4. "Generando diagnóstico..."

**R3.3 Duración**
- Random: 3-6 segundos (no fijo)
- Progreso: 0% → 95% (NUNCA 100%, psicología)
- Al terminar: Auto-avanza a resultados

**R3.4 Animaciones**
- Spinner: Rotación 360° cada 1.8s, linear
- Mensaje: Fade-out (200ms) + fade-in (300ms) entre cambios
- Progreso: Smooth fill animation (400ms)
- Logo: Pulse suave (scale 1.0 ↔ 1.05)

---

## VI. PANTALLA 4: RESULTADO

### Objetivo

Mostrar insight valuoso + crear urgencia de desbloquear

### Requisitos

**R4.1 Índice Kleos Hero**
- Número animado: 0 → score (1.5s contador)
- Score rango: 75-100 (para MVP, siempre valida)
- Interpretación: Label de "CRÍTICO/ALTO/MODERADO/BAJO"
- Confianza: 85-95% (mostrar barra pequeña)
- Animación: Pulse al terminar contador

**R4.2 Percepción Detectada (FREEMIUM 1/3)**
- Mostrar: Título + 2 bullet points visibles
- Ocultar: Próximos 3-5 bullet points (gris punteado)
- CTA: Botón "DESBLOQUEAR ANÁLISIS COMPLETO"
- Texto bloqueado: "Descubre 5 percepciones más"

**R4.3 Verdad Incómoda (FREEMIUM 2/3)**
- Frase generada: "De cada 100 clientes, X no comprenden tu diferenciador"
- X = Math.round(gap_score)
- Mostrar: 1 implicación visible
- Ocultar: 3 implicaciones más (bloqueado)

**R4.4 Diagnóstico Principal (FREEMIUM 3/3)**
- Mostrar: Título del insight principal
- Ocultar: Acciones + recomendaciones (bloqueado)
- Texto: "Acceso completo incluye 5 recomendaciones accionables"

**R4.5 CTA Principal**
- Botón: "DESBLOQUEAR ANÁLISIS COMPLETO"
- Posición: Sticky bottom o full-width
- Describe benefit: "Acceso completo incluye: análisis 5 percepciones + 5 recomendaciones + timeline"
- Precio: [A DEFINIR LUEGO]
- Interacción: Hover → oro glow

**R4.6 CTA Secundarias**
- Botón: "COMPARTIR RESULTADO" (social)
- Botón: "DESCARGAR ANÁLISIS" (genera .txt)
- Botón: "NUEVO ANÁLISIS" (reset)

**R4.7 Algoritmo MVP (Local)**
```javascript
// Calcular brecha de percepción
const selfWords = answers.q6_self_perception.split(',').map(w => w.trim().toLowerCase());
const clientWords = answers.q5_client_perception.split(',').map(w => w.trim().toLowerCase());
const matchCount = selfWords.filter(w => clientWords.includes(w)).length;
const matchPercent = (matchCount / Math.max(selfWords.length, clientWords.length)) * 100;
const gapScore = 100 - matchPercent;  // 0-100

// Índice Kleos
const kleosIndex = Math.round(gapScore * 0.8 + Math.random() * 20);  // 60-100
const confidence = 85 + Math.random() * 10;  // 85-95%

// Verdad incómoda
const clientsUnaware = Math.round(gapScore);  // % que no entienden

// Percepciones simuladas
const perceptions = [
  `${answers.q2_industry} típico`,
  answers.q5_client_perception.split(',')[0],
  "Premium pero inaccesible",
  "Conocido pero no diferenciado",
  "Alternativa, no preferencia"
];

// Output
const result = {
  kleosIndex,
  confidence,
  clientsUnaware,
  perceptions: perceptions.slice(0, 2),  // MVP: mostrar 2, rest bloqueado
  insight: `Alinea tu narrativa con "${answers.q8_differentiation}"`
}
```

---

## VII. DATA FLOWS

### Captura de Datos

```
Landing page
  → User clicks "INICIAR DIAGNÓSTICO"
  → Navigate to diagnóstico page
  → Form renders Q1-Q12
  → User responde
  → Cada respuesta se guarda en window.kleosApp.answers
  → User clicks "ANALIZAR"
  → Guardas en localStorage: answers
  → Navigate a procesamiento
```

### Procesamiento

```
Procesamiento page
  → Lee localStorage.answers
  → Calcula índice local (algorithm)
  → Guarda resultado en localStorage: result
  → Simula 3-6 segundos
  → Auto-navega a resultados
```

### Resultado

```
Resultado page
  → Lee localStorage.result
  → Renderiza índice + percepciones + verdad
  → Anima contador
  → User ve: 2 percepciones visibles, 3-5 bloqueadas
  → User ve: 1 insight visible, resto bloqueado
  → CTA: "DESBLOQUEAR"
  → [Futuro: Checkout]
```

---

## VIII. RESPONSIVE DESIGN

**Desktop (1024px+)**
- Full layout
- Padding 48px
- Typography: 56px H1, 42px H2

**Tablet (768px - 1024px)**
- Adjusted padding 32px
- Typography: -4px
- 2-column grids → single column

**Mobile (< 768px)**
- Single column
- Padding 16px
- Full-width buttons
- Typography: -8px
- Spinner: 40x40px (vs 60x60 desktop)

---

## IX. PERFORMANCE REQUIREMENTS

**Metrics:**
- Page load: < 2 segundos (Lighthouse > 90)
- Time to interactive: < 3 segundos
- First input delay: < 100ms
- Cumulative layout shift: 0

**Optimizaciones:**
- CSS: Minified
- JS: Minified, no async libraries
- Images: SVGs para icons/logos
- Fonts: Google Fonts (system stack como fallback)
- No videos, no heavy animations

---

## X. ACCESIBILIDAD

**WCAG 2.1 Level AA:**
- ✅ Contraste mínimo 4.5:1
- ✅ Focus visible (ring oro)
- ✅ Keyboard navigation completa (Tab, Enter, Escape)
- ✅ ARIA labels en iconos
- ✅ Alt text en imágenes
- ✅ Respeto a prefers-reduced-motion

---

## XI. TESTING CHECKLIST

### Funcional

- [ ] Landing página scrollea
- [ ] CTAs navegan correctamente
- [ ] 12 preguntas se muestran en orden
- [ ] Validación rechaza campos vacíos
- [ ] Botón VOLVER retrocede con datos intactos
- [ ] Botón ANALIZAR guarda en localStorage
- [ ] Procesamiento dura 3-6 segundos (variable)
- [ ] Auto-avanza a resultado
- [ ] Resultado muestra índice animado
- [ ] Bloqueado muestra placeholder
- [ ] CTA DESBLOQUEAR es visible

### Responsive

- [ ] Mobile 375px: sin overflow horizontal
- [ ] Tablet 768px: layout adapta
- [ ] Desktop 1440px: full layout
- [ ] Touch targets: mínimo 44x44px

### Visual

- [ ] Colores: oro #C5A059, negro #050505
- [ ] Tipografía: Playfair Display (titulación)
- [ ] Tipografía: JetBrains Mono (datos)
- [ ] Animaciones suaves (sin lag)
- [ ] Transiciones 200-600ms
- [ ] Contraste WCAG AA mínimo

### Cross-browser

- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)
- [ ] Mobile Safari iOS
- [ ] Chrome Mobile Android

---

## XII. DEPLOYMENT

**Opción A: Netlify (Recomendado)**
```bash
npm install netlify-cli
netlify deploy --prod
```

**Opción B: GitHub Pages**
```bash
git push
# GitHub Pages auto-deploys
```

**Opción C: Vercel**
```bash
vercel --prod
```

**Opción D: Server Local**
```bash
python -m http.server 8000
```

**No requiere:**
- SSL manual (Netlify/Vercel lo hacen)
- Servidor backend
- Base de datos
- CI/CD pipeline compleja

---

## XIII. TIMELINE

| Fase | Duración | Tareas |
|------|----------|--------|
| Setup | 30 min | Estructura HTML, CSS reset |
| Landing | 4 horas | Hero, secciones, animations |
| Diagnóstico | 6 horas | Form, validación, UX |
| Procesamiento | 2 horas | Timeline, animaciones |
| Resultado | 4 horas | Cálculos, freemium, bloqueado |
| Responsive | 3 horas | Media queries, testing |
| Testing | 2 horas | Cross-browser, funcional |
| **Total** | **~21 horas** | **MVP Ready** |

**Estimado: 2-3 días (dev senior)**

---

## XIV. PRIORIDADES

### P0 (Must-have)
1. Landing funcional
2. 12 preguntas capturan datos
3. Procesamiento anima 3-6 seg
4. Resultado muestra índice + 2 items freemium
5. Responsive (mobile + desktop)

### P1 (Should-have)
1. Animaciones suaves
2. Validación completa
3. localStorage persistencia
4. CTA bloqueado visible

### P2 (Nice-to-have)
1. Email capture
2. Social share
3. PDF download
4. Analytics

---

## XV. SUCCESS METRICS (MVP VALIDATION)

Para considerar MVP exitoso:

```
Landing → Diagnóstico Conversion: ≥ 30%
  Si 100 visitan landing → 30+ inician form = ✅

Form Completion: ≥ 70%
  Si 30 inician form → 21+ completan = ✅

Resultado Conversion (CTA click): ≥ 15%
  Si 21 ven resultado → 3+ quieren desbloquear = ✅

Resultado Final:
  3 leads interesados en pagar = MVP VALIDADO
```

---

## XVI. RIESGOS Y MITIGACIÓN

| Riesgo | Impacto | Mitigación |
|--------|---------|-----------|
| Algoritmo local insuficiente | Alto | Hacer scoring realista, no obvio |
| Performance en mobile | Medio | Optimizar CSS/JS, lazy-load images |
| Form abandonment alto | Alto | UX impecable, progreso visible |
| Bloqueado no genera urgencia | Medio | Copy provocador, CTA prominent |
| iOS Safari bugs | Bajo | Testing temprano en device real |

---

## XVII. POST-MVP (V2+)

**No incluir ahora. Fase 2:**

1. **Autenticación** - Email/Google login
2. **Dashboard** - Historial de análisis
3. **Gemini API** - Análisis real (no local)
4. **Reportes PDF** - Exportación premium
5. **Membresías** - Plans (Free / Pro / Enterprise)
6. **Email follow-up** - Sequences
7. **Database** - Persistencia user
8. **Analytics** - Tracking conversiones

---

## XVIII. CONCLUSIÓN

**MVP V1 = 4 pantallas, 1 objetivo: Validar que personas pagan por Kleos**

```
❌ NO: Perfección, features futuras, complejidad
✅ SÍ: Mínimo viable, rápido, enfocado en validación

Timeline: 2-3 días
Developers: 1 senior
Cost: $0 (host estático)
Risk: Bajo (sin backend, sin DB)
Success: 3 leads listos para pagar = MVP validado
```

---

**PRD Aprobado para Construcción**

Próximo paso: Dev inicia con HTML/CSS/JS vanilla.

*No hay ambigüedad. Solo construcción.*

