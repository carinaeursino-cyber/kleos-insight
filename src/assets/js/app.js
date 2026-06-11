/* =========================================================
   KLEOS INSIGHT™ — KIP-001 · Controlador de la experiencia
   Flujo: Landing → Protocolo → Análisis → Lectura
   Sin frameworks. Sin dependencias.
   ========================================================= */

(() => {
  "use strict";

  // ---------- Configuración de checkout ----------
  // URL del producto en Lemon Squeezy (reemplazar al crear la tienda)
  const CHECKOUT_URL = "https://kleosstudio.lemonsqueezy.com/buy/PRODUCT_UUID";

  // ---------- Estado ----------
  const state = {
    current: 0,
    answers: {}, // { [id]: optionIndex | string }
    reading: null, // último resultado (para el desbloqueo)
    lead: { nombre: "", email: "", empresa: "" }, // captura del gate
    recordId: null, // id del registro guardado
  };

  // ---------- Referencias ----------
  const screens = {
    landing: document.getElementById("screen-landing"),
    protocol: document.getElementById("screen-protocol"),
    analysis: document.getElementById("screen-analysis"),
    gate: document.getElementById("screen-gate"),
    reading: document.getElementById("screen-reading"),
  };

  const el = {
    qCategory: document.getElementById("q-category"),
    qText: document.getElementById("q-text"),
    qHint: document.getElementById("q-hint"),
    qBody: document.getElementById("q-body"),
    discoveryValue: document.getElementById("discovery-value"),
    progressFill: document.getElementById("progress-fill"),
    quizCard: document.getElementById("quiz-card"),
    btnPrev: document.getElementById("btn-prev"),
    procMsg: document.getElementById("processing-msg"),
    procBar: document.getElementById("processing-bar-fill"),
    indexNumber: document.getElementById("index-number"),
    idxArc: document.getElementById("idx-arc"),
    resultLevel: document.getElementById("result-level"),
    resultPerception: document.getElementById("result-perception"),
    resultTruth: document.getElementById("result-truth"),
    resultDiagnosis: document.getElementById("result-diagnosis"),
    dimsBoard: document.getElementById("dims-board"),
  };

  // ---------- Navegación entre pantallas ----------
  function showScreen(name) {
    Object.values(screens).forEach((s) => s.classList.remove("is-active"));
    screens[name].classList.add("is-active");
    window.scrollTo(0, 0);
  }

  // ---------- Eventos de negocio (embudo de conversión) ----------
  function trackEvent(event) {
    try {
      fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "event", event }),
        keepalive: true, // sobrevive al cierre de pestaña
      }).catch(() => {});
    } catch { /* silencioso */ }
  }

  // Abandono: si cierra la pestaña a mitad del protocolo, guardar estado parcial
  let protocolActive = false;
  window.addEventListener("pagehide", () => {
    if (!protocolActive || state.current >= KIP_PROTOCOL.length - 1) return;
    try {
      navigator.sendBeacon(
        "/api/capture",
        new Blob(
          [JSON.stringify({
            action: "partial",
            empresa: state.lead.empresa || state.answers.company || "",
            entrada: state.current + 1,
            respuestas: state.answers,
          })],
          { type: "application/json" }
        )
      );
      trackEvent("abandonedProtocol");
    } catch { /* noop */ }
  });

  // ---------- Cielo estrellado dorado (canvas global · estilo KLEOS) ----------
  (function initStarfield() {
    const canvas = document.getElementById("bg-stars");
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d");
    let stars = [];
    let raf;
    let W = 0, H = 0;

    function resize() {
      // Compensación de pantallas Retina/alta densidad (clave para móvil)
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = W + "px";
      canvas.style.height = H + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function spawn() {
      // Densidad tipo cielo: ~1 estrella por cada 12.000 px²
      const count = Math.min(140, Math.floor((W * H) / 12000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.5 + Math.random() * 1.1,          // finas
        a: 0.08 + Math.random() * 0.22,        // brillo sutil — presencia, no protagonismo
        tw: 0.5 + Math.random() * 0.5,         // amplitud del titileo
        sp: 0.6 + Math.random() * 1.6,         // velocidad del titileo
        ph: Math.random() * Math.PI * 2,       // fase aleatoria
        gold: Math.random() < 0.7,             // 70% doradas, 30% blancas tenues
        halo: Math.random() < 0.08,            // 8% con halo muy suave
      }));
    }

    function drawStar(s, alpha) {
      // Halo de brillo en las estrellas destacadas
      if (s.halo) {
        const g = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, s.r * 4);
        const c = s.gold ? "197, 160, 89" : "245, 245, 245";
        g.addColorStop(0, `rgba(${c}, ${alpha * 0.3})`);
        g.addColorStop(1, `rgba(${c}, 0)`);
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r * 4, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = s.gold
        ? `rgba(197, 160, 89, ${alpha})`
        : `rgba(245, 245, 245, ${alpha * 0.6})`;
      ctx.fill();
    }

    function paintStatic() {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) drawStar(s, s.a);
    }

    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      for (const s of stars) {
        // Titileo: oscila entre ~30% y 100% del brillo base
        const k = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin((t / 1000) * s.sp + s.ph)) * s.tw + (1 - s.tw) * 0.7;
        drawStar(s, Math.min(s.a * k, 0.4));
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    spawn();
    if (reduced) {
      paintStatic(); // sin animación: cielo fijo
    } else {
      raf = requestAnimationFrame(frame);
    }
    window.addEventListener("resize", () => {
      resize();
      spawn();
      if (reduced) paintStatic();
    });

    // Pausar cuando la pestaña no está visible (rendimiento)
    document.addEventListener("visibilitychange", () => {
      if (reduced) return;
      if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = null;
      } else if (!raf) {
        raf = requestAnimationFrame(frame);
      }
    });
  })();

  // ---------- Reveal por scroll (landing) ----------
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.15 }
  );
  document.querySelectorAll(".reveal").forEach((n) => observer.observe(n));

  // ---------- Pantalla 2 · Protocolo ----------
  const pad = (n) => String(n).padStart(2, "0");

  // Nivel de descubrimiento: métrica de investigación, no progreso.
  // No lineal: arranca lento y acelera — la revelación se profundiza.
  let discoveryShown = 0;
  function discoveryTarget() {
    const p = state.current / KIP_PROTOCOL.length;
    return Math.round(Math.pow(p, 1.25) * 100);
  }
  function animateDiscovery(target) {
    const start = discoveryShown;
    const t0 = performance.now();
    const dur = 700;
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      discoveryShown = Math.round(start + (target - start) * easeOut(p));
      if (el.discoveryValue) el.discoveryValue.textContent = discoveryShown + "%";
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function renderEntry(animated = true) {
    const q = KIP_PROTOCOL[state.current];

    const paint = () => {
      el.qCategory.textContent = `${q.category}`;
      el.qText.textContent = q.text;
      el.qHint.textContent = q.hint || "";
      animateDiscovery(discoveryTarget());
      el.progressFill.style.width = `${(state.current / KIP_PROTOCOL.length) * 100}%`;
      el.btnPrev.disabled = state.current === 0;
      el.qBody.innerHTML = "";

      if (q.type === "choice") {
        q.options.forEach((opt, i) => {
          const btn = document.createElement("button");
          btn.className = "q-option" + (state.answers[q.id] === i ? " selected" : "");
          btn.innerHTML = `<span class="marker">▸</span><span>${opt.label}</span>`;
          btn.addEventListener("click", () => selectOption(q.id, i, btn, q));
          el.qBody.appendChild(btn);
        });
      } else if (q.type === "chips") {
        renderChips(q);
      } else {
        const input = document.createElement(q.multiline ? "textarea" : "input");
        input.className = q.multiline ? "q-textarea" : "q-input";
        input.placeholder = q.placeholder || "";
        input.maxLength = q.maxLength || 120;
        input.value = state.answers[q.id] || "";
        if (!q.multiline) input.type = "text";

        const row = document.createElement("div");
        row.className = "q-submit-row";
        const btn = document.createElement("button");
        btn.className = "btn-gold";
        btn.textContent = "Registrar";
        const count = document.createElement("span");
        count.className = "q-charcount";

        const updateCount = () => {
          count.textContent = `${input.value.length} / ${input.maxLength}`;
          btn.style.opacity = input.value.trim() ? "1" : "0.4";
        };
        updateCount();
        input.addEventListener("input", updateCount);

        const submit = () => {
          if (!input.value.trim()) {
            input.focus();
            return;
          }
          state.answers[q.id] = input.value.trim();
          advance();
        };
        btn.addEventListener("click", submit);
        input.addEventListener("keydown", (e) => {
          if (e.key === "Enter" && !q.multiline) {
            e.preventDefault();
            submit();
          }
          if (e.key === "Enter" && q.multiline && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            submit();
          }
        });

        row.appendChild(btn);
        row.appendChild(count);
        el.qBody.appendChild(input);
        el.qBody.appendChild(row);
        setTimeout(() => input.focus(), animated ? 420 : 50);
      }
    };

    if (!animated) {
      paint();
      return;
    }

    el.quizCard.classList.add("leaving");
    setTimeout(() => {
      paint();
      el.quizCard.classList.remove("leaving");
      el.quizCard.classList.add("entering");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => el.quizCard.classList.remove("entering"))
      );
    }, 500);
  }

  // ---------- Fichas de selección (3 palabras, sin tipear) ----------
  function renderChips(q) {
    const picked = String(state.answers[q.id] || "")
      .split(",").map((s) => s.trim()).filter(Boolean);

    const board = document.createElement("div");
    board.className = "chips-board";

    const counter = document.createElement("p");
    counter.className = "chips-counter mono";

    const continueRow = document.createElement("div");
    continueRow.className = "q-submit-row";
    const btnGo = document.createElement("button");
    btnGo.className = "btn-gold";
    btnGo.textContent = "Registrar selección";
    continueRow.appendChild(btnGo);

    const updateUI = () => {
      counter.textContent = `${picked.length} / ${q.pick} SELECCIONADAS`;
      btnGo.style.opacity = picked.length === q.pick ? "1" : "0.35";
      board.querySelectorAll(".chip").forEach((c) => {
        c.classList.toggle("selected", picked.includes(c.dataset.word));
        c.classList.toggle("disabled", picked.length >= q.pick && !picked.includes(c.dataset.word));
      });
    };

    q.words.forEach((w) => {
      const chip = document.createElement("button");
      chip.className = "chip";
      chip.dataset.word = w;
      chip.textContent = w;
      chip.addEventListener("click", () => {
        const idx = picked.indexOf(w);
        if (idx >= 0) picked.splice(idx, 1);
        else if (picked.length < q.pick) picked.push(w);
        updateUI();
      });
      board.appendChild(chip);
    });

    // Opción discreta: agregar palabra propia
    const customRow = document.createElement("div");
    customRow.className = "chip-custom-row";
    const customBtn = document.createElement("button");
    customBtn.className = "btn-ghost mono";
    customBtn.textContent = "+ otra palabra";
    const customInput = document.createElement("input");
    customInput.className = "q-input chip-custom-input";
    customInput.type = "text";
    customInput.maxLength = 20;
    customInput.placeholder = "escriba y presione Enter";
    customInput.style.display = "none";
    customBtn.addEventListener("click", () => {
      customInput.style.display = "block";
      customInput.focus();
    });
    customInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const w = customInput.value.trim().toLowerCase();
        if (w && !picked.includes(w) && picked.length < q.pick) {
          picked.push(w);
          const chip = document.createElement("button");
          chip.className = "chip selected";
          chip.dataset.word = w;
          chip.textContent = w;
          chip.addEventListener("click", () => {
            const idx = picked.indexOf(w);
            if (idx >= 0) picked.splice(idx, 1);
            else if (picked.length < q.pick) picked.push(w);
            updateUI();
          });
          board.appendChild(chip);
          customInput.value = "";
          customInput.style.display = "none";
          updateUI();
        }
      }
    });
    customRow.appendChild(customBtn);
    customRow.appendChild(customInput);

    btnGo.addEventListener("click", () => {
      if (picked.length !== q.pick) return;
      state.answers[q.id] = picked.join(", ");
      advance();
    });

    el.qBody.appendChild(counter);
    el.qBody.appendChild(board);
    el.qBody.appendChild(customRow);
    el.qBody.appendChild(continueRow);
    updateUI();
  }

  // ---------- Señales del sistema (lectura en tiempo real) ----------
  const SYSTEM_SIGNALS = [
    { after: "clarity_2", check: (a) => a.clarity_2 >= 2, signal: "SEÑAL REGISTRADA · PROPUESTA SIN ANCLAJE DOCUMENTAL" },
    { after: "client_perception", check: () => true, signal: "CONTRASTE D-PERCEPTIVO EN ANÁLISIS" },
    { after: "value_2", check: (a) => a.value_2 >= 2, signal: "SEÑAL REGISTRADA · TECHO DE PRECIO AUTOIMPUESTO" },
    { after: "value_2", check: (a) => a.value_2 < 2, signal: "SEÑAL REGISTRADA · POSICIÓN DE PRECIO ACTIVA" },
    { after: "trust_2", check: (a) => a.trust_1 >= 2 || a.trust_2 >= 2, signal: "TENSIÓN DETECTADA ENTRE D2 Y D3" },
    { after: "trust_2", check: (a) => a.trust_1 < 2 && a.trust_2 < 2, signal: "SEÑAL REGISTRADA · D3 EN RANGO ESTABLE" },
    { after: "diff_1", check: (a) => a.diff_1 >= 2, signal: "SEÑAL REGISTRADA · MENSAJE INTERCAMBIABLE DETECTADO" },
    { after: "journey_1", check: () => true, signal: "ENTRADAS COMPLETAS · PREPARANDO ANÁLISIS DIMENSIONAL" },
  ];

  function getSignal(questionId) {
    const candidates = SYSTEM_SIGNALS.filter((s) => s.after === questionId);
    for (const c of candidates) {
      try { if (c.check(state.answers)) return c.signal; } catch { /* noop */ }
    }
    return null;
  }

  function flashSignal(text, then) {
    const slot = document.getElementById("signal-slot");
    const sig = document.createElement("div");
    sig.className = "system-signal mono";
    sig.textContent = text;
    slot.appendChild(sig);
    requestAnimationFrame(() => sig.classList.add("visible"));
    setTimeout(() => {
      sig.classList.remove("visible");
      setTimeout(() => { sig.remove(); then(); }, 300);
    }, 1100);
  }

  let advancing = false;
  function selectOption(id, i, btn, q) {
    if (advancing) return;
    advancing = true;

    state.answers[id] = i;
    el.qBody.querySelectorAll(".q-option").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");

    // Follow-up opcional (precisión del diferenciador)
    if (q && q.followUp && i !== q.options.length - 1) {
      setTimeout(() => {
        advancing = false;
        renderFollowUp(q.followUp);
      }, 450);
      return;
    }

    setTimeout(() => {
      advancing = false;
      advance();
    }, 450);
  }

  // ---------- Follow-up: línea opcional tras una elección ----------
  function renderFollowUp(fu) {
    el.qBody.innerHTML = "";
    el.qHint.textContent = "";
    el.qText.textContent = fu.text;

    const input = document.createElement("input");
    input.className = "q-input";
    input.type = "text";
    input.maxLength = fu.maxLength || 160;
    input.placeholder = fu.placeholder || "";

    const row = document.createElement("div");
    row.className = "q-submit-row";
    const btnOk = document.createElement("button");
    btnOk.className = "btn-gold";
    btnOk.textContent = "Registrar";
    const btnSkip = document.createElement("button");
    btnSkip.className = "btn-ghost mono";
    btnSkip.textContent = "Omitir →";

    const submit = (value) => {
      state.answers[fu.id] = value;
      advance();
    };
    btnOk.addEventListener("click", () => submit(input.value.trim()));
    btnSkip.addEventListener("click", () => submit(""));
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") { e.preventDefault(); submit(input.value.trim()); }
    });

    row.appendChild(btnOk);
    row.appendChild(btnSkip);
    el.qBody.appendChild(input);
    el.qBody.appendChild(row);
    setTimeout(() => input.focus(), 80);
  }

  function advance() {
    const currentId = KIP_PROTOCOL[state.current].id;
    const signal = getSignal(currentId);

    const go = () => {
      if (state.current < KIP_PROTOCOL.length - 1) {
        state.current++;
        renderEntry();
      } else {
        el.progressFill.style.width = "100%";
        animateDiscovery(100);
        protocolActive = false;
        trackEvent("completedProtocol");
        setTimeout(startAnalysis, 350);
      }
    };

    if (signal) flashSignal(signal, go);
    else go();
  }

  el.btnPrev.addEventListener("click", () => {
    if (state.current > 0) {
      state.current--;
      renderEntry();
    }
  });

  // ---------- Pantalla 3 · Análisis ----------
  function startAnalysis() {
    showScreen("analysis");

    let msgIdx = 0;
    el.procMsg.textContent = KIP_ANALYSIS_MESSAGES[0];
    const msgTimer = setInterval(() => {
      msgIdx++;
      if (msgIdx >= KIP_ANALYSIS_MESSAGES.length) {
        clearInterval(msgTimer);
        return;
      }
      el.procMsg.classList.add("fading");
      setTimeout(() => {
        el.procMsg.textContent = KIP_ANALYSIS_MESSAGES[msgIdx];
        el.procMsg.classList.remove("fading");
      }, 350);
    }, 1250);

    // Progreso no lineal: cómputo, no countdown
    el.procBar.style.width = "0%";
    [[200, "31%"], [1100, "49%"], [2300, "68%"], [3500, "84%"], [4500, "100%"]]
      .forEach(([t, w]) => setTimeout(() => (el.procBar.style.width = w), t));

    const minDelay = new Promise((r) => setTimeout(r, 5300));
    Promise.all([KleosEngine.run(state.answers), minDelay])
      .then(([reading]) => showGate(reading))
      .catch((err) => {
        // Red de seguridad: nunca dejar la rueda girando
        console.error("KIP-001 error en análisis:", err);
        showScreen("landing");
        alert("Ocurrió un error al componer la lectura. Por favor, intente de nuevo.");
      });
  }

  // ---------- Pantalla 3.5 · Diagnóstico listo (captura de lead) ----------
  function showGate(r) {
    state.reading = r;
    document.getElementById("gate-index").textContent = r.index;
    document.getElementById("gate-level").textContent = r.level.name
      .toLowerCase()
      .replace(/^./, (c) => c.toUpperCase());
    const weakest = r.weakestFinding ? r.weakestFinding.name.toLowerCase() : "posicionamiento";
    document.getElementById("gate-gap").innerHTML =
      `Detectamos una brecha importante en su <span class="gold">${weakest}</span>`;
    const gc = document.getElementById("gate-company");
    if (gc && !gc.value) gc.value = state.answers.company || "";
    showScreen("gate");
  }

  // Validación y envío del gate
  function gateStatus(msg, cls) {
    const n = document.getElementById("gate-status");
    n.textContent = msg;
    n.className = "gate-status mono" + (cls ? " " + cls : "");
  }

  async function captureRecord() {
    // Captura silenciosa: nunca bloquea la experiencia
    try {
      const r = state.reading;
      const resp = await fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: state.lead.nombre,
          email: state.lead.email,
          empresa: state.lead.empresa || state.answers.company || "",
          respuestas: state.answers,
          declaraciones: r.declarations || [],
          kleosIndex: r.index,
          perceptionLevel: `${r.level.code} — ${r.level.name}`,
          pattern: r.pattern ? r.pattern.name : "",
          mainDiagnosis: r.prescription ? r.prescription.cause : "",
          priorityNumberOne: r.prescription ? r.prescription.priority : "",
          insightDetected: r.insight || "",
          dimensions: r.dimensions.map((d) => ({ name: d.name, score: d.score })),
        }),
      });
      const j = await resp.json().catch(() => null);
      if (j && j.id) state.recordId = j.id;
    } catch { /* silencioso */ }
  }

  document.getElementById("btn-gate").addEventListener("click", async () => {
    const nombre = document.getElementById("gate-name").value.trim();
    const email = document.getElementById("gate-email").value.trim();
    const empresa = document.getElementById("gate-company").value.trim();
    if (nombre.length < 2) {
      gateStatus("INGRESE SU NOMBRE", "error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      gateStatus("INGRESE UN EMAIL VÁLIDO", "error");
      return;
    }
    if (empresa.length < 2) {
      gateStatus("INGRESE SU EMPRESA", "error");
      return;
    }
    state.lead = { nombre, email, empresa };
    gateStatus("DESBLOQUEANDO INFORME", "loading");
    trackEvent("openedResults");
    captureRecord(); // en paralelo, sin esperar
    setTimeout(() => {
      gateStatus("");
      showReading(state.reading);
    }, 600);
  });

  // ---------- Pantalla 4 · Lectura ----------
  function showReading(r) {
    state.reading = r; // guardar para el desbloqueo
    el.resultLevel.textContent = `${r.level.code} — ${r.level.name}`;
    el.resultPerception.textContent = r.perception;
    el.resultTruth.textContent = r.truth;
    el.resultDiagnosis.textContent = r.diagnosis;

    // Prescripción: causa raíz, prioridad #1 e impacto potencial
    if (r.prescription) {
      document.getElementById("cause-dimension").textContent =
        `DIMENSIÓN CRÍTICA · ${r.prescription.dimension.toUpperCase()}`;
      document.getElementById("cause-text").textContent = r.prescription.cause;
      document.getElementById("priority-text").textContent = r.prescription.priority;
      const list = document.getElementById("impact-list");
      list.innerHTML = "";
      r.prescription.impacts.forEach((imp, i) => {
        const row = document.createElement("p");
        row.className = "impact-item mono";
        row.style.animationDelay = `${1.2 + i * 0.18}s`;
        row.textContent = imp;
        list.appendChild(row);
      });
    }

    // Insight detectado: el momento eureka
    if (r.insight) {
      document.getElementById("insight-text").textContent = r.insight;
    }

    // Patrón detectado: identidad reconocible
    if (r.pattern) {
      document.getElementById("pattern-name").textContent = r.pattern.name.toUpperCase();
      document.getElementById("pattern-text").textContent = r.pattern.text;
      document.getElementById("pattern-match").textContent = r.pattern.match.toUpperCase();
    }

    // Fragmento oculto: corta en máxima tensión, el resto queda velado
    if (r.hiddenFragment) {
      document.getElementById("hidden-fragment").textContent = r.hiddenFragment + "…";
    }

    // Hallazgo central del CTA: la dimensión más baja y su costo
    if (r.weakestFinding) {
      document.getElementById("weakest-name").textContent = r.weakestFinding.name.toUpperCase();
      document.getElementById("weakest-meaning").textContent = r.weakestFinding.meaning;
    }

    // Tablero de dimensiones: solo la fortaleza visible, 4 reservadas
    el.dimsBoard.innerHTML = "";
    r.dimensions.forEach((d, i) => {
      const row = document.createElement("div");
      row.className = "dim-result" + (d.state === "locked" ? " locked" : " strength");
      const pct = d.state === "locked" ? 100 : Math.round((d.score / d.max) * 100);
      const scoreLabel =
        d.state === "locked"
          ? `RESERVADA<span class="lock-mark">◆</span>`
          : `${pad(d.score)} / ${d.max}`;
      row.innerHTML = `
        <span class="code">D${pad(i + 1)}</span>
        <span class="name">${d.name}<span class="dim-q sans">${d.question}</span></span>
        <span class="bar"><span class="bar-fill" data-w="${pct}"></span></span>
        <span class="score">${scoreLabel}</span>
        ${d.reading ? `<p class="dim-reading sans">${d.reading}</p>` : ""}`;
      el.dimsBoard.appendChild(row);
    });

    showScreen("reading");

    // Animaciones de entrada: anillo, contador y barras
    const CIRC = 565.48; // 2πr, r = 90
    setTimeout(() => {
      el.idxArc.style.strokeDashoffset = CIRC * (1 - r.index / 100);
      animateCounter(el.indexNumber, r.index, 1500);
      el.dimsBoard.querySelectorAll(".bar-fill").forEach((b, i) => {
        setTimeout(() => (b.style.width = b.dataset.w + "%"), 600 + i * 130);
      });
    }, 400);
  }

  function animateCounter(node, target, duration) {
    const start = performance.now();
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    function frame(now) {
      const p = Math.min((now - start) / duration, 1);
      node.textContent = Math.round(easeOut(p) * target);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  // ---------- Acciones globales ----------
  function resetProtocol() {
    state.current = 0;
    state.answers = {};
    state.reading = null;
    state.recordId = null;
    discoveryShown = 0;
    if (el.discoveryValue) el.discoveryValue.textContent = "0%";
    el.indexNumber.textContent = "0";
    el.idxArc.style.strokeDashoffset = "565.48";
    const gn = document.getElementById("gate-name");
    const ge = document.getElementById("gate-email");
    const gc = document.getElementById("gate-company");
    if (gn) gn.value = "";
    if (ge) ge.value = "";
    if (gc) gc.value = "";
  }

  document.querySelectorAll("[data-start]").forEach((btn) =>
    btn.addEventListener("click", () => {
      resetProtocol();
      protocolActive = true;
      trackEvent("startedProtocol");
      showScreen("protocol");
      renderEntry(false);
      el.progressFill.style.width = "0%";
    })
  );

  document.getElementById("btn-restart").addEventListener("click", () => {
    resetProtocol();
    showScreen("landing");
  });

  // ---------- Modal de acceso / checkout ----------
  const modal = document.getElementById("modal-unlock");
  const licenseInput = document.getElementById("license-input");
  const unlockStatus = document.getElementById("unlock-status");

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.getElementById("btn-checkout").href = CHECKOUT_URL;
  }
  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
  }

  document.getElementById("btn-unlock").addEventListener("click", () => {
    trackEvent("clickedUnlock");
    openModal();
  });
  modal.querySelectorAll("[data-modal-close]").forEach((n) =>
    n.addEventListener("click", closeModal)
  );
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  // ---------- Desbloqueo con clave de acceso ----------
  function setStatus(msg, cls) {
    unlockStatus.textContent = msg;
    unlockStatus.className = "unlock-status mono" + (cls ? " " + cls : "");
  }

  async function redeemLicense() {
    const key = licenseInput.value.trim();
    if (key.length < 10) {
      setStatus("INGRESE LA CLAVE RECIBIDA POR CORREO", "error");
      return;
    }
    if (!state.reading) {
      setStatus("EJECUTE EL PROTOCOLO ANTES DE DESBLOQUEAR", "error");
      return;
    }

    const r = state.reading;
    const weakest = [...r.dimensions].sort((a, b) => a.score - b.score)[0];

    setStatus("VALIDANDO CLAVE · COMPONIENDO LECTURA COMPLETA", "loading");
    document.getElementById("btn-redeem").disabled = true;

    try {
      const resp = await fetch("/api/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          license_key: key,
          company: state.answers.company,
          self_perception: state.answers.self_perception,
          client_perception: state.answers.client_perception,
          differentiator: state.answers.differentiator,
          index: r.index,
          level: `${r.level.code} — ${r.level.name}`,
          weakest: weakest.name,
          dimensions: r.dimensions.map((d) => ({
            key: d.key,
            name: d.name,
            score: d.score,
            locked: d.state === "locked",
          })),
          declarations: r.declarations || [],
          // Datos para el informe permanente + email (Instrucciones 11+12)
          lead_name: state.lead.nombre,
          lead_email: state.lead.email,
          pattern: r.pattern ? r.pattern.name : "",
          perception: r.perception || "",
          insight: r.insight || "",
          cause: r.prescription ? r.prescription.cause : "",
          priority: r.prescription ? r.prescription.priority : "",
          next_code: r.nextProtocol ? r.nextProtocol.code : "",
          next_name: r.nextProtocol ? r.nextProtocol.name : "",
          next_objective: r.nextProtocol ? r.nextProtocol.objective : "",
        }),
      });

      if (resp.status === 403) {
        setStatus("CLAVE NO VÁLIDA O YA UTILIZADA", "error");
        return;
      }
      if (!resp.ok) {
        setStatus("ERROR AL GENERAR LA LECTURA — INTENTE DE NUEVO", "error");
        return;
      }

      const full = await resp.json();
      setStatus("ACCESO CONFIRMADO", "ok");
      // Marcar el registro como pagado (silencioso)
      if (state.recordId) {
        fetch("/api/capture", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action: "mark_paid", id: state.recordId }),
        }).catch(() => {});
      }
      setTimeout(() => {
        closeModal();
        revealFullReading(full, r);
      }, 700);
    } catch {
      setStatus("ERROR DE CONEXIÓN — INTENTE DE NUEVO", "error");
    } finally {
      document.getElementById("btn-redeem").disabled = false;
    }
  }

  document.getElementById("btn-redeem").addEventListener("click", redeemLicense);
  licenseInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") redeemLicense();
  });

  // ---------- Revelación de la lectura completa ----------
  function revealFullReading(full, r) {
    // Poblar interpretaciones de las dimensiones reservadas
    const fdc = document.getElementById("full-dims-container");
    fdc.innerHTML = "";
    r.dimensions.forEach((d, i) => {
      if (d.state !== "locked") return;
      const reading = (full.dim_readings && full.dim_readings[d.key]) || "";
      if (!reading) return;
      const div = document.createElement("div");
      div.className = "full-dim";
      div.innerHTML = `
        <p class="full-dim-name mono">D${pad(i + 1)} &nbsp;·&nbsp; ${d.name.toUpperCase()}</p>
        <p class="sans">${reading}</p>`;
      fdc.appendChild(div);
    });
    document.getElementById("full-truth").textContent = full.truth_full;
    document.getElementById("full-diagnosis").textContent = full.diagnosis_full;
    document.getElementById("full-error").textContent = full.first_error;

    const seqEl = document.getElementById("full-sequence");
    seqEl.innerHTML = "";
    full.sequence.forEach((s, i) => {
      const item = document.createElement("div");
      item.className = "sequence-item";
      item.innerHTML = `<span class="num">0${i + 1}</span><p>${s}</p>`;
      seqEl.appendChild(item);
    });

    // Desbloquear dimensiones del tablero (puntajes reales)
    el.dimsBoard.querySelectorAll(".dim-result.locked").forEach((row, idx) => {
      const dim = r.dimensions.filter((d) => d.state === "locked")[idx];
      if (!dim) return;
      row.classList.remove("locked");
      const score = row.querySelector(".score");
      const bar = row.querySelector(".bar-fill");
      if (score) score.textContent = `${pad(dim.score)} / ${dim.max}`;
      if (bar) bar.style.width = Math.round((dim.score / dim.max) * 100) + "%";
    });

    // Quitar velos de los bloques bloqueados
    document.querySelectorAll(".lock-veil").forEach((v) => (v.style.display = "none"));
    document.querySelectorAll(".locked-text p").forEach((p) => (p.style.filter = "none"));
    const badge = document.querySelector(".lock-badge");
    if (badge) badge.style.display = "none";
    const note = document.querySelector(".dims-note");
    if (note) note.textContent = "CINCO DE CINCO DIMENSIONES DESBLOQUEADAS";

    // Próximo protocolo recomendado + Ruta KLEOS
    if (r.nextProtocol) {
      const np = r.nextProtocol;
      document.getElementById("next-code").textContent = np.code;
      document.getElementById("next-name").textContent = np.name;
      document.getElementById("next-objective").textContent = np.objective;
      const btn = document.getElementById("btn-next-protocol");
      const subject = encodeURIComponent(`Acceso prioritario ${np.code} — ${np.name}`);
      const body = encodeURIComponent(
        `Hola, acabo de completar KIP-001 (Índice Kleos: ${r.index}) y quiero reservar acceso prioritario a ${np.code}.`
      );
      btn.href = `mailto:carina@carinaursino.com?subject=${subject}&body=${body}`;

      const routeEl = document.getElementById("route-list");
      routeEl.innerHTML = "";
      np.route.forEach((k) => {
        const row = document.createElement("div");
        row.className =
          "route-item mono" +
          (k.done ? " done" : "") +
          (k.recommended ? " recommended" : "");
        row.innerHTML = `
          <span class="route-mark">${k.done ? "✓" : "○"}</span>
          <span class="route-code">${k.code}</span>
          <span class="route-name">${k.name}</span>
          <span class="route-status">${k.done ? "COMPLETADO" : k.recommended ? "RECOMENDADO" : "EN RUTA"}</span>`;
        routeEl.appendChild(row);
      });
    }

    // Enlace permanente al informe (si el servidor lo generó)
    if (full.report_token) {
      const br = document.getElementById("btn-report");
      const rn = document.getElementById("report-note");
      br.href = "/informe.html?t=" + encodeURIComponent(full.report_token);
      br.style.display = "inline-block";
      rn.style.display = "block";
    }

    // Ocultar CTA de compra y sección de hallazgos ocultos, mostrar lectura completa
    document.getElementById("unlock-cta-block").style.display = "none";
    const hf = document.getElementById("hidden-findings-block");
    if (hf) hf.style.display = "none";
    const fr = document.getElementById("full-reading");
    fr.hidden = false;
    fr.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("btn-restart-2").addEventListener("click", () => {
    resetProtocol();
    document.getElementById("full-reading").hidden = true;
    document.getElementById("unlock-cta-block").style.display = "";
    const hf = document.getElementById("hidden-findings-block");
    if (hf) hf.style.display = "";
    showScreen("landing");
  });

})();
