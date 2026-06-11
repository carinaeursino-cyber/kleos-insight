/* =========================================================
   KLEOS INSIGHT™ — KIP-001 · Controlador de la experiencia
   Flujo: Landing → Protocolo → Análisis → Lectura
   Sin frameworks. Sin dependencias.
   ========================================================= */

(() => {
  "use strict";

    // ---------- Configuración de checkout ----------
  // URL del producto en Lemon Squeezy (reemplazar al crear la tienda)
  const CHECKOUT_URL = "https://TUTIENDA.lemonsqueezy.com/buy/PRODUCT_UUID";

  // ---------- Estado ----------
  const state = {
    current: 0,
    answers: {}, // { [id]: optionIndex | string }
    reading: null, // último resultado (para el desbloqueo)
  };

  // ---------- Referencias ----------
  const screens = {
    landing: document.getElementById("screen-landing"),
    protocol: document.getElementById("screen-protocol"),
    analysis: document.getElementById("screen-analysis"),
    reading: document.getElementById("screen-reading"),
  };

  const el = {
    qCategory: document.getElementById("q-category"),
    qText: document.getElementById("q-text"),
    qHint: document.getElementById("q-hint"),
    qBody: document.getElementById("q-body"),
    qCurrent: document.getElementById("q-current"),
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

  // ---------- Cielo estrellado dorado (canvas global · estilo KLEOS) ----------
  (function initStarfield() {
    const canvas = document.getElementById("bg-stars");
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const ctx = canvas.getContext("2d");
    let stars = [];
    let raf;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    function spawn() {
      // Densidad tipo cielo: ~1 estrella por cada 11.000 px²
      const count = Math.min(160, Math.floor((canvas.width * canvas.height) / 11000));
      stars = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.3 + Math.random() * 1.0,          // diminutas
        a: 0.05 + Math.random() * 0.3,         // brillo base variado
        tw: 0.4 + Math.random() * 0.6,         // amplitud del titileo
        sp: 0.4 + Math.random() * 1.2,         // velocidad del titileo
        ph: Math.random() * Math.PI * 2,       // fase aleatoria
        gold: Math.random() < 0.7,             // 70% doradas, 30% blancas tenues
      }));
    }

    function paintStatic() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? `rgba(197, 160, 89, ${s.a})`
          : `rgba(245, 245, 245, ${s.a * 0.5})`;
        ctx.fill();
      }
    }

    function frame(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const s of stars) {
        const k = 1 - s.tw * 0.5 * (1 + Math.sin((t / 1000) * s.sp + s.ph)) * 0.5;
        const alpha = s.a * k;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.gold
          ? `rgba(197, 160, 89, ${alpha})`
          : `rgba(245, 245, 245, ${alpha * 0.5})`;
        ctx.fill();
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

  function renderEntry(animated = true) {
    const q = KIP_PROTOCOL[state.current];

    const paint = () => {
      el.qCategory.textContent = `${q.category} · ENTRADA ${pad(state.current + 1)}`;
      el.qText.textContent = q.text;
      el.qHint.textContent = q.hint || "";
      // Micro-fade del contador
      el.qCurrent.classList.add("tick");
      setTimeout(() => {
        el.qCurrent.textContent = pad(state.current + 1);
        el.qCurrent.classList.remove("tick");
      }, 130);
      el.progressFill.style.width = `${(state.current / KIP_PROTOCOL.length) * 100}%`;
      el.btnPrev.disabled = state.current === 0;
      el.qBody.innerHTML = "";

      if (q.type === "choice") {
        q.options.forEach((opt, i) => {
          const btn = document.createElement("button");
          btn.className = "q-option" + (state.answers[q.id] === i ? " selected" : "");
          btn.innerHTML = `<span class="marker">▸</span><span>${opt.label}</span>`;
          btn.addEventListener("click", () => selectOption(q.id, i, btn));
          el.qBody.appendChild(btn);
        });
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
        setTimeout(() => input.focus(), animated ? 520 : 50);
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

  let advancing = false;
  function selectOption(id, i, btn) {
    if (advancing) return;
    advancing = true;

    state.answers[id] = i;
    el.qBody.querySelectorAll(".q-option").forEach((b) => b.classList.remove("selected"));
    btn.classList.add("selected");

    setTimeout(() => {
      advancing = false;
      advance();
    }, 450);
  }

  function advance() {
    if (state.current < KIP_PROTOCOL.length - 1) {
      state.current++;
      renderEntry();
    } else {
      el.progressFill.style.width = "100%";
      setTimeout(startAnalysis, 350);
    }
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
    Promise.all([KleosEngine.run(state.answers), minDelay]).then(([reading]) =>
      showReading(reading)
    );
  }

    // ---------- Pantalla 4 · Lectura ----------
  function showReading(r) {
    state.reading = r; // guardar para el desbloqueo
    el.resultLevel.textContent = `${r.level.code} — ${r.level.name}`;
    el.resultPerception.textContent = r.perception;
    el.resultTruth.textContent = r.truth;
    el.resultDiagnosis.textContent = r.diagnosis;

    // Tablero de dimensiones: 2 visibles, 3 reservadas
    el.dimsBoard.innerHTML = "";
    r.dimensions.forEach((d, i) => {
      const row = document.createElement("div");
      row.className = "dim-result" + (d.state === "locked" ? " locked" : "");
      const pct = d.state === "locked" ? 100 : Math.round((d.score / d.max) * 100);
      const scoreLabel =
        d.state === "locked"
          ? `RESERVADA<span class="lock-mark">◆</span>`
          : `${pad(d.score)} / ${d.max}`;
      row.innerHTML = `
        <span class="code">D${i + 1}</span>
        <span class="name">${d.name}</span>
        <span class="bar"><span class="bar-fill" data-w="${pct}"></span></span>
        <span class="score">${scoreLabel}</span>`;
      el.dimsBoard.appendChild(row);
    });

    showScreen("reading");

    // Animaciones de entrada: anillo, contador (1.5s) y barras (1s)
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
    el.indexNumber.textContent = "0";
    el.idxArc.style.strokeDashoffset = "565.48";
  }

  document.querySelectorAll("[data-start]").forEach((btn) =>
    btn.addEventListener("click", () => {
      resetProtocol();
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

  document.getElementById("btn-unlock").addEventListener("click", openModal);
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
          dimensions: r.dimensions.map((d) => ({ name: d.name, score: d.score })),
          declarations: r.declarations || [],
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
    // Poblar contenidos
    document.getElementById("full-trust").textContent = full.dim_readings.trust;
    document.getElementById("full-differentiation").textContent = full.dim_readings.differentiation;
    document.getElementById("full-journey").textContent = full.dim_readings.journey;
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

    // Ocultar CTA de compra, mostrar lectura completa
    document.getElementById("unlock-cta-block").style.display = "none";
    const fr = document.getElementById("full-reading");
    fr.hidden = false;
    fr.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  document.getElementById("btn-restart-2").addEventListener("click", () => {
    resetProtocol();
    document.getElementById("full-reading").hidden = true;
    document.getElementById("unlock-cta-block").style.display = "";
    showScreen("landing");
  });
})();