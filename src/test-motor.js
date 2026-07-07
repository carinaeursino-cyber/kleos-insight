document.addEventListener("DOMContentLoaded", () => {
    // Inject testing button
    const btn = document.createElement("button");
    btn.innerHTML = "🧪 SIMULAR RESULTADOS (TEST)";
    btn.style.cssText = "position: fixed; bottom: 20px; right: 20px; z-index: 9999; background: #D95B4F; color: white; border: none; padding: 10px 20px; border-radius: 100px; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: bold; cursor: pointer; box-shadow: 0 4px 15px rgba(0,0,0,0.5);";
    document.body.appendChild(btn);

    // Auto-inject if ?test=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('test') === 'true') {
        setTimeout(() => inyectarDatosPrueba(true), 300);
        btn.remove();
    }

    btn.addEventListener("click", () => {
        inyectarDatosPrueba(false);
        btn.innerHTML = "✅ DATOS INYECTADOS";
        btn.style.background = "#D4A24E";
        setTimeout(() => btn.remove(), 3000);
    });
});

function inyectarDatosPrueba(fromStorage = false) {
    let savedData = null;
    if(fromStorage) {
        try {
            const raw = localStorage.getItem('kleos_kip001_result');
            if(raw) savedData = JSON.parse(raw);
        } catch(e) {}
    }

    // 1. KPI Principales
    const idxVal = savedData ? savedData.index : "63";
    const lvlVal = savedData ? savedData.level.name.toUpperCase() : "MEDIO";
    const dimVal = savedData && savedData.prescription ? savedData.prescription.dimension.toUpperCase() : "DIFERENCIACIÓN";
    const dimScore = savedData && savedData.weakestFinding ? "8" : "8"; 

    const vI = document.getElementById("val-indice");
    if(vI) vI.textContent = idxVal;
    
    const lI = document.getElementById("lbl-indice");
    if(lI) lI.textContent = lvlVal;
    
    const vP = document.getElementById("val-performance");
    if(vP) vP.textContent = "72";
    
    const vB = document.getElementById("val-brecha");
    if(vB) vB.textContent = "37";
    
    const vC = document.getElementById("val-critica");
    if(vC) vC.textContent = dimScore;
    
    const lC = document.getElementById("lbl-critica");
    if(lC) lC.textContent = dimVal;
    
    const vPo = document.getElementById("val-potencial");
    if(vPo) vPo.textContent = "42";

    // 2. Espejo de Percepción
    const listCrees = document.getElementById("list-crees");
    if(listCrees) listCrees.innerHTML = `
        <div class="kip-espejo-item"><span class="icon check">✓</span> Innovador</div>
        <div class="kip-espejo-item"><span class="icon check">✓</span> Profesional</div>
        <div class="kip-espejo-item"><span class="icon check">✓</span> Confiable</div>
        <div class="kip-espejo-item"><span class="icon check">✓</span> Comprometido</div>
    `;

    const listMercado = document.getElementById("list-mercado");
    if(listMercado) listMercado.innerHTML = `
        <div class="kip-espejo-item"><span class="icon cross">✕</span> Similar a otras opciones</div>
        <div class="kip-espejo-item"><span class="icon cross">✕</span> Poco diferenciado</div>
        <div class="kip-espejo-item"><span class="icon cross">✕</span> Difícil de comprender</div>
        <div class="kip-espejo-item"><span class="icon cross">✕</span> Comunicación poco clara</div>
    `;

    // 3. Fuga de Crecimiento
    const fugaTit = document.getElementById("fuga-titulo");
    if (fugaTit) fugaTit.textContent = dimVal;
    const fugaSc = document.getElementById("fuga-score");
    if (fugaSc) fugaSc.textContent = dimScore;
    const fugaDesc = document.getElementById("fuga-desc");
    if (fugaDesc) fugaDesc.textContent = savedData && savedData.weakestFinding ? savedData.weakestFinding.meaning : "Alto valor interno, baja tracción externa. El producto supera a su comunicación. El reto no es construir algo mejor, sino proyectar verdadera autoridad.";

    // 4. Perfil Estratégico (Radar)
    const rcFill = document.getElementById("radar-claridad-fill");
    if (rcFill) rcFill.style.width = "75%";
    const rcSc = document.getElementById("radar-claridad-score");
    if (rcSc) rcSc.textContent = "15/20";
    
    const rvFill = document.getElementById("radar-valor-fill");
    if (rvFill) rvFill.style.width = "70%";
    const rvSc = document.getElementById("radar-valor-score");
    if (rvSc) rvSc.textContent = "14/20";
    
    const rcoFill = document.getElementById("radar-confianza-fill");
    if (rcoFill) rcoFill.style.width = "65%";
    const rcoSc = document.getElementById("radar-confianza-score");
    if (rcoSc) rcoSc.textContent = "13/20";
    
    const rdFill = document.getElementById("radar-diferenciacion-fill");
    if (rdFill) rdFill.style.width = "40%";
    const rdSc = document.getElementById("radar-diferenciacion-score");
    if (rdSc) rdSc.textContent = "8/20";
    
    const rrFill = document.getElementById("radar-recorrido-fill");
    if (rrFill) rrFill.style.width = "65%";
    const rrSc = document.getElementById("radar-recorrido-score");
    if (rrSc) rrSc.textContent = "13/20";

    const diagTxt = document.getElementById("diagnosis-text");
    if (diagTxt) diagTxt.textContent = savedData ? savedData.diagnosis : "Tu negocio presenta una base sólida de claridad, confianza y valor percibido. Sin embargo, la baja diferenciación está limitando el impacto del resto de tus fortalezas. Actualmente este es el principal cuello de botella del sistema.";
    
    const insTxt = document.getElementById("insight-text");
    if (insTxt) insTxt.textContent = savedData ? `"${savedData.insight}"` : '"La percepción de tu negocio es superior a su capacidad de diferenciarse."';

    // 5. Verdad Incómoda
    const verTit = document.getElementById("verdad-title");
    if (verTit) verTit.innerHTML = savedData ? savedData.truth : "El mercado no percibe el valor real de tu oferta.";
    
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
    if (prioTit) prioTit.textContent = savedData && savedData.prescription ? savedData.prescription.cause : "Redefinir la matriz de diferenciación.";
    
    const prioTxt = document.getElementById("prioridad-text");
    if (prioTxt) prioTxt.textContent = "Antes de escalar en difusión, asegura el mensaje. El mercado debe entender inmediatamente por qué elegirte es la única decisión lógica.";
    
    // Iniciar Gráficos (Si existen los canvas)
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
        // Performance
        const ctxPerf = document.getElementById('chart-performance');
        if(ctxPerf) new Chart(ctxPerf, { type: 'doughnut', data: { datasets: [{ data: [72, 28], backgroundColor: ['#C5A059', 'rgba(255,255,255,0.05)'], borderWidth: 0, borderRadius: 20 }] }, options: commonOptions });
        
        // Brecha
        const ctxBrecha = document.getElementById('chart-brecha');
        if(ctxBrecha) new Chart(ctxBrecha, { type: 'doughnut', data: { datasets: [{ data: [37, 63], backgroundColor: ['#C5A059', 'rgba(255,255,255,0.05)'], borderWidth: 0, borderRadius: 20 }] }, options: commonOptions });
        
        // Potencial
        const ctxPotencial = document.getElementById('chart-potencial');
        if(ctxPotencial) new Chart(ctxPotencial, { type: 'doughnut', data: { datasets: [{ data: [42, 58], backgroundColor: ['#C5A059', 'rgba(255,255,255,0.05)'], borderWidth: 0, borderRadius: 20 }] }, options: commonOptions });
    }
}