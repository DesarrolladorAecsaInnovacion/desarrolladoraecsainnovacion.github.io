let currentStep = 0;
const totalSteps = 11; // 0 (Checklist) + 1-9 (Steps) + 10 (Golden Tips)
const stepCompletion = new Array(totalSteps).fill(false);
const checklistState = [false, false, false, false];
const factClasses = { 1: null, 2: null };

function showModal(title, message) {
  const modal = document.getElementById("aecsa-modal");
  if (modal) {
    document.getElementById("modal-title").innerText = title;
    document.getElementById("modal-message").innerText = message;
    modal.classList.remove("hidden");
  }
}

function closeModal() {
  document.getElementById("aecsa-modal")?.classList.add("hidden");
}

function speakText(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "es-CO";
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  } else {
    showModal(
      "Sintetizador de Voz",
      "Tu navegador no soporta la API local de síntesis de voz.",
    );
  }
}

function switchMainTab(tabName) {
  const views = [
    "view-simulator",
    "view-methodology",
    "view-quiz",
    "view-reportes",
  ];
  views.forEach((v) => document.getElementById(v)?.classList.add("hidden"));

  const buttons = [
    "btn-tab-simulator",
    "btn-tab-methodology",
    "btn-tab-quiz",
    "btn-tab-reportes",
  ];
  buttons.forEach((id) => {
    const b = document.getElementById(id);
    if (b) {
      b.className =
        "px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 text-gray-300 hover:text-white";
    }
  });

  const activeView = document.getElementById(`view-${tabName}`);
  const activeBtn = document.getElementById(`btn-tab-${tabName}`);
  if (activeView) activeView.classList.remove("hidden");
  if (activeBtn) {
    activeBtn.className =
      "px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 bg-aecsaGreen text-aecsaNavy shadow-md";
  }

  if (tabName === "reportes") {
    loadReportes();
  }

  window.scrollTo({ top: 0, behavior: "smooth" });
}

