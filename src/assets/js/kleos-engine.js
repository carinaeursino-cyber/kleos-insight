/* =========================================================
   KLEOS INSIGHT™ — Motor Compartido (kleos-engine.js)
   ARQUITECTURA v2: Protocol-Agnostic + User-Centric
   
   Responsabilidades:
   1. Gestionar la sesión del usuario (sessionStorage)
   2. Validar el token contra el servidor
   3. Inyectar datos dinámicos en la página de lectura
   4. Inyectar contenido del informe IA (si purchased)
   5. Inicializar visualizaciones (Chart.js)
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
    
    function saveSession(data) {
        try {
            localStorage.setItem(KLEOS.SESSION_KEY, data.token);
            localStorage.setItem(KLEOS.USER_KEY, JSON.stringify(data.user));
            if (data.protocols) {
                localStorage.setItem(KLEOS.PROTOCOL_KEY, JSON.stringify(data.protocols));
            }
            // NUEVO v2: Guardar estado de protocolos si existe
            if (data.protocolsState) {
                localStorage.setItem('kleos_protocols_state', JSON.stringify(data.protocolsState));
            }
            console.log('[KLEOS] Sesión guardada para:', data.user.email);
        } catch (e) {
            console.error('[KLEOS] Error guardando sesión:', e);
        }
    }

    function getToken() {
        const sessionToken = localStorage.getItem(KLEOS.SESSION_KEY);
        if (sessionToken) return sessionToken;

        const urlParams = new URLSearchParams(window.location.search);
        const urlToken = urlParams.get('token');
        if (urlToken) {
            localStorage.setItem(KLEOS.SESSION_KEY, urlToken);
            return urlToken;
        }

        return null;
    }

    function clearSession() {
        localStorage.removeItem(KLEOS.SESSION_KEY);
        localStorage.removeItem(KLEOS.USER_KEY);
        localStorage.removeItem(KLEOS.PROTOCOL_KEY);
        localStorage.removeItem('kleos_protocols_state');
    }

    function getUser() {
        try {
            return JSON.parse(localStorage.getItem(KLEOS.USER_KEY) || 'null');
        } catch (e) {
            return null;
        }
    }

    function getProtocols() {
        try {
            return JSON.parse(localStorage.getItem(KLEOS.PROTOCOL_KEY) || '[]');
        } catch (e) {
            return [];
        }
    }

    // ─── VALIDACIÓN Y CARGA DE DATOS ─────────────────────

    /**
     * Valida la sesión y carga los datos del protocolo desde el servidor.
     * NUEVO v2: También devuelve purchased y ai_report
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
                return {
                    success: true,
                    reading: data.reading,
                    purchased: data.purchased || false,
                    ai_report: data.ai_report || null
                };
            }

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
     * Inyecta los datos del servidor en los elementos HTML de lectura.html.
     * NUEVO v2: Recibe ai_report y lo inyecta si existe.
     */
    function injectKIP001(raw, aiReport) {
        try {
            // 1. KPI Principales
            const idxVal = raw.kleosIndex || raw.index || "--";
            const rawLvl = raw.perceptionLevel || (raw.level ? raw.level.name : "NIVEL II — PERCEPCIÓN DIFUSA");
            const lvlVal = rawLvl.split("—")[1] ? rawLvl.split("—")[1].trim().toUpperCase() : rawLvl.toUpperCase();

            const dimVal = raw.prescription ? raw.prescription.dimension.toUpperCase() : "DIFERENCIACIÓN";
            const dimList = raw.dimensions || [];
            let dimScore = "--";
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
            
            // Si hay informe IA, usar leak_description; si no, usar fallback
            if (aiReport && aiReport.leak_description) {
                setElementText("fuga-desc", aiReport.leak_description);
            } else {
                setElementText("fuga-desc", raw.weakestFinding
                    ? raw.weakestFinding.meaning
                    : "Alto valor interno, baja tracción externa. El producto supera a su comunicación. El reto no es construir algo mejor, sino proyectar verdadera autoridad.");
            }

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

            // 5. Diagnóstico e Insight (datos básicos)
            setElementText("diagnosis-text",
                raw.diagnosis || raw.mainDiagnosis ||
                "Tu negocio presenta una base sólida de claridad, confianza y valor percibido. Sin embargo, la baja diferenciación está limitando el impacto del resto de tus fortalezas.");

            setElementText("insight-text",
                raw.insight || raw.insightDetected
                    ? `"${raw.insight || raw.insightDetected}"`
                    : '"La percepción de tu negocio es superior a su capacidad de diferenciarse."');

            // 6. Prioridad (datos básicos)
            setElementText("prioridad-title",
                (raw.prescription ? raw.prescription.cause : null) || raw.priorityNumberOne || "Redefinir la matriz de diferenciación.");

            setElementText("prioridad-text",
                "Antes de escalar en difusión, asegura el mensaje. El mercado debe entender inmediatamente por qué elegirte es la única decisión lógica.");

            // 7. Inicializar charts
            initCharts();

            console.log('[KLEOS] Datos básicos de KIP-001 inyectados');

            // 8. NUEVO v2: Inyectar informe IA si existe
            if (aiReport) {
                injectAIReport(aiReport);
            }

        } catch (err) {
            console.error('[KLEOS] Error inyectando datos:', err);
            showError();
        }
    }

    // ─── NUEVO v2: INYECCIÓN DE INFORME IA ───────────────

    /**
     * Inyecta el contenido del informe IA en las secciones premium.
     * Solo se ejecuta si el usuario compró el protocolo.
     */
    function injectAIReport(report) {
        console.log('[KLEOS] Inyectando informe IA...');

        try {
            // Verdad Incómoda
            if (report.truth_title) setElementText("ai-truth-title", report.truth_title);
            if (report.truth_body) setElementText("ai-truth-body", report.truth_body);
            if (report.truth_consequence) setElementText("ai-truth-consequence", report.truth_consequence);

            // Costo de la Inacción
            if (report.cost_items && Array.isArray(report.cost_items)) {
                const listCosto = document.getElementById("ai-cost-list");
                if (listCosto) {
                    listCosto.innerHTML = report.cost_items.map(item =>
                        `<li>${item}</li>`
                    ).join('');
                }
            }

            // Ventana de Oportunidad
            if (report.opportunity_items && Array.isArray(report.opportunity_items)) {
                const listOp = document.getElementById("ai-opportunity-list");
                if (listOp) {
                    listOp.innerHTML = report.opportunity_items.map(item =>
                        `<li>${item}</li>`
                    ).join('');
                }
            }

            // Diagnóstico Ejecutivo (reemplaza el básico si existe)
            if (report.diagnosis_executive) {
                setElementText("diagnosis-text", report.diagnosis_executive);
            }

            // Insight Principal (reemplaza el básico si existe)
            if (report.insight_main) {
                setElementText("insight-text", `"${report.insight_main}"`);
            }

            // Prioridad #1 (descripción expandida)
            if (report.priority_description) {
                setElementText("prioridad-text", report.priority_description);
            }

            // Mostrar secciones premium (quitar estado bloqueado)
            unlockPremiumSections();

            console.log('[KLEOS] ✓ Informe IA inyectado correctamente');

        } catch (err) {
            console.error('[KLEOS] Error inyectando informe IA:', err);
        }
    }

    /**
     * Desbloquea las secciones premium quitando clases de bloqueo.
     */
    function unlockPremiumSections() {
        const lockedElements = document.querySelectorAll('.premium-locked');
        lockedElements.forEach(el => {
            el.classList.remove('premium-locked');
            el.classList.add('premium-unlocked');
        });

        // Ocultar CTA de compra si existe
        const ctaPurchase = document.getElementById('cta-purchase');
        if (ctaPurchase) {
            ctaPurchase.style.display = 'none';
        }

        console.log('[KLEOS] ✓ Secciones premium desbloqueadas');
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

    async function init() {
        const path = window.location.pathname;

        if (path.includes('lectura')) {
            const urlParams = new URLSearchParams(window.location.search);
            const isTest = urlParams.get('test') === 'true';

            if (isTest) {
                console.log('[KLEOS] Modo test activado');
                setTimeout(() => injectKIP001({ fallbackLocal: true }, null), 300);
                return;
            }

            const result = await loadProtocolData('KIP-001');

            if (result.success) {
                injectKIP001(result.reading, result.ai_report);
            } else {
                console.error('[KLEOS] Error:', result.error);
                showError();
            }
        }
    }

    // ─── API PÚBLICA ─────────────────────────────────────
    
    window.KLEOS = {
        saveSession: saveSession,
        clearSession: clearSession,
        getToken: getToken,
        getUser: getUser,
        getProtocols: getProtocols,
        loadProtocolData: loadProtocolData,
        injectKIP001: injectKIP001,
        injectAIReport: injectAIReport,
        initCharts: initCharts,
        showError: showError,
        MOCK_TOKEN: KLEOS.MOCK_TOKEN
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
