# KLEOS INSIGHT™ MVP V1 — Visual Blueprint

**Arquitectura visual del MVP en ASCII + Diagrama**

---

## 🎯 FLUJO TOTAL DEL USUARIO

```
┌─────────────────────────────────────────────────────────────────────┐
│                                                                     │
│                        KLEOS INSIGHT™ MVP V1                       │
│                                                                     │
│  PANTALLA 1: LANDING               PANTALLA 2: DIAGNÓSTICO         │
│  ┌─────────────────────────┐       ┌──────────────────────────────┐
│  │                         │       │  Pregunta 1 de 12            │
│  │  ¿Qué percepción       │       │  ┌──────────────────────────┐│
│  │  limita tu             │       │  │ [Progreso: ████░░░░░░░] ││
│  │  crecimiento?          │       │  │                          ││
│  │                         │       │  │ ¿Nombre de tu empresa?  ││
│  │  [INICIAR →]           │───────│→ │ [_______________]       ││
│  │                         │       │  │                          ││
│  │  • Filosofía (3)        │       │  │ [← VOLVER] [SIGUIENTE →]││
│  │  • Cómo funciona (4)    │       │  │                          ││
│  │  • Beneficios (2)       │       │  └──────────────────────────┘
│  │  • CTA final            │       │
│  │                         │       │  ... Q3, Q4, ... Q12
│  └─────────────────────────┘       └──────────────────────────────┘
│         ↓ SCROLL                            ↓ RESPONDE 12 PREGUNTAS
│         ↓                                   ↓
│  PANTALLA 3: PROCESAMIENTO        PANTALLA 4: RESULTADO
│  ┌─────────────────────────┐       ┌──────────────────────────────┐
│  │                         │       │  TU ÍNDICE KLEOS             │
│  │      KLEOS             │       │  ━━━━━━━━━━━━━━━━━━━━━━━━━  │
│  │     /‾‾‾\              │       │                              │
│  │    ( ◯ )     ◯ spinner │       │        98 / 100             │
│  │     \___/              │       │                              │
│  │                         │       │  Tu brecha es CRÍTICA        │
│  │  Analizando            │ 3-6s  │  Confianza: 94%             │
│  │  percepciones...        │       │                              │
│  │                         │       │  PERCEPCIÓN DETECTADA        │
│  │  [████░░░░░░░░░░░░░░░] │       │  • Premium                  │
│  │  43%                    │       │  • Confiable                │
│  │                         │       │  • [BLOQUEADO] ••••••••     │
│  │  Auto-avanza →          │───────│→ • [BLOQUEADO] ••••••••     │
│  │                         │       │                              │
│  └─────────────────────────┘       │  [DESBLOQUEAR COMPLETO]      │
│         ↓ 3-6 SEGUNDOS             │                              │
│         ↓                           └──────────────────────────────┘
│   Auto-redirige              Bloqueado: 60% del contenido
│         ↓
│      RESULTADO (con freemium)
│
└─────────────────────────────────────────────────────────────────────┘
```

---

## 📱 VISTA POR DISPOSITIVO

### Desktop (1440px)

```
┌─────────────────────────────────────────────────────┐
│  KLEOS INSIGHT™                                     │  (Header: 72px)
├─────────────────────────────────────────────────────┤
│                                                     │
│                    HERO                            │  100vh
│          ¿Qué percepción limita tu               │
│          crecimiento?                             │
│          [INICIAR] [SABER MÁS]                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  FILOSOFÍA (3 COLUMNAS)                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │ 01       │  │ 02       │  │ 03       │         │
│  │ Percep.. │  │ Claridad │  │ Confianza│         │
│  └──────────┘  └──────────┘  └──────────┘         │
├─────────────────────────────────────────────────────┤
│  CÓMO FUNCIONA (TIMELINE VERTICAL)                  │
│  ⊙--[Q1-Q4 Datos de empresa]                       │
│  │                                                  │
│  ⊙--[Q5-Q7 Percepciones]                           │
│  │                                                  │
│  ⊙--[Q8-Q10 Competencia]                           │
│  │                                                  │
│  ⊙--[Q11-Q12 Objetivo]                             │
├─────────────────────────────────────────────────────┤
│  BENEFICIOS (2 CARDS)                               │
│  ┌────────────────────┐  ┌────────────────────┐   │
│  │ Sabes exactamente  │  │ Tienes plan       │   │
│  │ qué está frenando  │  │ claro para        │   │
│  │                    │  │ actuar            │   │
│  └────────────────────┘  └────────────────────┘   │
├─────────────────────────────────────────────────────┤
│                 CTA FINAL                           │
│        ¿Listo para saber la verdad?                │
│         [COMENZAR DIAGNÓSTICO]                     │
├─────────────────────────────────────────────────────┤
│  © 2026 KLEOS INSIGHT™                              │
└─────────────────────────────────────────────────────┘
```