function goToStep(stepIdx) {
  if (stepIdx < 0 || stepIdx >= totalSteps) return;
  currentStep = stepIdx;
  renderStepContent(currentStep);
  updateProgressUI();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function nextStep() {
  if (currentStep < totalSteps - 1) {
    goToStep(currentStep + 1);
  }
}

function prevStep() {
  if (currentStep > 0) {
    goToStep(currentStep - 1);
  }
}

function updateProgressUI() {
  const indicator = document.getElementById("step-indicator");
  if (indicator && stepsData[currentStep]) {
    indicator.innerText = `${stepsData[currentStep].phase}: ${stepsData[currentStep].title}`;
  }

  const btnPrev = document.getElementById("btn-prev");
  const btnNext = document.getElementById("btn-next");
  if (btnPrev) btnPrev.disabled = currentStep === 0;
  if (btnNext) btnNext.disabled = currentStep === totalSteps - 1;

  const lineActive = document.getElementById("stepper-line-active");
  if (lineActive) {
    const pct = (currentStep / (totalSteps - 1)) * 100;
    lineActive.style.width = `${pct}%`;
  }

  for (let i = 0; i < totalSteps; i++) {
    const btn = document.getElementById(`step-btn-${i}`);
    if (!btn) continue;
    if (i === currentStep) {
      btn.className =
        "step-btn relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs bg-aecsaNavy text-white ring-4 ring-aecsaGreen shadow-lg scale-110 transition-all";
    } else if (stepCompletion[i]) {
      btn.className =
        "step-btn relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs bg-aecsaGreen text-aecsaNavy ring-4 ring-white shadow transition-all";
    } else {
      btn.className =
        "step-btn relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs bg-gray-200 text-gray-600 ring-4 ring-white shadow transition-all";
    }
  }

  const completedCount = stepCompletion.filter(Boolean).length;
  const overallPct = Math.round((completedCount / totalSteps) * 100);
  const progressBar = document.getElementById("overall-progress-bar");
  const progressText = document.getElementById("overall-progress-text");
  if (progressBar) progressBar.style.width = `${overallPct}%`;
  if (progressText) progressText.innerText = `${overallPct}% Completado`;
}

const stepsData = [
  // STEP 0: Checklist
  {
    id: 0,
    phase: "Fase 1: Pre-audiencia",
    title: "Checklist técnico y operativo",
    subtitle:
      "Verificación de requisitos indispensables antes de la conexión virtual",
    icon: "fa-list-check",
    content: `
                    <div class="space-y-6">
                        <p class="text-xs md:text-sm text-gray-600 leading-relaxed">
                            Antes de iniciar la audiencia virtual, debes verificar meticulosamente tus componentes operativos y jurídicos. Completa este checklist interactivo para activar tu autorización de audiencia:
                        </p>
                        
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4" id="checklist-items">
                            <label class="flex items-start space-x-3 p-4 bg-slate-50 border border-gray-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                                <input type="checkbox" onchange="toggleChecklistItem(0)" ${checklistState[0] ? "checked" : ""} class="chk-item mt-1 rounded text-aecsaGreen focus:ring-aecsaGreen w-5 h-5">
                                <div>
                                    <span class="text-xs font-bold text-aecsaNavy block"><i class="fa-solid fa-folder-open text-aecsaGreenDark mr-1"></i> Documentación completa de expediente</span>
                                    <span class="text-xs text-gray-500">Pagarés, demanda, contestación, histórico de pagos y propuesta comercial F46.</span>
                                </div>
                            </label>

                            <label class="flex items-start space-x-3 p-4 bg-slate-50 border border-gray-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                                <input type="checkbox" onchange="toggleChecklistItem(1)" ${checklistState[1] ? "checked" : ""} class="chk-item mt-1 rounded text-aecsaGreen focus:ring-aecsaGreen w-5 h-5">
                                <div>
                                    <span class="text-xs font-bold text-aecsaNavy block"><i class="fa-solid fa-link text-aecsaOrange mr-1"></i> Reserva de sala y conexión</span>
                                    <span class="text-xs text-gray-500">Sala apartada previamente en el aplicativo.</span>
                                </div>
                            </label>

                            <label class="flex items-start space-x-3 p-4 bg-slate-50 border border-gray-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                                <input type="checkbox" onchange="toggleChecklistItem(2)" ${checklistState[2] ? "checked" : ""} class="chk-item mt-1 rounded text-aecsaGreen focus:ring-aecsaGreen w-5 h-5">
                                <div>
                                    <span class="text-xs font-bold text-aecsaNavy block"><i class="fa-solid fa-video text-blue-600 mr-1"></i> Entorno, iluminación y conexión</span>
                                    <span class="text-xs text-gray-500">Espacio silencioso, iluminación frontal, prueba 30 min antes.</span>
                                </div>
                            </label>

                            <label class="flex items-start space-x-3 p-4 bg-slate-50 border border-gray-200 rounded-2xl cursor-pointer hover:bg-slate-100 transition">
                                <input type="checkbox" onchange="toggleChecklistItem(3)" ${checklistState[3] ? "checked" : ""} class="chk-item mt-1 rounded text-aecsaGreen focus:ring-aecsaGreen w-5 h-5">
                                <div>
                                    <span class="text-xs font-bold text-aecsaNavy block"><i class="fa-solid fa-id-card text-emerald-600 mr-1"></i> Acreditación física</span>
                                    <span class="text-xs text-gray-500">Cédula física y Tarjeta Profesional vigentes para exhibir en cámara.</span>
                                </div>
                            </label>
                        </div>

                        <div id="checklist-feedback" class="${checklistState.every(Boolean) ? "" : "hidden"} p-4 rounded-2xl text-xs font-bold bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center gap-2">
                            <i class="fa-solid fa-circle-check text-emerald-600 text-base"></i>
                            <span>¡Alistamiento finalizado con éxito! Puedes avanzar a la Fase 2 del Simulador.</span>
                        </div>
                    </div>
                `,
  },
  // STEP 1: Instalación
  {
    id: 1,
    phase: "Paso 1: Art. 372 CGP",
    title: "Instalación e identificación de las partes",
    subtitle: "Apertura formal de la diligencia por el Juez",
    icon: "fa-gavel",
    content: `
                    <div class="space-y-6">
                        <div class="bg-slate-900 text-white p-5 rounded-2xl border-l-4 border-aecsaGreen space-y-3">
                            <div class="flex items-center justify-between">
                                <span class="text-xs font-bold text-aecsaGreen uppercase tracking-wider"><i class="fa-solid fa-scale-balanced mr-1"></i> Juez Virtual:</span>
                                <button onclick="speakText('En la ciudad de Bogotá, siendo la hora fijada, se declara abierta la audiencia inicial. Se procede a verificar la asistencia de las partes y sus apoderados judicialmente reconocidos.')" class="px-3 py-1 bg-slate-800 text-aecsaGreen rounded-lg text-xs font-bold hover:bg-slate-700 transition flex items-center gap-1">
                                    <i class="fa-solid fa-volume-high"></i> Escuchar al Juez
                                </button>
                            </div>
                            <p class="text-xs md:text-sm italic text-gray-200">"En la ciudad de Bogotá, siendo la hora fijada, se declara abierta la audiencia inicial dentro del proceso ejecutivo. Se procede a verificar la asistencia de las partes y sus apoderados judicialmente reconocidos."</p>
                        </div>

                        <div class="p-5 bg-slate-50 border border-gray-200 rounded-2xl space-y-4">
                            <h4 class="font-extrabold text-xs md:text-sm text-aecsaNavy flex items-center gap-2">
                                <i class="fa-solid fa-key text-aecsaOrange"></i> Clave jurídica: Acreditación de representación
                            </h4>
                            <p class="text-xs text-gray-600 leading-relaxed">
                                Para blindar la representación de la entidad financiera demandante, ¿qué documento técnico clave debes aportar previamente junto al poder de sustitución?
                            </p>

                            <div class="space-y-2">
                                <button onclick="checkStep1Option(this, false)" class="w-full text-left p-3.5 rounded-xl border border-gray-300 text-xs font-medium hover:bg-slate-100 transition flex items-center justify-between">
                                    <span>A) Copia simple de la cédula del Gerente General de la entidad.</span>
                                    <i class="fa-regular fa-circle text-gray-400"></i>
                                </button>
                                <button onclick="checkStep1Option(this, true)" class="w-full text-left p-3.5 rounded-xl border border-gray-300 text-xs font-medium hover:bg-slate-100 transition flex items-center justify-between">
                                    <span>B) Certificado de Representación Legal expedido por la Superintendencia Financiera indicando hoja y renglón específico.</span>
                                    <i class="fa-regular fa-circle text-gray-400"></i>
                                </button>
                                <button onclick="checkStep1Option(this, false)" class="w-full text-left p-3.5 rounded-xl border border-gray-300 text-xs font-medium hover:bg-slate-100 transition flex items-center justify-between">
                                    <span>C) Carta informal del coordinador de operaciones de la compañía.</span>
                                    <i class="fa-regular fa-circle text-gray-400"></i>
                                </button>
                            </div>
                            <div id="step1-feedback" class="hidden p-3.5 rounded-xl text-xs font-bold"></div>
                        </div>
                    </div>
                `,
  },
  // STEP 2: Presentación
  {
    id: 2,
    phase: "Paso 2: Art. 372 CGP",
    title: "Presentación de la diligencia (guion verbal)",
    subtitle: "Individualización formal del apoderado",
    icon: "fa-id-badge",
    content: `
                    <div class="space-y-6">
                        <p class="text-xs md:text-sm text-gray-600 leading-relaxed">
                            Al concederte el uso de la palabra, debes encender el micrófono y enunciar pausadamente tus generales de ley. Estructura y completa los campos de tu presentación procesal:
                        </p>

                        <div class="p-5 bg-slate-900 text-white rounded-2xl space-y-4 border border-slate-800">
                            <span class="text-xs font-bold text-aecsaGreen uppercase tracking-wider"><i class="fa-solid fa-microphone"></i> Constructor de guion verbal</span>
                            
                            <p class="text-xs md:text-sm leading-loose text-gray-200">
                                "Señoría, comparece el abogado <input type="text" id="script-name" placeholder="[Tu Nombre Completo]" class="px-2.5 py-1 bg-slate-800 border border-slate-600 text-white text-xs rounded-lg outline-none focus:border-aecsaGreen">,
                                identificado con C.C. No. <input type="text" id="script-cc" placeholder="[Número Cédula]" class="px-2.5 py-1 bg-slate-800 border border-slate-600 text-white text-xs rounded-lg outline-none focus:border-aecsaGreen">
                                y Tarjeta Profesional No. <input type="text" id="script-tp" placeholder="[Número T.P.]" class="px-2.5 py-1 bg-slate-800 border border-slate-600 text-white text-xs rounded-lg outline-none focus:border-aecsaGreen"> del C.S.J.,
                                con correo electrónico <input type="text" id="script-email" placeholder="[Correo Notificación]" class="px-2.5 py-1 bg-slate-800 border border-slate-600 text-white text-xs rounded-lg outline-none focus:border-aecsaGreen">,
                                actuando como apoderado de la parte demandante. Solicito respetuosamente se reconozca personería y procedo a exhibir mis documentos ante la cámara."
                            </p>

                            <button onclick="validateStep2Script()" class="px-4 py-2.5 bg-aecsaGreen text-aecsaNavy rounded-xl text-xs font-extrabold hover:bg-aecsaGreenDark transition shadow flex items-center gap-2">
                                <i class="fa-solid fa-check"></i> Validar Guion Procesal
                            </button>
                        </div>
                        <div id="step2-feedback" class="hidden p-4 rounded-xl text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200"></div>
                    </div>
                `,
  },
  // STEP 3: Conciliación
  {
    id: 3,
    phase: "Paso 3: Art. 372 CGP",
    title: "Etapa de conciliación",
    subtitle:
      "Búsqueda de acuerdo concertado y regla crítica de negociación AECSA",
    icon: "fa-handshake",
    content: `
                    <div class="space-y-6">
                        <div class="p-4 bg-amber-50 border-l-4 border-aecsaOrange text-amber-900 rounded-r-2xl text-xs space-y-1">
                            <p class="font-extrabold uppercase text-aecsaOrange"><i class="fa-solid fa-triangle-exclamation"></i> REGLA CRÍTICA AECSA:</p>
                            <p>Por NINGÚN MOTIVO se debe permitir la terminación del proceso ejecutivo por el solo acuerdo de cuotas. Se debe solicitar la SUSPENSIÓN del proceso condicionada al pago total de la última cuota.</p>
                        </div>

                        <div class="p-5 bg-white border border-gray-200 rounded-2xl space-y-4">
                            <h4 class="font-bold text-xs md:text-sm text-aecsaNavy">Simulador de decisión en audiencia:</h4>
                            <p class="text-xs text-gray-600">El demandado propone pagar la obligación en 6 cuotas mensuales. El Juez pregunta si aceptas el acuerdo y propone dar por terminado el proceso ejecutivo hoy. ¿Qué postura adoptas?</p>

                            <div class="space-y-3">
                                <button onclick="checkStep3Decision(this, false)" class="w-full text-left p-3.5 rounded-xl border border-gray-200 text-xs font-medium hover:bg-red-50 transition">
                                    <span class="font-bold text-red-700 block mb-0.5">Opción A: Aceptar terminación inmediata</span>
                                    <span>Aceptar dar por terminado el proceso judicial de inmediato para cerrar la controversia.</span>
                                </button>
                                <button onclick="checkStep3Decision(this, true)" class="w-full text-left p-3.5 rounded-xl border border-gray-200 text-xs font-medium hover:bg-emerald-50 transition">
                                    <span class="font-bold text-emerald-700 block mb-0.5">Opción B: Solicitar Suspensión con Condición (RECOMENDADA AECSA)</span>
                                    <span>Solicitar al Juez suspender el proceso hasta el pago total de la última cuota, exigiendo que el demandado renuncie previamente a sus excepciones.</span>
                                </button>
                            </div>
                            <div id="step3-feedback" class="hidden p-4 rounded-xl text-xs font-bold"></div>
                        </div>
                    </div>
                `,
  },
  // STEP 4: Control de Legalidad
  {
    id: 4,
    phase: "Paso 4: Art. 372 CGP",
    title: "Control de legalidad y saneamiento",
    subtitle: "Saneamiento del proceso e inhabilitación de nulidades futuras",
    icon: "fa-shield-halved",
    content: `
                    <div class="space-y-6">
                        <p class="text-xs md:text-sm text-gray-600 leading-relaxed">
                            El Juez indaga a los apoderados sobre la presencia de vicios o vicios procesales. Emitir la manifestación correcta en este punto inabilita al demandado para alegar nulidades previas posteriormente.
                        </p>

                        <div class="p-5 bg-slate-900 text-white rounded-2xl space-y-4">
                            <span class="text-xs font-bold text-aecsaGreen uppercase tracking-wider"><i class="fa-solid fa-quote-left"></i> Fórmula procesal de saneamiento:</span>
                            <p class="text-xs italic text-gray-300">Selecciona la manifestación técnica formal que debes pronunciar ante el despacho:</p>

                            <div class="space-y-2">
                                <button onclick="checkStep4Formula(this, true)" class="w-full text-left p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs hover:border-aecsaGreen transition text-gray-200">
                                    "Señoría, este apoderado no observa ninguna irregularidad ni vicio que afecte la validez de la actuación por lo que solicito se declare saneado el proceso."
                                </button>
                                <button onclick="checkStep4Formula(this, false)" class="w-full text-left p-3 rounded-xl bg-slate-800 border border-slate-700 text-xs hover:border-red-400 transition text-gray-200">
                                    "Señoría, guardo silencio para reservar futuras causales de nulidad ante el tribunal."
                                </button>
                            </div>
                            <div id="step4-feedback" class="hidden p-3.5 rounded-xl text-xs font-bold"></div>
                        </div>
                    </div>
                `,
  },
  // STEP 5: Excepciones Previas
  {
    id: 5,
    phase: "Paso 5: Art. 372 CGP",
    title: "Decisión de excepciones previas",
    subtitle:
      "Resolución de medios exceptivos e interposición verbal de recursos",
    icon: "fa-gavel",
    content: `
                    <div class="space-y-6">
                        <p class="text-xs md:text-sm text-gray-600 leading-relaxed">
                            Si se promovieron excepciones previas, el Juez las resolverá en audiencia. Si la decisión es contraria a los intereses de la entidad, se deben interponer los recursos verbales inmediatamente.
                        </p>

                        <div class="p-5 bg-white border border-gray-200 rounded-2xl space-y-4">
                            <h4 class="font-bold text-xs md:text-sm text-aecsaNavy">Simulación de interposición oral:</h4>
                            <p class="text-xs text-gray-600">El Despacho profiere auto declarando probada una excepción previa desfavorable. ¿Qué recurso oral debes interponer inmediatamente?</p>

                            <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <button onclick="checkStep5Recurso(this, false)" class="p-3.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-700 hover:bg-slate-100 transition">
                                    Presentar únicamente recurso por escrito dentro de los 3 días siguientes.
                                </button>
                                <button onclick="checkStep5Recurso(this, true)" class="p-3.5 border border-gray-300 rounded-xl text-xs font-bold text-aecsaNavy hover:bg-emerald-50 transition border-aecsaGreen">
                                    Interponer verbalmente el Recurso de Reposición y en subsidio Apelación en la misma sesión.
                                </button>
                            </div>
                            <div id="step5-feedback" class="hidden p-3.5 rounded-xl text-xs font-bold"></div>
                        </div>
                    </div>
                `,
  },
  // STEP 6: Interrogatorio
  {
    id: 6,
    phase: "Paso 6: Art. 372 CGP",
    title: "Interrogatorio de las partes",
    subtitle: "Declaración bajo la gravedad del juramento",
    icon: "fa-comments",
    content: `
                    <div class="space-y-6">
                        <p class="text-xs md:text-sm text-gray-600 leading-relaxed">
                            El Juez interroga oficiosamente a las partes. Recuerda que toda declaración se rige bajo la gravedad del juramento, con responsabilidad penal, disciplinaria y pecuniaria.
                        </p>

                        <!-- Mini Hangman Game -->
                        <div class="p-5 bg-slate-900 text-white rounded-2xl space-y-4">
                            <span class="text-xs font-bold text-aecsaGreen uppercase tracking-wider"><i class="fa-solid fa-gamepad"></i> Ahorcado procesal: Principio legal</span>
                            <p class="text-xs text-gray-300">Descubre la advertencia bajo la cual prestan declaración los representantes:</p>

                            <div id="hangman-word-display" class="text-lg md:text-2xl font-black tracking-widest text-aecsaGreen text-center py-3 bg-slate-800 rounded-xl"></div>
                            
                            <div id="hangman-keyboard" class="flex flex-wrap gap-1.5 justify-center pt-2">
                                <!-- Keyboard rendered dynamically -->
                            </div>
                            <div id="hangman-status" class="text-xs font-bold text-center text-gray-300"></div>
                        </div>
                    </div>
                `,
  },
  // STEP 7: Fijación del Litigio
  {
    id: 7,
    phase: "Paso 7: Art. 372 CGP",
    title: "Fijación del litigio (delimitación)",
    subtitle: "Matriz de contraste: Hechos admitidos vs. debate probatorio",
    icon: "fa-border-all",
    content: `
                    <div class="space-y-6">
                        <p class="text-xs md:text-sm text-gray-600 leading-relaxed">
                            Consiste en delimitar junto con el Juez cuáles hechos de la demanda están admitidos y cuáles exigen debate probatorio. Clasifica los 2 enunciados:
                        </p>

                        <div class="space-y-3">
                            <div class="p-4 bg-slate-50 border border-gray-200 rounded-xl space-y-2">
                                <p class="text-xs font-bold text-aecsaNavy">Hecho 1: "La firma y suscripción del pagaré por parte del deudor."</p>
                                <div class="flex gap-2">
                                    <button onclick="setFactClass(this, 1, 'admitido')" class="fact-btn-1 p-2 bg-white border border-gray-300 text-xs font-semibold rounded-lg hover:bg-slate-100 transition">Admitido / Probado</button>
                                    <button onclick="setFactClass(this, 1, 'debate')" class="fact-btn-1 p-2 bg-white border border-gray-300 text-xs font-semibold rounded-lg hover:bg-slate-100 transition">Requiere Debate Probatorio</button>
                                </div>
                            </div>

                            <div class="p-4 bg-slate-50 border border-gray-200 rounded-xl space-y-2">
                                <p class="text-xs font-bold text-aecsaNavy">Hecho 2: "El pago alegado de $10.000.000 no registrado en los extractos."</p>
                                <div class="flex gap-2">
                                    <button onclick="setFactClass(this, 2, 'admitido')" class="fact-btn-2 p-2 bg-white border border-gray-300 text-xs font-semibold rounded-lg hover:bg-slate-100 transition">Admitido / Probado</button>
                                    <button onclick="setFactClass(this, 2, 'debate')" class="fact-btn-2 p-2 bg-white border border-gray-300 text-xs font-semibold rounded-lg hover:bg-slate-100 transition">Requiere Debate Probatorio</button>
                                </div>
                            </div>
                        </div>

                        <button onclick="validateFactClassification()" class="px-5 py-2.5 bg-aecsaNavy text-white text-xs font-bold rounded-xl hover:bg-slate-800 transition">
                            Validar Fijación del Litigio
                        </button>
                        <div id="step7-feedback" class="hidden p-4 rounded-xl text-xs font-bold"></div>
                    </div>
                `,
  },
  // STEP 8: Decreto de Pruebas
  {
    id: 8,
    phase: "Paso 8: Art. 372 / 373 CGP",
    title: "Decreto de pruebas y bifurcación procesal",
    subtitle: "Determinación de admisibilidad y rutas del Art. 373 CGP",
    icon: "fa-diagram-project",
    content: `
                    <div class="space-y-6">
                        <p class="text-xs md:text-sm text-gray-600 leading-relaxed">
                            El Juez decreta las pruebas conducentes, pertinentes y útiles. Dependiendo del tipo de pruebas decretadas, el proceso toma dos caminos posibles:
                        </p>

                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl space-y-2">
                                <span class="text-[10px] font-extrabold uppercase text-emerald-800 bg-emerald-200 px-2 py-0.5 rounded-full">Escenario A: Audiencia concentrada</span>
                                <h5 class="font-extrabold text-xs text-emerald-950">Pruebas únicamente documentales</h5>
                                <p class="text-xs text-emerald-900 leading-relaxed">
                                    Si las pruebas decretadas son solo documentales, el Juez prescinde de la audiencia de juicio, concede palabra para <strong>Alegatos de Conclusión (20 min)</strong> y dicta sentencia en la misma sesión.
                                </p>
                            </div>

                            <div class="p-5 bg-amber-50 border-2 border-amber-300 rounded-2xl space-y-2">
                                <span class="text-[10px] font-extrabold uppercase text-amber-800 bg-amber-200 px-2 py-0.5 rounded-full">Escenario B: Fijación de juicio</span>
                                <h5 class="font-extrabold text-xs text-amber-950">Pruebas complejas / testimonios</h5>
                                <p class="text-xs text-amber-900 leading-relaxed">
                                    Si se decreta práctica de peritajes o testimonios, el Juez fija fecha para la <strong>Audiencia de Instrucción y Juzgamiento (Art. 373 CGP)</strong>.
                                </p>
                            </div>
                        </div>

                        <div class="p-4 bg-slate-900 text-white rounded-xl text-xs space-y-2">
                            <p class="font-bold text-aecsaGreen uppercase"><i class="fa-solid fa-lightbulb"></i> Simulación práctica:</p>
                            <p>Si el Juez decreta únicamente pruebas documentales ya aportadas, debes estar preparado para alegar inmediatamente de forma oral.</p>
                            <button onclick="completeStep8()" class="mt-2 px-4 py-2 bg-aecsaGreen text-aecsaNavy rounded-lg text-xs font-bold hover:bg-aecsaGreenDark transition">Comprendido y Validado</button>
                        </div>
                    </div>
                `,
  },
  // STEP 9: Orden de Seguir Adelante
  {
    id: 9,
    phase: "Paso 9: Art. 373 CGP",
    title: "Orden de seguir adelante la ejecución",
    subtitle: "Proferimiento de sentencia y sustentación de recursos",
    icon: "fa-gavel",
    content: `
                    <div class="space-y-6">
                        <p class="text-xs md:text-sm text-gray-600 leading-relaxed">
                            Surtidos los alegatos, el Juez profiere sentencia. Si la decisión acoge parcialmente una excepción del demandado, se debe interponer el recurso de apelación de forma parcial.
                        </p>

                        <div class="p-5 bg-white border border-gray-200 rounded-2xl space-y-4">
                            <h4 class="font-bold text-xs md:text-sm text-aecsaNavy">Acción procesal ante sentencia parcial:</h4>
                            <p class="text-xs text-gray-600">Si la sentencia resulta parcialmente desfavorable, ¿cuál es la conducta procesal correcta?</p>

                            <div class="space-y-2">
                                <button onclick="checkStep9Apelacion(this, true)" class="w-full text-left p-3.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 hover:bg-emerald-50 transition">
                                    A) Interponer recurso de apelación de forma parcial indicando el numeral específico de la sentencia que se recurre y fundamentando los puntos de desacuerdo.
                                </button>
                                <button onclick="checkStep9Apelacion(this, false)" class="w-full text-left p-3.5 border border-gray-300 rounded-xl text-xs font-semibold text-gray-800 hover:bg-red-50 transition">
                                    B) Apelar la totalidad de la sentencia en términos generales sin precisar los numerales.
                                </button>
                            </div>
                            <div id="step9-feedback" class="hidden p-3.5 rounded-xl text-xs font-bold"></div>
                        </div>
                    </div>
                `,
  },
  // STEP 10: Golden Rules
  {
    id: 10,
    phase: "Fase final: Excelencia procesal",
    title: "Consejos de oro AECSA",
    subtitle: "Decoro, fluidez argumentativa y etiqueta virtual",
    icon: "fa-star",
    content: `
                    <div class="space-y-6">
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                                <h5 class="font-extrabold text-xs text-aecsaNavy flex items-center gap-2">
                                    <i class="fa-solid fa-microphone-slash text-aecsaOrange"></i> Dominio del micrófono
                                </h5>
                                <p class="text-xs text-gray-600">Mantenlo apagado salvo cuando estés en uso de la palabra para evitar filtraciones de ruido.</p>
                            </div>

                            <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                                <h5 class="font-extrabold text-xs text-aecsaNavy flex items-center gap-2">
                                    <i class="fa-solid fa-user-tie text-aecsaGreenDark"></i> Solemnidad y etiqueta
                                </h5>
                                <p class="text-xs text-gray-600">La virtualidad exige excelente presentación personal y cumplimiento estricto del decoro judicial.</p>
                            </div>

                            <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                                <h5 class="font-extrabold text-xs text-aecsaNavy flex items-center gap-2">
                                    <i class="fa-solid fa-comments text-blue-600"></i> Fluidez argumentativa
                                </h5>
                                <p class="text-xs text-gray-600">Apóyate en minutas sin leer bloques textualmente. Mira fijamente a la cámara.</p>
                            </div>

                            <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                                <h5 class="font-extrabold text-xs text-aecsaNavy flex items-center gap-2">
                                    <i class="fa-solid fa-handshake-angle text-emerald-600"></i> Respeto procesal
                                </h5>
                                <p class="text-xs text-gray-600">Frente a fallos adversos, dirígete siempre con decoro ("Respeto su criterio Su Señoría, sin embargo interpongo...").</p>
                            </div>
                        </div>

                        <div class="text-center pt-4">
                            <button onclick="switchMainTab('quiz')" class="px-8 py-3.5 bg-aecsaOrange text-white rounded-2xl font-extrabold text-xs hover:bg-orange-600 transition shadow-lg inline-flex items-center gap-2">
                                <i class="fa-solid fa-award text-sm"></i> Ir a la Evaluación Final de Desempeño
                            </button>
                        </div>
                    </div>
                `,
  },
];

function renderStepContent(stepIdx) {
  const card = document.getElementById("step-content-card");
  if (!card) return;
  const step = stepsData[stepIdx];
  if (!step) return;

  card.innerHTML = `
                <div class="space-y-4">
                    <div class="flex items-center justify-between border-b border-gray-100 pb-3">
                        <span class="text-xs font-bold text-aecsaGreenDark uppercase tracking-wider bg-lime-100 px-3 py-1 rounded-full"><i class="fa-solid ${step.icon} mr-1"></i> ${step.phase}</span>
                        <span class="text-xs text-gray-400 font-semibold">Paso ${stepIdx} de ${totalSteps - 1}</span>
                    </div>
                    <div>
                        <h3 class="text-xl md:text-2xl font-extrabold text-aecsaNavy">${step.title}</h3>
                        <p class="text-xs text-gray-500 mt-1">${step.subtitle}</p>
                    </div>
                    <div class="pt-2">
                        ${step.content}
                    </div>
                </div>
            `;

  if (stepIdx === 6) {
    initHangman();
  }
}

function toggleChecklistItem(idx) {
  checklistState[idx] = !checklistState[idx];
  const allChecked = checklistState.every(Boolean);
  const feedback = document.getElementById("checklist-feedback");
  if (allChecked) {
    stepCompletion[0] = true;
    if (feedback) feedback.classList.remove("hidden");
  } else {
    if (feedback) feedback.classList.add("hidden");
  }
  updateProgressUI();
}

function checkStep1Option(btn, isCorrect) {
  const feedback = document.getElementById("step1-feedback");
  if (!feedback) return;
  feedback.classList.remove("hidden");
  if (isCorrect) {
    feedback.className =
      "p-3.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300";
    feedback.innerHTML =
      '<i class="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i> ¡Correcto! El Certificado de Representación Legal de la Superfinanciera (con hoja y renglón) acredita la capacidad del Representante Legal.';
    stepCompletion[1] = true;
  } else {
    feedback.className =
      "p-3.5 rounded-xl text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300";
    feedback.innerHTML =
      '<i class="fa-solid fa-circle-xmark text-rose-600 mr-1.5"></i> Incorrecto. El documento idóneo es el Certificado expedido por la Superintendencia Financiera.';
  }
  updateProgressUI();
}

function validateStep2Script() {
  const name = document.getElementById("script-name")?.value.trim();
  const cc = document.getElementById("script-cc")?.value.trim();
  const tp = document.getElementById("script-tp")?.value.trim();
  const email = document.getElementById("script-email")?.value.trim();
  const feedback = document.getElementById("step2-feedback");
  if (!feedback) return;

  feedback.classList.remove("hidden");
  if (name && cc && tp && email) {
    feedback.className =
      "p-4 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300";
    feedback.innerHTML = `<i class="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i> Guion validado correctamente para <strong>${name}</strong> (C.C. ${cc}, T.P. ${tp}). ¡Listo para presentar en cámara!`;
    stepCompletion[2] = true;
  } else {
    feedback.className =
      "p-4 rounded-xl text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300";
    feedback.innerHTML =
      '<i class="fa-solid fa-triangle-exclamation text-amber-600 mr-1.5"></i> Por favor completa todos los campos (Nombre, C.C., T.P. y Correo) antes de validar tu guion.';
  }
  updateProgressUI();
}

function checkStep3Decision(btn, isCorrect) {
  const feedback = document.getElementById("step3-feedback");
  if (!feedback) return;
  feedback.classList.remove("hidden");
  if (isCorrect) {
    feedback.className =
      "p-4 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300";
    feedback.innerHTML =
      '<i class="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i> ¡Excelente decisión! Solicitar la suspensión condicionada al pago de la última cuota protege las garantías ejecutivas de la compañía en caso de mora.';
    stepCompletion[3] = true;
  } else {
    feedback.className =
      "p-4 rounded-xl text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300";
    feedback.innerHTML =
      '<i class="fa-solid fa-circle-xmark text-rose-600 mr-1.5"></i> ¡Error crítico! Si aceptas terminar el proceso hoy, pierdes el título ejecutivo y el embargo si el deudor incumple el acuerdo de cuotas.';
  }
  updateProgressUI();
}

function checkStep4Formula(btn, isCorrect) {
  const feedback = document.getElementById("step4-feedback");
  if (!feedback) return;
  feedback.classList.remove("hidden");
  if (isCorrect) {
    feedback.className =
      "p-3.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300";
    feedback.innerHTML =
      '<i class="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i> ¡Fórmula correcta! Al pronunciar esta manifestación, solicitas expresamente el saneamiento procesal conforme al Art. 372 CGP.';
    stepCompletion[4] = true;
  } else {
    feedback.className =
      "p-3.5 rounded-xl text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300";
    feedback.innerHTML =
      '<i class="fa-solid fa-circle-xmark text-rose-600 mr-1.5"></i> Guardar silencio no reserva causales de nulidad no alegadas. Debes manifestar expresamente que no observas vicios.';
  }
  updateProgressUI();
}

function checkStep5Recurso(btn, isCorrect) {
  const feedback = document.getElementById("step5-feedback");
  if (!feedback) return;
  feedback.classList.remove("hidden");
  if (isCorrect) {
    feedback.className =
      "p-3.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300";
    feedback.innerHTML =
      '<i class="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i> ¡Correcto! Las decisiones proferidas en audiencia pública deben recurrirse verbal e inmediatamente en la misma sesión.';
    stepCompletion[5] = true;
  } else {
    feedback.className =
      "p-3.5 rounded-xl text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300";
    feedback.innerHTML =
      '<i class="fa-solid fa-circle-xmark text-rose-600 mr-1.5"></i> Incorrecto. Presentar recurso por escrito 3 días después provocará extemporaneidad, dejando el auto firme.';
  }
  updateProgressUI();
}

let hangmanSecret = "GRAVEDAD DEL JURAMENTO";
let hangmanGuessed = new Set([" ", "A", "E"]);

function initHangman() {
  hangmanGuessed = new Set([" ", "A", "E"]);
  renderHangmanDisplay();
  renderHangmanKeyboard();
}

function renderHangmanDisplay() {
  const display = document.getElementById("hangman-word-display");
  if (!display) return;
  let html = "";
  for (let char of hangmanSecret) {
    if (char === " ") html += "&nbsp;&nbsp;";
    else if (hangmanGuessed.has(char)) html += `${char} `;
    else html += "_ ";
  }
  display.innerHTML = html;

  const isWon = [...hangmanSecret].every(
    (c) => c === " " || hangmanGuessed.has(c),
  );
  const status = document.getElementById("hangman-status");
  if (isWon) {
    stepCompletion[6] = true;
    if (status)
      status.innerHTML =
        '<span class="text-aecsaGreen font-extrabold flex items-center justify-center gap-1"><i class="fa-solid fa-trophy"></i> ¡Completado! Principio: GRAVEDAD DEL JURAMENTO.</span>';
    updateProgressUI();
  } else if (status) {
    status.innerText =
      "Selecciona las letras para adivinar la advertencia procesal.";
  }
}

function renderHangmanKeyboard() {
  const kb = document.getElementById("hangman-keyboard");
  if (!kb) return;
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  kb.innerHTML = alphabet
    .map((l) => {
      const isGuessed = hangmanGuessed.has(l);
      return `<button onclick="guessHangmanLetter('${l}')" ${isGuessed ? 'disabled class="w-7 h-7 rounded bg-slate-700 text-gray-500 font-bold text-xs cursor-not-allowed"' : 'class="w-7 h-7 rounded bg-aecsaGreen text-aecsaNavy font-bold text-xs hover:bg-aecsaGreenDark transition shadow"'}>${l}</button>`;
    })
    .join("");
}

function guessHangmanLetter(letter) {
  hangmanGuessed.add(letter);
  renderHangmanDisplay();
  renderHangmanKeyboard();
}

function setFactClass(btn, factNum, classification) {
  factClasses[factNum] = classification;
  const btnGroup = document.querySelectorAll(`.fact-btn-${factNum}`);
  btnGroup.forEach((b) =>
    b.classList.remove(
      "bg-aecsaNavy",
      "text-white",
      "bg-emerald-600",
      "bg-amber-500",
    ),
  );
  if (classification === "admitido") {
    btn.classList.add("bg-emerald-600", "text-white");
  } else {
    btn.classList.add("bg-amber-500", "text-white");
  }
}

function validateFactClassification() {
  const feedback = document.getElementById("step7-feedback");
  if (!feedback) return;
  feedback.classList.remove("hidden");

  if (factClasses[1] === "admitido" && factClasses[2] === "debate") {
    feedback.className =
      "p-4 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300";
    feedback.innerHTML =
      '<i class="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i> ¡Fijación del litigio correcta! La firma del pagaré está admitida (no requiere prueba), mientras que el pago no registrado exige debate probatorio.';
    stepCompletion[7] = true;
  } else {
    feedback.className =
      "p-4 rounded-xl text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300";
    feedback.innerHTML =
      '<i class="fa-solid fa-circle-xmark text-rose-600 mr-1.5"></i> Revisa la clasificación: El Hecho 1 (suscripción) no fue tachado, por tanto está admitido. El Hecho 2 (abono no registrado) debe probarse.';
  }
  updateProgressUI();
}

function completeStep8() {
  stepCompletion[8] = true;
  updateProgressUI();
  nextStep();
}

function checkStep9Apelacion(btn, isCorrect) {
  const feedback = document.getElementById("step9-feedback");
  if (!feedback) return;
  feedback.classList.remove("hidden");
  if (isCorrect) {
    feedback.className =
      "p-3.5 rounded-xl text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300";
    feedback.innerHTML =
      '<i class="fa-solid fa-circle-check text-emerald-600 mr-1.5"></i> ¡Correcto! La apelación parcial debe delimitar los numerales específicos impugnados y sustentar los motivos de desacuerdo.';
    stepCompletion[9] = true;
    stepCompletion[10] = true;
  } else {
    feedback.className =
      "p-3.5 rounded-xl text-xs font-bold bg-rose-100 text-rose-900 border border-rose-300";
    feedback.innerHTML =
      '<i class="fa-solid fa-circle-xmark text-rose-600 mr-1.5"></i> Incorrecto. Apelar la totalidad sin precisar numerales genera confusión e inadmisión del recurso.';
  }
  updateProgressUI();
}

const pedagogicalData = [
  {
    stepNum: "Checklist técnico",
    title: "Alistamiento operativo y conectividad",
    mechanic: "Checklist de verificación multicriterio",
    justification:
      "Asegura que el apoderado o representante elimine fallas técnicas e imprevisiones jurídicas antes de la audiencia.",
    uxStructure:
      "Grid interactivo con casillas de verificación e hipervínculos de reserva local.",
    outcome:
      "Previene aplazamientos de audiencias por fallas de conexión o credenciales.",
  },
  {
    stepNum: "Paso 1",
    title: "Instalación e identificación",
    mechanic: "Escenario de decisión documental",
    justification:
      "Capacita en la debida acreditación de representación legal ante la Superintendencia Financiera.",
    uxStructure:
      "Tarjetas de selección de acreditación con retroalimentación inmediata.",
    outcome: "Reconocimiento de personería jurídica sin objeciones procesales.",
  },
  {
    stepNum: "Paso 2",
    title: "Presentación de la diligencia",
    mechanic: "Constructor de guion verbal e intérprete local",
    justification:
      "Reduce el nerviosismo estructurando la fórmula procesal hablada obligatoria.",
    uxStructure: "Campos dinámicos de entrada y voz local sintetizada.",
    outcome: "Asegura oratoria clara y completa conforme al Art. 372 CGP.",
  },
  {
    stepNum: "Paso 3",
    title: "Conciliación",
    mechanic: "Árbol de decisión crítica AECSA",
    justification:
      "Inculca la regla corporativa de no terminar procesos ejecutivos sin verificación previa de pago total.",
    uxStructure:
      "Bifurcación de decisiones (Terminación vs Suspensión) con alertas patrimoniales.",
    outcome:
      "Protege garantías ejecutivas mediante solicitudes de suspensión condicionada.",
  },
  {
    stepNum: "Paso 4",
    title: "Control de legalidad y saneamiento",
    mechanic: "Selección de fórmula procesal de blindaje",
    justification:
      "Asegura la manifestación expresa de ausencia de vicios para precluir nulidades posteriores.",
    uxStructure: "Opciones con resaltado de la fórmula jurídica exacta.",
    outcome: "Garantiza el saneamiento firme a favor de la entidad.",
  },
  {
    stepNum: "Paso 5",
    title: "Decisión de excepciones previas",
    mechanic: "Simulación de recurso oral inmediato",
    justification:
      "Entrena la agilidad de interposición verbal de Reposición y Apelación en subsidio.",
    uxStructure:
      "Simulador de tiempo de respuesta inmediata ante fallo del Juez.",
    outcome:
      "Previene la firmeza de autos adversos por falta de recurso oportuno.",
  },
  {
    stepNum: "Paso 6",
    title: "Interrogatorio de las partes",
    mechanic: "Mini-juego ahorcado de gravedad del juramento",
    justification:
      "Concientiza sobre las consecuencias penales, pecuniarias y disciplinarias del juramento.",
    uxStructure: "Adivinanza interactiva de letras.",
    outcome: "Respuestas veraces y preparación técnica para contrainterrogar.",
  },
  {
    stepNum: "Paso 7",
    title: "Fijación del litigio",
    mechanic: "Matriz de clasificación de hechos",
    justification:
      "Enseña a delimitar el objeto del proceso contrastando demanda vs contestación.",
    uxStructure:
      "Botones para categorizar hechos en 'Admitidos' o 'Debate Probatorio'.",
    outcome: "Evita desgastar la etapa probatoria en hechos ya aceptados.",
  },
  {
    stepNum: "Paso 8",
    title: "Decreto de pruebas",
    mechanic: "Simulador de bifurcación Art. 373 CGP",
    justification:
      "Explica la diferencia entre Audiencia Concentrada e Instrucción y Juzgamiento.",
    uxStructure:
      "Diagrama dinámico explicativo de rutas procesales (Escenario A vs B).",
    outcome:
      "Preparación inmediata para alegar de conclusión en la misma sesión.",
  },
  {
    stepNum: "Paso 9",
    title: "Orden de seguir adelante",
    mechanic: "Simulador de apelación parcial",
    justification:
      "Capacita en la sustentación de objeciones a numerales específicos de la sentencia.",
    uxStructure:
      "Escenario práctico para seleccionar la forma técnica de recurrir.",
    outcome: "Apelaciones precisas y fundamentadas en audiencia.",
  },
];

function renderPedagogicalCards() {
  const container = document.getElementById("pedagogical-cards-container");
  if (!container) return;
  container.innerHTML = pedagogicalData
    .map(
      (item) => `
                <div class="p-5 bg-slate-50 rounded-2xl border border-gray-200 space-y-3">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-bold uppercase tracking-wider text-aecsaGreenDark bg-lime-100 px-2.5 py-0.5 rounded-full">${item.stepNum}</span>
                        <span class="text-xs font-semibold text-gray-500"><i class="fa-solid fa-gears mr-1"></i> Mecánica: ${item.mechanic}</span>
                    </div>
                    <h4 class="font-extrabold text-sm md:text-base text-aecsaNavy">${item.title}</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-1">
                        <div class="p-3 bg-white rounded-xl border border-gray-200">
                            <p class="font-bold text-gray-400 uppercase text-[10px]">Justificación Pedagógica</p>
                            <p class="text-gray-700 mt-1">${item.justification}</p>
                        </div>
                        
                        <div class="p-3 bg-white rounded-xl border border-gray-200">
                            <p class="font-bold text-gray-400 uppercase text-[10px]">Resultado de Aprendizaje</p>
                            <p class="text-gray-700 mt-1">${item.outcome}</p>
                        </div>
                    </div>
                </div>
            `,
    )
    .join("");
}

const quizData = [
  {
    id: 1,
    type: "tf",
    q: "1. Conciliación (falso o verdadero): Durante la etapa de Conciliación en un proceso ejecutivo, si el demandado propone pagar la deuda en 6 cuotas mensuales, el apoderado de la entidad acreedora puede aceptar la TERMINACIÓN INMEDIATA del proceso judicial en esa misma audiencia.",
    options: [
      "Verdadero: Se debe dar por terminado el proceso inmediatamente para cerrar el trámite.",
      "Falso: Jamás se acepta la terminación por el solo acuerdo. Se debe solicitar la SUSPENSIÓN del proceso condicionada al pago total de la última cuota y exigiendo renuncia a excepciones.",
    ],
    answer: 1,
    explain:
      "Regla crítica AECSA: Por ningún motivo se debe permitir la terminación del proceso por el solo acuerdo de cuotas. Se exige la suspensión supeditada al cumplimiento total del pago.",
  },
  {
    id: 2,
    type: "audio",
    q: "2. Presentación e instalación (fluidez oral): Utiliza la grabadora de voz local para realizar oralmente tu presentación formal de generales de ley ante el Despacho (Nombre, C.C., T.P., Correo y solicitud de reconocimiento de personería).",
    placeholder:
      "Señoría, comparece el abogado [Nombre], C.C. [Número], T.P. [Número] del C.S.J., correo [Email], actuando como apoderado judicial de...",
    keyTerms: [
      "señoría",
      "identificado",
      "cédula",
      "tarjeta profesional",
      "correo",
      "personería",
    ],
    explain:
      "En la presentación oral debes enunciar de forma pausada y completa tus datos de identificación, tu correo electrónico registrado y solicitar el reconocimiento formal de personería.",
  },
  {
    id: 3,
    type: "case_scenario",
    q: "3. Caso práctico - Decisión de excepciones previas:\nDurante la audiencia inicial virtual, el Juez dicta auto declarando PROBADA una excepción previa interpuesta por el demandado, lo cual afecta directamente el cobro del título ejecutivo del banco. El Juez no concede recurso de oficio y se dispone a pasar de inmediato al siguiente punto de la diligencia.\n\nComo abogado apoderado presente en la pantalla, ¿cuál es la conducta procesal exacta e inmediata que debes ejecutar?",
    options: [
      "A) Guardar silencio durante la audiencia virtual y radicar un escrito de reposición ante la secretaría del juzgado dentro de los 3 días hábiles siguientes.",
      "B) Solicitar de inmediato el uso de la palabra e interponer verbalmente el Recurso de Reposición y en subsidio el de Apelación en la misma sesión, sustentando técnicamente los motivos de desacuerdo.",
      "C) Aceptar la decisión del Juez y solicitar la terminación del proceso para volver a presentar una nueva demanda posteriormente.",
      "D) Desconectarse de la videollamada inmediatamente para consultar previamente la decisión con el equipo jurídico de la compañía.",
    ],
    answer: 1,
    explain:
      "Conforme al Art. 372/373 CGP, las decisiones notificadas en audiencia pública deben impugnarse de forma oral e inmediata en la misma sesión, interponiendo Reposición y en subsidio Apelación con sustento oportuno.",
  },
  {
    id: 4,
    type: "hangman",
    q: "4. Desafío ahorcado procesal: Descubre la advertencia legal obligatoria bajo la cual rinden su declaración las partes intervinientes durante la etapa del Interrogatorio y que conlleva responsabilidad penal, pecuniaria y disciplinaria.",
    secret: "GRAVEDAD DEL JURAMENTO",
    explain:
      "Toda declaración prestada por los representantes o partes procesales en audiencia se surte bajo la GRAVEDAD DEL JURAMENTO.",
  },
  {
    id: 5,
    type: "text_formula",
    q: "5. Control de legalidad y saneamiento (redacción técnica): Escribe o valida la manifestación verbal exacta que debes pronunciar cuando el Juez consulte si observas vicios o nulidades en la actuación:",
    requiredText:
      "Señoría, este apoderado no observa ninguna irregularidad ni vicio que afecte la validez de la actuación por lo que solicito se declare saneado el proceso.",
    explain:
      "Esta fórmula blinda la actuación y le permite al Juez declarar saneado el proceso, inhabilitando al demandado para alegar nulidades previas.",
  },
  {
    id: 6,
    type: "audio",
    q: "6. Impugnación oral en audiencia (práctica de voz): Graba con el micrófono local la interposición verbal del recurso de reposición y en subsidio apelación frente a un auto adverso notificado en estrados.",
    placeholder:
      "Señoría, con todo respeto interpongo en este momento el recurso de reposición y en subsidio el de apelación en contra del auto proferido...",
    keyTerms: ["reposición", "apelación", "subsidio", "respeto", "recurso"],
    explain:
      "Las decisiones notificadas en audiencia deben recurrirse de forma oral e inmediata interponiendo Reposición y en subsidio Apelación.",
  },
  {
    id: 7,
    type: "classify",
    q: "7. Fijación del litigio (matriz de delimitación): Clasifica si la suscripción del pagaré está 'Admitido / Probado' o si un alegado abono parcial de $10.000.000 exige 'Debate Probatorio'.",
    item1: "Firma y suscripción del pagaré ejecutivo por parte del deudor",
    item2:
      "Existencia del abono parcial de $10.000.000 alegado por el demandado",
    answer1: "admitido",
    answer2: "debate",
    explain:
      "La suscripción del pagaré está admitida; en cambio, la existencia del abono parcial exige debate probatorio.",
  },
  {
    id: 8,
    type: "mcq",
    q: "8. Decreto de pruebas y Art. 373 CGP: Si el Juez únicamente decreta pruebas documentales que ya constan en el expediente, ¿cuál es la consecuencia procesal?",
    options: [
      "El Juez suspende la audiencia por 30 días.",
      "El Juez prescinde de la audiencia de juicio, concede la palabra para Alegatos de Conclusión (20 min) y dicta sentencia en la misma sesión.",
      "Se debe realizar una inspección judicial obligatoria.",
      "Se remite el expediente al tribunal superior.",
    ],
    answer: 1,
    explain:
      "Es la figura de la Audiencia Concentrada (Art. 373 CGP). Al no requerir práctica de pruebas complejas, se pasa de inmediato a alegatos de conclusión y juzgamiento.",
  },
  {
    id: 9,
    type: "audio",
    q: "9. Orden de seguir adelante (sustentación de apelación parcial): El Despacho dicta sentencia acogiendo parcialmente una excepción del demandado. Graba o escribe cómo debes interponer la apelación parcial:",
    placeholder:
      "Señoría, interpongo recurso de apelación en contra de la sentencia dictada, de manera parcial, específicamente en lo relativo al numeral...",
    keyTerms: ["apelación", "parcial", "numeral", "sentencia", "desacuerdo"],
    explain:
      "Al apelar una sentencia parcialmente desfavorable, se debe señalar expresamente el numeral específico que se recurre y fundamentar los puntos de desacuerdo.",
  },
  {
    id: 10,
    type: "ordering",
    q: "10. Secuencia cronológica del CGP: Selecciona el orden secuencial estricto de las etapas de la audiencia inicial:",
    options: [
      "1. Instalación -> 2. Presentación -> 3. Conciliación -> 4. Control de Legalidad -> 5. Excepciones Previas -> 6. Interrogatorios -> 7. Fijación del Litigio -> 8. Decreto de Pruebas -> 9. Sentencia / Alegatos",
      "1. Interrogatorios -> 2. Conciliación -> 3. Sentencia -> 4. Instalación -> 5. Pruebas",
      "1. Sentencia -> 2. Conciliación -> 3. Excepciones Previas -> 4. Presentación",
      "1. Decreto de Pruebas -> 2. Instalación -> 3. Conciliación -> 4. Interrogatorios",
    ],
    answer: 0,
    explain:
      "El orden procesal estricto del Art. 372 CGP es: Instalación, Presentación, Conciliación, Control de legalidad, Excepciones previas, Interrogatorio, Fijación del litigio, Decreto de pruebas y Sentencia/Alegatos.",
  },
];

let quizHangmanSecret = "GRAVEDAD DEL JURAMENTO";
let quizGuessedLetters = new Set([" ", "A", "E"]);

function guessQuizHangmanLetter(letter) {
  quizGuessedLetters.add(letter);
  renderQuizHangmanDisplay();
  renderQuizHangmanKeyboard();
  updateQuizCompletionCount();
}

function renderQuizHangmanDisplay() {
  const display = document.getElementById("quiz-hangman-display");
  if (!display) return;

  let html = "";
  for (let char of quizHangmanSecret) {
    if (char === " ") {
      html += "&nbsp;&nbsp;";
    } else if (quizGuessedLetters.has(char)) {
      html += `${char} `;
    } else {
      html += "_ ";
    }
  }
  display.innerHTML = html;

  const isWon = [...quizHangmanSecret].every(
    (char) => char === " " || quizGuessedLetters.has(char),
  );
  const status = document.getElementById("quiz-hangman-status");
  if (status) {
    if (isWon) {
      status.innerHTML =
        '<span class="text-emerald-600 font-extrabold flex items-center justify-center gap-1.5"><i class="fa-solid fa-trophy"></i> ¡Excelente! Has descubierto: GRAVEDAD DEL JURAMENTO.</span>';
    } else {
      status.innerText = "Haz clic en las letras para completar la frase.";
    }
  }
}

function renderQuizHangmanKeyboard() {
  const keyboard = document.getElementById("quiz-hangman-keyboard");
  if (!keyboard) return;

  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  keyboard.innerHTML = alphabet
    .map((letter) => {
      const isGuessed = quizGuessedLetters.has(letter);
      return `<button type="button" onclick="guessQuizHangmanLetter('${letter}')" ${isGuessed ? 'disabled class="w-7 h-7 rounded bg-slate-200 text-gray-400 font-bold text-xs cursor-not-allowed"' : 'class="w-7 h-7 rounded bg-aecsaNavy text-white font-bold text-xs hover:bg-slate-800 transition shadow"'}>${letter}</button>`;
    })
    .join("");
}

function isQuizHangmanWon() {
  return [...quizHangmanSecret].every(
    (char) => char === " " || quizGuessedLetters.has(char),
  );
}

const mediaRecorders = {};
const recordedAudioBlobs = {};

async function startAudioRecording(qId) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
    });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) chunks.push(e.data);
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "audio/webm" });
      recordedAudioBlobs[qId] = blob;
      const audioURL = URL.createObjectURL(blob);
      const player = document.getElementById(`audio-player-${qId}`);
      if (player) {
        player.src = audioURL;
        player.classList.remove("hidden");
      }
      const status = document.getElementById(`rec-status-${qId}`);
      if (status)
        status.innerText = "¡Audio grabado localmente en tu navegador!";
      updateQuizCompletionCount();
    };

    mediaRecorders[qId] = mediaRecorder;
    mediaRecorder.start();

    document.getElementById(`btn-start-rec-${qId}`)?.classList.add("hidden");
    document.getElementById(`btn-stop-rec-${qId}`)?.classList.remove("hidden");
    const status = document.getElementById(`rec-status-${qId}`);
    if (status)
      status.innerText = "Grabando... Habla claro frente a tu micrófono.";
  } catch (err) {
    showModal(
      "Acceso a Micrófono",
      "No se pudo acceder al micrófono local. Puedes ingresar la respuesta escrita en el campo de texto.",
    );
  }
}

