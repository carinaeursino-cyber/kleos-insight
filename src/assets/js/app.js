/* =========================================================
   KLEOS INSIGHT™ — KIP-001 · Controlador de la experiencia
   Flujo: Landing → Protocolo → Análisis → Lectura
   ========================================================= */

(() => {
  "use strict";

  // ---------- Configuración de checkout ----------
  const CHECKOUT_URL = "https://kleosstudio.lemonsqueezy.com/checkout/buy/9f5dabcc-38f7-48d1-9cd1-c8e53337ef76";

  // ---------- Estado ----------
  const state = {
    current: 0,
    answers: {},
    reading: null,
    lead: { nombre: "", email: "", empresa: "" },
    recordId: null,
    startedAt: null,
    answeredCount: 0,
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
    Object.values(screens).forEach((s) => {
      if(s) s.classList.remove("is-active");
    });
    if(screens[name]) screens[name].classList.add("is-active");
    window.scrollTo(0, 0);
  }

  // ---------- Eventos de negocio (embudo de conversión) ----------
  function trackEvent(event) {
    try {
      fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "event", event }),
        keepalive: true,
      }).catch(() => {});
    } catch { /* silencioso */ }
  }

  function trackQuestion(n) {
    try {
      fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "question", n }),
        keepalive: true,
      }).catch(() => {});
    } catch { /* silencioso */ }
  }

  let protocolActive = false;
  let gateActive = false;
  window.addEventListener("pagehide", () => {
    const midProtocol = protocolActive && state.current < KIP_PROTOCOL.length - 1;
    if (!midProtocol && !gateActive) return;
    try {
      navigator.sendBeacon(
        "/api/capture",
        new Blob(
          [JSON.stringify({
            action: "partial",
            gate: gateActive,
            empresa: state.lead.empresa || state.answers.company || "",
            entrada: gateActive ? 12 : state.current + 1,
            respondidas: gateActive ? 12 : state.answeredCount,
            elapsed: state.startedAt ? Math.round((Date.now() - state.startedAt) / 1000) : 0,
            respuestas: state.answers,
          })],
          { type: "application/json" }
        )
      );
      navigator.sendBeacon(
        "/api/capture",
        new Blob(
          [JSON.stringify({ action: "event", event: "abandonedProtocol" })],
          { type: "application/json" }
        )
      );
    } catch { /* noop */ }
  });

  // ---------- Cielo estrellado dorado ----------
  (function initStarfield() {
    const canvas = document.getElementById("bg-stars");
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const ctx = canvas.getContext("2d");
    let stars = [];
    let raf;
    let W = 0, H = 0;

    function resize() {
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
      const count = Math.min(140, Math.floor((W * H) / 12000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        r: 0.5 + Math.random() * 1.1,
        a: 0.08 + Math.random() * 0.22,
        tw: 0.5 + Math.random() * 0.5,
        sp: 0.6 + Math.random() * 1.6,
        ph: Math.random() * Math.PI * 2,
        gold: Math.random() < 0.7,
        halo: Math.random() < 0.08,
      }));
    }

    function drawStar(s, alpha) {
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
        const k = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin((t / 1000) * s.sp + s.ph)) * s.tw + (1 - s.tw) * 0.7;
        drawStar(s, Math.min(s.a * k, 0.4));
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    spawn();
    if (reduced) paintStatic();
    else raf = requestAnimationFrame(frame);

    window.addEventListener("resize", () => {
      resize();
      spawn();
      if (reduced) paintStatic();
    });

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

  // ---------- Reveal por scroll ----------
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
      if(el.qCategory) el.qCategory.textContent = `${q.category}`;
      if(el.qText) el.qText.textContent = q.text;
      if(el.qHint) el.qHint.textContent = q.hint || "";
      animateDiscovery(discoveryTarget());
      if(el.progressFill) el.progressFill.style.width = `${(state.current / KIP_PROTOCOL.length) * 100}%`;
      if(el.btnPrev) el.btnPrev.disabled = state.current === 0;
      if(el.qBody) el.qBody.innerHTML = "";

      if (q.type === "choice") {
        q.options.forEach((opt, i) => {
          const btn = document.createElement("button");
          btn.className = "q-option" + (state.answers[q.id] === i ? " selected" : "");
          btn.innerHTML = `<span class="marker">▸</span><span>${opt.label}</span>`;
          btn.addEventListener("click", () => selectOption(q.id, i, btn, q));
          if(el.qBody) el.qBody.appendChild(btn);
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
        if(el.qBody) {
            el.qBody.appendChild(input);
            el.qBody.appendChild(row);
        }
        setTimeout(() => input.focus(), animated ? 420 : 50);
      }
    };

    if (!animated) {
      paint();
      return;
    }
    if(el.quizCard) {
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
  }

  // ---------- Fichas de selección ----------
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

    if(el.qBody) {
        el.qBody.appendChild(counter);
        el.qBody.appendChild(board);
        el.qBody.appendChild(customRow);
        el.qBody.appendChild(continueRow);
    }
    updateUI();
  }

  // ---------- Señales del sistema ----------
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
    if(!slot) { then(); return; }
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
    if(el.qBody) el.qBody.querySelectorAll(".q-option").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");
    
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

  function renderFollowUp(fu) {
    if(el.qBody) el.qBody.innerHTML = "";
    if(el.qHint) el.qHint.textContent = "";
    if(el.qText) el.qText.textContent = fu.text;
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
    if(el.qBody) {
        el.qBody.appendChild(input);
        el.qBody.appendChild(row);
    }
    setTimeout(() => input.focus(), 80);
  }

  function advance() {
    const currentId = KIP_PROTOCOL[state.current].id;
    const signal = getSignal(currentId);
    state.answeredCount = state.current + 1;
    trackQuestion(state.current + 1);

    const go = () => {
      if (state.current < KIP_PROTOCOL.length - 1) {
        state.current++;
        renderEntry();
      } else {
        if(el.progressFill) el.progressFill.style.width = "100%";
        animateDiscovery(100);
        protocolActive = false;
        try {
          fetch("/api/capture", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "event",
              event: "completedProtocol",
              duration: state.startedAt ? Math.round((Date.now() - state.startedAt) / 1000) : 0,
            }),
            keepalive: true,
          }).catch(() => {});
        } catch { /* noop */ }
        setTimeout(startAnalysis, 350);
      }
    };

    if (signal) flashSignal(signal, go);
    else go();
  }

  if(el.btnPrev) {
    el.btnPrev.addEventListener("click", () => {
        if (state.current > 0) {
        state.current--;
        renderEntry();
        }
    });
  }

  // ---------- Pantalla 3 · Análisis ----------
  function startAnalysis() {
    showScreen("analysis");
    let msgIdx = 0;
    if(el.procMsg) el.procMsg.textContent = KIP_ANALYSIS_MESSAGES[0];
    const msgTimer = setInterval(() => {
      msgIdx++;
      if (msgIdx >= KIP_ANALYSIS_MESSAGES.length) {
        clearInterval(msgTimer);
        return;
      }
      if(el.procMsg) {
          el.procMsg.classList.add("fading");
          setTimeout(() => {
            el.procMsg.textContent = KIP_ANALYSIS_MESSAGES[msgIdx];
            el.procMsg.classList.remove("fading");
          }, 350);
      }
    }, 1250);

    if(el.procBar) el.procBar.style.width = "0%";
    [[200, "31%"], [1100, "49%"], [2300, "68%"], [3500, "84%"], [4500, "100%"]]
      .forEach(([t, w]) => setTimeout(() => { if(el.procBar) el.procBar.style.width = w; }, t));

    const minDelay = new Promise((r) => setTimeout(r, 5300));
    Promise.all([typeof KleosEngine !== 'undefined' ? KleosEngine.run(state.answers) : Promise.resolve({ index: 68, level: {name:"MEDIO", code:"M"}, prescription: {dimension: "diferenciacion", cause: "", priority: "", impacts: []}, dimensions: [] }), minDelay])
      .then(([reading]) => showGate(reading))
      .catch((err) => {
        console.error("KIP-001 error en análisis:", err);
        showScreen("landing");
        alert("Ocurrió un error al componer la lectura. Por favor, intente de nuevo.");
      });
  }

  // ---------- Pantalla 3.5 · Diagnóstico listo (captura de lead) ----------
  function showGate(r) {
    state.reading = r;
    try {
      fetch("/api/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "event", event: "resultGenerated", index: r.index }),
        keepalive: true,
      }).catch(() => {});
    } catch { /* noop */ }

    const idxEl = document.getElementById("gate-index");
    if(idxEl) idxEl.textContent = r.index;
    
    const lvlEl = document.getElementById("gate-level");
    if(lvlEl && r.level) lvlEl.textContent = r.level.name.toLowerCase().replace(/^./, (c) => c.toUpperCase());
    
    const weakest = r.weakestFinding ? r.weakestFinding.name.toLowerCase() : "posicionamiento";
    const gapEl = document.getElementById("gate-gap");
    if (gapEl) gapEl.innerHTML = `Detectamos una brecha importante en su <span class="gold">${weakest}</span>`;

    const gc = document.getElementById("gate-company");
    if (gc && !gc.value) gc.value = state.answers.company || "";
    gateActive = true; 
    showScreen("gate");
  }

  function gateStatus(msg, cls) {
    const n = document.getElementById("gate-status");
    if(n) {
        n.textContent = msg;
        n.className = "gate-status mono" + (cls ? " " + cls : "");
    }
  }

  async function captureRecord() {
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
          dimensions: r.dimensions ? r.dimensions.map((d) => ({ name: d.name, score: d.score })) : [],
        }),
      });
      const j = await resp.json().catch(() => null);
      if (j && j.id) state.recordId = j.id;
    } catch { /* silencioso */ }
  }

  const btnGate = document.getElementById("btn-gate");
  if(btnGate) {
      btnGate.addEventListener("click", async () => {
        const nEl = document.getElementById("gate-name");
        const eEl = document.getElementById("gate-email");
        const cEl = document.getElementById("gate-company");
        
        const nombre = nEl ? nEl.value.trim() : "";
        const email = eEl ? eEl.value.trim() : "";
        const empresa = cEl ? cEl.value.trim() : "";

        if (nombre.length < 2) return gateStatus("INGRESE SU NOMBRE", "error");
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return gateStatus("INGRESE UN EMAIL VÁLIDO", "error");
        if (empresa.length < 2) return gateStatus("INGRESE SU EMPRESA", "error");

        state.lead = { nombre, email, empresa };
        gateActive = false;
        gateStatus("DESBLOQUEANDO INFORME", "loading");
        trackEvent("openedResults");
        captureRecord(); 

        setTimeout(() => {
          gateStatus("");
          showReading(state.reading);
        }, 600);
      });
  }

  // ---------- Pantalla 4 · Lectura (Parcial) ----------
  function showReading(r) {
    state.reading = r; 
    
    if(el.resultLevel) el.resultLevel.textContent = `${r.level.code} — ${r.level.name}`;
    if(el.resultPerception) el.resultPerception.textContent = r.perception;
    if(el.resultTruth) el.resultTruth.textContent = r.truth;
    if(el.resultDiagnosis) el.resultDiagnosis.textContent = r.diagnosis;

    if (r.prescription) {
      if(document.getElementById("cause-dimension")) document.getElementById("cause-dimension").textContent = `DIMENSIÓN CRÍTICA · ${r.prescription.dimension.toUpperCase()}`;
      if(document.getElementById("cause-text")) document.getElementById("cause-text").textContent = r.prescription.cause;
      if(document.getElementById("priority-text")) document.getElementById("priority-text").textContent = r.prescription.priority;
      const list = document.getElementById("impact-list");
      if(list) {
          list.innerHTML = "";
          r.prescription.impacts.forEach((imp, i) => {
            const row = document.createElement("p");
            row.className = "impact-item mono";
            row.style.animationDelay = `${1.2 + i * 0.18}s`;
            row.textContent = imp;
            list.appendChild(row);
          });
      }
    }

    if (r.insight && document.getElementById("insight-text")) {
      document.getElementById("insight-text").textContent = r.insight;
    }

    if (r.pattern) {
      if(document.getElementById("pattern-name")) document.getElementById("pattern-name").textContent = r.pattern.name.toUpperCase();
      if(document.getElementById("pattern-text")) document.getElementById("pattern-text").textContent = r.pattern.text;
      if(document.getElementById("pattern-match")) document.getElementById("pattern-match").textContent = r.pattern.match.toUpperCase();
    }

    if (r.hiddenFragment && document.getElementById("hidden-fragment")) {
      document.getElementById("hidden-fragment").textContent = r.hiddenFragment + "…";
    }

    if (r.weakestFinding) {
      if(document.getElementById("weakest-name")) document.getElementById("weakest-name").textContent = r.weakestFinding.name.toUpperCase();
      if(document.getElementById("weakest-meaning")) document.getElementById("weakest-meaning").textContent = r.weakestFinding.meaning;
    }

    if(el.dimsBoard && r.dimensions) {
        el.dimsBoard.innerHTML = "";
        r.dimensions.forEach((d, i) => {
          const row = document.createElement("div");
          row.className = "dim-result" + (d.state === "locked" ? " locked" : " strength");
          const pct = d.state === "locked" ? 100 : Math.round((d.score / d.max) * 100);
          const scoreLabel = d.state === "locked" ? `RESERVADA<span class="lock-mark">◆</span>` : `${pad(d.score)} / ${d.max}`;
          row.innerHTML = `
            <span class="code">D${pad(i + 1)}</span>
            <span class="name">${d.name}<span class="dim-q sans">${d.question}</span></span>
            <span class="bar"><span class="bar-fill" data-w="${pct}"></span></span>
            <span class="score">${scoreLabel}</span>
            ${d.reading ? `<p class="dim-reading sans">${d.reading}</p>` : ""}`;
          el.dimsBoard.appendChild(row);
        });
    }

    showScreen("reading");

    const CIRC = 565.48; 
    setTimeout(() => {
      if(el.idxArc) el.idxArc.style.strokeDashoffset = CIRC * (1 - r.index / 100);
      if(el.indexNumber) animateCounter(el.indexNumber, r.index, 1500);
      if(el.dimsBoard) {
          el.dimsBoard.querySelectorAll(".bar-fill").forEach((b, i) => {
            setTimeout(() => (b.style.width = b.dataset.w + "%"), 600 + i * 130);
          });
      }
    }, 400);
  }

  // ---------- Control General ----------
  function resetProtocol() {
    protocolActive = false;
    gateActive = false;
    state.current = 0;
    state.answers = {};
    state.reading = null;
    state.recordId = null;
    state.startedAt = null;
    discoveryShown = 0;
    
    if (el.discoveryValue) el.discoveryValue.textContent = "0%";
    if (el.indexNumber) el.indexNumber.textContent = "0";
    if (el.idxArc) el.idxArc.style.strokeDashoffset = "565.48";
    
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
      state.startedAt = Date.now();
      state.answeredCount = 0;
      trackEvent("startedProtocol");
      showScreen("protocol");
      renderEntry(false);
      if(el.progressFill) el.progressFill.style.width = "0%";
    })
  );

  document.querySelectorAll("#btn-restart, #btn-restart-2").forEach(btn => {
    if(btn) {
      btn.addEventListener("click", () => {
        resetProtocol();
        showScreen("landing");
      });
    }
  });

  // CTA de asesoría directa
  document.querySelectorAll(".advisory-link").forEach((a) =>
    a.addEventListener("click", () => trackEvent("clickedAdvisory"), { once: true })
  );

})();