/**
 * Calculadora de Fuga Operativa y Retorno de Automatización
 * Optimizada para eventos en vivo en Sogamoso · nikko.dev
 */

(function () {
  'use strict';

  // Configuración y datos por sector
  const SECTORS = {
    educacion: {
      name: 'Colegio / Educación',
      context: 'Matrículas, notas, preguntas frecuentes de acudientes y circulares por WhatsApp.',
      icon: '🎓'
    },
    industria: {
      name: 'Industria / Ferretería',
      context: 'Cotizaciones en WhatsApp, consulta de existencias en bodega y remisiones manuales.',
      icon: '⚙️'
    },
    salud: {
      name: 'Salud / IPS',
      context: 'Agendamiento de citas médicas, autorizaciones, recordatorios y gestión de inasistencias.',
      icon: '🩺'
    },
    transporte: {
      name: 'Transporte / Logística',
      context: 'Seguimiento de fletes, planilla de viaje y novedades de ruta repetidas a clientes.',
      icon: '🚚'
    },
    comercio: {
      name: 'Comercio / Servicios',
      context: 'Atención de pedidos por chat, catálogo desactualizado y transcripción a facturación.',
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
    calc: {
      fugaMensual: 0,
      fugaAnual: 0,
      horasRecuperables: 0,
      paybackMeses: 0
    }
  };

  // Referencias DOM
  const dom = {
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
    toast: document.getElementById('toast')
  };

  // Formateadores
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

    // Horas recuperables al año (asumiendo 70% de automatización)
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

    // Actualizar cifras
    dom.fugaMensualVal.textContent = currencyFormatter.format(fugaMensual);
    dom.fugaAnualVal.textContent = currencyFormatter.format(fugaAnual);
    dom.horasRecuperablesVal.textContent = `${numberFormatter.format(horasRecuperables)} h`;
    dom.fugaAnualVs.textContent = currencyFormatter.format(fugaAnual);

    // Actualizar badge de payback
    if (paybackMeses <= 0.95) {
      const dias = Math.max(12, Math.round(paybackMeses * 30));
      dom.paybackBadge.textContent = `Retorno en ~${dias} días`;
      dom.paybackText.textContent = `La inversión de $1.5M COP se amortiza en menos de un mes con el ahorro de tiempo.`;
    } else if (paybackMeses <= 1.25) {
      dom.paybackBadge.textContent = `Retorno en ~1 mes`;
      dom.paybackText.textContent = `La inversión se cubre por completo durante las primeras 4 semanas post-despliegue.`;
    } else {
      dom.paybackBadge.textContent = `Retorno en ~${paybackMeses.toFixed(1)} meses`;
      dom.paybackText.textContent = `Recuperas la inversión en aprox. ${paybackMeses.toFixed(1)} meses y el resto del año es ahorro neto.`;
    }

    // Actualizar links de contacto con los datos en vivo
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

    return `Hola Brayan, estuve en el taller en Sogamoso.

Acabo de calcular la fuga operativa de mi empresa con la herramienta:

📋 DATOS DEL DIAGNÓSTICO
• Sector: ${sec.name}
• Empresa: ${empresa}
• Contacto: ${nombre} (${cargo})${tel ? `\n• WhatsApp: ${tel}` : ''}

📊 RESULTADOS ESTIMADOS
• Personas en tareas repetitivas: ${state.personas}
• Horas perdidas por persona/sem: ${state.horas}h
• Costo hora promedio: ${currencyFormatter.format(state.costoHora)} COP
• Fuga operativa mensual: ${currencyFormatter.format(fugaMensual)} COP
• Fuga operativa anual: ${currencyFormatter.format(fugaAnual)} COP
• Horas recuperables al año: ${numberFormatter.format(horasRecuperables)} horas (70% automatizable)
• Retorno de inversión (Sprint $1.5M): ${paybackStr}

Me gustaría coordinar la auditoría gratuita de 30 min para evaluar qué procesos conviene automatizar primero.`;
  }

  function updateContactLinks() {
    const text = generateReportText();
    const encoded = encodeURIComponent(text);

    // WhatsApp
    dom.btnSendWhatsapp.href = `https://wa.me/${CONSTANTS.WHATSAPP_NUMBER}?text=${encoded}`;

    // Email
    const subject = encodeURIComponent(`Auditoría de Automatización - ${state.empresa.trim() || 'Sogamoso'}`);
    dom.btnSendEmail.href = `mailto:${CONSTANTS.CONTACT_EMAIL}?subject=${subject}&body=${encoded}`;
  }

  function showToast(msg) {
    dom.toast.textContent = msg;
    dom.toast.classList.add('show');
    setTimeout(() => {
      dom.toast.classList.remove('show');
    }, 2800);
  }

  // Event Listeners
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

    // 2. Personas (slider + botones)
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

    // 3. Horas semanales (slider + botones)
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

      // Actualizar pills activas
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
        dom.btnOpenLead.textContent = 'Solicitar Auditoría Gratuita →';
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

  // Inicialización
  function init() {
    initListeners();
    calculate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
