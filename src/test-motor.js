document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const isTest = urlParams.get('test') === 'true';

    // FASE 2: Consultar al servidor usando el Token (Cero LocalStorage)
    if (token) {
        try {
            const response = await fetch('/api/get-reading', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token })
            });

            const data = await response.json();

            if (data.success && data.reading) {
                inyectarDatosPrueba({ serverData: data.reading });
            } else {
                mostrarErrorAcceso();
            }
        } catch (err) {
            console.error(err);
            mostrarErrorAcceso();
        }
        return;
    }

    // Mantenemos esto temporalmente solo por si quieres probar "a la fuerza" sin token en local
    if (isTest) {
        setTimeout(() => inyectarDatosPrueba({ fallbackLocal: true }), 300);
        return;
    }

    mostrarErrorAcceso();
});

function mostrarErrorAcceso() {
    document.body.innerHTML = '';
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = "display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #000; color: #F5F5F5; font-family: 'Inter', sans-serif;";
    errorDiv.innerHTML = `
        <h2 style="font-family: 'Playfair Display', serif; font-size: 2.2rem; color: #C5A059; margin-bottom: 1rem; font-weight: 400;">Sesión Expirada</h2>
        <p style="color: rgba(255,255,255,0.6); margin-bottom: 2.5rem; text-align: center; line-height: 1.6;">Su token de acceso es inválido o ha caducado.<br>Por seguridad, los accesos deben generarse desde su Portal KLEOS.</p>
        <button onclick="window.location.href='portal.html'" style="background: #C5A059; color: #000; padding: 1rem 2rem; border-radius: 100px; border: none; font-weight: 600; cursor: pointer; font-size: 0.95rem; font-family: 'Inter', sans-serif;">Volver al Portal</button>
    `;
    document.body.appendChild(errorDiv);
}

