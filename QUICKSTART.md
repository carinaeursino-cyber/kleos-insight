# KLEOS INSIGHT™ — Quick Start Guide

**Comienza en 5 minutos**

---

## ⚡ Inicio Rápido (sin API)

### 1. Clonar o descargar el proyecto

```bash
cd kleos-insight-v1
```

### 2. Abrir en navegador

**Opción A: VS Code + Live Server**
- Abre la carpeta en VS Code
- Instala extensión "Live Server"
- Click derecho en `src/index.html` → "Open with Live Server"
- Se abre en `http://127.0.0.1:5500`

**Opción B: Python**
```bash
cd src
python -m http.server 8000
# Abre http://localhost:8000
```

**Opción C: Node.js**
```bash
cd src
npx http-server
# Abre http://localhost:8080
```

### 3. Prueba el flujo completo

1. **Landing Page** → Click "Iniciar Diagnóstico"
2. **Preguntas** → Completa las 12 preguntas
3. **Análisis** → Verás barra de progreso animada
4. **Resultados** → Datos simulados realistas
5. **Acciones** → Descarga, comparte o nuevo análisis

✅ **¡Listo! MVP funcionando con datos simulados**

---

## 🔌 Conectar con Gemini API (Backend)

### Requisitos

- Node.js 18+
- API Key de Gemini (ver `docs/API_INTEGRATION.md`)

### Setup Backend

```bash
# 1. Crear carpeta backend
mkdir backend && cd backend

# 2. Inicializar
npm init -y

# 3. Instalar dependencias
npm install express cors dotenv @google/generative-ai express-rate-limit

# 4. Crear archivos (ver API_INTEGRATION.md)
# - server.js
# - services/geminiService.js
# - .env

# 5. Agregar .env
echo "GEMINI_API_KEY=tu-clave-aqui" > .env
echo "PORT=3001" >> .env
echo "NODE_ENV=development" >> .env
```

### Copiar código del servidor

Ver `docs/API_INTEGRATION.md` → Sección "Backend en Node.js"

### Ejecutar backend

```bash
npm install -g nodemon
nodemon server.js

# Backend corriendo en http://localhost:3001
```

### Actualizar frontend

En `src/assets/js/main.js`, cambiar endpoint:

```javascript
// Cambiar esta línea:
// this.analysisData = this.generateMockAnalysis();

// Por esta:
const response = await fetch('http://localhost:3001/api/analyze', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    companyName: this.userAnswers.company_name,
    // ... más campos
  })
});
```

### Abrir frontend

Mantén el backend corriendo y abre frontend en otro terminal:

```bash
cd src
python -m http.server 8000
# Abre http://localhost:8000
```

✅ **Ahora funciona con Gemini API en tiempo real**

---

## 📱 Estructura de Archivos

```
kleos-insight-v1/
├── src/
│   ├── index.html                 ← Abre AQUÍ
│   ├── README.md                  ← Documentación completa
│   ├── assets/
│   │   ├── css/styles.css        ← Diseño premium
│   │   └── js/main.js            ← Lógica JS
│   └── pages/                     ← (Para referencia)
├── design/
│   └── KLEOS_INSIGHT_Experience_Design.md  ← Especificación
├── docs/
│   └── API_INTEGRATION.md         ← Cómo integrar Gemini
├── backend/                       ← (Crear cuando necesites API)
│   ├── server.js
│   ├── services/
│   ├── .env
│   └── package.json
└── QUICKSTART.md                  ← Este archivo
```

---

## 🎯 Casos de Uso

### Para Demostración
✅ Abre `src/index.html` en navegador
- Datos simulados realistas
- Todas las animaciones funcionan
- Perfecto para showcases

### Para Desarrollo
✅ Usa Backend + Frontend
- Conéctalo a Gemini API
- Análisis reales basados en AI
- Guarda datos en base de datos

### Para Producción
✅ Deployment completo
- Backend en Heroku/Railway/Render
- Frontend en Netlify/Vercel
- BD en PostgreSQL/MongoDB
- Ver deployment guide en `docs/`

---

## 🎨 Personalización

### Cambiar Colores

En `src/assets/css/styles.css`:

```css
:root {
  --color-black: #050505;    /* Cambiar aquí */
  --color-gold: #C5A059;     /* Cambiar aquí */
  /* ... más colores */
}
```

### Cambiar Tipografía

```css
/* En styles.css, importar nuevas fuentes */
@import url('https://fonts.googleapis.com/css2?family=YOUR-FONT&display=swap');

/* Luego usar en --font-display, etc. */
```

### Cambiar Preguntas

En `src/index.html`, sección "Questions Form":

```html
<!-- Reemplazar preguntas existentes o agregar nuevas -->
<div class="form-group">
  <label>Pregunta X de 12</label>
  <h3>Tu pregunta aquí</h3>
  <input type="text" name="field_name" required>
</div>
```

### Cambiar Duración de Análisis

