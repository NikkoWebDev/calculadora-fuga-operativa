/**
 * Calculadora de Fuga Operativa y Retorno de Automatización
 * FX Engine & Runtime inspirado en NikkoDev OS
 * 0 dependencias · Ultraligero · Mobile-First
 */

(function () {
  'use strict';

  // Configuración y datos contextuales por sector
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
    SPRINT_INVESTMENT_COP: 1500000,
    WHATSAPP_NUMBER: '573136638097',
    CONTACT_EMAIL: 'contacto@nikko.dev'
  };

  // Estado reactivo
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
      paybackMeses: 0
    }
  };

  // Referencias DOM
  const dom = {
    root: document.documentElement,
    sectorButtons: document.querySelectorAll('.sector-btn'),
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
    costoPresetPills: document.querySelectorAll('.preset-pill'),
    // Resultados
    fugaMensualVal: document.getElementById('res-fuga-mensual'),
    fugaAnualVal: document.getElementById('res-fuga-anual'),
    horasRecuperablesVal: document.getElementById('res-horas-recuperables'),
    fugaAnualVs: document.getElementById('res-fuga-anual-vs'),
    paybackBadge: document.getElementById('res-payback-badge'),
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
    glassPanels: document.querySelectorAll('.glass-panel, .results-panel')
  };

  // Formateadores de moneda colombiana
  const currencyFormatter = new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  });

  const numberFormatter = new Intl.NumberFormat('es-CO');

  function calculate() {
    const { personas, horas, costoHora } = state;

    // Fuga Operativa Mensual (COP) = personas × horas_semanales × 4.33 × costo_hora
    const fugaMensual = Math.round(personas * horas * CONSTANTS.WEEKS_PER_MONTH * costoHora);

    // Fuga Operativa Anual (COP) = Fuga Mensual × 12
    const fugaAnual = Math.round(fugaMensual * 12);

    // Horas recuperables al año (asumiendo 70% de automatización de tareas repetitivas)
    const horasRecuperables = Math.round(personas * horas * CONSTANTS.WEEKS_PER_YEAR * CONSTANTS.AUTOMATION_EFFICIENCY);

    // Payback = 1.500.000 / (Fuga Mensual × 0.70)
    const ahorroMensualEstimado = fugaMensual * CONSTANTS.AUTOMATION_EFFICIENCY;
    const paybackMeses = ahorroMensualEstimado > 0 
      ? (CONSTANTS.SPRINT_INVESTMENT_COP / ahorroMensualEstimado) 
      : 99;

    state.calc = {
      fugaMensual,
      fugaAnual,
      horasRecuperables,
      paybackMeses
    };

    updateUI();
  }

  function updateUI() {
    const { fugaMensual, fugaAnual, horasRecuperables, paybackMeses } = state.calc;

    dom.fugaMensualVal.textContent = currencyFormatter.format(fugaMensual);
    dom.fugaAnualVal.textContent = currencyFormatter.format(fugaAnual);
    dom.horasRecuperablesVal.textContent = `${numberFormatter.format(horasRecuperables)} h`;
    dom.fugaAnualVs.textContent = currencyFormatter.format(fugaAnual);

    // Payback humanizado
    if (paybackMeses <= 0.95) {
      const dias = Math.max(14, Math.round(paybackMeses * 30));
      dom.paybackBadge.textContent = `Retorno en ~${dias} días`;
      dom.paybackText.textContent = `La automatización (Sprint de $1.5M COP) se amortiza en menos de un mes con el tiempo ahorrado. A partir de ahí, es pura rentabilidad.`;
    } else if (paybackMeses <= 1.25) {
      dom.paybackBadge.textContent = `Retorno en ~1 mes`;
      dom.paybackText.textContent = `La inversión se cubre por completo durante las primeras 4 semanas post-despliegue.`;
    } else {
      dom.paybackBadge.textContent = `Retorno en ~${paybackMeses.toFixed(1)} meses`;
      dom.paybackText.textContent = `La automatización se paga sola en aprox. ${paybackMeses.toFixed(1)} meses con el tiempo ahorrado. A partir de ahí, es pura rentabilidad y tranquilidad para el equipo.`;
    }

    updateContactLinks();
  }

  function generateReportText() {
    const sec = SECTORS[state.sector] || SECTORS.industria;
    const { fugaMensual, fugaAnual, horasRecuperables, paybackMeses } = state.calc;
    const nombre = state.nombre.trim() || 'No especificado';
    const empresa = state.empresa.trim() || 'Empresa en Sogamoso';
    const cargo = state.cargo.trim() || 'Líder / Directivo';
    const tel = state.whatsapp.trim() || '';

    const paybackStr = paybackMeses <= 1 ? 'menos de 1 mes' : `${paybackMeses.toFixed(1)} meses`;

    return `Hola Brayan, estuve en tu taller en Sogamoso.

Hice el cálculo de mi empresa en la calculadora y estos fueron los resultados:

📋 DATOS DE MI OPERACIÓN
• Sector: ${sec.name}
• Empresa: ${empresa}
• Contacto: ${nombre} (${cargo})${tel ? `\n• WhatsApp: ${tel}` : ''}

📊 RESULTADOS ESTIMADOS
• Personas en atención manual / WhatsApp: ${state.personas}
• Horas dedicadas a consultas repetitivas: ${state.horas}h/semana por persona
• Costo hora promedio: ${currencyFormatter.format(state.costoHora)} COP
• Costo mensual de la atención manual: ${currencyFormatter.format(fugaMensual)} COP
• Costo anual acumulado: ${currencyFormatter.format(fugaAnual)} COP
• Horas recuperables al año: ${numberFormatter.format(horasRecuperables)} horas (70% automatizable)
• Retorno estimado de automatización (Sprint $1.5M): ${paybackStr}

Me interesa coordinar los 30 minutos de auditoría gratuita para revisar en detalle mis procesos y ver por dónde conviene empezar.`;
  }

  function updateContactLinks() {
    const text = generateReportText();
    const encoded = encodeURIComponent(text);

    // WhatsApp
    dom.btnSendWhatsapp.href = `https://wa.me/${CONSTANTS.WHATSAPP_NUMBER}?text=${encoded}`;

    // Email
    const subject = encodeURIComponent(`Auditoría de Procesos - ${state.empresa.trim() || 'Sogamoso'}`);
    dom.btnSendEmail.href = `mailto:${CONSTANTS.CONTACT_EMAIL}?subject=${subject}&body=${encoded}`;
  }

  function showToast(msg) {
    dom.toast.textContent = msg;
    dom.toast.classList.add('show');
    setTimeout(() => {
      dom.toast.classList.remove('show');
    }, 2800);
  }

  // ── Módulo de Tema (Claro Menta <-> Oscuro Obsidian) ──
  function initTheme() {
    const savedTheme = localStorage.getItem('nikkodev-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Predeterminado: Modo Claro Menta salvo que el usuario haya elegido oscuro previamente
    const isDark = savedTheme === 'dark';
    setTheme(isDark);

    dom.btnThemeToggle.addEventListener('click', () => {
      setTheme(!state.isDark);
    });
  }

  function setTheme(dark) {
    state.isDark = dark;
    if (dark) {
      dom.root.classList.add('dark');
      dom.iconSun.style.display = 'block';
      dom.iconMoon.style.display = 'none';
      localStorage.setItem('nikkodev-theme', 'dark');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#0b0d10');
    } else {
      dom.root.classList.remove('dark');
      dom.iconSun.style.display = 'none';
      dom.iconMoon.style.display = 'block';
      localStorage.setItem('nikkodev-theme', 'light');
      document.querySelector('meta[name="theme-color"]')?.setAttribute('content', '#F8FAFC');
    }
  }

  // ── Módulo FX de Fondo Vivo y Linterna (NikkoDev FX Engine) ──
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

    const LINK_DIST = 135;
    const LINK_SQ = LINK_DIST * LINK_DIST;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = finePointer
        ? Math.max(22, Math.min(50, Math.round((width * height) / 25000)))
        : Math.max(12, Math.min(20, Math.round((width * height) / 45000)));

      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        z: 0.4 + Math.random() * 0.8
      }));
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      const isDark = state.isDark;
      const pointColor = isDark ? '#34D399' : '#047857';
      const lineAlphaBase = isDark ? 0.22 : 0.16;
      const dotAlpha = isDark ? 0.65 : 0.45;

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

        // Dibujar punto
        ctx.fillStyle = pointColor;
        ctx.globalAlpha = dotAlpha * n.z;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 1.6 * n.z, 0, Math.PI * 2);
        ctx.fill();

        // Conectar puntos cercanos
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

    // Linterna reactiva al cursor/toque para el grid de fondo
    if (dom.fxBg) {
      window.addEventListener('pointermove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
        dom.fxBg.style.setProperty('--px', `${e.clientX}px`);
        dom.fxBg.style.setProperty('--py', `${e.clientY}px`);
      }, { passive: true });
    }

    // Linterna perimetral para paneles de vidrio
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

  // ── Event Listeners de la Calculadora ──
  function initListeners() {
    // 1. Selector de Sector
    dom.sectorButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        dom.sectorButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const sectorKey = btn.dataset.sector;
        state.sector = sectorKey;
        const info = SECTORS[sectorKey];
        dom.sectorContext.innerHTML = `<strong>${info.name}:</strong> ${info.context}`;
        calculate();
      });
    });

    // 2. Personas (slider + botones táctiles)
    dom.personasRange.addEventListener('input', (e) => {
      state.personas = parseInt(e.target.value, 10);
      dom.personasBadge.textContent = state.personas;
      calculate();
    });

    dom.btnPersonasMinus.addEventListener('click', () => {
      if (state.personas > parseInt(dom.personasRange.min, 10)) {
        state.personas -= 1;
        dom.personasRange.value = state.personas;
        dom.personasBadge.textContent = state.personas;
        calculate();
      }
    });

    dom.btnPersonasPlus.addEventListener('click', () => {
      if (state.personas < parseInt(dom.personasRange.max, 10)) {
        state.personas += 1;
        dom.personasRange.value = state.personas;
        dom.personasBadge.textContent = state.personas;
        calculate();
      }
    });

    // 3. Horas semanales (slider + botones táctiles)
    dom.horasRange.addEventListener('input', (e) => {
      state.horas = parseInt(e.target.value, 10);
      dom.horasBadge.textContent = `${state.horas}h`;
      calculate();
    });

    dom.btnHorasMinus.addEventListener('click', () => {
      if (state.horas > parseInt(dom.horasRange.min, 10)) {
        state.horas -= 1;
        dom.horasRange.value = state.horas;
        dom.horasBadge.textContent = `${state.horas}h`;
        calculate();
      }
    });

    dom.btnHorasPlus.addEventListener('click', () => {
      if (state.horas < parseInt(dom.horasRange.max, 10)) {
        state.horas += 1;
        dom.horasRange.value = state.horas;
        dom.horasBadge.textContent = `${state.horas}h`;
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
        const val = parseInt(pill.dataset.val, 10);
        state.costoHora = val;
        dom.costoInput.value = val;
        dom.costoPresetPills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        calculate();
      });
    });

    // 5. Botón Abrir / Alternar Formulario Lead
    dom.btnOpenLead.addEventListener('click', () => {
      const isClosed = !dom.leadFormBox.classList.contains('open');
      dom.leadFormBox.classList.toggle('open');
      if (isClosed) {
        dom.btnOpenLead.textContent = 'Ocultar formulario de contacto ↑';
        setTimeout(() => {
          dom.leadFormBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          dom.inputNombre.focus();
        }, 120);
      } else {
        dom.btnOpenLead.textContent = 'Solicitar Auditoría Gratuita de Procesos';
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

  // Inicialización global
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