function inyectarDatosPrueba({ serverData = null, fallbackLocal = false }) {
    let raw = null;
    if (serverData) {
        raw = serverData;
    } else if (fallbackLocal) {
        try { raw = JSON.parse(localStorage.getItem('kleos_kip001_result') || '{}'); } catch(e) {}
    }

    if (!raw) raw = {}; 
    
    // 1. KPI Principales
    const idxVal = raw.kleosIndex || raw.index || "63";
    const rawLvl = raw.perceptionLevel || (raw.level ? raw.level.name : "NIVEL II — PERCEPCIÓN DIFUSA");
    const lvlVal = rawLvl.split("—")[1] ? rawLvl.split("—")[1].trim().toUpperCase() : rawLvl.toUpperCase();
    
    // Asumimos Diferenciación como default si no viene prescripción
    const dimVal = raw.prescription ? raw.prescription.dimension.toUpperCase() : "DIFERENCIACIÓN";
    
    const dimList = raw.dimensions || [];
    let dimScore = "8";
    if (dimList.length > 0) {
        const sorted = [...dimList].sort((a,b) => a.score - b.score);
        dimScore = sorted[0].score.toString();
    }

    const vI = document.getElementById("val-indice"); if(vI) vI.textContent = idxVal;
    const lI = document.getElementById("lbl-indice"); if(lI) lI.textContent = lvlVal;
    const vP = document.getElementById("val-performance"); if(vP) vP.textContent = "72";
    const vB = document.getElementById("val-brecha"); if(vB) vB.textContent = "37";
    const vC = document.getElementById("val-critica"); if(vC) vC.textContent = dimScore;
    const lC = document.getElementById("lbl-critica"); if(lC) lC.textContent = dimVal;
    const vPo = document.getElementById("val-potencial"); if(vPo) vPo.textContent = "42";

    // 2. Espejo de Percepción 
    let sPercep = ["Innovador", "Profesional", "Confiable"];
    let cPercep = ["Similar a opciones", "Poco claro", "Difícil comprender"];
    
    if (raw.respuestas) {
        if (raw.respuestas.self_perception) sPercep = String(raw.respuestas.self_perception).split(',');
        if (raw.respuestas.client_perception) cPercep = String(raw.respuestas.client_perception).split(',');
    }

    const listCrees = document.getElementById("list-crees");
    if(listCrees) {
        listCrees.innerHTML = sPercep.map(w => `<div class="kip-espejo-item"><span class="icon check">✓</span> ${w.trim()}</div>`).join('');
    }

    const listMercado = document.getElementById("list-mercado");
    if(listMercado) {
        listMercado.innerHTML = cPercep.map(w => `<div class="kip-espejo-item"><span class="icon cross">✕</span> ${w.trim()}</div>`).join('');
    }

    // 3. Fuga de Crecimiento
    const fugaTit = document.getElementById("fuga-titulo");
    if (fugaTit) fugaTit.textContent = dimVal;
    const fugaSc = document.getElementById("fuga-score");
    if (fugaSc) fugaSc.textContent = dimScore;
    const fugaDesc = document.getElementById("fuga-desc");
    if (fugaDesc) fugaDesc.textContent = raw.weakestFinding ? raw.weakestFinding.meaning : "Alto valor interno, baja tracción externa. El producto supera a su comunicación. El reto no es construir algo mejor, sino proyectar verdadera autoridad.";

    // 4. Perfil Estratégico (Radar con datos reales)
    if(dimList.length === 5) {
        const dmap = {};
        dimList.forEach(d => dmap[d.name.toLowerCase()] = d.score);
        
        const setRadar = (id, score) => {
            const fill = document.getElementById(`radar-${id}-fill`);
            const sc = document.getElementById(`radar-${id}-score`);
            if(fill) fill.style.width = Math.round((score/20)*100) + "%";
            if(sc) sc.textContent = `${score}/20`;
        };

        setRadar('claridad', dmap['comprensión'] || dmap['claridad'] || 15);
        setRadar('valor', dmap['autoridad'] || dmap['valor percibido'] || 14);
        setRadar('confianza', dmap['confianza'] || 13);
        setRadar('diferenciacion', dmap['diferenciación'] || dmap['diferenciacion'] || 8);
        setRadar('recorrido', dmap['conversión'] || dmap['recorrido de compra'] || 13);
    } else {
        if (document.getElementById("radar-claridad-fill")) document.getElementById("radar-claridad-fill").style.width = "75%";
        if (document.getElementById("radar-claridad-score")) document.getElementById("radar-claridad-score").textContent = "15/20";
        if (document.getElementById("radar-valor-fill")) document.getElementById("radar-valor-fill").style.width = "70%";
        if (document.getElementById("radar-valor-score")) document.getElementById("radar-valor-score").textContent = "14/20";
        if (document.getElementById("radar-confianza-fill")) document.getElementById("radar-confianza-fill").style.width = "65%";
        if (document.getElementById("radar-confianza-score")) document.getElementById("radar-confianza-score").textContent = "13/20";
        if (document.getElementById("radar-diferenciacion-fill")) document.getElementById("radar-diferenciacion-fill").style.width = "40%";
        if (document.getElementById("radar-diferenciacion-score")) document.getElementById("radar-diferenciacion-score").textContent = "8/20";
        if (document.getElementById("radar-recorrido-fill")) document.getElementById("radar-recorrido-fill").style.width = "65%";
        if (document.getElementById("radar-recorrido-score")) document.getElementById("radar-recorrido-score").textContent = "13/20";
    }

    const diagTxt = document.getElementById("diagnosis-text");
    if (diagTxt) diagTxt.textContent = raw.diagnosis || raw.mainDiagnosis || "Tu negocio presenta una base sólida de claridad, confianza y valor percibido. Sin embargo, la baja diferenciación está limitando el impacto del resto de tus fortalezas.";
    
    const insTxt = document.getElementById("insight-text");
    if (insTxt) insTxt.textContent = raw.insight || raw.insightDetected ? `"${raw.insight || raw.insightDetected}"` : '"La percepción de tu negocio es superior a su capacidad de diferenciarse."';

    // 5. Verdad Incómoda
    const verTit = document.getElementById("verdad-title");
    if (verTit) verTit.innerHTML = raw.truth || "El mercado no percibe el valor real de tu oferta.";
    const verBod = document.getElementById("verdad-body");
    if (verBod) verBod.innerHTML = "Compites en desventaja. El problema no radica en el producto, sino en su envoltura estratégica. Ante la ausencia de un diferencial claro, tu cliente decide por precio.";
    const verCon = document.getElementById("verdad-consecuencia");
    if (verCon) verCon.innerHTML = "<strong>CONSECUENCIA OPERATIVA:</strong><br>Fuga de capital hacia competidores de menor valor pero mayor claridad comercial.";

    // 6. Costo / Oportunidad
    const listCosto = document.getElementById("list-costo");
    if(listCosto) listCosto.innerHTML = `
        <li>Competirás cada vez más por precio.</li>
        <li>Los clientes seguirán comparándote con alternativas similares.</li>
        <li>Tu propuesta perderá fuerza frente a competidores mejor posicionados.</li>
    `;

    const listOportunidad = document.getElementById("list-oportunidad");
    if(listOportunidad) listOportunidad.innerHTML = `
        <li>Aumentarás el valor percibido de tu oferta.</li>
        <li>Reducirás la comparación directa con competidores.</li>
        <li>Facilitarás la decisión de compra sin depender de descuentos.</li>
    `;

    // 7. Prioridad
    const prioTit = document.getElementById("prioridad-title");
    if (prioTit) prioTit.textContent = (raw.prescription ? raw.prescription.cause : null) || raw.priorityNumberOne || "Redefinir la matriz de diferenciación.";
    
    const prioTxt = document.getElementById("prioridad-text");
    if (prioTxt) prioTxt.textContent = "Antes de escalar en difusión, asegura el mensaje. El mercado debe entender inmediatamente por qué elegirte es la única decisión lógica.";
    
    initTestCharts();
}

function initTestCharts() {
    const commonOptions = {
        cutout: '80%',
        responsive: true,
        maintainAspectRatio: false,
        plugins: { tooltip: { enabled: false }, legend: { display: false } }
    };
    
    if(typeof Chart !== 'undefined') {
        const ctxPerf = document.getElementById('chart-performance');
        if(ctxPerf) new Chart(ctxPerf, { type: 'doughnut', data: { datasets: [{ data: [72, 28], backgroundColor: ['#C5A059', 'rgba(255,255,255,0.05)'], borderWidth: 0, borderRadius: 20 }] }, options: commonOptions });
        
        const ctxBrecha = document.getElementById('chart-brecha');
        if(ctxBrecha) new Chart(ctxBrecha, { type: 'doughnut', data: { datasets: [{ data: [37, 63], backgroundColor: ['#C5A059', 'rgba(255,255,255,0.05)'], borderWidth: 0, borderRadius: 20 }] }, options: commonOptions });
        
        const ctxPotencial = document.getElementById('chart-potencial');
        if(ctxPotencial) new Chart(ctxPotencial, { type: 'doughnut', data: { datasets: [{ data: [42, 58], backgroundColor: ['#C5A059', 'rgba(255,255,255,0.05)'], borderWidth: 0, borderRadius: 20 }] }, options: commonOptions });
    }
}