### Mobile (375px)

```
┌──────────────────┐
│ KLEOS            │ (Header stacked)
├──────────────────┤
│      HERO        │
│ ¿Qué percep..   │ (Font: -8px)
│ [INICIAR]       │ (Full-width)
│ [SABER MÁS]     │
├──────────────────┤
│    FILOSOFÍA     │
│ ┌──────────────┐ │
│ │ 01 Percepción│ │ (Stack 1 col)
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ 02 Claridad  │ │
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ 03 Confianza │ │
│ └──────────────┘ │
├──────────────────┤
│   CÓMO FUNCIONA  │
│   ⊙ Q1-Q4       │ (Single line)
│   ⊙ Q5-Q7       │
│   ⊙ Q8-Q10      │
│   ⊙ Q11-Q12     │
├──────────────────┤
│   BENEFICIOS     │
│ ┌──────────────┐ │
│ │ Sabes exac.. │ │ (Stack)
│ └──────────────┘ │
│ ┌──────────────┐ │
│ │ Tienes plan..│ │
│ └──────────────┘ │
├──────────────────┤
│   CTA FINAL      │
│ [COMENZAR]       │ (Full-width)
├──────────────────┤
│ © KLEOS          │
└──────────────────┘
```

---

## 🎨 COLOR SYSTEM

```
┌─────────────────────────────────────┐
│  PALETA KLEOS INSIGHT™ MVP V1        │
├─────────────────────────────────────┤
│                                     │
│  ███ #050505 — NEGRO ABSOLUTO      │
│  Fondos primarios, autoridad        │
│                                     │
│  ███ #C5A059 — ORO PREMIUM         │
│  Acentos, CTAs, diferenciación      │
│                                     │
│  ███ #F5F5F5 — BLANCO ROTO         │
│  Texto principal, contraste         │
│                                     │
│  ███ #1A1A1A — GRIS CHARCOAL       │
│  Elementos secundarios              │
│                                     │
│  ███ #2D2D2D — GRIS MEDIO          │
│  Divisores, subtexto                │
│                                     │
│  Contraste mínimo WCAG AA:  4.5:1  │
│                                     │
└─────────────────────────────────────┘
```

---

## 🔤 TIPOGRAFÍA

```
┌──────────────────────────────────────────┐
│  PLAYFAIR DISPLAY (Titulación)          │
├──────────────────────────────────────────┤
│                                          │
│  ¿Qué percepción limita tu crecimiento? │  (56px, H1)
│                                          │
│  Kleos en 60 segundos                    │  (42px, H2)
│                                          │
│  Percepción determina valor              │  (20px, H3)
│                                          │
│  Regular (400) + Bold (700)              │
│                                          │
└──────────────────────────────────────────┘

┌──────────────────────────────────────────┐
│  JETBRAINS MONO (Datos/Números)          │
├──────────────────────────────────────────┤
│                                          │
│  Pregunta 1 de 12                        │  (12px, labels)
│                                          │
│  98 / 100                                │  (96px, index)
│                                          │
│  Confianza: 94%                          │  (14px, metrics)
│                                          │
│  Regular (400) + Medium (500)            │
│                                          │
└──────────────────────────────────────────┘
```

---

## 📊 ESTRUCTURA DE DATOS

### Respuestas Capturadas

```javascript
{
  q1_company: "TuEmpresa SA",
  q2_industry: "Consultoría",
  q3_value_prop: "Detectamos brechas...",
  q4_challenge: "Conversión baja",
  q5_client_perception: "Premium, Costoso, Exclusivo",
  q6_self_perception: "Innovador, Accesible",
  q7_competitor: "McKinsey",
  q8_differentiation: "Análisis local vs global",
  q9_channels: ["Venta directa", "Inbound marketing"],
  q10_budget: "$50k-$100k",
  q11_objective: "Aumentar conversión 30%",
  q12_email: "ceo@tuempresa.com"  // optional
}
```

