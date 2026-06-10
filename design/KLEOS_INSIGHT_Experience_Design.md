# KLEOS INSIGHT™ — Sistema de Diseño de Experiencia Premium

**Documento de Arquitectura Visual y Experiencia del Usuario**

---

## I. FUNDACIÓN ESTRATÉGICA

### Principios de Diseño

**1. Percepción Visual como Diferenciador**
- Cada elemento visual comunica inteligencia y sofisticación
- El silencio visual genera autoridad (lo que NO se muestra es tan importante como lo que se muestra)
- La claridad extrema inspira confianza inmediata

**2. Jerarquía Cognitiva**
- Reducir carga decisiva: una acción clara por estado
- Revelar información progresivamente
- Provocar curiosidad sin abrumar

**3. Lujo Digital**
- Espacio negativo generoso (breathing room)
- Tipografía de alto contraste
- Transiciones suaves que no distraen
- Precisión en cada píxel

### Filosofía Visual

*"La percepción determina el valor"* se traduce visualmente en:
- Composiciones equilibradas que transmiten control
- Paleta limitada que evoca exclusividad
- Movimiento sutil que respeta la inteligencia del usuario

---

## II. SISTEMA DE DISEÑO

### Paleta de Color

**Color Primario: Negro Absoluto**
- Hex: #050505
- RGB: 5, 5, 5
- Función: Autoridad, profundidad, elegancia
- Uso: Fondos, tipografía principal, estructuras

**Color de Acento: Oro Premium**
- Hex: #C5A059
- RGB: 197, 160, 89
- Función: Diferenciación, llamada a acción, énfasis
- Uso: Bordes, acentos, elementos interactivos clave

**Colores Secundarios**
- Blanco Roto: #F5F5F5 (texto principal, contraste)
- Gris Charcoal: #1A1A1A (elementos secundarios)
- Gris Medio: #2D2D2D (divisores, bordes sutiles)
- Negro Profundo: #000000 (capas de profundidad)

### Tipografía

**Playfair Display**
- Pesos: Regular (400), Bold (700)
- Función: Titulación, encabezados, narrativa estratégica
- Espaciado: Generoso, elegante
- Tamaños maestros:
  - H1: 56px / line-height: 1.2
  - H2: 42px / line-height: 1.3
  - H3: 28px / line-height: 1.4

**JetBrains Mono**
- Pesos: Regular (400), Medium (500)
- Función: Datos, métricas, información técnica
- Tamaño maestro: 14px / 16px
- Espaciado: Monoespaciado preciso

**Aplicación**
- Playfair: Toda narrativa, preguntas, frases de impacto
- JetBrains: Números, porcentajes, datos, APIs, valores técnicos
- Combinación: Títulos en Playfair + detalles en JetBrains crea sofisticación premium

### Espaciado y Grilla

**Sistema de 8px**
- Unidad base: 8px
- Múltiplos: 16px, 24px, 32px, 48px, 64px, 80px
- Padding interior: 24px (3 unidades)
- Margen exterior: 32px (4 unidades)
- Espacio negativo estratégico: 48-64px entre secciones

### Elementos Visuales

**Líneas y Bordes**
- Grosor primario: 1px
- Color primario: #C5A059 (oro)
- Color secundario: #2D2D2D (gris charcoal)
- Uso: División elegante, no separación agresiva

**Formas**
- Bordes: Square (0px radius) para modernidad digital
- Esquinas: Máximo 4px radius para elementos flotantes
- Geometría: Líneas rectas y limpias
- Proporción: Golden ratio (1:1.618) en elementos clave

**Sombras**
- Elevación suave: shadow de 2px desplazamiento, blur 8px, #000000 opacity 0.15
- Elevación media: shadow de 4px desplazamiento, blur 16px, #000000 opacity 0.20
- Profundidad máxima: shadow de 8px desplazamiento, blur 24px, #000000 opacity 0.25

---

## III. ARQUITECTURA DE PANTALLAS

### 1. LANDING PAGE — "El Descubrimiento"

**Propósito Emocional**
Generar curiosidad sofisticada. El visitante debe sentir: "Esto es diferente, esto es inteligente."

**Composición**

