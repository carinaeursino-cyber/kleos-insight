/* ===============================================
   KLEOS INSIGHT™ - MAIN APPLICATION LOGIC
   Vanilla JavaScript - No Dependencies
   =============================================== */

class KleosInsight {
  constructor() {
    this.currentPage = 'home';
    this.userAnswers = {};
    this.analysisData = null;
    this.isPremium = false; // Free MVP version
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadPage('home');
  }

  setupEventListeners() {
    // Navigation
    document.addEventListener('click', (e) => {
      if (e.target.dataset.page) {
        e.preventDefault();
        this.loadPage(e.target.dataset.page);
      }
    });

    // Form handling
    const questionForm = document.getElementById('questionForm');
    if (questionForm) {
      questionForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleFormSubmit();
      });
    }

    // Window history
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.page) {
        this.loadPage(e.state.page, false);
      }
    });
  }

  loadPage(page, updateHistory = true) {
    this.currentPage = page;

    if (updateHistory) {
      history.pushState({ page }, page, `#${page}`);
    }

    // Hide all pages
    document.querySelectorAll('[data-page-content]').forEach(el => {
      el.classList.add('hidden');
    });

    // Show selected page
    const pageElement = document.querySelector(`[data-page-content="${page}"]`);
    if (pageElement) {
      pageElement.classList.remove('hidden');
      this.animatePageEntry();

      // Run page-specific initialization
      if (page === 'questions') {
        this.initQuestionsPage();
      } else if (page === 'analysis') {
        this.initAnalysisPage();
      } else if (page === 'results') {
        this.initResultsPage();
      }
    }

    // Scroll to top
    window.scrollTo(0, 0);
  }

  animatePageEntry() {
    const elements = document.querySelectorAll('[data-page-content]:not(.hidden) > *');
    elements.forEach((el, index) => {
      el.style.animation = `slideUp 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards`;
      el.style.animationDelay = `${index * 100}ms`;
      el.style.opacity = '0';
    });
  }

  // ===== QUESTIONS PAGE =====
  initQuestionsPage() {
    this.updateProgressIndicator();
    this.setupQuestionValidation();
  }

  updateProgressIndicator() {
    const steps = document.querySelectorAll('.progress-step');
    steps.forEach((step, index) => {
      step.classList.remove('active', 'completed');
      if (index < Object.keys(this.userAnswers).length) {
        step.classList.add('completed');
      } else if (index === Object.keys(this.userAnswers).length) {
        step.classList.add('active');
      }
    });
  }

  setupQuestionValidation() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
      input.addEventListener('change', () => {
        this.updateProgressIndicator();
      });
    });
  }

  handleFormSubmit() {
    this.collectAnswers();
    
    if (Object.keys(this.userAnswers).length < 12) {
      this.showToast('Por favor completa todas las preguntas', 'warning');
      return;
    }

    // Go to analysis
    this.loadPage('analysis');
  }

  collectAnswers() {
    const form = document.getElementById('questionForm');
    const formData = new FormData(form);
    const collected = {};

    for (const key of formData.keys()) {
      collected[key] = formData.getAll(key);
    }

    Object.entries(collected).forEach(([key, values]) => {
      this.userAnswers[key] = values.length > 1 ? values : values[0];
    });
  }

  // ===== ANALYSIS PAGE =====
  initAnalysisPage() {
    this.startAnalysis();
  }

  startAnalysis() {
    const progressBar = document.querySelector('#progressBar');
    const progressPercent = document.getElementById('progressPercent');

    // Simulate analysis progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 25;
      if (progress > 95) progress = 95;

      progressBar.style.width = progress + '%';
      progressPercent.textContent = Math.floor(progress);

      if (progress >= 95) {
        clearInterval(interval);
        setTimeout(() => {
          this.completeAnalysis();
        }, 1500);
      }
    }, 200);
  }

  completeAnalysis() {
    // Simulate API delay
    setTimeout(() => {
      this.generateAnalysisResults();
      this.loadPage('results');
    }, 2000);
  }

  generateAnalysisResults() {
    this.analysisData = this.generateKleosAnalysis();
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  textScore(text) {
    const words = String(text || '').trim().split(/\s+/).filter(Boolean).length;
    return this.clamp(Math.round(words * 2), 0, 20);
  }

  mapBudgetScore(value) {
    switch (value) {
      case '0-10k': return 9;
      case '10-50k': return 12;
      case '50-100k': return 15;
      case '100k+': return 18;
      default: return 11;
    }
  }

  getChallengeImpact(value) {
    const impact = {
      awareness: { clarity: -2, perceivedValue: 0, confidence: -1, differentiation: -1, journey: -2 },
      positioning: { clarity: -1, perceivedValue: -2, confidence: -1, differentiation: -4, journey: -1 },
      pricing: { clarity: 0, perceivedValue: -4, confidence: -1, differentiation: -1, journey: -1 },
      conversion: { clarity: -1, perceivedValue: -1, confidence: -2, differentiation: -1, journey: -4 }
    };
    return impact[value] || { clarity: 0, perceivedValue: 0, confidence: 0, differentiation: 0, journey: 0 };
  }

  getPerceptionLevel(score) {
    if (score >= 71) return 'Alto';
    if (score >= 41) return 'Medio';
    return 'Bajo';
  }

  getTrendLabel(score) {
    if (score >= 17) return '+18%';
    if (score >= 13) return '+10%';
    if (score >= 9) return '+4%';
    return '-6%';
  }

  getUncomfortableTruth(challenge, companyName, mainCompetitor) {
    const baseName = companyName ? `${companyName} ` : '';
    const competitorText = mainCompetitor ? ` frente a ${mainCompetitor}` : '';

    switch (challenge) {
      case 'awareness':
        return `${baseName}no está llegando de forma consistente al cliente ideal${competitorText}.`;
      case 'positioning':
        return `${baseName}tu mensaje se percibe como genérico y se mezcla con la competencia${competitorText}.`;
      case 'pricing':
        return `${baseName}tu valor no se traduce claramente en el precio percibido por el mercado.`;
      case 'conversion':
        return `${baseName}estás generando interés, pero el recorrido de compra no convierte correctamente.`;
      default:
        return `${baseName}existe una brecha entre lo que ofreces y lo que el mercado recibe.`;
    }
  }

  getPriorityText(lowestDimension) {
    switch (lowestDimension) {
      case 'Claridad':
        return 'Reformula tu propuesta con mensajes simples y concretos que conecten rápido con el cliente.';
      case 'Valor Percibido':
        return 'Eleva la percepción de valor con casos, beneficios claros y comparativas frente a competidores.';
      case 'Confianza':
        return 'Aumenta la confianza con pruebas sociales, testimonios y una experiencia coherente de marca.';
      case 'Diferenciación':
        return 'Destaca tu elemento único frente a la competencia y evita descripciones genéricas.';
      case 'Recorrido':
        return 'Mejora la secuencia de canales y mensajes para que el cliente avance más rápido hacia la compra.';
      default:
        return 'Prioriza la claridad de tu propuesta para reducir ambigüedad en el mercado.';
    }
  }

  generateKleosAnalysis() {
    const {
      value_proposition = '',
      differentiation = '',
      self_perception = '',
      client_perception = '',
      objectives = '',
      marketing_budget,
      sales_challenge,
      main_competitor = '',
      sales_channels,
      company_name = 'Tu Empresa'
    } = this.userAnswers;

    const valuePropScore = this.textScore(value_proposition);
    const differentiationScore = this.textScore(differentiation);
    const selfPerceptionScore = this.textScore(self_perception);
    const clientPerceptionScore = this.textScore(client_perception);
    const objectivesScore = this.textScore(objectives);
    const channelCount = Array.isArray(sales_channels) ? sales_channels.length : sales_channels ? 1 : 0;
    const channelScore = this.clamp(channelCount * 6 + 4, 0, 20);
    const budgetScore = this.mapBudgetScore(marketing_budget);
    const challengeImpact = this.getChallengeImpact(sales_challenge);

    const clarity = this.clamp(Math.round(valuePropScore * 0.55 + differentiationScore * 0.35 + challengeImpact.clarity + 2), 0, 20);
    const perceivedValue = this.clamp(Math.round(budgetScore * 0.45 + valuePropScore * 0.2 + challengeImpact.perceivedValue + 3), 0, 20);
    const confidence = this.clamp(Math.round(selfPerceptionScore * 0.4 + clientPerceptionScore * 0.35 + objectivesScore * 0.2 + challengeImpact.confidence + 2), 0, 20);
    const differentiationFactor = this.clamp(Math.round(differentiationScore * 0.45 + selfPerceptionScore * 0.25 + clientPerceptionScore * 0.15 + challengeImpact.differentiation + 2), 0, 20);
    const journey = this.clamp(Math.round(channelScore * 0.45 + objectivesScore * 0.3 + budgetScore * 0.15 + challengeImpact.journey + 2), 0, 20);

    const dimensions = [
      { name: 'Claridad', score: clarity, trend: this.getTrendLabel(clarity) },
      { name: 'Valor Percibido', score: perceivedValue, trend: this.getTrendLabel(perceivedValue) },
      { name: 'Confianza', score: confidence, trend: this.getTrendLabel(confidence) },
      { name: 'Diferenciación', score: differentiationFactor, trend: this.getTrendLabel(differentiationFactor) },
      { name: 'Recorrido', score: journey, trend: this.getTrendLabel(journey) }
    ];

    const totalIndex = clarity + perceivedValue + confidence + differentiationFactor + journey;
    const perceptionLevel = this.getPerceptionLevel(totalIndex);

    const lowestDimension = dimensions.reduce((lowest, current) => current.score < lowest.score ? current : lowest, dimensions[0]);
    const mainDiagnosis = `Tu mayor oportunidad está en ${lowestDimension.name.toLowerCase()}. Ese factor limita tu capacidad para convertir claridad en resultados.`;
    const perceptionDetected = `Detectamos que tu marca se presenta internamente como “${self_perception}” mientras que tus clientes la perciben como “${client_perception}”.`;
    const uncomfortableTruth = this.getUncomfortableTruth(sales_challenge, company_name, main_competitor);
    const priorityNumberOne = this.getPriorityText(lowestDimension.name);
    const actionPlan = `1. Clarifica tu mensaje principal. 2. Refuerza el valor percibido. 3. Alinea el recorrido de compra con tus canales prioritarios.`;

    return {
      businessName: company_name,
      timestamp: new Date().toLocaleDateString('es-ES'),
      kleosIndex: totalIndex,
      perceptionLevel,
      perceptionDetected,
      uncomfortableTruth,
      mainDiagnosis,
      priorityNumberOne,
      actionPlan,
      dimensions,
      confidence: this.clamp(Math.round(60 + totalIndex * 0.35), 50, 98)
    };
  }

  // ===== RESULTS PAGE =====
  initResultsPage() {
    this.displayResults();
  }

  displayResults() {
    if (!this.analysisData) return;

    const insightCard = document.querySelector('.insight-card');
    if (insightCard) {
      this.animateCountUp('insight-number-display', 0, this.analysisData.kleosIndex, 2000);
      const watermark = document.getElementById('insight-watermark');
      if (watermark) {
        watermark.textContent = this.analysisData.kleosIndex;
      }
    }

    const perceptionLevelEl = document.getElementById('perception-level');
    if (perceptionLevelEl) {
      perceptionLevelEl.textContent = this.analysisData.perceptionLevel;
    }

    const perceptionDetectedEl = document.getElementById('perception-detected');
    if (perceptionDetectedEl) {
      perceptionDetectedEl.textContent = this.analysisData.perceptionDetected;
    }

    const insightText = document.getElementById('insight-text');
    if (insightText) {
      insightText.textContent = this.analysisData.mainDiagnosis;
    }

    const confidenceEl = document.getElementById('insight-confidence');
    if (confidenceEl) {
      confidenceEl.textContent = `${this.analysisData.confidence}%`;
    }

    this.displayDimensions();
    this.displayPerceptionComparison();
    this.displayRecommendations();
  }

  displayDimensions() {
    const dimensionsContainer = document.querySelector('.dimensions-grid');
    if (!dimensionsContainer) return;

    dimensionsContainer.innerHTML = '';

    this.analysisData.dimensions.forEach((dim, index) => {
      const card = document.createElement('div');
      card.className = 'card dimension-card';
      card.style.animation = `slideUp 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards`;
      card.style.animationDelay = `${index * 100}ms`;
      card.innerHTML = `
        <div style="font-family: var(--font-mono); font-size: 28px; color: var(--color-gold); margin-bottom: 16px;">
          ${dim.score}/20
        </div>
        <h4 style="font-family: var(--font-display); font-size: 18px; margin-bottom: 12px;">${dim.name}</h4>
        <div style="font-family: var(--font-mono); font-size: 14px; color: var(--color-success);">
          ${dim.trend} tendencia
        </div>
      `;
      dimensionsContainer.appendChild(card);
    });
  }

  displayRecommendations() {
    const recsContainer = document.querySelector('.recommendations-list');
    if (!recsContainer) return;

    recsContainer.innerHTML = '';

    const items = [
      {
        title: 'Diagnóstico Principal',
        description: this.analysisData.mainDiagnosis,
        accent: 'P1'
      },
      {
        title: 'Prioridad Número 1',
        description: this.analysisData.priorityNumberOne,
        accent: 'Prioridad'
      }
    ];

    items.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'card recommendation-card';
      card.style.animation = `slideUp 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards`;
      card.style.animationDelay = `${index * 100}ms`;

      card.innerHTML = `
        <div style="display: flex; gap: 16px; align-items: flex-start;">
          <div style="font-family: var(--font-mono); font-size: 24px; font-weight: 700; color: var(--color-gold); opacity: 0.2; min-width: 40px;">
            ${String(index + 1).padStart(2, '0')}
          </div>
          <div style="flex: 1;">
            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 8px;">
              <h4 style="font-family: var(--font-display); font-size: 20px; margin: 0;">${item.title}</h4>
              <span style="font-family: var(--font-mono); font-size: 11px; padding: 4px 8px; background-color: rgba(197, 160, 89, 0.12); border-left: 2px solid var(--color-gold); color: var(--color-gold);">
                ${item.accent}
              </span>
            </div>
            <p style="font-size: 14px; color: var(--color-gray-medium); margin-bottom: 12px;">
              ${item.description}
            </p>
          </div>
        </div>
      `;
      recsContainer.appendChild(card);
    });

    const planCard = document.createElement('div');
    planCard.className = 'card recommendation-card';
    planCard.style.animation = `slideUp 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards`;
    planCard.style.animationDelay = `${items.length * 100}ms`;

    if (this.isPremium) {
      planCard.innerHTML = `
        <div style="display: flex; gap: 16px; align-items: flex-start;">
          <div style="font-family: var(--font-mono); font-size: 24px; font-weight: 700; color: var(--color-gold); opacity: 0.2; min-width: 40px;">
            ${String(items.length + 1).padStart(2, '0')}
          </div>
          <div style="flex: 1;">
            <div style="display: flex; gap: 12px; align-items: center; margin-bottom: 8px;">
              <h4 style="font-family: var(--font-display); font-size: 20px; margin: 0;">Plan de Acción</h4>
              <span style="font-family: var(--font-mono); font-size: 11px; padding: 4px 8px; background-color: rgba(197, 160, 89, 0.12); border-left: 2px solid var(--color-gold); color: var(--color-gold);">
                Plan
              </span>
            </div>
            <p style="font-size: 14px; color: var(--color-gray-medium); margin-bottom: 12px;">
              ${this.analysisData.actionPlan}
            </p>
          </div>
        </div>
      `;
    } else {
      planCard.innerHTML = `
        <div style="display: flex; gap: 16px; align-items: center;">
          <div style="font-family: var(--font-mono); font-size: 24px; font-weight: 700; color: var(--color-gold); opacity: 0.2; min-width: 40px;">
            🔒
          </div>
          <div style="flex: 1;">
            <h4 style="font-family: var(--font-display); font-size: 20px; margin: 0;">Plan de Acción</h4>
            <p style="font-size: 14px; color: var(--color-gray-medium); margin-top: 12px;">
              El plan completo está reservado para la versión premium. Actualiza para recibir una ruta de acción detallada.
            </p>
          </div>
        </div>
      `;
    }

    recsContainer.appendChild(planCard);
  }

  displayPerceptionComparison() {
    const container = document.querySelector('.perception-comparison');
    if (!container) return;

    container.innerHTML = `
      <div class="grid-2">
        <div class="card" style="animation: slideUp 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards;">
          <h4 style="font-family: var(--font-display); font-size: 20px; margin-bottom: 24px; color: var(--color-gold);">
            Percepción Detectada
          </h4>
          <p style="font-size: 14px; color: var(--color-gray-medium); line-height: 1.7;">
            ${this.analysisData.perceptionDetected}
          </p>
        </div>
        <div class="card" style="animation: slideUp 600ms cubic-bezier(0.4, 0, 0.2, 1) forwards; animation-delay: 100ms;">
          <h4 style="font-family: var(--font-display); font-size: 20px; margin-bottom: 24px; color: var(--color-gold);">
            Verdad Incómoda
          </h4>
          <p style="font-size: 14px; color: var(--color-gray-medium); line-height: 1.7;">
            ${this.analysisData.uncomfortableTruth}
          </p>
        </div>
      </div>
    `;
  }

  animateCountUp(elementId, start, end, duration) {
    const element = document.getElementById(elementId);
    if (!element) return;

    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
        element.classList.add('pulse');
      }
      element.textContent = Math.floor(current);
    }, 16);
  }

  // ===== UTILITIES =====
  showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 5000);
  }

  downloadResults() {
    if (!this.analysisData) return;

    const planText = this.isPremium ? this.analysisData.actionPlan : 'Contenido reservado para la versión premium.';
    const content = `
KLEOS INSIGHT™ - REPORTE DE ANÁLISIS
====================================

Empresa: ${this.analysisData.businessName}
Fecha: ${this.analysisData.timestamp}
Índice KLEOS: ${this.analysisData.kleosIndex}
Nivel de Percepción: ${this.analysisData.perceptionLevel}

PERCEPCIÓN DETECTADA
--------------------
${this.analysisData.perceptionDetected}

VERDAD INCÓMODA
---------------
${this.analysisData.uncomfortableTruth}

DIAGNÓSTICO PRINCIPAL
---------------------
${this.analysisData.mainDiagnosis}

PRIORIDAD NÚMERO 1
------------------
${this.analysisData.priorityNumberOne}

PLAN DE ACCIÓN
--------------
${planText}

DIMENSIONES KLEOS
-----------------
${this.analysisData.dimensions.map(d => `${d.name}: ${d.score}/20 (${d.trend})`).join('\n')}

Generado por KLEOS INSIGHT™
    `;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kleos-insight-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    this.showToast('Reporte descargado exitosamente', 'success');
  }

  shareResults() {
    const text = `He descubierto mi Índice KLEOS (${this.analysisData.kleosIndex}) y el diagnóstico principal: ${this.analysisData.mainDiagnosis}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'KLEOS INSIGHT™ - Mi Análisis',
        text: text
      });
    } else {
      this.copyToClipboard(text);
    }
  }

  copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
      this.showToast('Copiado al portapapeles', 'success');
    });
  }

  startNewAnalysis() {
    this.userAnswers = {};
    this.analysisData = null;
    this.loadPage('home');
  }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.kleosApp = new KleosInsight();
});
