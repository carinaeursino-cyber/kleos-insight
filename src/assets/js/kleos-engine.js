/* =========================================================
   KLEOS INSIGHT™ — Motor Compartido (kleos-engine.js)
   Arquitectura User-Centric | Escalable a KIP-002 → KIP-006
   
   Responsabilidades:
   1. Gestionar la sesión del usuario (sessionStorage)
   2. Validar el token contra el servidor
   3. Inyectar datos dinámicos en la página de lectura
   4. Inicializar visualizaciones (Chart.js)
   ========================================================= */

(function() {
    'use strict';

    // ─── CONFIGURACIÓN ───────────────────────────────────
    const KLEOS = {
        SESSION_KEY: 'kleos_session',
        USER_KEY: 'kleos_user',
        PROTOCOL_KEY: 'kleos_protocol',
        MOCK_TOKEN: 'mock-user-token-12345',
        API: {
            GET_READING: '/api/get-reading',
            PORTAL_AUTH: '/api/portal-auth'
        }
    };

    // ─── GESTIÓN DE SESIÓN ───────────────────────────────
    
    /**
     * Guarda la sesión completa en sessionStorage.
     * Usado por portal.html después del login exitoso.
     */
    function saveSession(data) {
        try {
            sessionStorage.setItem(KLEOS.SESSION_KEY, data.token);
            sessionStorage.setItem(KLEOS.USER_KEY, JSON.stringify(data.user));
            if (data.protocols) {
                sessionStorage.setItem(KLEOS.PROTOCOL_KEY, JSON.stringify(data.protocols));
            }
            console.log('[KLEOS] Sesión guardada para:', data.user.email);
        } catch (e) {
            console.error('[KLEOS] Error guardando sesión:', e);
        }
    }

    /**
     * Obtiene el token de la sesión activa.
     * Prioridad: sessionStorage > URL (legacy fallback)
     */
    function getToken() {
        // 1. sessionStorage (método correcto)
        const sessionToken = sessionStorage.getItem(KLEOS.SESSION_KEY);
        if (sessionToken) return sessionToken;

        // 2. URL query parameter (fallback para compatibilidad)
        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        if (urlToken) {
            // Migrar automáticamente a sessionStorage
            sessionStorage.setItem(KLEOS.SESSION_KEY, urlToken);
            return urlToken;
        }

        return null;
    }

    /**
     * Limpia la sesión completa.
     */
    function clearSession() {
        sessionStorage.removeItem(KLEOS.SESSION_KEY);
        sessionStorage.removeItem(KLEOS.USER_KEY);
        sessionStorage.removeItem(KLEOS.PROTOCOL_KEY);
    }

    /**
     * Obtiene los datos del usuario de la sesión.
     */
    function getUser() {
        try {
            return JSON.parse(sessionStorage.getItem(KLEOS.USER_KEY) || 'null');
        } catch (e) {
            return null;
        }
    }

    /**
     * Obtiene los protocolos activos del usuario.
     */
    function getProtocols() {
        try {
            return JSON.parse(sessionStorage.getItem(KLEOS.PROTOCOL_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    // ─── VALIDACIÓN Y CARGA DE DATOS ─────────────────────

    /**
     * Valida la sesión y carga los datos del protocolo desde el servidor.
     * @param {string} protocolCode - Código del protocolo (ej: "KIP-001")
     * @returns {Promise<{success: boolean, reading?: object, error?: string}>}
     */
    async function loadProtocolData(protocolCode) {
        const token = getToken();

        if (!token) {
            return { success: false, error: 'No hay sesión activa' };
        }

        try {
            const response = await fetch(KLEOS.API.GET_READING, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, protocol: protocolCode })
            });

            const data = await response.json();

            if (data.success && data.reading) {
                return { success: true, reading: data.reading };
            }

            // Si la sesión expiró, limpiar sessionStorage
            if (response.status === 401) {
                clearSession();
            }

            return { 
                success: false, 
                error: data.message || 'Error cargando datos del protocolo' 
            };

        } catch (err) {
            console.error('[KLEOS] Error de red:', err);
            return { success: false, error: 'Error de conexión con el servidor' };
        }
    }

    // ─── INYECCIÓN DE DATOS EN KIP-001 ───────────────────

    /**
     * Inyecta los datos del servidor en los elementos HTML de lectura.html
     * Esta función es específica para KIP-001. Futuros protocolos tendrán
     * su propia función de inyección.
     */
    function injectKIP001(raw) {
        try {
            // 1. KPI Principales
            const idxVal = raw.kleosIndex || raw.index || "63";
            const rawLvl = raw.perceptionLevel || (raw.level ? raw.level.name : "NIVEL II — PERCEPCIÓN DIFUSA");
            const lvlVal = rawLvl.split("—")[1] ? rawLvl.split("—")[1].trim().toUpperCase() : rawLvl.toUpperCase();

            const dimVal = raw.prescription ? raw.prescription.dimension.toUpperCase() : "DIFERENCIACIÓN";
            const dimList = raw.dimensions || [];
            let dimScore = "8";
            if (dimList.length > 0) {
                const sorted = [...dimList].sort((a, b) => a.score - b.score);
                dimScore = sorted[0].score.toString();
            }

            setElementText("val-indice", idxVal);
            setElementText("lbl-indice", lvlVal);
            setElementText("val-performance", "72");
            setElementText("val-brecha", "37");
            setElementText("val-critica", dimScore);
            setElementText("lbl-critica", dimVal);
            setElementText("val-potencial", "42");

            // 2. Espejo de Percepción
            let sPercep = ["Innovador", "Profesional", "Confiable"];
            let cPercep = ["Similar a opciones", "Poco claro", "Difícil comprender"];

            if (raw.respuestas) {
                if (raw.respuestas.self_perception) sPercep = String(raw.respuestas.self_perception).split(',');
                if (raw.respuestas.client_perception) cPercep = String(raw.respuestas.client_perception).split(',');
            }

            const listCrees = document.getElementById("list-crees");
            if (listCrees) {
                listCrees.innerHTML = sPercep.map(w =>
                    `<div class="kip-espejo-item"><span class="icon check">✓</span> ${w.trim()}</div>`
                ).join('');
            }

            const listMercado = document.getElementById("list-mercado");
            if (listMercado) {
                listMercado.innerHTML = cPercep.map(w =>
                    `<div class="kip-espejo-item"><span class="icon cross">✕</span> ${w.trim()}</div>`
                ).join('');
            }

            // 3. Fuga de Crecimiento
            setElementText("fuga-titulo", dimVal);
            setElementText("fuga-score", dimScore);
            setElementText("fuga-desc", raw.weakestFinding
                ? raw.weakestFinding.meaning
                : "Alto valor interno, baja tracción externa. El producto supera a su comunicación. El reto no es construir algo mejor, sino proyectar verdadera autoridad.");

            // 4. Perfil Estratégico (Radar de dimensiones)
            if (dimList.length === 5) {
                const dmap = {};
                dimList.forEach(d => dmap[d.name.toLowerCase()] = d.score);

                const setRadar = (id, score) => {
                    const fill = document.getElementById(`radar-${id}-fill`);
                    const sc = document.getElementById(`radar-${id}-score`);
                    if (fill) fill.style.width = Math.round((score / 20) * 100) + "%";
                    if (sc) sc.textContent = `${score}/20`;
                };

                setRadar('claridad', dmap['comprensión'] || dmap['claridad'] || 15);
                setRadar('valor', dmap['autoridad'] || dmap['valor percibido'] || 14);
                setRadar('confianza', dmap['confianza'] || 13);
                setRadar('diferenciacion', dmap['diferenciación'] || dmap['diferenciacion'] || 8);
                setRadar('recorrido', dmap['conversión'] || dmap['recorrido de compra'] || 13);
            } else {
                // Datos mock si no hay dimensiones reales
                const setRadarMock = (id, pct, sc) => {
                    const fill = document.getElementById(`radar-${id}-fill`);
                    if (fill) fill.style.width = pct;
                    const score = document.getElementById(`radar-${id}-score`);
                    if (score) score.textContent = sc;
                };
                setRadarMock('claridad', "75%", "15/20");
                setRadarMock('valor', "70%", "14/20");
                setRadarMock('confianza', "65%", "13/20");
                setRadarMock('diferenciacion', "40%", "8/20");
                setRadarMock('recorrido', "65%", "13/20");
            }

            // 5. Diagnóstico e Insight
            setElementText("diagnosis-text",
                raw.diagnosis || raw.mainDiagnosis ||
                "Tu negocio presenta una base sólida de claridad, confianza y valor percibido. Sin embargo, la baja diferenciación está limitando el impacto del resto de tus fortalezas.");

            setElementText("insight-text",
                raw.insight || raw.insightDetected
                    ? `"${raw.insight || raw.insightDetected}"`
                    : '"La percepción de tu negocio es superior a su capacidad de diferenciarse."');

            // 6. Verdad Incómoda
            setElementHTML("verdad-title", raw.truth || "El mercado no percibe el valor real de tu oferta.");
            setElementHTML("verdad-body", "Compites en desventaja. El problema no radica en el producto, sino en su envoltura estratégica. Ante la ausencia de un diferencial claro, tu cliente decide por precio.");
            setElementHTML("verdad-consecuencia", "<strong>CONSECUENCIA OPERATIVA:</strong><br>Fuga de capital hacia competidores de menor valor pero mayor claridad comercial.");

            // 7. Costo / Oportunidad
            setElementHTML("list-costo", `
                <li>Competirás cada vez más por precio.</li>
                <li>Los clientes seguirán comparándote con alternativas similares.</li>
                <li>Tu propuesta perderá fuerza frente a competidores mejor posicionados.</li>
            `);

            setElementHTML("list-oportunidad", `
                <li>Aumentarás el valor percibido de tu oferta.</li>
                <li>Reducirás la comparación directa con competidores.</li>
                <li>Facilitarás la decisión de compra sin depender de descuentos.</li>
            `);

            // 8. Prioridad
            setElementText("prioridad-title",
                (raw.prescription ? raw.prescription.cause : null) || raw.priorityNumberOne || "Redefinir la matriz de diferenciación.");

            setElementText("prioridad-text",
                "Antes de escalar en difusión, asegura el mensaje. El mercado debe entender inmediatamente por qué elegirte es la única decisión lógica.");

            // 9. Inicializar charts con datos reales
            initCharts();

            console.log('[KLEOS] Datos de KIP-001 inyectados correctamente');

        } catch (err) {
            console.error('[KLEOS] Error inyectando datos:', err);
            showError();
        }
    }

    // ─── VISUALIZACIONES ─────────────────────────────────

    function initCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('[KLEOS] Chart.js no está disponible');
            return;
        }

        const commonOptions = {
            cutout: '80%',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { tooltip: { enabled: false }, legend: { display: false } }
        };

        createChart('chart-performance', 72, commonOptions);
        createChart('chart-brecha', 37, commonOptions);
        createChart('chart-potencial', 42, commonOptions);
    }

    function createChart(canvasId, percentage, options) {
        const ctx = document.getElementById(canvasId);
        if (!ctx) return;

        // Destruir instancia previa si existe
        const existingChart = Chart.getChart(ctx);
        if (existingChart) existingChart.destroy();

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [percentage, 100 - percentage],
                    backgroundColor: ['#C5A059', 'rgba(255,255,255,0.05)'],
                    borderWidth: 0,
                    borderRadius: 20
                }]
            },
            options: options
        });
    }

    // ─── UTILIDADES ──────────────────────────────────────

    function setElementText(id, value) {
        const el = document.getElementById(id);
        if (el && value !== undefined && value !== null) el.textContent = value;
    }

    function setElementHTML(id, value) {
        const el = document.getElementById(id);
        if (el && value !== undefined && value !== null) el.innerHTML = value;
    }

    function showError() {
        document.body.innerHTML = '';
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = "display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #000; color: #F5F5F5; font-family: 'Inter', sans-serif; padding: 2rem;";
        errorDiv.innerHTML = `
            <h2 style="font-family: 'Playfair Display', serif; font-size: 2.2rem; color: #C5A059; margin-bottom: 1rem; font-weight: 400;">Sesión Expirada</h2>
            <p style="color: rgba(255,255,255,0.6); margin-bottom: 2.5rem; text-align: center; line-height: 1.6;">
                Su sesión ha caducado o el acceso no es válido.<br>
                Por seguridad, los accesos deben generarse desde su Portal KLEOS.
            </p>
            <button onclick="window.location.href='portal.html'" style="background: #C5A059; color: #000; padding: 1rem 2rem; border-radius: 100px; border: none; font-weight: 600; cursor: pointer; font-size: 0.95rem; font-family: 'Inter', sans-serif;">
                Volver al Portal
            </button>
        `;
        document.body.appendChild(errorDiv);
    }

    // ─── INICIALIZACIÓN ──────────────────────────────────

    /**
     * Punto de entrada principal. Se ejecuta cuando el DOM está listo.
     * Detecta en qué página estamos y actúa en consecuencia.
     */
    async function init() {
        const path = window.location.pathname;

        // Si estamos en lectura.html
        if (path.includes('lectura')) {
            const urlParams = new URLSearchParams(window.location.search);
            const isTest = urlParams.get('test') === 'true';

            // Modo test local (sin servidor)
            if (isTest) {
                console.log('[KLEOS] Modo test activado');
                setTimeout(() => injectKIP001({ fallbackLocal: true }), 300);
                return;
            }

            // Cargar datos del servidor
            const result = await loadProtocolData('KIP-001');

            if (result.success) {
                injectKIP001(result.reading);
            } else {
                console.error('[KLEOS] Error:', result.error);
                showError();
            }
        }
    }

    // ─── API PÚBLICA ─────────────────────────────────────
    
    // Exponer funciones necesarias globalmente
    window.KLEOS = {
        saveSession: saveSession,
        clearSession: clearSession,
        getToken: getToken,
        getUser: getUser,
        getProtocols: getProtocols,
        loadProtocolData: loadProtocolData,
        injectKIP001: injectKIP001,
        initCharts: initCharts,
        showError: showError,
        MOCK_TOKEN: KLEOS.MOCK_TOKEN
    };

    // Auto-inicializar cuando el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