function stopAudioRecording(qId) {
  if (mediaRecorders[qId] && mediaRecorders[qId].state !== "inactive") {
    mediaRecorders[qId].stop();
    mediaRecorders[qId].stream.getTracks().forEach((track) => track.stop());
    document.getElementById(`btn-start-rec-${qId}`)?.classList.remove("hidden");
    document.getElementById(`btn-stop-rec-${qId}`)?.classList.add("hidden");
  }
}

const quizClassifyState = {};
function setQuizClassify(btn, qId, itemNum, val) {
  if (!quizClassifyState[qId]) quizClassifyState[qId] = {};
  quizClassifyState[qId][itemNum] = val;

  const btns = document.querySelectorAll(`.q-class-${itemNum}-${qId}`);
  btns.forEach((b) =>
    b.classList.remove(
      "bg-aecsaNavy",
      "text-white",
      "bg-emerald-600",
      "bg-amber-500",
    ),
  );

  if (val === "admitido") {
    btn.classList.add("bg-emerald-600", "text-white");
  } else {
    btn.classList.add("bg-amber-500", "text-white");
  }
  updateQuizCompletionCount();
}

function getQuestionTypeName(type) {
  switch (type) {
    case "audio":
      return "Fluidez oral";
    case "text_formula":
      return "Redacción técnica";
    case "classify":
      return "Matriz";
    case "hangman":
      return "Ahorcado";
    case "tf":
      return "Verdadero / falso";
    case "case_scenario":
      return "Caso práctico";
    default:
      return "Selección";
  }
}

