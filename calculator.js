/**
 * Calculadora de Tiempo y Fuga Operativa
 * Diseñada para NikkoDev OS · calc.nikko.dev
 * Enfoque en ahorro de tiempo, jornadas laborales y ROI pragmático
 */

(function () {
  'use strict';

  const SECTORS = {
    educacion: {
      name: 'Educación (Colegios / Institutos)',
      context: 'Matrículas, pedir notas, consultar horarios y responder 150 veces la misma pregunta de acudientes por WhatsApp.',
      icon: '🎓'
    },
    industria: {
      name: 'Industria / Ferretería',
      context: 'Cotizaciones por chat, pedir existencias a bodega y transcribir remisiones a mano.',
      icon: '⚙️'
    },
    salud: {
      name: 'Salud / IPS',
      context: 'Agendar citas, autorizaciones de EPS, llamadas de confirmación y lidiar con pacientes que no llegan.',
      icon: '🩺'
    },
    transporte: {
      name: 'Transporte / Logística',
      context: 'Avisar por dónde va el camión, planillas de viaje, remisiones de carga y reportar novedades de ruta.',
      icon: '🚚'
    },
    comercio: {
      name: 'Comercio / Servicios',
      context: 'Pasar catálogo en PDF, confirmar existencias, tomar pedidos por chat y transcribirlos al sistema contable.',
      icon: '💼'
    }
  };

  const CONSTANTS = {
    WEEKS_PER_MONTH: 4.33,
    WEEKS_PER_YEAR: 52,
    AUTOMATION_EFFICIENCY: 0.70, // 70% recuperable
    WORK_DAY_HOURS: 8,
    SPRINT_INVESTMENT_COP: 1500000,
    WHATSAPP_NUMBER: '573136638097',
    CONTACT_EMAIL: 'contacto@nikko.dev'
  };

  const state = {
    sector: 'industria',
    personas: 2,
    horas: 10,
    costoHora: 12000,
    nombre: '',
    empresa: '',
    cargo: '',
    whatsapp: '',
    isDark: false,
    calc: {
      fugaMensual: 0,
      fugaAnual: 0,
      horasRecuperables: 0,
      jornadasGanadas: 0,
      horasSemana: 0,
      horasMes: 0,
      paybackMeses: 0
    }
  };

  // Referencias DOM
  const dom = {
    root: document.documentElement,
    sectorButtons: document.querySelectorAll('.sec-pill-btn'),
    sectorContext: document.getElementById('sector-context-text'),
    personasRange: document.getElementById('personas-range'),
    personasBadge: document.getElementById('personas-val'),
    btnPersonasMinus: document.getElementById('btn-personas-minus'),
    btnPersonasPlus: document.getElementById('btn-personas-plus'),
    horasRange: document.getElementById('horas-range'),
    horasBadge: document.getElementById('horas-val'),
    btnHorasMinus: document.getElementById('btn-horas-minus'),
    btnHorasPlus: document.getElementById('btn-horas-plus'),
    costoInput: document.getElementById('costo-hora-input'),
    costoPresetPills: document.querySelectorAll('.cost-chip'),
    // Métricas de Tiempo
    horasRecuperablesVal: document.getElementById('res-horas-recuperables'),
    jornadasText: document.getElementById('res-jornadas-text'),
    horasSemanaVal: document.getElementById('res-horas-semana'),
    horasMesVal: document.getElementById('res-horas-mes'),
    jornadasBadgeVal: document.getElementById('res-jornadas-badge'),
    gaugeFill: document.getElementById('gauge-fill'),
    // Métricas Financieras y ROI
    fugaAnualVal: document.getElementById('res-fuga-anual'),
    paybackBadge: document.getElementById('res-payback-badge'),
    paybackBadgeSec: document.getElementById('res-payback-badge-sec'),
    paybackText: document.getElementById('res-payback-text'),
    // Lead Form & CTA
    btnOpenLead: document.getElementById('btn-open-lead'),
    leadFormBox: document.getElementById('lead-form-box'),
    inputNombre: document.getElementById('lead-nombre'),
    inputEmpresa: document.getElementById('lead-empresa'),
    inputCargo: document.getElementById('lead-cargo'),
    inputWhatsapp: document.getElementById('lead-whatsapp'),
    btnSendWhatsapp: document.getElementById('btn-send-whatsapp'),
    btnSendEmail: document.getElementById('btn-send-email'),
    btnCopyReport: document.getElementById('btn-copy-report'),
    toast: document.getElementById('toast'),
    // Tema
    btnThemeToggle: document.getElementById('btn-theme-toggle'),
    iconSun: document.getElementById('theme-icon-sun'),
    iconMoon: document.getElementById('theme-icon-moon'),
    // FX
    fxBg: document.querySelector('.fx-bg'),
    canvasNet: document.getElementById('fxNet'),
    glassPanels: document.querySelectorAll('.time-hero-panel, .controls-panel, .roi-strip')
  };

  const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  });

  const numberFormatter = new Intl.NumberFormat('es-CO');

  function updateSliderFill(input) {
    if (!input) return;
    const min = parseFloat(input.min) || 0;
    const max = parseFloat(input.max) || 100;
    const val = parseFloat(input.value) || 0;
    const pct = ((val - min) / (max - min)) * 100;
    const trackBase = state.isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(15, 23, 42, 0.1)';
    input.style.background = `linear-gradient(to right, #10B981 0%, #10B981 ${pct}%, ${trackBase} ${pct}%, ${trackBase} 100%)`;
  }

  const currentDisplayed = {
    horasRecuperables: 728,
    fugaAnual: 12470400
  };

  let animFrame = null;
  function animateNumbers(targetHr, targetFa) {
    const startHr = currentDisplayed.horasRecuperables;
    const startFa = currentDisplayed.fugaAnual;
    const duration = 240;
    const startTime = performance.now();

    if (animFrame) cancelAnimationFrame(animFrame);

    function step(now) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);

      const curHr = Math.round(startHr + (targetHr - startHr) * ease);
      const curFa = Math.round(startFa + (targetFa - startFa) * ease);

      if (dom.horasRecuperablesVal) dom.horasRecuperablesVal.textContent = numberFormatter.format(curHr);
      if (dom.fugaAnualVal) dom.fugaAnualVal.textContent = currencyFormatter.format(curFa);

      if (progress < 1) {
        animFrame = requestAnimationFrame(step);
      } else {
        currentDisplayed.horasRecuperables = targetHr;
        currentDisplayed.fugaAnual = targetFa;
      }
    }

    animFrame = requestAnimationFrame(step);
  }

  function calculate() {
    const { personas, horas, costoHora } = state;

    const horasRecuperables = Math.round(personas * horas * CONSTANTS.WEEKS_PER_YEAR * CONSTANTS.AUTOMATION_EFFICIENCY);
    const jornadasGanadas = Math.round(horasRecuperables / CONSTANTS.WORK_DAY_HOURS);
    const horasSemana = Math.round(personas * horas * CONSTANTS.AUTOMATION_EFFICIENCY);
    const horasMes = Math.round(personas * horas * CONSTANTS.WEEKS_PER_MONTH * CONSTANTS.AUTOMATION_EFFICIENCY);

    const fugaMensual = Math.round(personas * horas * CONSTANTS.WEEKS_PER_MONTH * costoHora);
    const fugaAnual = Math.round(fugaMensual * 12);

    const ahorroMensual = fugaMensual * CONSTANTS.AUTOMATION_EFFICIENCY;
    const paybackMeses = ahorroMensual > 0 
      ? (CONSTANTS.SPRINT_INVESTMENT_COP / ahorroMensual) 
      : 99;

    state.calc = {
      fugaMensual,
      fugaAnual,
      horasRecuperables,
      jornadasGanadas,
      horasSemana,
      horasMes,
      paybackMeses
    };

    updateUI();
  }

  function updateUI() {
    const { fugaAnual, horasRecuperables, jornadasGanadas, horasSemana, horasMes, paybackMeses } = state.calc;

    animateNumbers(horasRecuperables, fugaAnual);

    if (dom.jornadasText) {
      dom.jornadasText.innerHTML = `⏳ Equivale a <strong>~${numberFormatter.format(jornadasGanadas)} jornadas laborales de 8h</strong> que tu equipo deja de quemar tecleando`;
    }
    if (dom.horasSemanaVal) dom.horasSemanaVal.textContent = `${horasSemana} h`;
    if (dom.horasMesVal) dom.horasMesVal.textContent = `${horasMes} h`;
    if (dom.jornadasBadgeVal) dom.jornadasBadgeVal.textContent = `${jornadasGanadas} días`;

    updateSliderFill(dom.personasRange);
    updateSliderFill(dom.horasRange);

    let paybackStr = '';
    let paybackExpl = '';

    if (paybackMeses <= 0.95) {
      const dias = Math.max(14, Math.round(paybackMeses * 30));
      paybackStr = `Retorno en ~${dias} días`;
      paybackExpl = `La automatización (Sprint de $1.5M COP) se amortiza en menos de un mes con el tiempo ahorrado. A partir de ahí, es pura rentabilidad operativa.`;
    } else if (paybackMeses <= 1.25) {
      paybackStr = `Retorno en ~1 mes`;
      paybackExpl = `La inversión se cubre por completo durante las primeras 4 semanas post-despliegue.`;
    } else {
      paybackStr = `Retorno en ~${paybackMeses.toFixed(1)} meses`;
      paybackExpl = `La inversión se amortiza en aprox. ${paybackMeses.toFixed(1)} meses con el tiempo ahorrado. A partir de ahí, es puro ahorro y tranquilidad operativa.`;
    }

    if (dom.paybackBadge) dom.paybackBadge.textContent = paybackStr;
    if (dom.paybackBadgeSec) dom.paybackBadgeSec.textContent = paybackStr;
    if (dom.paybackText) dom.paybackText.textContent = paybackExpl;

    updateContactLinks();
  }

  function triggerHaptic() {
    if (navigator.vibrate) {
      try { navigator.vibrate(8); } catch (e) {}
    }
  }

  function generateReportText() {
    const sec = SECTORS[state.sector] || SECTORS.industria;
    const { fugaMensual, fugaAnual, horasRecuperables, jornadasGanadas, horasSemana, paybackMeses } = state.calc;
    const nombre = state.nombre.trim() || 'No especificado';
    const empresa = state.empresa.trim() || 'Mi empresa';
    const cargo = state.cargo.trim() || 'Directivo / Líder';
    const tel = state.whatsapp.trim() || '';

    const paybackStr = paybackMeses <= 1 ? 'menos de 1 mes' : `${paybackMeses.toFixed(1)} meses`;

    return `Hola Brayan, calculé el impacto de automatización para mi empresa:

📋 MI OPERACIÓN
• Sector: ${sec.name}
• Empresa: ${empresa}
• Contacto: ${nombre} (${cargo})${tel ? `\n• WhatsApp: ${tel}` : ''}

⏳ TIEMPO QUE PODRÍAMOS RECUPERAR (70% automatizable)
• Horas al año devueltas al equipo: ${numberFormatter.format(horasRecuperables)} horas
• Equivalente en jornadas laborales de 8h: ~${numberFormatter.format(jornadasGanadas)} días completos de trabajo
• Tiempo liberado por semana: ~${horasSemana} horas libres

💰 IMPACTO ECONÓMICO ESTIMADO
• Nómina dedicada a tareas repetitivas: ${currencyFormatter.format(fugaMensual)} COP/mes
• Fuga anual acumulada: ${currencyFormatter.format(fugaAnual)} COP/año
• Retorno estimado de automatización (Sprint $1.5M): ${paybackStr}

Me interesa coordinar los 30 min de auditoría gratuita para revisar en detalle mis procesos y ver por dónde conviene empezar.`;
  }

  function updateContactLinks() {
    const text = generateReportText();
    const encoded = encodeURIComponent(text);

    if (dom.btnSendWhatsapp) {
      dom.btnSendWhatsapp.href = `https://wa.me/${CONSTANTS.WHATSAPP_NUMBER}?text=${encoded}`;
    }

    const subject = encodeURIComponent(`Auditoría de Procesos - ${state.empresa.trim() || 'Empresa'}`);
    if (dom.btnSendEmail) {
      dom.btnSendEmail.href = `mailto:${CONSTANTS.CONTACT_EMAIL}?subject=${subject}&body=${encoded}`;
    }
  }

  function showToast(msg) {
    if (!dom.toast) return;
    dom.toast.textContent = msg;
    dom.toast.classList.add('show');
    setTimeout(() => {
      dom.toast.classList.remove('show');
    }, 2800);
  }

  function initTheme() {
    const savedTheme = localStorage.getItem('nikkodev-theme');
    const isDark = savedTheme === 'dark';
    setTheme(isDark);

    if (dom.btnThemeToggle) {
      dom.btnThemeToggle.addEventListener('click', () => {
        triggerHaptic();
        setTheme(!state.isDark);
        updateSliderFill(dom.personasRange);
        updateSliderFill(dom.horasRange);
      });
    }
  }

  function setTheme(dark) {
    state.isDark = dark;
    if (dark) {
      dom.root.classList.add('dark');
      if (dom.iconSun) dom.iconSun.style.display = 'block';
      if (dom.iconMoon) dom.iconMoon.style.display = 'none';
      localStorage.setItem('nikkodev-theme', 'dark');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#07090E');
    } else {
      dom.root.classList.remove('dark');
      if (dom.iconSun) dom.iconSun.style.display = 'none';
      if (dom.iconMoon) dom.iconMoon.style.display = 'block';
      localStorage.setItem('nikkodev-theme', 'light');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F4FBF7');
    }
  }

  function initFX() {
    const canvas = dom.canvasNet;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let nodes = [];
    const mouse = { x: -9999, y: -9999 };
    const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

    const LINK_DIST = 140;
    const LINK_SQ = LINK_DIST * LINK_DIST;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = finePointer
        ? Math.max(20, Math.min(45, Math.round((width * height) / 26000)))
        : Math.max(12, Math.min(20, Math.round((width * height) / 45000)));

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        z: 0.4 + Math.random() * 0.8
      }));
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      const isDark = state.isDark;
      const pointColor = isDark ? '#34D399' : '#047857';
      const lineAlphaBase = isDark ? 0.24 : 0.16;
      const dotAlpha = isDark ? 0.7 : 0.5;

      ctx.lineWidth = 1;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!reduceMotion) {
          n.x += n.vx;
          n.y += n.vy;
          if (n.x < -10) n.x = width + 10;
          else if (n.x > width + 10) n.x = -10;
          if (n.y < -10) n.y = height + 10;
          else if (n.y > height + 10) n.y = -10;
        }

        ctx.fillStyle = pointColor;
        ctx.globalAlpha = dotAlpha * n.z;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6 * n.z, 0, Math.PI * 2);
        ctx.fill();

        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const distSq = dx * dx + dy * dy;

          if (distSq < LINK_SQ) {
            ctx.strokeStyle = pointColor;
            ctx.globalAlpha = (1 - distSq / LINK_SQ) * lineAlphaBase;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }
      }

      if (!reduceMotion) {
        requestAnimationFrame(render);
      }
    }

    if (dom.fxBg) {
      window.addEventListener('pointermove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        dom.fxBg.style.setProperty('--px', `${e.clientX}px`);
        dom.fxBg.style.setProperty('--py', `${e.clientY}px`);
      }, { passive: true });
    }

    dom.glassPanels.forEach((panel) => {
      panel.addEventListener('pointermove', (e) => {
        const rect = panel.getBoundingClientRect();
        panel.style.setProperty('--mx', `${e.clientX - rect.left}px`);
        panel.style.setProperty('--my', `${e.clientY - rect.top}px`);
      }, { passive: true });
    });

    window.addEventListener('resize', resize, { passive: true });
    resize();
    render();
  }

  function initListeners() {
    // 1. Selector de Sector en Pills
    dom.sectorButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        triggerHaptic();
        dom.sectorButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const sectorKey = btn.dataset.sector;
        state.sector = sectorKey;
        const info = SECTORS[sectorKey];
        if (dom.sectorContext) {
          dom.sectorContext.innerHTML = `<strong>${info.name}:</strong> ${info.context}`;
        }
        calculate();
      });
    });

    // 2. Personas
    dom.personasRange.addEventListener('input', (e) => {
      state.personas = parseInt(e.target.value, 10);
      dom.personasBadge.textContent = state.personas;
      updateSliderFill(dom.personasRange);
      calculate();
    });

    dom.btnPersonasMinus.addEventListener('click', () => {
      triggerHaptic();
      if (state.personas > parseInt(dom.personasRange.min, 10)) {
        state.personas -= 1;
        dom.personasRange.value = state.personas;
        dom.personasBadge.textContent = state.personas;
        updateSliderFill(dom.personasRange);
        calculate();
      }
    });

    dom.btnPersonasPlus.addEventListener('click', () => {
      triggerHaptic();
      if (state.personas < parseInt(dom.personasRange.max, 10)) {
        state.personas += 1;
        dom.personasRange.value = state.personas;
        dom.personasBadge.textContent = state.personas;
        updateSliderFill(dom.personasRange);
        calculate();
      }
    });

    // 3. Horas semanales
    dom.horasRange.addEventListener('input', (e) => {
      state.horas = parseInt(e.target.value, 10);
      dom.horasBadge.textContent = `${state.horas}h`;
      updateSliderFill(dom.horasRange);
      calculate();
    });

    dom.btnHorasMinus.addEventListener('click', () => {
      triggerHaptic();
      if (state.horas > parseInt(dom.horasRange.min, 10)) {
        state.horas -= 1;
        dom.horasRange.value = state.horas;
        dom.horasBadge.textContent = `${state.horas}h`;
        updateSliderFill(dom.horasRange);
        calculate();
      }
    });

    dom.btnHorasPlus.addEventListener('click', () => {
      triggerHaptic();
      if (state.horas < parseInt(dom.horasRange.max, 10)) {
        state.horas += 1;
        dom.horasRange.value = state.horas;
        dom.horasBadge.textContent = `${state.horas}h`;
        updateSliderFill(dom.horasRange);
        calculate();
      }
    });

    // 4. Costo promedio por hora
    dom.costoInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value.replace(/\D/g, ''), 10);
      if (isNaN(val) || val <= 0) val = 12000;
      state.costoHora = val;

      dom.costoPresetPills.forEach((p) => {
        p.classList.toggle('active', parseInt(p.dataset.val, 10) === val);
      });

      calculate();
    });

    dom.costoPresetPills.forEach((pill) => {
      pill.addEventListener('click', () => {
        triggerHaptic();
        const val = parseInt(pill.dataset.val, 10);
        state.costoHora = val;
        dom.costoInput.value = val;
        dom.costoPresetPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        calculate();
      });
    });

    // 5. Botón Abrir / Alternar Lead Form
    dom.btnOpenLead.addEventListener('click', () => {
      triggerHaptic();
      const isClosed = !dom.leadFormBox.classList.contains('open');
      dom.leadFormBox.classList.toggle('open');
      if (isClosed) {
        dom.btnOpenLead.querySelector('span').textContent = 'Ocultar formulario ↑';
        setTimeout(() => {
          dom.leadFormBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          dom.inputNombre.focus();
        }, 120);
      } else {
        dom.btnOpenLead.querySelector('span').textContent = 'Solicitar Auditoría Gratuita de Procesos';
      }
    });

    // 6. Campos del formulario
    [dom.inputNombre, dom.inputEmpresa, dom.inputCargo, dom.inputWhatsapp].forEach((input) => {
      input.addEventListener('input', (e) => {
        state[e.target.name] = e.target.value;
        updateContactLinks();
      });
    });

    // 7. Copiar reporte
    dom.btnCopyReport.addEventListener('click', async (e) => {
      e.preventDefault();
      triggerHaptic();
      const text = generateReportText();
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = text;
          document.body.appendChild(textArea);
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        showToast('✓ Diagnóstico copiado al portapapeles');
      } catch (err) {
        showToast('Listo para enviar');
      }
    });
  }

  function init() {
    initTheme();
    initListeners();
    calculate();
    initFX();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