### Resultado Generado (Localmente)

```javascript
{
  kleosIndex: 98,           // 0-100 puntos
  confidence: 94,           // % confianza
  clientsUnaware: 98,       // De cada 100, X no entienden
  perceptions: [
    "Premium",
    "Confiable",
    "Moderno",
    "Accesible",
    "Especializado"
  ],
  diagnosis: "Alinea tu narrativa de marketing con tu propuesta de valor..."
}
```

---

## 🔄 ALGORITMO MVP (LOCAL)

```
INPUT: answers (12 preguntas)

PASO 1: Calcular brecha de percepción
├─ Palabras clientes (Q5)
├─ Palabras self (Q6)
├─ Comparar: matches / total = % similitud
└─ Gap Score = 100 - % similitud  (0-100)

PASO 2: Generar Índice Kleos
├─ Base: Gap Score * 0.8
├─ Variabilidad: + random(0-20)
└─ Resultado: 75-100 (siempre validante para MVP)

PASO 3: Confianza
├─ Base: 85% + random(0-10)
└─ Resultado: 85-95%

PASO 4: Percepciones
├─ Usar palabras de clientes (Q5)
├─ Agregar palabras simuladas
└─ Mostrar: primeras 2 visible, rest bloqueadas

OUTPUT: result JSON (guardar en localStorage)
```

---

## 🎭 EXPERIENCIA EMOCIONAL POR PANTALLA

```
LANDING PAGE
┌──────────────────────────────────┐
│ Emociones: Intriga + Relevancia  │
│ Frase: "Esto habla de mi         │
│        problema específico"      │
│                                  │
│ Visual: Negro + Oro + Espacio    │
│ Copy: Provocador + Claro         │
└──────────────────────────────────┘
         ↓

DIAGNÓSTICO
┌──────────────────────────────────┐
│ Emociones: Conversación          │
│            Privada + Control     │
│ Frase: "Me siento escuchado,    │
│        esto es personal"         │
│                                  │
│ Visual: Minimalista, limpio      │
│ Copy: Preguntas directas         │
└──────────────────────────────────┘
         ↓

PROCESAMIENTO
┌──────────────────────────────────┐
│ Emociones: Expectativa +         │
│            Anticipación          │
│ Frase: "Algo importante está    │
│        sucediendo"               │
│                                  │
│ Visual: Spinner + msgs rotativo  │
│ Duración: 3-6s (variable)        │
└──────────────────────────────────┘
         ↓

RESULTADO
┌──────────────────────────────────┐
│ Emociones: Sorpresa + Deseo +   │
│            Urgencia              │
│ Frase: "No sabía esto...        │
│        necesito saber más y     │
│        pagar si es necesario"   │
│                                  │
│ Visual: Números grandes, bloques │
│ Copy: Provocador, urgencia       │
└──────────────────────────────────┘
```

---

## 🎯 COMPONENTES PRINCIPALES

### Botones

```
PRIMARY (Oro fondo)
┌───────────────────────────┐
│   INICIAR DIAGNÓSTICO     │  Padding: 12px 32px
│                           │  Font: Playfair 16px bold
│   Hover: +15% brightness  │  Cursor: pointer
│   Active: +25%            │  Transition: 300ms
└───────────────────────────┘

SECONDARY (Borde oro)
┌───────────────────────────┐
│   SABER MÁS               │  Border: 1px oro
│                           │  Bg: transparent
│   Hover: bg 10% oro       │  Font: Playfair 14px
│   Active: bg 20%          │  Transition: 300ms
└───────────────────────────┘
```

### Inputs

