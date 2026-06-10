/* =========================================================
   KLEOS INSIGHT™ — KIP-001 · Controlador de la experiencia
   Flujo: Landing → Protocolo → Análisis → Lectura
   Sin frameworks. Sin dependencias.
   ========================================================= */

(() => {
  "use strict";

  // ---------- Estado ----------
  const state = {
    current: 0,
    answers: {}, // { [id]: optionIndex | string }
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

  // ---------- Partículas doradas (canvas · casi imperceptibles) ----------
  (function initParticles() {
    const canvas = document.getElementById("hero-particles");
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const ctx = canvas.getContext("2d");
    let particles = [];
    let raf;

    function resize() {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }

    function spawn() {
      const count = Math.min(26, Math.floor(canvas.width / 60));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 0.4 + Math.random() * 1.1,
        vx: (Math.random() - 0.5) * 0.08,
        vy: -0.03 - Math.random() * 0.07,
        a: 0.04 + Math.random() * 0.12,
        ph: Math.random() * Math.PI * 2,
      }));
    }

    function frame(t) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < -4) { p.y = canvas.height + 4; p.x = Math.random() * canvas.width; }
        if (p.x < -4) p.x = canvas.width + 4;
        if (p.x > canvas.width + 4) p.x = -4;
        const tw = p.a * (0.6 + 0.4 * Math.sin(t / 1900 + p.ph));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(197, 160, 89, ${tw})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    }

    resize();
    spawn();
    raf = requestAnimationFrame(frame);
    window.addEventListener("resize", () => { resize(); spawn(); });

    // Pausar cuando el hero no es visible (rendimiento)
    new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          if (!raf) raf = requestAnimationFrame(frame);
        } else {
          cancelAnimationFrame(raf);
          raf = null;
        }
      });
    }).observe(canvas);
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

  // ---------- Modal de acceso reservado ----------
  const modal = document.getElementById("modal-unlock");

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
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
})();