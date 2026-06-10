# KLEOS INSIGHT™ MVP V1 — Design System Simplificado

**MVP de Validación de Mercado - 4 Pantallas Únicamente**

---

## I. FUNDACIÓN DEL MVP

### Objetivo de Negocio

Validar que personas están dispuestas a:
1. ✅ Responder 12 preguntas sobre su negocio
2. ✅ Ver un resultado que les importe
3. ✅ Querer pagar por acceso completo

### Scope Definitivo

**INCLUIR:**
- ✅ Landing Page (Generar curiosidad)
- ✅ Diagnóstico (12 preguntas)
- ✅ Procesamiento (Expectativa)
- ✅ Resultado (MVP de contenido)

**EXCLUIR (Fases futuras):**
- ❌ Autenticación
- ❌ Dashboard
- ❌ Historial
- ❌ Reportes
- ❌ Membresías
- ❌ Multi-usuario
- ❌ Notificaciones

---

## II. SISTEMA DE DISEÑO (SIN CAMBIOS)

### Paleta
```
--color-black: #050505           (Fondos, autoridad)
--color-gold: #C5A059            (Acentos, diferenciación)
--color-white: #F5F5F5           (Texto principal)
--color-gray-dark: #1A1A1A       (Elementos secundarios)
--color-gray-medium: #2D2D2D     (Divisores, subtexto)
```

### Tipografía
```
--font-display: 'Playfair Display'   (Títulos, narrativa)
--font-mono: 'JetBrains Mono'        (Datos, números)
```

### Transiciones
```
--transition-fast: 200ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-medium: 300ms cubic-bezier(0.4, 0, 0.2, 1)
--transition-slow: 600ms cubic-bezier(0.4, 0, 0.2, 1)
```

---

## III. PANTALLA 1: LANDING PAGE

**Objetivo:** Generar curiosidad + convertir a diagnóstico

**Flujo Emocional:** Intriga → Relevancia → Urgencia → CTA

### Estructura

**HERO SECTION (100vh)**

Contenido centrado verticalmente:

```
┌─────────────────────────────────────┐
│                                     │
│   ¿Qué percepción                   │
│   limita tu crecimiento?            │  (Playfair 56px, blanco + oro)
│                                     │
│   KLEOS INSIGHT™ detecta las       │  (Playfair 24px, gris)
│   limitaciones imperceptibles       │
│   que frenan tu negocio             │
│                                     │
│   [INICIAR DIAGNÓSTICO] [SABER MÁS] │  (CTAs)
│                                     │
└─────────────────────────────────────┘
```