```
Text Input
┌─────────────────────────┐
│ [Label] Pregunta X      │
│ ────────────────────────│  Transparent bg
│ [Placeholder text...]   │  Border-bottom: 1px gris
│                         │  Focus: border 2px oro
│ Focus state: glow oro   │  Transition: 200ms
└─────────────────────────┘

Textarea
┌─────────────────────────┐
│ [Label] Pregunta X      │
│ ┌───────────────────────│  Min-height: 100px
│ │ [Placeholder...]      │  Border: 1px gris
│ │                       │  Focus: border 2px oro
│ │                       │  Padding: 12px
│ └───────────────────────│
└─────────────────────────┘

Select
┌─────────────────────────┐
│ [Selecciona opción ▼]   │  Chevron: oro
│                         │  Transparent bg
│ [Dropdown abierto]      │  Focus: border oro
│  → Opción 1             │  Transition: 200ms
│  → Opción 2             │
│  → Opción 3             │
└─────────────────────────┘

Checkbox
☐ Opción 1   ← Unchecked (gris border)
☑ Opción 2   ← Checked (oro border + fill)
```

---

## 🎬 ANIMACIONES PRINCIPALES

```
FADE IN
From: opacity 0
To:   opacity 1
Dur:  300-600ms
Ease: cubic-bezier(0.4, 0, 0.2, 1)

SLIDE UP
From: translateY(10px) + opacity 0
To:   translateY(0) + opacity 1
Dur:  400ms
Ease: cubic-bezier(0.4, 0, 0.2, 1)

COUNTER (0 → 98)
From: 0
To:   target number
Dur:  1500ms
Ease: ease-out

SPIN (Procesamiento)
From: rotate(0deg)
To:   rotate(360deg)
Dur:  1.8s
Ease: linear (repeat)

PROGRESS FILL
From: width 0%
To:   width X%
Dur:  400-3000ms
Ease: ease-out
```

---

## 📈 MÉTRICAS DE ÉXITO

```
┌────────────────────────────────────────┐
│  MVP V1 VALIDATION METRICS             │
├────────────────────────────────────────┤
│                                        │
│  Métrica 1: Landing → Diagnóstico      │
│  ├─ 100 visitantes                     │
│  ├─ 30+ click "INICIAR"                │
│  ├─ CTR: ≥ 30% ✓ ÉXITO                │
│  └─ Línea base: 30% es bueno           │
│                                        │
│  Métrica 2: Diagnóstico completado     │
│  ├─ 30 usuarios inician form           │
│  ├─ 21+ completan (70%)                │
│  ├─ Abandono: ≤ 30% ✓ ÉXITO            │
│  └─ Línea base: >70% completion        │
│                                        │
│  Métrica 3: CTA Desbloquear             │
│  ├─ 21 usuarios ven resultado          │
│  ├─ 3+ click "DESBLOQUEAR"             │
│  ├─ Conversión: ≥ 15% ✓ ÉXITO          │
│  └─ Línea base: 3+ leads = validación  │
│                                        │
│  RESULTADO FINAL                       │
│  3 personas dispuestas a PAGAR         │
│  = MVP VALIDATED                       │
│                                        │
└────────────────────────────────────────┘
```

---

## 🗂️ ESTRUCTURA DE ARCHIVOS

```
kleos-insight-v1/
│
├── src/                                [Frontend MVP V1]
│   ├── index.html                      [550 líneas, 4 pantallas SPA]
│   ├── assets/
│   │   ├── css/
│   │   │   └── styles.css              [300 líneas, design system]
│   │   └── js/
│   │       └── main.js                 [300 líneas, lógica]
│   └── [No hay assets images en MVP]
│
├── design/
│   ├── MVP_V1_SIMPLIFIED_DESIGN.md     [Diseño visual 4 pantallas]
│   └── KLEOS_INSIGHT_Experience_Design.md [Referencia, no MVP]
│
├── EXECUTIVE_SUMMARY_MVP_V1.md         [Simplificación radical]
├── MVP_V1_PRD.md                       [Requirements completo]
├── MVP_V1_READING_GUIDE.md             [Este documento]
├── DEVELOPER_QUICKSTART.md             [Código exacto]
│
└── [Anteriores docs - para referencia]
```

---

## ⏱️ TIMELINE VISUAL

```
Hora 0-1       Setup + Estructura
├─ Crear carpetas
├─ HTML boilerplate
└─ CSS variables

Hora 1-5       HTML Estructura (4 pantallas)
├─ Landing page
├─ Diagnóstico form
├─ Procesamiento
└─ Resultado

Hora 5-7       CSS Styling
├─ Variables + utilities
├─ Componentes
├─ Layout
└─ Responsive

Hora 7-11      JavaScript Logic
├─ Page navigation
├─ Form handling + validation
├─ Processing animation
└─ Result rendering

Hora 11-12     Testing + Deployment
├─ Cross-browser
├─ Mobile testing
├─ Deploy a Netlify
└─ QA final

TOTAL: 12 horas = MVP READY
```