function renderQuiz() {
  const container = document.getElementById("quiz-container");
  if (!container) return;

  container.innerHTML = quizData
    .map((q, idx) => {
      let interactiveControlHtml = "";

      if (q.type === "mcq" || q.type === "ordering" || q.type === "tf") {
        interactiveControlHtml = `
                        <div class="space-y-2 pt-2">
                            ${q.options
                              .map(
                                (opt, oIdx) => `
                                <label class="flex items-start space-x-3 p-3.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-slate-50 hover:border-aecsaGreen transition text-xs font-medium text-aecsaNavy">
                                    <input type="radio" name="quiz-q-${idx}" value="${oIdx}" onchange="updateQuizCompletionCount()" class="mt-0.5 text-aecsaGreen focus:ring-aecsaGreen">
                                    <span class="leading-relaxed">${opt}</span>
                                </label>
                            `,
                              )
                              .join("")}
                        </div>
                    `;
      } else if (q.type === "case_scenario") {
        interactiveControlHtml = `
                        <div class="space-y-3 pt-2">
                            <div class="p-3.5 bg-slate-900 text-white rounded-xl border border-slate-800 text-xs">
                                <span class="font-extrabold text-aecsaGreen uppercase block mb-1"><i class="fa-solid fa-briefcase mr-1"></i> Simulación de caso real:</span>
                                <p class="text-gray-300">Lee con atención la situación procesal y selecciona la opción de actuación oportuna:</p>
                            </div>
                            <div class="space-y-2">
                                ${q.options
                                  .map(
                                    (opt, oIdx) => `
                                    <label class="flex items-start space-x-3 p-3.5 rounded-xl border border-gray-200 cursor-pointer hover:bg-emerald-50 hover:border-aecsaGreen transition text-xs font-medium text-aecsaNavy">
                                        <input type="radio" name="quiz-q-${idx}" value="${oIdx}" onchange="updateQuizCompletionCount()" class="mt-0.5 text-aecsaGreen focus:ring-aecsaGreen">
                                        <span class="leading-relaxed">${opt}</span>
                                    </label>
                                `,
                                  )
                                  .join("")}
                            </div>
                        </div>
                    `;
      } else if (q.type === "hangman") {
        interactiveControlHtml = `
                        <div class="space-y-4 pt-2">
                            <div class="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
                                <div id="quiz-hangman-display" class="text-lg md:text-2xl font-black tracking-widest text-aecsaNavy py-3 bg-white border border-slate-200 rounded-xl shadow-inner"></div>
                                <div id="quiz-hangman-keyboard" class="flex flex-wrap gap-1.5 justify-center"></div>
                                <div id="quiz-hangman-status" class="text-xs font-bold text-gray-500">Haz clic en las letras para completar la frase.</div>
                            </div>
                        </div>
                    `;
      } else if (q.type === "audio") {
        interactiveControlHtml = `
                        <div class="space-y-4 pt-2">
                            <div class="p-4 bg-slate-900 text-white rounded-xl space-y-3 border border-slate-800">
                                <div class="flex items-center justify-between">
                                    <span class="text-xs font-bold text-aecsaGreen uppercase"><i class="fa-solid fa-microphone"></i> Grabadora de voz local (sin servidores)</span>
                                    <span id="rec-status-${q.id}" class="text-xs text-gray-300">Presiona para grabar audio local</span>
                                </div>

                                <div class="flex flex-wrap items-center gap-3">
                                    <button type="button" id="btn-start-rec-${q.id}" onclick="startAudioRecording(${q.id})" class="px-4 py-2 bg-aecsaOrange text-white rounded-lg text-xs font-extrabold hover:bg-orange-600 transition flex items-center gap-2">
                                        <i class="fa-solid fa-circle"></i> Grabar audio
                                    </button>
                                    <button type="button" id="btn-stop-rec-${q.id}" onclick="stopAudioRecording(${q.id})" class="hidden px-4 py-2 bg-red-600 text-white rounded-lg text-xs font-extrabold hover:bg-red-700 transition flex items-center gap-2">
                                        <i class="fa-solid fa-square"></i> Detener grabación
                                    </button>
                                    <audio id="audio-player-${q.id}" controls class="hidden h-9 w-full max-w-xs rounded"></audio>
                                </div>
                            </div>

                            <div>
                                <label class="block text-xs font-bold text-slate-700 mb-1">O escribe tu transcripción escrita para evaluación:</label>
                                <textarea id="quiz-text-input-${q.id}" oninput="updateQuizCompletionCount()" rows="3" placeholder="${q.placeholder}" class="w-full p-3 text-xs bg-slate-50 border border-gray-300 rounded-xl focus:border-aecsaNavy focus:ring-aecsaNavy outline-none font-sans"></textarea>
                            </div>
                        </div>
                    `;
      } else if (q.type === "text_formula") {
        interactiveControlHtml = `
                        <div class="space-y-3 pt-2">
                            <p class="text-xs text-gray-500 italic">Redacta o ajusta la fórmula formal de saneamiento procesal:</p>
                            <textarea id="quiz-formula-input-${q.id}" oninput="updateQuizCompletionCount()" rows="3" class="w-full p-3 text-xs bg-slate-50 border border-gray-300 rounded-xl focus:border-aecsaNavy focus:ring-aecsaNavy outline-none font-sans">Señoría, este apoderado no observa ninguna irregularidad ni vicio que afecte la validez de la actuación por lo que solicito se declare saneado el proceso.</textarea>
                        </div>
                    `;
      } else if (q.type === "classify") {
        interactiveControlHtml = `
                        <div class="space-y-3 pt-2">
                            <div class="p-3 bg-slate-50 border border-gray-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                                <span><strong>A)</strong> ${q.item1}</span>
                                <div class="flex gap-2">
                                    <button type="button" onclick="setQuizClassify(this, ${q.id}, 1, 'admitido')" class="q-class-1-${q.id} px-3 py-1.5 font-bold rounded-lg border border-gray-300 text-gray-700 hover:bg-emerald-100 transition">Admitido / Probado</button>
                                    <button type="button" onclick="setQuizClassify(this, ${q.id}, 1, 'debate')" class="q-class-1-${q.id} px-3 py-1.5 font-bold rounded-lg border border-gray-300 text-gray-700 hover:bg-amber-100 transition">Requiere Debate</button>
                                </div>
                            </div>
                            <div class="p-3 bg-slate-50 border border-gray-200 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                                <span><strong>B)</strong> ${q.item2}</span>
                                <div class="flex gap-2">
                                    <button type="button" onclick="setQuizClassify(this, ${q.id}, 2, 'admitido')" class="q-class-2-${q.id} px-3 py-1.5 font-bold rounded-lg border border-gray-300 text-gray-700 hover:bg-emerald-100 transition">Admitido / Probado</button>
                                    <button type="button" onclick="setQuizClassify(this, ${q.id}, 2, 'debate')" class="q-class-2-${q.id} px-3 py-1.5 font-bold rounded-lg border border-gray-300 text-gray-700 hover:bg-amber-100 transition">Requiere Debate</button>
                                </div>
                            </div>
                        </div>
                    `;
      }

      return `
                    <div id="quiz-card-${q.id}" class="p-5 md:p-6 bg-white border-2 border-gray-200 rounded-2xl space-y-3 shadow-sm transition">
                        <div class="flex items-center justify-between gap-2 border-b border-gray-100 pb-3">
                            <span class="text-xs font-bold uppercase tracking-wider text-aecsaNavy bg-slate-100 px-3 py-1 rounded-full">Pregunta ${q.id} de 10</span>
                            <div class="flex items-center gap-2">
                                <span id="q-badge-${q.id}" class="hidden text-xs font-extrabold px-2.5 py-0.5 rounded-full"></span>
                                <span class="text-xs font-semibold text-gray-400">Modalidad: ${getQuestionTypeName(q.type)}</span>
                            </div>
                        </div>
                        <p class="font-extrabold text-xs md:text-sm text-aecsaNavy leading-relaxed whitespace-pre-line">${q.q}</p>
                        ${interactiveControlHtml}
                        <div id="q-feedback-${q.id}" class="hidden p-3.5 rounded-xl text-xs leading-relaxed space-y-1"></div>
                    </div>
                `;
    })
    .join("");

  renderQuizHangmanDisplay();
  renderQuizHangmanKeyboard();
  updateQuizCompletionCount();
}