En `src/assets/js/main.js`, método `startAnalysis()`:

```javascript
// Cambiar velocidades
const interval = setInterval(() => { /* ... */ }, 300);  // Más rápido/lento
setTimeout(() => { /* ... */ }, 1000);  // Delay final
```

---

## 🐛 Troubleshooting

### "No se abre la página"
- ¿Puerto está ocupado? Cambia en comando http-server
- ¿Ruta correcta? Asegúrate que estás en `src/`

### "Las animaciones no funcionan"
- Abre DevTools (F12)
- ¿Errores en console? Chequeá paths CSS/JS
- ¿Navegador antiguo? Necesitas Chrome/Firefox reciente

### "No funciona el formulario"
- Completa TODAS las 12 preguntas
- Abre DevTools → Console → Ver errores
- Chequeá que `main.js` se cargó correctamente

### "Backend no conecta"
- ¿Backend está corriendo? (`npm start`)
- ¿PORT correcto? (Default 3001)
- ¿CORS habilitado en backend?
- URL en frontend: `http://localhost:3001`

### "Gemini API error"
- ¿API Key válida en `.env`?
- ¿API habilitada en Google Cloud?
- ¿Límite de cuota alcanzado?
- Ver `docs/API_INTEGRATION.md` → Sección Errores

---

## 📊 Demo Data

El MVP incluye datos simulados realistas:

```javascript
// Análisis simulado
{
  mainInsight: 98,
  mainInsightText: "De cada 100 clientes, 98 no comprenden tu diferenciador",
  confidence: 94,
  perception: {
    marketPerception: ['Premium', 'Costoso', 'Exclusivo', ...],
    businessReality: ['Innovador', 'Accesible', 'Confiable', ...]
  },
  dimensions: [
    { name: 'Calidad vs Precio', score: 65, trend: '+12%' },
    ...
  ],
  recommendations: [
    { priority: 'P1', title: '...', impact: '↑ 34%', ... },
    ...
  ]
}
```

Perfecto para pruebas sin API conectada.

---

## 🔐 Checklist Pre-Producción

- [ ] Validar todos los campos del formulario
- [ ] Implementar autenticación en backend
- [ ] Usar HTTPS en todas las conexiones
- [ ] Rate limiting configurado
- [ ] Logs y monitoreo activos
- [ ] Error handling robusto
- [ ] CORS policies correctas
- [ ] API Key segura (env vars, nunca en código)
- [ ] Base de datos para persistencia
- [ ] Plan de respaldo/recovery
- [ ] Testing automatizado
- [ ] Performance optimizado

---

## 📈 Métricas de Éxito

```
Page Load Time:      < 2s
First Paint:         < 500ms
Largest Paint:       < 1.5s
Form Submission:     < 100ms
API Response:        < 3s (con Gemini)
Mobile Score:        > 90
Accessibility:       > 95
```

---

## 🚀 Próximos Pasos

### Corto Plazo (Esta semana)
- [ ] Conectar Gemini API
- [ ] Implementar autenticación básica
- [ ] Agregar persistencia de datos

### Mediano Plazo (Este mes)
- [ ] Dashboard de historial
- [ ] PDF descargables
- [ ] Exportar a PowerPoint
- [ ] Analytics

### Largo Plazo (Este año)
- [ ] Modelos personalizados
- [ ] Colaboración en tiempo real
- [ ] Marketplace de insights
- [ ] Integración con CRM/HubSpot

---

## 📚 Documentación Completa

- **Design System:** `design/KLEOS_INSIGHT_Experience_Design.md`
- **API Integration:** `docs/API_INTEGRATION.md`
- **Full README:** `src/README.md`

---

## 💬 Soporte Rápido

### ¿Qué es KLEOS INSIGHT™?
Plataforma que detecta qué percepciones limitan el crecimiento de un negocio usando IA.

### ¿Cómo funciona?
1. Usuario responde 12 preguntas
2. Backend procesa con Gemini API
3. Genera análisis con recomendaciones
4. Usuario descarga reporte

### ¿Necesito backend?
**No** para demo (datos simulados)
**Sí** para análisis reales (con Gemini API)

### ¿Qué es el "Gap de Percepción"?
La diferencia entre cómo el mercado percibe tu empresa vs. lo que realmente eres.

---

## ✅ Lista de Verificación

- [ ] Descargué el proyecto
- [ ] Abrí `src/index.html` en navegador
- [ ] Completé el flujo completo
- [ ] Vi datos simulados realistas
- [ ] Descargué reporte
- [ ] Leí documentación completa
- [ ] Entiendo arquitectura
- [ ] Listo para backend (opcional)

---

**¡Empecemos! 🚀**

```bash
# Clonar/descargar
cd kleos-insight-v1/src

# Abrir
python -m http.server 8000

# Luego en navegador:
# http://localhost:8000
```

**KLEOS INSIGHT™ — Where Perception Meets Strategy**