**Sección Hero (Full Viewport)**
- Fondo: Negro absoluto (#050505)
- Contenido centrado verticalmente
- Tipografía:
  - Línea 1: "¿Qué percepción" — Playfair Display 56px, blanco roto
  - Línea 2: "limita tu crecimiento?" — Playfair Display 56px, oro (#C5A059)
  - Pausa visual: Espacio de 16px entre líneas
- Subtítulo: "KLEOS INSIGHT™ detecta y transforma las limitaciones imperceptibles" — Playfair 24px, gris medio
- Call-to-Action:
  - Botón primario: "Iniciar Diagnóstico"
  - Estilo: Borde de 1px oro, fondo transparente, texto blanco
  - Padding: 16px horizontal, 12px vertical
  - Hover: Fondo color oro 10%, transición 300ms

**Sección de Principios (Viewport completo)**
- Fondo: Negro absoluto
- 3 columnas de igual ancho
- Cada columna contiene:
  - Número (01, 02, 03) — JetBrains Mono 48px, oro
  - Línea divisoria horizontal: 2px, oro, ancho 40px
  - Principio: Playfair 28px, blanco roto
  - Descripción: 2-3 líneas máximo, JetBrains 14px, gris medio
- Espaciado: 64px entre columnas
- Alineación: Izquierda

**Sección de Capacidades (Viewport completo)**
- Fondo: Gradient sutil de #050505 a #0A0A0A
- Título: "Cómo KLEOS funciona" — Playfair 42px, oro
- 4 pasos en flujo vertical:
  - Cada paso: Cuadrado de 80x80px, borde 1px oro
  - Número dentro: JetBrains 32px, oro
  - Descripción a la derecha del cuadrado: Playfair 20px
- Línea conectora: 2px, oro, 20% opacity, entre cuadrados
- Dirección: Arriba hacia abajo

**Sección Social Proof (Viewport completo)**
- Fondo: Negro absoluto
- Titular: "Confían en KLEOS" — Playfair 42px, blanco roto
- Logos: 6 logos en fila, gris charcoal, 60% opacity, hover 100%
- Testimonio destacado:
  - Comilla grande: 120px, oro, opacity 30%
  - Texto: "La claridad que KLEOS proporcionó transformó nuestra estrategia de mercado." — Playfair 24px italic
  - Atribución: Nombre + Cargo — JetBrains 12px, gris medio
- Layout: Testimonios en carrusel infinito (3 visibles)

**Sección CTA Final (Viewport completo)**
- Fondo: Negro con línea superior 2px oro
- Contenido: Mínimo
- Pregunta: "¿Está tu negocio limitado por lo que no ves?" — Playfair 42px
- Botón secundario: "Acceder al Dashboard" — Estilo similar al hero pero más prominent
- Footer mínimo: "© 2026 KLEOS INSIGHT™ | Empresa"

---

### 2. AUTHENTICATION FLOW — "El Acceso"

**Propósito Emocional**
Hacer que el usuario sienta que está entrando a algo exclusivo y controlado.

**Login Screen**
- Fondo: Negro absoluto
- Centro visual: Cuadrado blanco de 420px ancho
  - Fondo interior: Gris charcoal muy sutil (#1A1A1A)
  - Borde: 1px oro
  - Padding interior: 48px
- Contenido:
  - Logo KLEOS: Símbolo minimalista + "KLEOS" — Playfair 24px
  - Línea divisoria: 1px oro bajo logo
  - Espaciado: 32px
  - Campo Email:
    - Label: "Email" — JetBrains 12px, gris medio
    - Input: Fondo transparente, borde inferior 1px oro, text blanco
    - Padding: 12px horizontal
    - Placeholder: "nombre@empresa.com" — JetBrains 14px, gris 50%
    - Focus: Borde color oro, shadow de 0 4px 16px #C5A059 20%
  - Campo Contraseña:
    - Idéntica estructura al email
    - Icono ojo: 16px, oro, hover visible
  - Link "Olvidé mi contraseña": 12px, oro, underline on hover
  - Espaciado entre campos: 24px
  - Botón "Ingresar":
    - Ancho: 100% del contenedor
    - Fondo: Oro (#C5A059), text negro
    - Padding: 14px
    - Hover: Brightness 110%
    - Transición: 300ms ease
  - Link "¿No tienes cuenta?" "Regístrate": 12px, oro

**Sign Up Screen**
- Similar a Login pero con 4 campos:
  - Empresa
  - Email
  - Contraseña
  - Confirmar Contraseña
- Checkbox de términos: "Acepto los términos" — 12px
- Botón "Crear Cuenta" con estado de carga

**Password Recovery**
- Título: "Recuperar acceso" — Playfair 32px
- 2 estados:
  1. Ingresar email
  2. Código de verificación
- Progreso visual: Círculos indicadores (○ ● ○) — JetBrains 16px

---

### 3. DASHBOARD PRINCIPAL — "La Inteligencia"

**Propósito Emocional**
Inspirar con datos. El usuario debe sentir control absoluto y claridad.

**Estructura Layout**

**Header Fijo**
- Altura: 72px
- Fondo: Negro absoluto (#050505)
- Contenido:
  - Izquierda: Logo KLEOS minimal + "KLEOS INSIGHT™" — Playfair 18px
  - Centro: Breadcrumb — "Dashboard / Análisis Actual" — JetBrains 12px, gris medio
  - Derecha:
    - Ícono de notificaciones: Campana 20px, oro, badge rojo con número
    - Avatar usuario: 40x40px, border 1px oro, iniciales blanco
    - Botón menú: 3 líneas horizontales, oro
- Línea divisoria inferior: 1px #2D2D2D

**Sidebar Colapsable (Izquierda)**
- Ancho: 240px (expandido), 64px (colapsado)
- Fondo: Gris charcoal (#1A1A1A)
- Menú vertical:
  - Dashboard — Ícono + texto, active con fondo oro 10%
  - Análisis — Ícono + texto
  - Reportes — Ícono + texto
  - Configuración — Ícono + texto
  - Logout — Ícono + texto (al fondo)
- Cada item: 48px height, padding 16px, hover background 10% oro
- Ícono + texto: JetBrains 14px
- Línea divisoria entre items: 1px #2D2D2D

**Área Principal**
- Padding: 48px (respecto al header y sidebar)
- Fondo: Negro absoluto con subtle pattern (noise texture al 2% opacity)

**Sección 1: Métrica Principal de Insights**

Componente central dominante (Full Width):
- Fondo: Borde 1px oro, fondo #0A0A0A
- Contenido:
  - Título: "Percepción Limitante Detectada" — Playfair 42px, oro
  - Indicador de confianza: "Confianza del análisis: 94%" — JetBrains 16px, verde suave (#4ADE80)
  - Barra de confianza: 100% width, altura 4px, fondo gris charcoal, fill verde 94%
  - Descripción: "Tu mercado percibe tu valor como 'solución X' pero te diferencias en 'Y'." — Playfair 24px, blanco roto
  - Espacio vertical: 32px
  - Insight principal: Cuadrado con número grande (098) — JetBrains 96px, oro, opacity 20% como watermark
  - Texto insight: "De cada 100 clientes potenciales, 98 no comprenden tu diferenciador clave." — Playfair 18px

**Sección 2: Grid de Dimensiones de Percepción (3 columnas)**

Cada tarjeta:
- Tamaño: Responsivo, mínimo 240px
- Fondo: Borde 1px #2D2D2D, fondo #0A0A0A
- Contenido:
  - Número de dimensión: JetBrains 48px, oro
  - Nombre: "Dimensión: Calidad vs Precio" — Playfair 18px
  - Indicador visual (Gauge circular):
    - Círculo: 80px diámetro
    - Trazo: 4px, fondo gris charcoal
    - Valor: Trazo oro del 65%
    - Número dentro: "65%" — JetBrains 20px, oro
  - Cambio respecto a mes anterior: "+12% respecto a mes anterior" — JetBrains 12px, verde si positivo
  - CTA: "Ver detalles →" — 12px, oro, cursor pointer

**Sección 3: Comparativa Percepción vs Realidad**

Layout 2 columnas:
- Izquierda: "Lo que el mercado percibe"
  - Nube de palabras: Palabras más grandes = mayor frecuencia de percepción
  - Colores: Escala de gris a oro (más relevante = más oro)
  - Palabras: "Premium", "Costoso", "Exclusivo", "Moderno", "Confiable", etc.
  - Playfair 14px-28px según tamaño
  
- Derecha: "Lo que realmente eres"
  - Nube de palabras: Construcción similar
  - Palabras: "Innovador", "Accesible", "Confiable", "Establecido", etc.
  - Playfair 14px-28px

- Línea divisoria central: 2px oro

**Sección 4: Recomendaciones Accionables**

Título: "Acciones recomendadas" — Playfair 32px, oro
- Card 1:
  - Número: "01" — JetBrains 32px, oro, opacity 20%
  - Título: "Alinear narrativa de marketing" — Playfair 20px
  - Descripción: "Enfatiza tus diferenciadores clave en: Website, LinkedIn, Pitch" — JetBrains 14px, gris medio
  - Impacto predicho: "↑ 34% en conversión" — JetBrains 14px, verde, bold
  - Tag: "Alta Prioridad" — Label rojo suave, JetBrains 12px
  - CTA: "Generar Brief" — Botón pequeño, borde oro

- Card 2: Idéntica estructura
- Card 3: Idéntica estructura

---

### 4. PÁGINA DE ANÁLISIS PROFUNDO — "La Transformación"

**Propósito Emocional**
Revelar verdades. El usuario debe sentir revelación progresiva.

**Hero Section**
- Título: "Análisis Profundo: [Nombre Negocio]" — Playfair 48px
- Línea divisoria dorada debajo
- Período analizado: "Análisis de 90 días | Última actualización: 10 jun 2026" — JetBrains 12px, gris medio

**Timeline Visual**
- Dirección: Horizontal, left to right
- Puntos: 5 etapas (Captura, Análisis, Síntesis, Predicción, Recomendación)
- Estilo:
  - Punto completado: Círculo 12px, fondo oro, borde oro
  - Punto actual: Círculo 12px, borde 2px oro, fondo transparent
  - Punto futuro: Círculo 12px, borde 1px gris charcoal, fondo transparent
- Línea conectora: 2px, gris charcoal (no completada), oro (completada)
- Label bajo cada punto: JetBrains 12px

**Sección Matriz de Factores (2D Visualization)**

Eje X: "Claridad de tu diferenciador" (izquierda baja → derecha alta)
Eje Y: "Importancia para decisión del cliente" (abajo baja → arriba alta)

Cuadrantes (4):
1. Superior-Derecha: "Fortalecer" — Fondo oro 5%, elementos aquí en oro
2. Superior-Izquierda: "Comunicar" — Fondo rojo suave 5%
3. Inferior-Derecha: "Mantener" — Fondo verde suave 5%
4. Inferior-Izquierda: "Transformar" — Fondo naranja suave 5%

- Burbujas de datos: Cada factor es una burbuja
  - Tamaño burbuja: Correlaciona con impacto en ventas
  - Color: Según cuadrante
  - Al hover: Revelar nombre del factor + porcentaje impacto
  - Label: JetBrains 12px en el centro de burbuja

**Sección Narrativa Comparativa**

3 columnas:
1. "Tu Posicionamiento" — Lo que comunicas hoy
2. "Percepción Actual" — Lo que el mercado entiende
3. "Posicionamiento Ideal" — Lo que deberías comunicar

Cada columna:
- Fondo: Gris charcoal muy sutil
- Contenido: Frases clave en Playfair 18px
- Flechas de transición entre columnas: Naranja/Verde indicando cambio
- Diferencias destacadas en oro

**Sección de Datos Cuantitativos**

Tabla elegante:
- Headers: JetBrains 12px, uppercase, oro, background gris charcoal
- Filas alternas: background #050505 y #0A0A0A
- Datos: JetBrains 14px, blanco roto
- Números destacados (KPIs): Oro, bold
- Línea divisoria: 1px #2D2D2D

**Sección de Predictivos**

Título: "Proyecciones de Impacto" — Playfair 32px

Gráfico de líneas (Sparkline elegante):
- Eje X: Tiempo (meses)
- Eje Y: Métrica de crecimiento
- Línea: 2px, gradiente naranja a oro
- Área bajo línea: Gradiente sutil, opacity 20%
- Puntos de datos: Círculos 4px, oro
- Grid: Líneas muy sutiles gris charcoal, opacity 10%
- Hover en punto: Tooltip con valor exacto, fondo negro, borde oro, JetBrains 12px

---

### 5. PÁGINA DE REPORTES — "La Documentación"

**Propósito Emocional**
Profesionalismo absoluto. El usuario debe sentir que tiene un documento de consultoría de alto nivel.

**Header de Reporte**
- Logo KLEOS (pequeño, arriba a la derecha)
- Fecha del reporte: "Reporte generado el 10 de junio, 2026"
- Nombre empresa: Playfair 32px, oro
- Período: "Análisis: Mayo 1 - Junio 10, 2026"

**Tabla de Contenidos**
- Título: "Contenidos" — Playfair 24px
- Índice: Playfair 16px
- Números de página: JetBrains 12px, derecha
- Líneas punteadas conectoras (color gris charcoal)

**Secciones del Reporte**

1. **Executive Summary**
   - Resumen 1 párrafo: Playfair 16px
   - 3 números clave en boxes: Número grande oro, descripción debajo

2. **Metodología**
   - Diagrama simple de proceso: 4 cajas conectadas horizontalmente
   - Descripción bajo cada caja: JetBrains 12px

3. **Hallazgos Principales**
   - Cada hallazgo: Playfair 20px en oro
   - Descripción: Playfair 14px, blanco roto
   - Impacto cuantificado: JetBrains 14px, verde si positivo

4. **Recomendaciones**
   - Prioridad (P1, P2, P3): Label con color gradiente rojo-amarillo
   - Acción: Playfair 18px
   - Beneficio estimado: JetBrains 14px
   - Timeline: "30 días para implementación"

5. **Anexos**
   - Datos detallados en tablas
   - Gráficos adicionales
   - Referencias

**Pie de Página**
- Línea divisoria: 1px oro
- Número de página: Derecha
- Copyright: Izquierda

**Botones de Acción**
- Descargar PDF
- Compartir vía email
- Generar presentación

---

### 6. MODAL Y OVERLAYS — "Las Capas"

**Modal de Confirmación**
- Overlay: Negro 70% opacity
- Cuadro: Centro, ancho máximo 480px
- Borde: 1px oro
- Fondo: Gris charcoal (#1A1A1A)
- Contenido:
  - Ícono (pequeño): Oro, 40x40px
  - Título: Playfair 24px, oro
  - Descripción: Playfair 16px, blanco roto
  - Botones: Primario (oro) y Secundario (borde gris)
  - Espaciado: 24px vertical

**Tooltip**
- Fondo: Negro absoluto
- Borde: 1px oro
- Texto: JetBrains 12px, blanco
- Padding: 8px 12px
- Punta (arrow): Oro, 6px
- Delay: 300ms antes de mostrar
- Fade-in: 200ms

**Notificación/Toast**
- Posición: Abajo-derecha
- Ancho: 320px
- Borde izquierdo: 3px, color según tipo (verde éxito, rojo error, naranja advertencia)
- Fondo: Gris charcoal
- Icono + Mensaje: JetBrains 14px
- Botón cerrar: X pequeña, oro
- Auto-desaparece: 5 segundos
- Animación entrada: Slide in from right, 300ms

---

## IV. COMPONENTES Y MICROINTERACCIONES

### Botones

**Primario (Llamada a Acción Principal)**
- Background: Oro (#C5A059)
- Text: Negro absoluto, Playfair 16px, bold
- Padding: 12px 32px
- Borde: None
- Border-radius: 0px (square)
- Cursor: Pointer
- Estados:
  - Default: Como describido
  - Hover: Brightness +15%, shadow suave
  - Active/Press: Brightness +25%, shadow mayor
  - Disabled: Opacity 50%, cursor not-allowed
- Transición: 300ms cubic-bezier(0.4, 0, 0.2, 1)

**Secundario (Alternativa)**
- Background: Transparent
- Text: Oro, JetBrains 14px
- Borde: 1px oro
- Padding: 10px 24px
- Estados:
  - Hover: Background oro 10%, transición 300ms
  - Active: Background oro 20%

**Tertiary (Minimal)**
- Background: Transparent
- Text: Oro, JetBrains 12px
- Borde: None
- Underline: On hover only
- Padding: 8px 12px

**Con Icono**
- Ícono + Espacio 8px + Texto
- Ícono: 16x16px, mismo color que texto
- Posición: Izquierda del texto
- Al hover: Ícono se mueve 2px a la derecha, transición 200ms

**Estados de Carga**
- Texto se reemplaza por "Cargando..."
- Ícono de carga (spinner) a la izquierda
- Cursor: Wait
- Disabled: true

### Campos de Entrada

**Campo de Texto**
- Background: Transparent
- Borde inferior: 1px #2D2D2D
- Altura: 40px
- Padding: 8px 0px (vertical), 0px (horizontal) — Baseline alignment
- Texto: JetBrains 14px, blanco roto
- Placeholder: JetBrains 14px, gris 50%
- Cursor: Text, blanco
- Estados:
  - Focus: Borde inferior 2px oro, shadow 0 4px 16px #C5A059 15%
  - Error: Borde inferior 2px rojo
  - Disabled: Opacity 40%, cursor not-allowed

**Label Asociado**
- Position: Arriba del campo
- Spacing: 8px abajo
- Tamaño: JetBrains 12px
- Color: Gris medio (#2D2D2D)
- Weight: 500

**Mensaje de Error**
- Tamaño: JetBrains 11px
- Color: Rojo suave (#EF4444)
- Position: Debajo del campo, 4px gap
- Ícono: Circulito rojo 6px, izquierda

### Selectores (Dropdowns)

**Estado Cerrado**
- Fondo: Transparent
- Borde: 1px #2D2D2D
- Altura: 40px
- Padding: 8px 12px
- Chevron: 12px, oro, derecha
- Transición: 200ms

**Estado Abierto**
- Borde: 2px oro
- Chevron: Rotado 180°
- Menu desplegable:
  - Fondo: #1A1A1A
  - Borde: 1px oro
  - Opciones: JetBrains 14px, padding 12px
  - Hover: Background oro 10%, no cambio de texto
  - Selected: Checkmark oro izquierda, background oro 5%
  - Shadow: 8px desplazamiento, 24px blur, negro 25%
  - Animación: Scale up 0.95 → 1.0, fade in, 200ms

### Toggles y Checkboxes

**Checkbox**
- Tamaño: 18x18px
- Borde: 1px #2D2D2D
- Background: Transparent
- Cursor: Pointer
- Estados:
  - Unchecked: Como descrito
  - Checked: Borde 1px oro, background oro 10%, checkmark blanco 2px stroke
  - Focus: Borde 1px oro, shadow 0 0 0 3px oro 20%
  - Disabled: Opacity 50%, cursor not-allowed
- Transición: 200ms

**Radio Button**
- Tamaño: 18x18px
- Forma: Círculo
- Borde: 1px #2D2D2D
- Background: Transparent
- Estados:
  - Unchecked: Como descrito
  - Checked: Borde 1px oro, punto interior 8px oro
  - Animación: Punto crece 0 → 8px, 200ms ease-out
- Transición: 200ms

**Toggle Switch**
- Ancho: 44px, alto: 24px
- Borde: 1px #2D2D2D
- Background: Transparent
- Círculo interno: 20x20px, background gris charcoal
- Estados:
  - OFF: Círculo a la izquierda
  - ON: Círculo a la derecha (movimiento 20px), background oro 20%, círculo background oro
  - Transición: 300ms cubic-bezier(0.4, 0, 0.2, 1)

### Cards y Contenedores

**Card Estándar**
- Borde: 1px #2D2D2D
- Background: #0A0A0A
- Padding: 24px
- Radius: 0px (angular)
- Divider entre secciones: 1px #2D2D2D
- Hover: Borde 1px oro, shadow suave, transición 300ms
- Elevación: Shadow 0 4px 16px negro 20%

**Card Premium (Destacada)**
- Borde: 1px oro
- Background: #050505 con patrón noise 2% opacity
- Padding: 32px
- Shadow: 0 8px 32px #C5A059 20%
- Hover: Shadow 0 12px 48px #C5A059 30%, transición 300ms

---

## V. SISTEMAS DE ANIMACIÓN Y MICROINTERACCIONES

### Principios de Movimiento

**Velocidad Base**
- Interacción rápida: 150-200ms (hover, focus, tap feedback)
- Transición media: 300-400ms (state changes, modal open)
- Transición lenta: 500-800ms (page transitions, complex reveals)

**Easing Function Primaria**
- `cubic-bezier(0.4, 0, 0.2, 1)` — Smooth, elegante, profesional
- Easing secundaria: `ease-out` para entrada, `ease-in` para salida

### Animaciones Específicas

**Loading States**
- Spinner elegante: Línea que se dibuja en círculo
  - Animación: Rotación 360° cada 1.8 segundos, easing linear
  - Color: Oro con opacity gradient (100% → 20%)
  - Tamaño: 32x32px
- Pulse de línea: Burbuja de carga que pulsa levemente
  - Animación: Scale 1.0 → 1.1 → 1.0, cada 1.5 segundos
  - Easing: ease-in-out

**Hover Interacciones**
- Elementos interactivos: Movimiento sutil 2px arriba + shadow aumenta
  - Transición: 200ms ease-out
  - Cursor: Pointer/Hand
- Líneas decorativas: Expand width 20% on hover
  - Transición: 300ms cubic-bezier

**Focus States**
- Campo de entrada: Borde inferior 2px oro + glow sutil
  - Shadow: 0 0 0 3px oro 15%
  - Transición: 200ms
- Elemento en focus: Ring de 2px oro con gap 2px
  - Outline style: solid, offset 2px

**Page Transitions**
- Entrada de página nueva:
  - Fade-in: Opacity 0 → 1, 400ms
  - Slide-in ligero: Transform translateY(10px) → 0, 400ms
  - Combined timing: Ambos simultáneamente
- Salida de página:
  - Fade-out: Opacity 1 → 0, 300ms
  - Slide-out ligero: Transform translateY(-10px), 300ms

**Modal Overlay**
- Entrada:
  - Overlay: Fade-in, 300ms
  - Modal: Scale 0.95 → 1.0 + Fade-in, 400ms cubic-bezier
- Salida:
  - Overlay: Fade-out, 200ms
  - Modal: Scale 1.0 → 0.95 + Fade-out, 200ms

**Revelar Contenido Progresivo**
- Sección nueva: Fade-in staggered por elemento
  - Delay entre elementos: 80ms
  - Cada elemento: Opacity 0 → 1 + translateY(4px) → 0, 400ms

**Interacción de Clic**
- Efecto ripple (subtil):
  - Círculo que expande desde punto de clic
  - Color: Oro 30%
  - Duración: 600ms, easing ease-out
  - Radius final: 200px

**Data Visualization Updates**
- Cambio de número:
  - Fade-out número anterior: 150ms
  - Fade-in número nuevo: 150ms offset 100ms
  - Ligero movimiento vertical: -2px → 0px
- Actualización de barra/gauge:
  - Transición suave del valor: Duración 1.5s, easing cubic-bezier
  - Fill color animado si es crítico: Pulse de opacidad durante transición

---

## VI. ESTADOS ESPECIALES DE CARGA

### Estados de Transición

**Cargando Inicial (Primera Vez)**
- Fondo: Negro absoluto
- Contenido centrado:
  - Logo KLEOS: 80x80px, oro
  - Línea debajo: 2px oro, ancho 60px, centrada
  - Texto: "Analizando tu negocio..." — Playfair 24px, blanco roto
  - Spinner: 60x60px, debajo del texto
  - Progreso: Barra horizontal debajo, 100% width
    - Background: Gris charcoal
    - Fill: Gradiente naranja a oro (izquierda a derecha)
    - Animación: Fill progresa suavemente, 0-100% en 3-8 segundos
  - Percentage text: JetBrains 12px, gris medio

**Empty State (Sin Datos)**
- Ícono grande: 120x120px, oro, opacity 20%
- Título: "No hay datos disponibles" — Playfair 24px, blanco roto
- Descripción: "Comienza un nuevo análisis para ver insights" — Playfair 16px, gris medio
- CTA: Botón primario "Iniciar Análisis"
- Background: Ligeramente más claro que contenedor, borde 1px punteado gris charcoal

**Error State**
- Ícono: Triángulo de alerta, 80x80px, color rojo suave
- Título: "Error en la carga" — Playfair 24px, rojo
- Descripción: Mensaje técnico elegante (no stderr crudo) — JetBrains 12px
- Botón: "Reintentar" primario + "Contactar soporte" secundario
- Fondo: Rojo 5% opacity

**Skeleton Loading (Placeholder)**
- Layout: Estructura del contenido esperado en gris charcoal
- Animación: Pulse sutil, opacity 0.5 → 1.0 → 0.5, cada 2 segundos
- Líneas de texto: Rectangulares, altura variable, bordes square
- Bordes: Square, sin rounding
- Color: #2D2D2D con opacity 40%

---

## VII. FLUJO DE USUARIO COMPLETO

### User Journey: "De Visitante a Decisor"

#### Fase 1: Descubrimiento (Landing Page)
**Tiempo:** 0-120 segundos

1. Usuario llega a Landing Page
   - Animación: Página se desvanece lentamente al cargar
   - Elementos aparecen en secuencia:
     - Primero: Pregunta principal (fade-in 400ms, delay 200ms)
     - Luego: Subtítulo (fade-in 400ms, delay 600ms)
     - Finalmente: CTA (fade-in 400ms, delay 1000ms + slide up 10px)

2. Usuario lee y explora
   - Secciones visibles al scroll: Fade-in staggered
   - Al hacer hover en cualquier elemento: +2px arriba, shadow aumenta
   - Sección de principios: Números pasan a oro al hover, línea se anima

3. Decisión: "Quiero probar KLEOS"
   - Usuario hace clic en CTA
   - Animación: Botón pulsa (scale 0.98 → 1.0), ripple effect
   - Transición a Login/Signup: Fade-out página, slide-in modal
   - Duración: 400ms

#### Fase 2: Autenticación (2-3 minutos)

1. Login Screen
   - Focus en email: Ring dorado aparece alrededor del campo
   - Usuario escribe email
   - Al cambiar de campo: Slide suave hacia abajo (8px)
   - Validación en tiempo real: Checkmark verde aparece si email es válido

2. Validación
   - Usuario envía: Botón se convierte en "Cargando..." con spinner
   - Spinner de 24px, oro, rotación constante
   - Transición: 300ms

3. Éxito
   - Notificación toast: "Bienvenido, [Nombre]" — Slide in desde derecha
   - Auto-desaparece en 3 segundos
   - Redirección automática: Fade-out + slide-in dashboard
   - Transición: 800ms

#### Fase 3: Primera Exploración del Dashboard (3-5 minutos)

1. Dashboard carga
   - Fade-in del layout base: 300ms
   - Skeleton loaders aparecen para cada sección
   - Datos reales reemplazan skeletons con fade-in staggered (80ms delay entre elementos)

2. Usuario ve Insight Principal
   - Animación de número: Contador animado de 0 → 98
     - Duración: 1.5 segundos, easing ease-out
     - El número pulsa al llegar a 98
   - Descripción: Fade-in después de número
   - Usuario siente: "Wow, esto es específico y valioso"

3. Exploración de dimensiones
   - Al hover en tarjeta: Borde cambia a oro, shadow aparece
   - Gauge circular se anima: Trazo se dibuja de 0% a valor final
     - Duración: 1.2 segundos, easing ease-out
   - Números dentro del gauge: Contador animado
   - Interacción: Usuario hace clic en "Ver detalles →"

#### Fase 4: Análisis Profundo (5-10 minutos)

1. Página de Análisis carga
   - Hero section: Fade-in + slide up 20px, 600ms
   - Timeline: Cada punto se anima secuencialmente (200ms apart)
     - Puntos completados: Scale 0 → 1, oro glow durante 200ms
   - Matriz de factores (2D):
     - Fade-in de base de coordenadas (300ms)
     - Burbujas aparecen con animación staggered (150ms apart)
     - Cada burbuja: Scale 0 → 1, opacity 0 → 1, 400ms cubic-bezier
     - Al hover: Burbuja se agranda 10%, label aparece con fade-in

2. Narrativa Comparativa
   - Sección izquierda (Tu Posicionamiento): Fade-in 400ms, delay 0
   - Flechas: Draw-in animation, 300ms, delay 400ms
   - Sección derecha (Ideal): Fade-in 400ms, delay 700ms
   - Diferencias: Highlight en oro con pulse sutil

3. Datos Cuantitativos
   - Tabla aparece con fade-in
   - Números importantes: Destacados en oro, pulse suave al cargar
   - Filas aparecen con stagger (50ms apart)
   - Números se "cuentan" si es apropiado

#### Fase 5: Reporte y Acción (10-15 minutos)

1. Usuario navega a Reportes
   - Listado de reportes: Cards aparecen en grid con stagger
   - Hover en card: Borde oro, shadow, +2px arriba, 300ms

2. Usuario descarga/comparte reporte
   - Botón "Descargar PDF" hace click
   - Transición a preparación: Spinner elegante aparece en overlay
   - Éxito: Toast "PDF descargado" slide in desde derecha
   - Botón vuelve a estado normal: 300ms

3. Usuario decide actuar
   - Ve recomendaciones: Cards aparecen con stagger
   - Hace clic en "Generar Brief"
   - Modal se abre: Scale + fade-in, 400ms
   - Modal contiene formulario o confirma acción

#### Fase 6: Engagement Continuo (Retorno)

1. Usuario vuelve mañana
   - Dashboard muestra nueva visualización de cambios
   - "Desde tu último acceso..." — Nueva sección se anima
   - Números cambian con animación de contador
   - El valor positivo pulsa levemente en verde

2. Notificaciones
   - Icono de campana en header tiene badge rojo con número
   - Hover: Dropdown aparece con últimas notificaciones
   - Stagger de 100ms entre notificaciones

---

## VIII. EXPERIENCIA EMOCIONAL POR ESTADO

### Journey Emocional del Usuario

**Landing Page**
- **Emoción Objetivo:** Intriga + Confianza
- **Visual Strategy:**
  - Pregunta provocadora en oro
  - Fondo negro transmite poder y misterio
  - Espacio negativo vasto = exclusividad
  - Líneas doradas = precisión
- **Sensación:** "Esto es sofisticado y podría saber algo que no sé"

**Login/Signup**
- **Emoción Objetivo:** Seguridad + Acceso exclusivo
- **Visual Strategy:**
  - Cuadrado con borde oro = puerta a algo exclusivo
  - Campos minimalistas = control
  - Validación inmediata = tranquilidad
  - Espalda oscura = aislamiento seguro
- **Sensación:** "Estoy entrando a algo importante"

**Dashboard Inicial**
- **Emoción Objetivo:** Revelación + Empoderamiento
- **Visual Strategy:**
  - Número grande animado = impacto inmediato
  - Oro vs Negro alto contraste = importancia
  - Datos claros = control
  - Recomendaciones accionables = poder
- **Sensación:** "Sé algo que no sabía y puedo hacer algo con ello"

**Análisis Profundo**
- **Emoción Objetivo:** Comprensión + Confianza estratégica
- **Visual Strategy:**
  - Visualizaciones que revelan progresivamente
  - Línea temporal muestra progreso
  - Matriz 2D = equilibrio estratégico
  - Colores precisos = confianza en datos
- **Sensación:** "Entiendo completamente el problema y qué hacer"

**Reporte**
- **Emoción Objetivo:** Profesionalismo + Credibilidad
- **Visual Strategy:**
  - Diseño editorial de lujo
  - Números precisos en monospacio
  - Estructura clara y lógica
  - Branding consistente en oro
- **Sensación:** "Esto parece creado por consultores de élite"

**Recomendaciones**
- **Emoción Objetivo:** Acción + Esperanza
- **Visual Strategy:**
  - Prioridades claras (P1, P2, P3)
  - Impacto cuantificado = esperanza medible
  - Plazos realistas = credibilidad
  - CTAs evidentes = camino claro
- **Sensación:** "Sé exactamente qué hacer y cuándo"

---

## IX. PRINCIPIOS DE ACCESIBILIDAD Y INCLUSIÓN

### Contraste y Legibilidad

- **Ratio de contraste:** Mínimo WCAG AA (4.5:1 para texto pequeño)
- **Negro #050505 sobre Blanco #F5F5F5:** 19:1 (Excepcional)
- **Oro #C5A059 sobre Negro #050505:** 10.2:1 (Muy bueno)
- **Tamaños de texto:** Mínimo 14px para cuerpo principal

### Navegación y Estructura

- **Orden lógico de tab:** Izquierda a derecha, arriba a abajo
- **Skip links:** "Saltar al contenido principal" visible al hacer focus
- **Encabezados jerárquicos:** H1, H2, H3 estructura lógica
- **ARIA labels:** Todos los iconos tienen aria-label descriptiva

### Interactividad

- **Focus visible:** Ring de 2px oro alrededor de elementos interactivos
- **Estados comunicados:** Disabled, error, loading — visualmente claros
- **Teclado navegable:** Tab, Enter, Escape, Arrows funcionan en todos lados
- **Sin autoplay:** Vídeos/animaciones no reproducen automáticamente

### Movimiento

- **Respeto a prefers-reduced-motion:**
  - Si usuario tiene activado: Todas las animaciones se reducen a 0.1s o se convierten en cambios instantáneos
  - Las transiciones esenciales se mantienen pero sin delay
  - Sin parallax, sin microinteracciones demasiado complejas

---

## X. RESPONSIVE DESIGN

### Breakpoints

**Desktop**
- Ancho base: 1440px
- Sidebar: 240px expandido, 64px colapsado
- Contenido principal: Fluido con máximo 1200px

**Tablet**
- Ancho: 768px - 1024px
- Sidebar: Colapsado por defecto
- Grid de 2 columnas (en lugar de 3) para cards
- Tipografía: -4px en tamaños principales

**Mobile**
- Ancho: 320px - 767px
- Sidebar: Hamburger menu desplegable desde arriba
- Grid: 1 columna
- Tipografía: -8px en tamaños principales
- Padding: 16px (en lugar de 24px)
- Botones: Full width en mobile
- Tabla: Scroll horizontal con indicador visual

### Comportamientos Adaptativos

**Typography Fluida**
- H1: 56px (desktop) → 40px (tablet) → 28px (mobile)
- H2: 42px (desktop) → 32px (tablet) → 24px (mobile)
- Body: 16px (desktop) → 16px (tablet) → 14px (mobile)

**Espaciado Fluido**
- Padding: 48px (desktop) → 32px (tablet) → 16px (mobile)
- Margin: 64px (desktop) → 48px (tablet) → 32px (mobile)

**Grid Cambios**
- 3 columnas (desktop) → 2 columnas (tablet) → 1 columna (mobile)
- Cards: Full width en mobile, sin máximo en desktop

---

## XI. GUÍA DE MICROCOPY

### Tone of Voice

**Principios:**
- Sofisticado pero accesible
- Directo sin ser frío
- Poderoso pero no agresivo
- Inspirador con datos

### Ejemplos de Microcopy

**Error Messages**
- ❌ "Error"
- ✅ "No pudimos procesar tu solicitud. Por favor, intenta de nuevo."

**Loading States**
- ❌ "Cargando..."
- ✅ "Analizando tu negocio..." / "Procesando insights..."

**Empty States**
- ❌ "Sin datos"
- ✅ "Comienza tu primer análisis para descubrir insights únicos"

**Success Messages**
- ❌ "Éxito"
- ✅ "Reporte generado. Descárgalo o comparte con tu equipo."

**Call-to-Action**
- ❌ "Enviar"
- ✅ "Iniciar Diagnóstico" / "Generar Insight"

**Confirmaciones**
- ❌ "¿Estás seguro?"
- ✅ "¿Descargar este reporte? Se guardará en tu computadora."

---

## XII. PATRONES DE INTERACCIÓN

### Flujo de Datos: Cómo se Revelan los Insights

1. **Primer encuentro:** Número principal (98)
   - Usuario entiende: Problema específico cuantificado

2. **Siguiente capa:** Descripción en Playfair 24px
   - Usuario entiende: Por qué es importante

3. **Tercera capa:** Dimensiones visuales (gauges)
   - Usuario entiende: Múltiples aspectos del problema

4. **Profundización:** Matriz 2D
   - Usuario entiende: Complejidad estratégica

5. **Acción:** Recomendaciones priorizadas
   - Usuario entiende: Qué hacer primero

Este patrón se replica en cada página: **Impacto → Entendimiento → Análisis → Acción**

### Patronización de CTA

**Jerarquía de Acciones:**

1. **Acción Principal** (Oro fondo)
   - Una sola por pantalla
   - Ejemplo: "Iniciar Diagnóstico", "Descargar PDF"

2. **Acciones Secundarias** (Borde oro)
   - Máximo 2 por pantalla
   - Ejemplo: "Saber más", "Contactar soporte"

3. **Acciones Terciarias** (Texto oro)
   - Ilimitadas
   - Ejemplo: "Compartir", "Editar", "Ver detalles"

---

## XIII. CONSIDERACIONES TÉCNICAS DE DISEÑO

### Especificaciones para Desarrollo

**Shadows**
- Elevación 1: `0 2px 8px rgba(0, 0, 0, 0.15)`
- Elevación 2: `0 4px 16px rgba(0, 0, 0, 0.20)`
- Elevación 3: `0 8px 24px rgba(0, 0, 0, 0.25)`
- Glow dorado: `0 0 0 3px rgba(197, 160, 89, 0.15)`

**Z-Index Scale**
- Base/Normal: 0
- Elevated: 10
- Dropdown/Menu: 100
- Modal Overlay: 900
- Modal Content: 1000
- Tooltip: 1100

**Performance Considerations**
- GPU acceleration en animaciones CSS (transform, opacity)
- Evitar animaciones de `left/top/width/height`
- Will-change sparingly, solo en animaciones que se repiten
- Debounce de eventos de scroll/resize a 300ms

**Image Optimization**
- SVGs para iconos y logos (scalable, pequeño tamaño)
- WebP con fallback PNG para fotografías
- Lazy loading para imágenes bajo el fold

---

## XIV. VERSIÓN DARK ONLY

### Consideración de Dark Mode

KLEOS Insight existe **únicamente en Dark Mode** por diseño estratégico.

**Razones:**
1. Oro sobre negro transmite lujo (no al revés)
2. Poder silencioso = ambiente oscuro
3. Datos sensibles = protección visual
4. Premium aesthetic = dark

**No existe:**
- Selector de tema
- Light mode alternative
- Toggle dark/light

Este es un compromiso visual estratégico.

---

## XV. VALIDACIÓN VISUAL

### Checklist de Implementación

**Tipografía**
- [ ] Playfair Display cargada (font-weight 400, 700)
- [ ] JetBrains Mono cargada (font-weight 400, 500)
- [ ] Jerarquía de tamaños respetada
- [ ] Line-height apropiado para legibilidad

**Color**
- [ ] Negro #050505 en fondos primarios
- [ ] Oro #C5A059 en acentos
- [ ] Contraste WCAG AA mínimo en todo texto
- [ ] Colores consistentes en toda la aplicación

**Espaciado**
- [ ] Múltiplos de 8px en padding/margin
- [ ] Espacio negativo generoso
- [ ] Consistencia en todo el producto

**Componentes**
- [ ] Botones con todos los estados (default, hover, active, disabled)
- [ ] Campos de entrada con focus, error, disabled
- [ ] Cards con elevación y transiciones
- [ ] Modals con overlay y animación

**Animaciones**
- [ ] Duración apropiada (150ms-800ms)
- [ ] Easing consistente
- [ ] Smooth sin lag en navegadores modernos
- [ ] Respeto a prefers-reduced-motion

**Accesibilidad**
- [ ] Focus visible en todos elementos
- [ ] ARIA labels en iconos
- [ ] Keyboard navigation funcional
- [ ] Contraste adecuado en todos colores

---

## XVI. CONCLUSIÓN: LA EXPERIENCIA COMO DIFERENCIADOR

KLEOS Insight no es solo un producto de IA.

Es una **experiencia de descubrimiento**.

Cada pixel, cada animación, cada palabra está diseñada para comunicar:

- **Inteligencia:** Datos precisos, visualización clara
- **Sofisticación:** Lujo digital, minimalismo estratégico
- **Confianza:** Claridad extrema, profesionalismo
- **Poder:** Silencio elegante, autoridad visual

El usuario debe sentir que está trabajando con consultores de élite, no con un software genérico.

La experiencia visual hace que el producto **se sienta valioso antes de generar valor**.

---

**Documento de Diseño Completado**
**KLEOS INSIGHT™ — Experience Design System v1.0**
**Creado: 10 de junio, 2026**