---

## 🚀 DEPLOYMENT OPTIONS

```
OPCIÓN 1: NETLIFY (Recomendado)
┌──────────────────────┐
│ npm install -g netlify-cli
│ netlify deploy --prod
│ 
│ Result: https://kleos-[random].netlify.app
│ Cost: $0 (forever free)
│ Speed: Deploy en 30 seg
└──────────────────────┘

OPCIÓN 2: GITHUB PAGES
┌──────────────────────┐
│ git push → Auto-deploy
│ 
│ Result: https://[user].github.io/kleos
│ Cost: $0
│ Speed: Deploy en 2-5 min
└──────────────────────┘

OPCIÓN 3: LOCAL (Testing)
┌──────────────────────┐
│ python -m http.server 8000
│ 
│ Result: http://localhost:8000
│ Cost: $0
│ Speed: Instant
└──────────────────────┘
```

---

## 🎓 CHECKLIST VISUAL

```
┌─────────────────────────────────────────────┐
│ MVP V1 CONSTRUCTION CHECKLIST               │
├─────────────────────────────────────────────┤
│                                             │
│ LANDING PAGE                                │
│  ☐ Hero section (56px title)               │
│  ☐ Filosofía (3 columnas)                  │
│  ☐ Cómo funciona (timeline)                │
│  ☐ Beneficios (2 cards)                    │
│  ☐ CTA final                               │
│  ☐ Footer                                  │
│                                             │
│ DIAGNÓSTICO                                 │
│  ☐ Barra progreso (top sticky)            │
│  ☐ 12 preguntas (SPA, una por una)        │
│  ☐ Validación en cliente                   │
│  ☐ Botones VOLVER/SIGUIENTE                │
│  ☐ localStorage persistence                │
│                                             │
│ PROCESAMIENTO                               │
│  ☐ Logo + spinner                          │
│  ☐ 4 mensajes dinámicos                    │
│  ☐ Barra progreso 0→95%                   │
│  ☐ Duration: random 3-6 seg               │
│  ☐ Auto-avanza                             │
│                                             │
│ RESULTADO                                   │
│  ☐ Índice animado (contador)              │
│  ☐ Confianza (barra + %)                   │
│  ☐ Percepción (2 visibles + bloqueadas)   │
│  ☐ Verdad incómoda                         │
│  ☐ Diagnóstico principal                   │
│  ☐ CTA Desbloquear (prominent)            │
│  ☐ CTAs secundarias                        │
│                                             │
│ RESPONSIVE                                  │
│  ☐ Desktop (1024px+)                      │
│  ☐ Tablet (768-1024px)                    │
│  ☐ Mobile (<768px)                        │
│  ☐ Touch targets (44x44px min)            │
│                                             │
│ TESTING                                     │
│  ☐ Navegación funciona                    │
│  ☐ Form valida correctamente              │
│  ☐ Procesamiento dura 3-6s                │
│  ☐ Resultado muestra índice               │
│  ☐ Bloqueado visible                      │
│  ☐ No errors en console (F12)             │
│  ☐ Cross-browser (Chrome, FF, Safari)    │
│                                             │
│ DEPLOYMENT                                  │
│  ☐ Deploy a Netlify                       │
│  ☐ HTTPS funciona                         │
│  ☐ Responsive en móvil                    │
│  ☐ No broken images/links                 │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🎯 ÉXITO = 3 PERSONAS LISTAS PARA PAGAR

Eso es todo lo que necesitas para MVP V1.

No perfección. No todas las features. Solo:
- ✅ Landing bonito
- ✅ Form que capture datos
- ✅ Análisis que dramatice
- ✅ Resultado que inspire deseo
- ✅ Freemium que cree urgencia

Resultado: 3 personas dicen "sí, pagaría"

= **MVP VALIDATED**

---

**KLEOS INSIGHT™ MVP V1 — Blueprint Visual Completo**

*Listo para construir. 72 horas. Éxito: 3 leads.*