function updateQuizCompletionCount() {
  let completed = 0;
  quizData.forEach((q, idx) => {
    if (
      q.type === "mcq" ||
      q.type === "ordering" ||
      q.type === "tf" ||
      q.type === "case_scenario"
    ) {
      if (document.querySelector(`input[name="quiz-q-${idx}"]:checked`))
        completed++;
    } else if (q.type === "hangman") {
      if (isQuizHangmanWon()) completed++;
    } else if (q.type === "audio") {
      const textVal = document
        .getElementById(`quiz-text-input-${q.id}`)
        ?.value.trim();
      if (recordedAudioBlobs[q.id] || (textVal && textVal.length > 5))
        completed++;
    } else if (q.type === "text_formula") {
      const textVal = document
        .getElementById(`quiz-formula-input-${q.id}`)
        ?.value.trim();
      if (textVal && textVal.length > 10) completed++;
    } else if (q.type === "classify") {
      if (quizClassifyState[q.id]?.[1] && quizClassifyState[q.id]?.[2])
        completed++;
    }
  });
  const countSpan = document.getElementById("quiz-completion-count");
  if (countSpan) countSpan.innerText = `${completed} / 10 Contestados`;
}

function submitQuiz() {
  let score = 0;
  const audioFeedbackList = [];
  const questionResults = [];

  quizData.forEach((q, idx) => {
    let isCorrect = false;

    if (
      q.type === "mcq" ||
      q.type === "ordering" ||
      q.type === "tf" ||
      q.type === "case_scenario"
    ) {
      const selected = document.querySelector(
        `input[name="quiz-q-${idx}"]:checked`,
      );
      if (selected && parseInt(selected.value) === q.answer) {
        isCorrect = true;
      }
    } else if (q.type === "hangman") {
      if (isQuizHangmanWon()) {
        isCorrect = true;
      }
    } else if (q.type === "audio") {
      const textVal = (
        document.getElementById(`quiz-text-input-${q.id}`)?.value || ""
      ).toLowerCase();
      const hasAudio = !!recordedAudioBlobs[q.id];
      const hasKeywords = q.keyTerms.some((term) => textVal.includes(term));

      if (hasAudio || hasKeywords || textVal.length > 20) {
        isCorrect = true;
      }
      if (hasAudio) {
        audioFeedbackList.push(
          `Pregunta ${q.id}: Audio grabado e integrado correctamente.`,
        );
      }
    } else if (q.type === "text_formula") {
      const textVal = (
        document.getElementById(`quiz-formula-input-${q.id}`)?.value || ""
      ).toLowerCase();
      if (
        textVal.includes("saneado") ||
        textVal.includes("vicio") ||
        textVal.includes("irregularidad")
      ) {
        isCorrect = true;
      }
    } else if (q.type === "classify") {
      const state = quizClassifyState[q.id];
      if (state && state[1] === q.answer1 && state[2] === q.answer2) {
        isCorrect = true;
      }
    }

    if (isCorrect) score++;

    // Highlight card and show feedback badge per question
    const card = document.getElementById(`quiz-card-${q.id}`);
    const badge = document.getElementById(`q-badge-${q.id}`);
    const feedbackDiv = document.getElementById(`q-feedback-${q.id}`);

    if (card) {
      card.className = isCorrect
        ? "p-5 md:p-6 bg-emerald-50/40 border-2 border-emerald-400 rounded-2xl space-y-3 shadow-sm transition"
        : "p-5 md:p-6 bg-rose-50/40 border-2 border-rose-300 rounded-2xl space-y-3 shadow-sm transition";
    }

    if (badge) {
      badge.classList.remove("hidden");
      if (isCorrect) {
        badge.className =
          "text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300";
        badge.innerHTML =
          '<i class="fa-solid fa-check mr-1"></i> Correcto (+1.0)';
      } else {
        badge.className =
          "text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-300";
        badge.innerHTML =
          '<i class="fa-solid fa-xmark mr-1"></i> Incorrecto (0.0)';
      }
    }

    if (feedbackDiv) {
      feedbackDiv.classList.remove("hidden");
      if (isCorrect) {
        feedbackDiv.className =
          "p-3.5 rounded-xl text-xs bg-emerald-100/90 text-emerald-950 border border-emerald-300 space-y-1";
        feedbackDiv.innerHTML = `
                            <p class="font-extrabold text-emerald-900 flex items-center gap-1.5"><i class="fa-solid fa-circle-check text-emerald-600"></i> ¡Excelente actuación procesal!</p>
                            <p class="text-emerald-800 leading-relaxed">${q.explain}</p>
                        `;
      } else {
        feedbackDiv.className =
          "p-3.5 rounded-xl text-xs bg-rose-100/90 text-rose-950 border border-rose-300 space-y-1";
        feedbackDiv.innerHTML = `
                            <p class="font-extrabold text-rose-900 flex items-center gap-1.5"><i class="fa-solid fa-circle-xmark text-rose-600"></i> Fundamento técnico corregido:</p>
                            <p class="text-rose-800 leading-relaxed">${q.explain}</p>
                        `;
      }
    }

    let userTextVal = null;
    if (q.type === "audio") {
      const textVal = (
        document.getElementById(`quiz-text-input-${q.id}`)?.value || ""
      ).trim();
      if (textVal) userTextVal = textVal;
    }

    questionResults.push({
      id: q.id,
      type: q.type,
      isCorrect,
      userText: userTextVal || undefined,
    });
  });

  const resultsDiv = document.getElementById("quiz-results");
  if (resultsDiv) resultsDiv.classList.remove("hidden");

  const scorePct = Math.round((score / 10) * 100);
  const scoreNum = document.getElementById("quiz-score-number");
  if (scoreNum) scoreNum.innerText = `${score} / 10 (${scorePct}%)`;

  const scoreTitle = document.getElementById("quiz-score-title");
  const scoreDesc = document.getElementById("quiz-score-desc");
  const scoreBadgeIcon = document.getElementById("quiz-badge-icon");

  if (scoreTitle && scoreDesc) {
    if (score >= 8) {
      if (scoreBadgeIcon)
        scoreBadgeIcon.className =
          "inline-block bg-aecsaGreen text-aecsaNavy p-5 rounded-full text-4xl shadow-lg";
      scoreTitle.innerHTML =
        '<i class="fa-solid fa-award text-aecsaGreen mr-1.5"></i> ¡Sobresaliente! Certificado de solvencia procesal';
      scoreDesc.innerText = `Has obtenido una calificación del ${scorePct}% (${score}/10 aciertos). Demostraste un dominio riguroso y fluido de las 9 etapas procesales de la Audiencia Inicial según los Artículos 372 y 373 del CGP.`;
    } else if (score >= 7) {
      if (scoreBadgeIcon)
        scoreBadgeIcon.className =
          "inline-block bg-lime-400 text-aecsaNavy p-5 rounded-full text-4xl shadow-lg";
      scoreTitle.innerHTML =
        '<i class="fa-solid fa-circle-check text-aecsaGreen mr-1.5"></i> Examen aprobado - Nivel competente';
      scoreDesc.innerText = `Has alcanzado el puntaje de aprobación del ${scorePct}% (${score}/10 aciertos). Posees bases procesales sólidas. Repasa los puntos en rojo para alcanzar la máxima solvencia jurídica.`;
    } else {
      if (scoreBadgeIcon)
        scoreBadgeIcon.className =
          "inline-block bg-aecsaOrange text-white p-5 rounded-full text-4xl shadow-lg";
      scoreTitle.innerHTML =
        '<i class="fa-solid fa-triangle-exclamation text-aecsaOrange mr-1.5"></i> Calificación insuficiente - Requiere refuerzo';
      scoreDesc.innerText = `Tu puntaje es de ${scorePct}% (${score}/10 aciertos). Para aprobar se requiere un mínimo del 70% (7/10). Revisa las retroalimentaciones marcadas en rojo en cada pregunta y vuelve a intentar.`;
    }
  }

  const breakdownList = document.getElementById("quiz-breakdown-list");
  if (breakdownList) {
    breakdownList.innerHTML = questionResults
      .map(
        (r) => `
                    <div class="flex items-center justify-between p-2.5 bg-slate-800 rounded-xl text-xs border border-slate-700">
                        <span class="font-bold text-gray-200">Pregunta ${r.id} (${getQuestionTypeName(r.type)}):</span>
                        ${
                          r.isCorrect
                            ? '<span class="px-2 py-0.5 bg-emerald-900/80 text-emerald-300 font-extrabold rounded-md border border-emerald-600 flex items-center gap-1"><i class="fa-solid fa-check"></i> +1.0 Pronombre</span>'
                            : '<span class="px-2 py-0.5 bg-rose-900/80 text-rose-300 font-extrabold rounded-md border border-rose-600 flex items-center gap-1"><i class="fa-solid fa-xmark"></i> 0.0 Puntos</span>'
                        }
                    </div>
                `,
      )
      .join("");
  }

  const audioSummaryDiv = document.getElementById(
    "quiz-audio-feedback-summary",
  );
  const audioListUl = document.getElementById("quiz-audio-list");
  if (audioSummaryDiv && audioListUl) {
    if (audioFeedbackList.length > 0) {
      audioSummaryDiv.classList.remove("hidden");
      audioListUl.innerHTML = audioFeedbackList
        .map((item) => `<li>${item}</li>`)
        .join("");
    } else {
      audioSummaryDiv.classList.add("hidden");
    }
  }

  if (resultsDiv) resultsDiv.scrollIntoView({ behavior: "smooth" });

  // --- Enviar resultados al backend para guardar en MySQL ---
  const userId = (
    document.getElementById("user-id-input")?.value ||
    document.getElementById("script-name")?.value ||
    ""
  ).trim();
  const formData = new FormData();
  formData.append("nombre_usuario", userId);
  formData.append("puntaje", score);
  formData.append("porcentaje", scorePct);
  formData.append("preguntas", JSON.stringify(questionResults));

  // Adjuntar audios grabados y respuestas de texto (preguntas 2, 6, 9)
  [2, 6, 9].forEach((qId) => {
    if (recordedAudioBlobs[qId]) {
      formData.append(
        `audio_p${qId}`,
        recordedAudioBlobs[qId],
        `audio_p${qId}.webm`,
      );
    }
    const textInputVal = (
      document.getElementById(`quiz-text-input-${qId}`)?.value || ""
    ).trim();
    if (textInputVal) {
      formData.append(`texto_p${qId}`, textInputVal);
    }
  });

  fetch("php/guardar_resultado.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        showModal(
          "Resultado guardado",
          "Tu calificación y audios han sido registrados exitosamente en la base de datos.",
        );
      } else {
        console.error("Error del servidor:", data.error);
        showModal(
          "Error al guardar",
          data.error || "No se pudo guardar el resultado. Intenta de nuevo.",
        );
      }
    })
    .catch((err) => {
      console.error("Error de red:", err);
      showModal(
        "Error de conexión",
        "No se pudo conectar con el servidor para guardar el resultado.",
      );
    });
}