**Estilo Hero:**
- Fondo: Negro absoluto (#050505)
- Tipografía: Playfair Display 56px blanco + oro
- Subtítulo: Playfair 24px gris medium
- Botón primario: Oro background, padding 12px 32px
- Botón secundario: Borde oro, transparent background
- Animación: Fade-in + slide-up staggered (h1 → subtitle → ctad)

---

**SECCIÓN 2: FILOSOFÍA (100vh)**

Título: "¿Por qué Kleos existe?" (Playfair 42px, oro)

3 columnas minimalistas:

```
01                      02                      03
Percepción             Claridad                Confianza
determina              genera                  reduce
valor                  confianza               fricción

Tu mercado no          Un mensaje claro        La incertidumbre
compra lo que          te posiciona como       es la razón #1
eres. Compra lo        autoridad indiscutible  por la que no
que PERCIBE.                                   cierran deals.
```

**Estilo Filosófico:**
- Número: JetBrains 48px oro
- Línea divisoria: 2px oro 40px ancho
- Título: Playfair 20px blanco
- Descripción: Playfair 14px gris, máximo 30 palabras
- Layout: 3 columnas gap 64px
- Animación: Fade-in staggered al scroll

---

**SECCIÓN 3: CÓMO FUNCIONA (100vh)**

Título: "Kleos en 60 segundos" (Playfair 42px, oro)

Timeline vertical simple:

```
01 ⬤  Responde 12 preguntas
  |   sobre tu negocio
  |
02 ⬤  Nuestro sistema analiza
  |   percepciones del mercado
  |
03 ⬤  Genera tu Índice Kleos
  |   (0-100 puntos)
  |
04 ⬤  Recibes diagnóstico
     único e inmediato
```

**Estilo Timeline:**
- Punto: Círculo 20px borde 2px oro
- Línea: 2px oro connecting
- Texto: Playfair 18px blanco
- Descripción: JetBrains 12px gris
- Interacción: Hover en punto → Se anima a oro 15%

---

**SECCIÓN 4: BENEFICIOS (100vh)**

Título: "¿Qué es el Índice Kleos?" (Playfair 42px, oro)

2 Benefit cards:

```
IZQUIERDA                        DERECHA
┌──────────────────────┐        ┌──────────────────────┐
│ Sabes exactamente    │        │ Tienes un plan       │
│ qué está frenanado   │        │ claro para actuar    │
│ tu crecimiento       │        │ inmediatamente       │
│                      │        │                      │
│ No más adivinanzas   │        │ No más confusión     │
│ estratégicas         │        │ en prioridades       │
└──────────────────────┘        └──────────────────────┘
```

**Estilo Benefits:**
- Cada card: Borde 1px oro, padding 32px
- Título: Playfair 24px blanco
- Descripción: Playfair 14px gris
- Animación: Fade-in + slide-up al scroll

---

**SECCIÓN 5: CTA FINAL (60vh)**

Minimalista. Solo:

```
┌──────────────────────────────────┐
│                                  │
│  ¿Listo para saber la verdad?   │
│                                  │
│  [COMENZAR DIAGNÓSTICO]         │
│  (botón primario, gold)         │
│                                  │
└──────────────────────────────────┘
```

**Estilo CTA Final:**
- Fondo: Negro absoluto
- Línea superior: 2px oro
- Tipografía: Playfair 32px blanco
- Botón: Primary, 16px 48px padding
- Animación: Pulse suave

---

## IV. PANTALLA 2: DIAGNÓSTICO (12 PREGUNTAS)

**Objetivo:** Capturar datos + mantener engagement

**Experiencia:** Conversación privada, no formulario

### Layout General

```
┌─────────────────────────────────────┐
│  [LOGO]        [BARRA PROGRESO]    │  (Header fijo)
├─────────────────────────────────────┤
│                                     │
│  (Pregunta centrada)                │  (Hero section)
│  (Input elegante)                   │
│                                     │
├─────────────────────────────────────┤
│  [VOLVER]              [SIGUIENTE]  │  (Footer fijo)
│                                     │
└─────────────────────────────────────┘
```

### Barra de Progreso

- Posición: Top, fijo
- Estilo: 100% width, height 4px
- Fill: Gradiente naranja → oro
- Progreso: Se actualiza al completar cada pregunta (1/12 → 2/12 → etc)
- Duración de animación: 400ms

```
PREGUNTA 1/12
████░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  (8.3%)
```

### Estructura de Pregunta

**Q1-Q4: Datos de Empresa**

```
Pregunta 1 de 12

¿Cuál es el nombre de tu empresa?

[_________________________]      Input text
```

**Estilo:**
- Label: "Pregunta X de 12" — JetBrains 12px oro
- Pregunta: Playfair 28px blanco
- Input: Transparente, borde inferior 1px gris, focus → oro 2px
- Placeholder: JetBrains 14px gris 50%

---

**Q2: Industria (Select)**

```
Pregunta 2 de 12

¿En qué industria operan?

[Selecciona tu industria ▼]
  → Tecnología
  → Finanzas
  → Consultoría
  → Marketing
  → E-commerce
  → Servicios
  → Otro
```

---

**Q3-Q4: Propuestas de Valor (Textarea)**

```
Pregunta 3 de 12

¿Cuál es tu principal propuesta de valor?

┌────────────────────────────────┐
│ (describe brevemente)          │  Textarea
│                                │  min-height: 100px
│                                │
│                                │
└────────────────────────────────┘
```

---

**Q5: Radio Buttons**

```
Pregunta 5 de 12

¿Cuál es tu mayor desafío en ventas?

◯ Falta de conocimiento del mercado
◯ Débil posicionamiento
◯ Problemas de precio percibido
◯ Baja tasa de conversión
```

---

**Q6-Q7: Percepciones (Input corto)**

```
Pregunta 6 de 12

¿Cómo describirían TUS CLIENTES tu empresa en 3 palabras?

[Ej: Confiable, Innovador, Premium]  Input text
```

```
Pregunta 7 de 12

¿Cómo TE DESCRIBES a ti mismo en 3 palabras?

[Ej: Especializado, Accesible, Confiable]  Input text
```

**Nota:** Esta sección es CRÍTICA. Aquí detectamos la brecha de percepción.

---

**Q8-Q9: Competencia (Input + Textarea)**

```
Pregunta 8 de 12

¿Cuál es tu principal competidor directo?

[_________________________]  Input text
```

```
Pregunta 9 de 12

¿Qué te diferencia de tu competencia?

┌────────────────────────────────┐
│ (¿Por qué elegir tu empresa?)  │  Textarea
│                                │
│                                │
└────────────────────────────────┘
```

---

**Q10: Checkboxes**

```
Pregunta 10 de 12

¿Cuáles son tus canales de ventas? (Selecciona todos)

☐ Venta directa
☐ Canales digitales
☐ Alianzas y partners
☐ Inbound marketing
```

---

**Q11: Select**

```
Pregunta 11 de 12

¿Cuál es tu presupuesto anual de marketing?

[Selecciona rango ▼]
  → $0 - $10k
  → $10k - $50k
  → $50k - $100k
  → $100k+
```

---

**Q12: Final (Textarea)**

```
Pregunta 12 de 12

¿Cuál es tu objetivo principal en los próximos 12 meses?

┌────────────────────────────────┐
│ (describe tu objetivo)         │  Textarea
│                                │
│                                │
└────────────────────────────────┘
```

---

### Flujo de Interacción

1. **Usuario llega a Q1**
   - Fade-in de pregunta (400ms)
   - Input autofocus (cursor parpadeante visible)

2. **Usuario ingresa dato**
   - Al cambiar de campo: Slide suave 8px abajo, fade-in siguiente
   - Validación en tiempo real: Checkmark verde si válido

3. **Usuario avanza con SIGUIENTE**
   - Fade-out pregunta actual (200ms)
   - Fade-in siguiente pregunta (300ms delay)
   - Barra progreso anima a nuevo % (400ms)

4. **Usuario presiona VOLVER**
   - Regresa a pregunta anterior
   - Datos se mantienen
   - Barra progreso retrocede

5. **Última pregunta completada**
   - Botón SIGUIENTE cambia a "Analizar →"
   - Animación: Pulse suave, hover aumenta

---

### Validación

**Campos requeridos:** Todos

**Validación por tipo:**
- Email: Formato correcto
- Texto: Mínimo 2 caracteres
- Select/Radio: Requerido
- Checkbox: Mínimo 1 seleccionado

**Error visual:**
- Borde rojo 2px
- Mensaje bajo campo: "Este campo es requerido" (JetBrains 11px, rojo)
- Animación: Shake suave

---

## V. PANTALLA 3: PROCESAMIENTO

**Objetivo:** Generar expectativa + dramatización

**Duración:** 3-6 segundos (no fijo, random para parecer real)

### Layout

```
┌─────────────────────────────────────┐
│                                     │
│        [LOGO KLEOS]                 │  Spinner elegante
│                                     │
│    Analizando percepciones...       │  Mensaje dinámico
│                                     │
│    ████░░░░░░░░░░░░░░░░░░░░░░      │  Barra progreso
│    43%                              │
│                                     │
└─────────────────────────────────────┘
```

### Elementos

**Logo Animado**
- KLEOS en blanco
- Línea dorada debajo pulsea
- Animación: Pulse suave (scale 1.0 → 1.05 → 1.0)
- Duración: 1.5s, easing ease-in-out

**Mensaje Dinámico**

Secuencia de 4 mensajes (rotación cada 1.5s):

```
1. "Analizando percepciones..."     (Playfair 24px, blanco)
   [Progreso: 25%]

2. "Detectando patrones..."
   [Progreso: 50%]

3. "Construyendo Índice Kleos..."
   [Progreso: 75%]

4. "Generando diagnóstico..."
   [Progreso: 95%]

[Final: Auto-avanza a Resultados]
```

**Transición entre mensajes:**
- Fade-out mensaje actual (200ms)
- Fade-in mensaje nuevo (300ms delay)

**Spinner**
- Tamaño: 60x60px
- Estilo: Círculo con trazo oro 4px
- Animación: Rotación 360° cada 1.8s, easing linear
- Opacity: Gradient (100% → 20% → 100%)

**Barra de Progreso**
- Full width
- Height: 4px
- Background: Gris charcoal
- Fill: Gradiente naranja → oro
- Animación: 0% → 95% en tiempo variable (3-6s)
- **Nota:** Siempre se detiene en 95%, no llega a 100% (psicología: esperanza)

**Porcentaje**
- JetBrains 12px gris
- Se actualiza cada 1.5s
- Fade-in/out con mensajes

---

### Timing Aleatorio

El sistema **NO** sigue timing exacto:

```javascript
// Duración random entre 3-6 segundos
const duration = Math.random() * 3000 + 3000;  // 3000ms a 6000ms

// Progreso no lineal (más realista)
// 0% → 30% (1s) → 50% (2s) → 75% (3s) → 95% (final, no llega a 100%)

// Auto-avance al final
setTimeout(() => loadPage('results'), duration);
```

**Por qué:** Parecer real, no robótico. Los usuarios esperan variabilidad.

---

### Fondo

- Negro absoluto
- Centered vertical
- Fade-in al entrar (400ms)

---

## VI. PANTALLA 4: RESULTADO (MVP)

**Objetivo:** Mostrar insight + crear deseo de acceso completo

**Modelo:** Freemium (versión gratuita limitada)

### Layout Principal

```
┌──────────────────────────────────────────┐
│                                          │
│  TU ÍNDICE KLEOS                         │  (Sección hero)
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━     │
│                                          │
│          98 / 100                        │  (Número gigante)
│                                          │
│  Tu percepción limitante es crítica     │  (Subtítulo)
│                                          │
│  Nivel de percepción: CRÍTICO            │  (Métrica)
│  Confianza del análisis: 94%             │
│                                          │
└──────────────────────────────────────────┘
```

---

### Sección 1: Índice Kleos Hero

**Estilo:**
- Fondo: Borde 1px oro, padding 48px
- Título: "TU ÍNDICE KLEOS" — Playfair 32px oro
- Línea divisoria: 2px oro debajo
- Número grande: JetBrains 96px oro
- Subtítulo: Playfair 20px blanco
- Métricas: JetBrains 14px gris

**Animación:**
- Número se anima (contador 0 → 98)
  - Duración: 1.5s, easing ease-out
  - Pulsa al terminar
- Subtítulo fade-in después (400ms delay)
- Métricas fade-in (800ms delay)

**Interpretación del Score:**

```
0-25:   CRÍTICO (Rojo)      — Urgencia máxima
26-50:  ALTO (Naranja)      — Requiere acción
51-75:  MODERADO (Amarillo) — Oportunidad clara
76-100: BAJO (Verde)        — Optimización posible
```

En este MVP, siempre muestra números altos (75-100) para demostrar validación.

---

### Sección 2: Percepción Detectada (FREEMIUM LIMIT 1/3)

```
┌──────────────────────────────────────────┐
│ PERCEPCIÓN DETECTADA                     │
│                                          │
│ El mercado percibe tu negocio como:      │
│                                          │
│ • Premium                                │
│ • Costoso                                │
│ • [BLOQUEADO] ••••••••••                │
│ • [BLOQUEADO] ••••••••••                │
│ • [BLOQUEADO] ••••••••••                │
│                                          │
│ [DESBLOQUEAR COMPLETO]  [COMPARTIR]     │
│                                          │
└──────────────────────────────────────────┘
```

**Estilo:**
- Borde: 1px gris charcoal
- Padding: 32px
- Título: Playfair 24px blanco
- Descripción: Playfair 16px gris
- Bullets: Playfair 14px blanco (primeros 2 visibles)
- Bloqueados: Gris punteado "•••••••" (3-5 líneas)
- Botón: Secundario, "Desbloquear análisis completo"

**Interacción:**
- Hover en "DESBLOQUEAR": Borde becomes oro, pulse
- Click: Abre modal de CTA

---

### Sección 3: Verdad Incómoda (FREEMIUM LIMIT 2/3)

```
┌──────────────────────────────────────────┐
│ LA VERDAD INCÓMODA                       │
│                                          │
│ De cada 100 clientes potenciales...      │
│                                          │
│ 98 NO comprenden tu diferenciador clave │
│                                          │
│ Esto significa:                          │
│ • Conversión baja                        │
│ • [BLOQUEADO] ••••••••••                │
│ • [BLOQUEADO] ••••••••••                │
│ • [BLOQUEADO] ••••••••••                │
│                                          │
└──────────────────────────────────────────┘
```

**Estilo:**
- Borde: 1px rojo suave (4ADE80 → #EF4444)
- Padding: 32px
- Fondo: Rojo 2% opacity
- Título: Playfair 24px blanco
- Número destacado: JetBrains 48px rojo
- Descripción: Playfair 14px gris
- Bullets: Primero visible, resto bloqueado

---

### Sección 4: Tu Diagnóstico (FREEMIUM LIMIT 3/3)

```
┌──────────────────────────────────────────┐
│ TU DIAGNÓSTICO PRINCIPAL                 │
│                                          │
│ Alinea tu narrativa de marketing         │
│ con tu propuesta de valor real            │
│                                          │
│ Acción recomendada:                      │
│                                          │
│ [BLOQUEADO - 3 acciones más en acceso    │
│ completo]                                │
│                                          │
└──────────────────────────────────────────┘
```

**Estilo:**
- Borde: 1px oro
- Padding: 32px
- Fondo: Oro 5% opacity
- Título: Playfair 24px oro
- Descripción principal: Playfair 18px blanco (bold)
- Subtítulo: JetBrains 12px gris
- Texto bloqueado: Gris punteado

---

### Sección 5: CTA Principal (DESBLOQUEAR)

**Position:** Sticky bottom o full-width al final

```
┌──────────────────────────────────────────┐
│                                          │
│  [DESBLOQUEAR ANÁLISIS COMPLETO]        │  (Botón primario, oro)
│                                          │
│  Accede a:                               │  (Descripción)
│  • Análisis completo de percepciones     │
│  • 5 recomendaciones accionables         │
│  • Timeline de implementación            │
│  • Exportar en PDF                       │
│                                          │
│  Precio: [A DEFINIR]                    │
│                                          │
└──────────────────────────────────────────┘
```

**Estilo:**
- Botón: Primary (oro background)
- Tamaño: 16px 48px padding
- Descripción: Playfair 14px blanco
- Lista: Bullets en oro
- Precio: JetBrains 20px blanco (bold)

**Interacción:**
- Hover: Brightness +15%, shadow aumenta
- Click: Modal/Redirect a checkout (futura)

---

### Sección 6: CTA Secundarias

**Opción A: Compartir resultado**

```
[COMPARTIR RESULTADO]  [DESCARGAR PDF]  [NUEVO ANÁLISIS]
```

- Botón secundario
- Compartir: Native share API o copia a clipboard
- Descargar: Genera .txt o PDF simple (sin contenido bloqueado)
- Nuevo análisis: Reset y vuelve a landing

---

## VII. EXPERIENCIA EMOCIONAL POR PANTALLA

### Landing Page
- **Emoción:** Intriga + Relevancia
- **Frase:** "Esto habla de mi problema específico"

### Diagnóstico
- **Emoción:** Conversación privada + Control
- **Frase:** "Me siento escuchado, esto es personal"

### Procesamiento
- **Emoción:** Expectativa + Anticipación
- **Frase:** "Algo importante está sucediendo"

### Resultado
- **Emoción:** Sorpresa + Deseo + Urgencia
- **Frase:** "No sabía esto... necesito saber más... y pagar si es necesario"

---

## VIII. MODELO FREEMIUM (MVP V1)

### Versión Gratuita Muestra

**Acceso libre:**
- ✅ Índice Kleos (número principal)
- ✅ Nivel de percepción (crítico/alto/etc)
- ✅ Primeras 2 percepciones detectadas
- ✅ Verdad incómoda principal (1 línea)
- ✅ Diagnóstico principal (headline)

**Bloqueado:**
- 🔒 Percepciones completas (3-5 items)
- 🔒 Análisis detallado de cada percepción
- 🔒 5 recomendaciones accionables
- 🔒 Timeline de implementación
- 🔒 Exportar en PDF
- 🔒 Proyecciones de impacto

### CTA de Conversión

**Estrategia:** "Eres casi allí, solo falta desbloquear"

- Botón prominent en todas partes
- Mensajes FOMO: "Descubre qué 98 de 100 clientes no saben"
- Llamado a urgencia: "Este análisis vence en 24h"
- Descuento (opcional): "Primeros 100: -50% acceso completo"

---

## IX. FLOW CRÍTICO

### De Landing a Resultado (Conversión)

```
LANDING
  ↓ Click "INICIAR DIAGNÓSTICO"
  
DIAGNÓSTICO
  ↓ Responde 12 preguntas
  ↓ Click "ANALIZAR"
  
PROCESAMIENTO
  ↓ 3-6 segundos (expectativa)
  ↓ Auto-avanza
  
RESULTADO
  ↓ Ver Index Kleos + bloqueado
  ↓ OPCIÓN A: Click "DESBLOQUEAR" → [Checkout futuro]
  ↓ OPCIÓN B: Click "COMPARTIR" → Social proof
  ↓ OPCIÓN C: Click "NUEVO ANÁLISIS" → Vuelve a landing
```

---

## X. DATOS MÍNIMOS PARA RESULTADO

**Del diagnóstico capturamos:**

```javascript
{
  company_name: string,
  industry: string,
  value_prop: string,
  self_perception: string,        // 3 palabras
  client_perception: string,      // 3 palabras
  // ... resto de 12 preguntas
}
```

**Algoritmo simple MVP:**

```javascript
// Brecha de percepción básica
const selfWords = self_perception.split(',');
const clientWords = client_perception.split(',');
const matches = selfWords.filter(w => clientWords.includes(w)).length;
const gapScore = 100 - (matches / selfWords.length * 100);

// Index Kleos
const kleosIndex = Math.round(gapScore * 0.8 + Math.random() * 20);  // 60-100
const confidence = 85 + Math.random() * 10;  // 85-95%

// Verdad incómoda
const clientsUnaware = Math.round(gapScore);
```

**No necesitamos Gemini API para MVP V1. Solo lógica básica.**

---

## XI. CHECKLIST MVP V1

### Frontend
- [ ] Landing page funcional (1 scroll)
- [ ] Diagnóstico form (12 preguntas)
- [ ] Procesamiento (3-6s duración)
- [ ] Resultado (con bloqueado)
- [ ] Responsive (mobile + desktop)
- [ ] Transiciones suaves
- [ ] Sin errores console

### UX
- [ ] Auto-focus en inputs
- [ ] Validación en cliente
- [ ] Botones con hover/active states
- [ ] Barra progreso actualiza
- [ ] Contador animado
- [ ] Mensajes dinámicos

### Copy
- [ ] Preguntas claras
- [ ] Títulos provocadores
- [ ] CTA conversiones
- [ ] Lenguaje premium

### Testing
- [ ] Testing flow completo
- [ ] Mobile view (375px - 768px - 1440px)
- [ ] Keyboard navigation
- [ ] Todos estados validados

---

## XII. NO INCLUIR EN MVP V1

❌ Login/Registro
❌ Dashboard
❌ Historial de análisis
❌ Reportes descargables
❌ Multi-usuario
❌ Membresías
❌ Notificaciones
❌ Integración Gemini (usar lógica local)
❌ Base de datos
❌ Analytics
❌ Email notifications

**TODO ESTO: Fase 2+**

---

## XIII. ARQUITECTURA SIMPLIFICADA

```
index.html (Una sola página)
├── Landing section
├── Diagnóstico section (12 preguntas)
├── Procesamiento section
└── Resultado section

styles.css
├── Variables (colores, tipografía)
├── Componentes base (botones, inputs)
├── Cada sección
└── Responsive (3 breakpoints)

main.js
├── KleosApp class
├── Navegación SPA (loadPage)
├── Validación form
├── Algoritmo MVP
└── Animaciones
```

**Tamaño total: ~100 KB (HTML + CSS + JS)**

---

## XIV. ÉXITO DEL MVP V1

**Métricas que importan:**

```
✅ Landing → Diagnóstico: >30% click CTA
✅ Diagnóstico: >70% completado (no abandono)
✅ Resultado: Visualización exitosa
✅ CTA Desbloquear: >15% click (deseo de acceso completo)
```

Si logras:
- 100 visitantes → 30 al diagnóstico → 21 completado → 3 desea pagar
- **= 3% conversion a evaluación de pago = ÉXITO MVP**

---

**KLEOS INSIGHT™ MVP V1 — 4 Pantallas, 1 Objetivo: Validar Mercado**

Próximo paso: Construir exactamente esto. Nada más.

---

*Simplificado radicalmente. Solo lo esencial para validar.*
*Sin futuro, sin complejidad, sin feature creep.*
*Medible, testeable, lanceable.*