function resetQuiz() {
  const inputs = document.querySelectorAll(
    '#quiz-container input[type="radio"]',
  );
  inputs.forEach((input) => (input.checked = false));

  const textAreas = document.querySelectorAll("#quiz-container textarea");
  textAreas.forEach((ta) => {
    if (!ta.id.includes("quiz-formula-input")) {
      ta.value = "";
    }
  });

  quizGuessedLetters = new Set([" ", "A", "E"]);
  renderQuizHangmanDisplay();
  renderQuizHangmanKeyboard();

  quizData.forEach((q) => {
    const card = document.getElementById(`quiz-card-${q.id}`);
    const badge = document.getElementById(`q-badge-${q.id}`);
    const feedbackDiv = document.getElementById(`q-feedback-${q.id}`);
    if (card) {
      card.className =
        "p-5 md:p-6 bg-white border-2 border-gray-200 rounded-2xl space-y-3 shadow-sm transition";
    }
    if (badge) badge.classList.add("hidden");
    if (feedbackDiv) feedbackDiv.classList.add("hidden");
  });

  const resultsDiv = document.getElementById("quiz-results");
  if (resultsDiv) resultsDiv.classList.add("hidden");

  updateQuizCompletionCount();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ============================================================
// REPORTES: Carga de evaluaciones y detalle con audios
// ============================================================

const PREGUNTA_NOMBRES = {
  1: "Conciliación (V/F)",
  2: "Presentación (Audio)",
  3: "Excepciones previas (Caso)",
  4: "Interrogatorio (Ahorcado)",
  5: "Control de legalidad (Texto)",
  6: "Impugnación oral (Audio)",
  7: "Fijación del litigio (Clasificar)",
  8: "Decreto de pruebas (MCQ)",
  9: "Apelación parcial (Audio)",
  10: "Secuencia CGP (Ordenar)",
};

function loadReportes() {
  const container = document.getElementById("reportes-container");
  if (!container) return;

  container.innerHTML = `
    <div class="flex items-center justify-center py-12 text-gray-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-3"></i>
      <span class="text-sm font-semibold">Cargando evaluaciones...</span>
    </div>
  `;

  fetch("php/obtener_evaluaciones.php")
    .then((res) => res.json())
    .then((data) => {
      if (!data.success || !data.data || data.data.length === 0) {
        container.innerHTML = `
          <div class="text-center py-12 text-gray-400 space-y-2">
            <i class="fa-solid fa-inbox text-4xl"></i>
            <p class="text-sm font-semibold">No hay evaluaciones registradas aún.</p>
          </div>
        `;
        return;
      }
      renderReportesTable(data.data, container);
    })
    .catch((err) => {
      console.error("Error cargando reportes:", err);
      container.innerHTML = `
        <div class="text-center py-12 text-rose-500 space-y-2">
          <i class="fa-solid fa-circle-exclamation text-4xl"></i>
          <p class="text-sm font-semibold">Error al cargar las evaluaciones.</p>
        </div>
      `;
    });
}

function renderReportesTable(evaluaciones, container) {
  const rows = evaluaciones
    .map((ev, idx) => {
      const fecha = new Date(ev.fecha_registro).toLocaleString("es-CO", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const pct = parseInt(ev.porcentaje);
      let badgeClass, badgeText;
      if (pct >= 80) {
        badgeClass = "bg-emerald-100 text-emerald-800 border-emerald-300";
        badgeText = "Sobresaliente";
      } else if (pct >= 70) {
        badgeClass = "bg-lime-100 text-lime-800 border-lime-300";
        badgeText = "Aprobado";
      } else {
        badgeClass = "bg-rose-100 text-rose-800 border-rose-300";
        badgeText = "Insuficiente";
      }

      return `
        <tr class="border-b border-gray-100 hover:bg-slate-50/60 transition">
          <td class="px-4 py-3 text-xs font-semibold text-gray-500">${ev.id}</td>
          <td class="px-4 py-3">
            <span class="text-xs font-bold text-aecsaNavy">${ev.nombre_usuario}</span>
          </td>
          <td class="px-4 py-3 text-center">
            <span class="text-sm font-extrabold text-aecsaNavy">${ev.puntaje}</span>
            <span class="text-xs text-gray-400">/10</span>
          </td>
          <td class="px-4 py-3 text-center">
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-extrabold border ${badgeClass}">
              ${pct}% · ${badgeText}
            </span>
          </td>
          <td class="px-4 py-3 text-xs text-gray-500">${fecha}</td>
          <td class="px-4 py-3 text-center">
            <button
              onclick="verDetalleEvaluacion(${ev.id})"
              class="px-3 py-1.5 bg-aecsaNavy text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition inline-flex items-center gap-1.5"
            >
              <i class="fa-solid fa-eye"></i> Ver detalle
            </button>
          </td>
        </tr>
      `;
    })
    .join("");

  container.innerHTML = `
    <div class="overflow-x-auto rounded-2xl border border-gray-200">
      <table class="w-full text-left">
        <thead>
          <tr class="bg-slate-900 text-white">
            <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider">#</th>
            <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider">Usuario</th>
            <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-center">Puntaje</th>
            <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-center">Resultado</th>
            <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider">Fecha</th>
            <th class="px-4 py-3 text-xs font-bold uppercase tracking-wider text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${rows}
        </tbody>
      </table>
    </div>
    <p class="text-xs text-gray-400 text-right mt-2">
      <i class="fa-solid fa-database mr-1"></i> ${evaluaciones.length} evaluación(es) registrada(s)
    </p>
  `;
}

function verDetalleEvaluacion(id) {
  const modal = document.getElementById("detalle-modal");
  const content = document.getElementById("detalle-modal-content");
  if (!modal || !content) return;

  content.innerHTML = `
    <div class="flex items-center justify-center py-12 text-gray-400">
      <i class="fa-solid fa-spinner fa-spin text-2xl mr-3"></i>
      <span class="text-sm font-semibold">Cargando detalle...</span>
    </div>
  `;
  modal.classList.remove("hidden");

  fetch(`php/obtener_detalle.php?id=${id}`)
    .then((res) => res.json())
    .then((data) => {
      if (!data.success) {
        content.innerHTML = `<p class="text-rose-600 text-sm font-bold text-center py-8">Error: ${data.error}</p>`;
        return;
      }
      renderDetalleModal(data.data, content);
    })
    .catch((err) => {
      console.error("Error cargando detalle:", err);
      content.innerHTML = `<p class="text-rose-600 text-sm font-bold text-center py-8">Error de conexión al cargar el detalle.</p>`;
    });
}

function escapeHtml(str) {
  if (!str) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function renderDetalleModal(ev, container) {
  const fecha = new Date(ev.fecha_registro).toLocaleString("es-CO", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const pct = parseInt(ev.porcentaje);
  let headerBg, headerBorder;
  if (pct >= 80) {
    headerBg = "bg-emerald-50";
    headerBorder = "border-emerald-300";
  } else if (pct >= 70) {
    headerBg = "bg-lime-50";
    headerBorder = "border-lime-300";
  } else {
    headerBg = "bg-rose-50";
    headerBorder = "border-rose-300";
  }

  // Build per-question rows
  const preguntasHTML = [];
  for (let i = 1; i <= 10; i++) {
    const correcto = parseInt(ev[`p${i}`]) === 1;
    const nombre = PREGUNTA_NOMBRES[i] || `Pregunta ${i}`;
    const isAudioOrText = [2, 6, 9].includes(i);
    const audioField = `audio_p${i}`;
    const textField = `texto_p${i}`;
    const hasAudio =
      isAudioOrText && ev[audioField + "_exists"] && ev[audioField];
    const textVal = isAudioOrText
      ? (
          ev[textField] ||
          (ev.detalle || []).find((d) => d.id === i)?.userText ||
          ""
        ).trim()
      : "";
    const hasText = textVal.length > 0;

    let mediaHTML = "";
    if (isAudioOrText) {
      let audioPart = "";
      if (hasAudio) {
        audioPart = `
          <div class="mt-2">
            <p class="text-xs text-gray-500 mb-1 flex items-center gap-1 font-semibold">
              <i class="fa-solid fa-headphones text-aecsaGreenDark"></i> Audio grabado:
            </p>
            <audio controls class="w-full h-8" preload="metadata">
              <source src="${ev[audioField]}" type="audio/webm">
              Tu navegador no soporta la reproducción de audio.
            </audio>
          </div>
        `;
      }

      let textPart = "";
      if (hasText) {
        textPart = `
          <div class="mt-2 p-2.5 bg-white/90 rounded-xl border border-slate-200 shadow-sm">
            <p class="text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
              <i class="fa-solid fa-align-left text-aecsaBlue700"></i> Respuesta escrita:
            </p>
            <p class="text-xs text-slate-600 whitespace-pre-wrap leading-relaxed">${escapeHtml(textVal)}</p>
          </div>
        `;
      }

      if (!hasAudio && !hasText) {
        mediaHTML = `
          <p class="mt-2 text-xs text-gray-400 italic flex items-center gap-1">
            <i class="fa-solid fa-microphone-slash"></i> Sin audio grabado ni respuesta escrita
          </p>
        `;
      } else {
        mediaHTML = audioPart + textPart;
      }
    }

    preguntasHTML.push(`
      <div class="p-3.5 rounded-xl border ${correcto ? "bg-emerald-50/50 border-emerald-200" : "bg-rose-50/50 border-rose-200"} space-y-1">
        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-aecsaNavy flex items-center gap-1.5">
            <span class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${correcto ? "bg-emerald-600 text-white" : "bg-rose-500 text-white"}">
              ${correcto ? "✓" : "✗"}
            </span>
            P${i}. ${nombre}
          </span>
          <span class="text-xs font-extrabold ${correcto ? "text-emerald-700" : "text-rose-700"}">
            ${correcto ? "+1.0" : "0.0"}
          </span>
        </div>
        ${mediaHTML}
      </div>
    `);
  }

  container.innerHTML = `
    <div class="space-y-5">
      <!-- Header -->
      <div class="${headerBg} ${headerBorder} border rounded-2xl p-5 space-y-3">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-extrabold text-aecsaNavy">
              <i class="fa-solid fa-user-graduate mr-1.5"></i> ${ev.nombre_usuario}
            </h3>
            <p class="text-xs text-gray-500 mt-0.5">
              <i class="fa-regular fa-calendar mr-1"></i> ${fecha}
            </p>
          </div>
          <div class="text-right">
            <div class="text-3xl font-black text-aecsaNavy">${ev.puntaje}<span class="text-lg text-gray-400">/10</span></div>
            <div class="text-sm font-extrabold ${pct >= 70 ? "text-emerald-700" : "text-rose-700"}">${pct}%</div>
          </div>
        </div>
      </div>

      <!-- Questions breakdown -->
      <div class="space-y-2">
        <p class="text-xs font-bold uppercase tracking-wider text-gray-500 flex items-center gap-1.5">
          <i class="fa-solid fa-list-check text-aecsaGreenDark"></i> Desglose por pregunta
        </p>
        ${preguntasHTML.join("")}
      </div>
    </div>
  `;
}

function cerrarDetalleModal() {
  const modal = document.getElementById("detalle-modal");
  if (modal) modal.classList.add("hidden");
}

// ============================================================

function initApp() {
  renderStepContent(currentStep);
  updateProgressUI();
  renderPedagogicalCards();
  renderQuiz();
  switchMainTab("methodology");
}

if (
  document.readyState === "complete" ||
  document.readyState === "interactive"
) {
  initApp();
} else {
  window.addEventListener("DOMContentLoaded", initApp);
}
