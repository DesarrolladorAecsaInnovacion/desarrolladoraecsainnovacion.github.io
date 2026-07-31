<?php
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

$idUsuario     = $_SESSION['id'] ?? '';
$nombreUsuario = $_SESSION['correo'] ?? '';
$rolUsuario    = $_SESSION['rol'] ?? '';
?>
<!doctype html>
<html lang="es" class="h-full bg-[#F4F5F6]">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>
      AECSA - Plataforma interactiva: Audiencia inicial (Art. 372/373 CGP)
    </title>
    <!-- Tailwind CSS CDN -->
    <script src="librerias/tailwind-3.4.17.js"></script>
    <!-- FontAwesome Icons -->
    <link rel="stylesheet" href="librerias/font-awesome.css" />
    <!-- Google Fonts Fallbacks -->
    <link href="librerias/googleFonts.css" rel="stylesheet" />
    <!-- Custom JS y CSS -->
    <script src="js/customTailwind.js"></script>
    <link rel="stylesheet" href="css/index.css">
  </head>
  <body
    class="bg-aecsaGray text-aecsaNavy min-h-screen flex flex-col font-sans antialiased selection:bg-aecsaGreen selection:text-aecsaNavy"
  >
    <header
      class="bg-aecsaNavy text-white sticky top-0 z-50 shadow-lg border-b-4 border-aecsaGreen"
    >
      <div
        class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between"
      >
        <!-- Logo & Brand Lockup -->
        <div class="flex items-center space-x-3">
          <div
            class="flex items-center gap-2.5 bg-transparent px-3.5 py-2 rounded-xl shadow-sm"
          >
            <img
              src="img/logo-aecsa.svg"
              alt="AECSA Logo"
              class="h-8 md:h-10 w-auto object-contain"
            />
          </div>
          <div class="hidden md:block text-xs border-l border-slate-700 pl-3">
            <p class="font-bold text-aecsaGreen uppercase tracking-wider">
              Simulador procesal autónomo CGP
            </p>
            <p class="text-gray-300 font-script text-sm">Contigo Siempre</p>
          </div>
        </div>

        <!-- Main Navigation Mode Switcher -->
        <nav
          class="flex space-x-1.5 bg-slate-900/80 p-1.5 rounded-xl border border-slate-700/60 shadow-inner"
        >
          <button
            onclick="switchMainTab('methodology')"
            id="btn-tab-methodology"
            class="px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 bg-aecsaGreen text-aecsaNavy shadow-md"
          >
            <i class="fa-solid fa-graduation-cap mr-1.5"></i>Diseño pedagógico
          </button>
          <button
            onclick="switchMainTab('simulator')"
            id="btn-tab-simulator"
            class="px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 text-gray-300 hover:text-white"
          >
            <i class="fa-solid fa-gamepad mr-1.5"></i>Simulador práctico
          </button>
          <button
            onclick="switchMainTab('quiz')"
            id="btn-tab-quiz"
            class="px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 text-gray-300 hover:text-white"
          >
            <i class="fa-solid fa-award mr-1.5"></i>Evaluación final (10
            pruebas)
          </button>
          <!-- Validar permiso de usuario administrador con variable de sesión -->
          <?php if ((string)$rolUsuario === '99'): ?>
          <button
            onclick="switchMainTab('reportes')"
            id="btn-tab-reportes"
            class="px-3.5 py-2 rounded-lg text-xs md:text-sm font-bold transition-all duration-200 text-gray-300 hover:text-white"
          >
            <i class="fa-solid fa-chart-line mr-1.5"></i>Reportes
          </button>
          <?php endif; ?>
        </nav>
      </div>
    </header>

    <main
      class="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6"
    >
      <!-- VIEW 1: INTERACTIVE SIMULATOR & STEPPER -->
      <section id="view-simulator" class="hidden space-y-6">
        <!-- Hero Banner -->
        <div
          class="bg-aecsaNavy rounded-3xl p-6 md:p-8 text-white relative overflow-hidden shadow-2xl border border-slate-800"
        >
          <div
            class="absolute right-0 top-0 opacity-10 text-aecsaGreen translate-x-12 -translate-y-8 pointer-events-none"
          >
            <i class="fa-solid fa-scale-balanced text-[240px]"></i>
          </div>
          <div class="relative z-10 max-w-3xl space-y-3">
            <span
              class="aecsa-eyebrow font-bold text-xs uppercase tracking-widest text-aecsaGreen"
              >Guía paso a paso • Art. 372 y 373 CGP</span
            >
            <h1
              class="text-2xl md:text-4xl font-extrabold text-white leading-tight"
            >
              Estructura procesal de la audiencia inicial virtual
            </h1>
            <p class="text-xs md:text-sm text-gray-300 leading-relaxed">
              Aprende y domina la gestión técnica, operativa y jurídica de las 9
              etapas procesales. Esta versión funciona
              <strong>100% de manera autónoma en tu navegador</strong> usando
              sintetizador de voz y grabadora local.
            </p>

            <div class="pt-2 flex flex-wrap gap-4 items-center">
              <div
                class="bg-slate-800/90 px-4 py-2 rounded-xl border border-slate-700 flex items-center gap-2.5"
              >
                <i class="fa-solid fa-trophy text-aecsaGreen text-sm"></i>
                <span class="text-xs font-bold text-gray-300"
                  >Progreso general:</span
                >
                <span
                  id="overall-progress-text"
                  class="font-extrabold text-white text-xs"
                  >0% completado</span
                >
              </div>
              <div
                class="w-48 bg-slate-800 rounded-full h-3 overflow-hidden border border-slate-700 p-0.5"
              >
                <div
                  id="overall-progress-bar"
                  class="bg-aecsaGreen h-full rounded-full w-0 transition-all duration-300"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Stepper Progress Bar -->
        <div
          class="bg-white p-4 rounded-2xl shadow-md border border-gray-200 overflow-x-auto custom-scrollbar"
        >
          <div
            class="flex items-center min-w-[920px] justify-between relative px-2"
          >
            <!-- Background Connector Line -->
            <div
              class="absolute top-1/2 left-4 right-4 h-1.5 bg-slate-100 -translate-y-1/2 z-0 rounded-full"
            ></div>
            <div
              id="stepper-line-active"
              class="absolute top-1/2 left-4 h-1.5 bg-aecsaGreen -translate-y-1/2 z-0 transition-all duration-300 rounded-full"
              style="width: 0%"
            ></div>

            <!-- Step Buttons (0: Checklist + 1-9 Steps + 10: Golden Rules) -->
            <button
              onclick="goToStep(0)"
              id="step-btn-0"
              class="step-btn relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs bg-aecsaNavy text-white ring-4 ring-white shadow transition-all"
            >
              0
            </button>
            <button
              onclick="goToStep(1)"
              id="step-btn-1"
              class="step-btn relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs bg-gray-200 text-gray-600 ring-4 ring-white shadow transition-all"
            >
              1
            </button>
            <button
              onclick="goToStep(2)"
              id="step-btn-2"
              class="step-btn relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs bg-gray-200 text-gray-600 ring-4 ring-white shadow transition-all"
            >
              2
            </button>
            <button
              onclick="goToStep(3)"
              id="step-btn-3"
              class="step-btn relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs bg-gray-200 text-gray-600 ring-4 ring-white shadow transition-all"
            >
              3
            </button>
            <button
              onclick="goToStep(4)"
              id="step-btn-4"
              class="step-btn relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs bg-gray-200 text-gray-600 ring-4 ring-white shadow transition-all"
            >
              4
            </button>
            <button
              onclick="goToStep(5)"
              id="step-btn-5"
              class="step-btn relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs bg-gray-200 text-gray-600 ring-4 ring-white shadow transition-all"
            >
              5
            </button>
            <button
              onclick="goToStep(6)"
              id="step-btn-6"
              class="step-btn relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs bg-gray-200 text-gray-600 ring-4 ring-white shadow transition-all"
            >
              6
            </button>
            <button
              onclick="goToStep(7)"
              id="step-btn-7"
              class="step-btn relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs bg-gray-200 text-gray-600 ring-4 ring-white shadow transition-all"
            >
              7
            </button>
            <button
              onclick="goToStep(8)"
              id="step-btn-8"
              class="step-btn relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs bg-gray-200 text-gray-600 ring-4 ring-white shadow transition-all"
            >
              8
            </button>
            <button
              onclick="goToStep(9)"
              id="step-btn-9"
              class="step-btn relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs bg-gray-200 text-gray-600 ring-4 ring-white shadow transition-all"
            >
              9
            </button>
            <button
              onclick="goToStep(10)"
              id="step-btn-10"
              class="step-btn relative z-10 w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs bg-gray-200 text-gray-600 ring-4 ring-white shadow transition-all"
            >
              <i class="fa-solid fa-star"></i>
            </button>
          </div>
        </div>

        <!-- Dynamic Content Card Container -->
        <div
          id="step-content-card"
          class="bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-gray-200"
        >
          <!-- Rendered dynamically by JavaScript -->
        </div>

        <!-- Bottom Navigation Bar -->
        <div
          class="flex justify-between items-center bg-white p-4 rounded-2xl border border-gray-200 shadow-sm"
        >
          <button
            id="btn-prev"
            onclick="prevStep()"
            class="px-5 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold text-xs hover:bg-gray-100 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <i class="fa-solid fa-arrow-left mr-2"></i>Anterior
          </button>
          <span
            id="step-indicator"
            class="text-xs font-extrabold text-aecsaNavy uppercase tracking-wider"
            >Fase 1: Checklist técnico</span
          >
          <button
            id="btn-next"
            onclick="nextStep()"
            class="px-5 py-2.5 rounded-xl bg-aecsaNavy text-white font-bold text-xs hover:bg-slate-800 transition shadow"
          >
            Siguiente<i class="fa-solid fa-arrow-right ml-2"></i>
          </button>
        </div>
      </section>

      <!-- VIEW 2: PEDAGOGICAL SPECIFICATION (DOCS) -->
      <section id="view-methodology" class="space-y-6">
        <div
          class="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-200 space-y-4"
        >
          <div>
            <span
              class="aecsa-eyebrow font-bold text-xs uppercase tracking-widest text-aecsaGreenDark"
              >Diseño instruccional corporativo</span
            >
            <h2 class="text-2xl font-extrabold text-aecsaNavy mt-1">
              Sustentación pedagógica de los 9 pasos
            </h2>
            <p class="text-gray-600 mt-1 text-xs md:text-sm">
              Estructura conceptual, mecánicas interactivas y resultados
              esperados para capacitar personal corporativo sin experiencia
              legal.
            </p>
          </div>

          <div class="mt-6 space-y-4" id="pedagogical-cards-container">
            <!-- Inserted via JavaScript -->
          </div>
        </div>
      </section>

      <!-- VIEW 3: FINAL EVALUATION & AUDIO CERTIFICATE -->
      <section id="view-quiz" class="hidden space-y-6">
        <div
          class="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-200 max-w-4xl mx-auto space-y-6"
        >
          <div class="text-center space-y-2">
            <span
              class="aecsa-eyebrow font-bold text-xs uppercase tracking-widest text-aecsaGreenDark"
              >Evaluación de desempeño práctico</span
            >
            <h2 class="text-2xl md:text-3xl font-extrabold text-aecsaNavy">
              Examen interactivo de audiencia inicial
            </h2>
            <p class="text-gray-600 text-xs md:text-sm max-w-2xl mx-auto">
              Demuestra tu solvencia legal, capacidad de reacción verbal y toma
              de decisiones completando los 10 desafíos interactivos locales.
            </p>
            <div class="pt-2 flex items-center justify-center">
              <div id="quiz-user-badge" class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-aecsaNavy shadow-sm <?php echo empty($nombreUsuario) ? 'hidden' : ''; ?>">
                <i class="fa-solid fa-user-check text-aecsaGreenDark text-sm"></i>
                <span>Usuario en sesión: <strong id="quiz-user-name-display" class="font-extrabold text-aecsaNavy"><?php echo htmlspecialchars($nombreUsuario, ENT_QUOTES, 'UTF-8'); ?></strong></span>
              </div>
            </div>
            <input type="hidden" id="user-id-input" value="<?php echo htmlspecialchars($idUsuario, ENT_QUOTES, 'UTF-8'); ?>" />
            <input type="hidden" id="user-name-input" value="<?php echo htmlspecialchars($nombreUsuario, ENT_QUOTES, 'UTF-8'); ?>" />
          </div>

          <!-- Quiz Progress Bar -->
          <div
            class="bg-slate-50 p-4 rounded-2xl flex items-center justify-between border border-slate-200 text-xs font-bold"
          >
            <div class="flex items-center space-x-2 text-aecsaNavy">
              <i
                class="fa-solid fa-list-check text-aecsaGreenDark text-base"
              ></i>
              <span class="uppercase tracking-wider"
                >10 desafíos evaluativos</span
              >
            </div>
            <span
              id="quiz-completion-count"
              class="text-aecsaOrange font-extrabold"
              >0 / 10 Contestados</span
            >
          </div>

          <!-- Questions Container -->
          <div id="quiz-container" class="space-y-6">
            <!-- 10 Interactive questions rendered dynamically via JS -->
          </div>

          <!-- Action Button -->
          <div class="pt-4 border-t border-gray-200">
            <button
              onclick="submitQuiz()"
              class="w-full py-4 bg-aecsaNavy text-white text-sm font-extrabold rounded-2xl hover:bg-slate-800 transition shadow-lg flex items-center justify-center gap-2"
            >
              <i class="fa-solid fa-paper-plane"></i> Evaluar desempeño y
              calificar examen
            </button>
          </div>

          <!-- Quiz Results Dashboard -->
          <div
            id="quiz-results"
            class="hidden mt-8 p-6 md:p-8 bg-slate-900 text-white rounded-3xl border border-slate-700 text-center space-y-6 shadow-2xl"
          >
            <div
              id="quiz-badge-icon"
              class="inline-block bg-aecsaGreen text-aecsaNavy p-5 rounded-full text-4xl shadow-lg"
            >
              <i class="fa-solid fa-trophy"></i>
            </div>
            <h3
              class="text-2xl font-extrabold text-white"
              id="quiz-score-title"
            >
              ¡Evaluación completada!
            </h3>
            <div
              class="text-4xl font-black text-aecsaGreen"
              id="quiz-score-number"
            >
              0 / 10 (0%)
            </div>
            <p
              class="text-xs md:text-sm text-gray-300 max-w-xl mx-auto leading-relaxed"
              id="quiz-score-desc"
            ></p>

            <!-- Itemized Question Breakdown Matrix -->
            <div
              class="p-4 bg-slate-800 rounded-2xl border border-slate-700 text-left space-y-3"
            >
              <p
                class="font-bold text-xs uppercase text-aecsaGreen flex items-center gap-2"
              >
                <i class="fa-solid fa-chart-bar"></i> Desglose detallado de
                calificación por pregunta:
              </p>
              <div
                id="quiz-breakdown-list"
                class="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs"
              >
                <!-- Filled dynamically -->
              </div>
            </div>

            <div
              id="quiz-audio-feedback-summary"
              class="hidden text-left bg-slate-800 p-4 rounded-2xl text-xs space-y-2 border border-slate-700"
            >
              <p class="font-bold text-aecsaGreen uppercase">
                <i class="fa-solid fa-microphone"></i> Resumen de prácticas de
                voz registradas:
              </p>
              <ul
                id="quiz-audio-list"
                class="list-disc list-inside text-gray-300 space-y-1"
              ></ul>
            </div>

            <div class="pt-2 flex flex-wrap gap-4 justify-center">
              <button
                onclick="resetQuiz()"
                class="px-6 py-3 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition border border-slate-600"
              >
                <i class="fa-solid fa-rotate-right mr-1.5"></i>Reiniciar y
                volver a intentar
              </button>
              <button
                onclick="switchMainTab('simulator')"
                class="px-6 py-3 bg-aecsaGreen text-aecsaNavy rounded-xl text-xs font-bold hover:bg-aecsaGreenDark transition shadow"
              >
                <i class="fa-solid fa-gamepad mr-1.5"></i>Volver al simulador
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- VIEW 4: REPORTES -->
      <section id="view-reportes" class="hidden space-y-6">
        <div
          class="bg-white rounded-3xl p-6 md:p-8 shadow-md border border-gray-200 space-y-4"
        >
          <div>
            <span
              class="aecsa-eyebrow font-bold text-xs uppercase tracking-widest text-aecsaGreenDark"
              >Reportes</span
            >
            <h2 class="text-2xl font-extrabold text-aecsaNavy mt-1">
              Reportes de evaluaciones
            </h2>
          </div>

          <div class="mt-6 space-y-4" id="reportes-container">
            
          </div>
        </div>
      </section>
    </main>
    <!-- Custom Modal Dialog (Replaces alert) -->
    <div
      id="aecsa-modal"
      class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <div
        class="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-200 space-y-4 text-center"
      >
        <div
          class="w-12 h-12 bg-lime-100 text-aecsaGreenDark rounded-full flex items-center justify-center mx-auto text-xl"
        >
          <i class="fa-solid fa-circle-info"></i>
        </div>
        <h3 id="modal-title" class="text-lg font-extrabold text-aecsaNavy">
          Aviso
        </h3>
        <p id="modal-message" class="text-xs text-gray-600 leading-relaxed"></p>
        <button
          onclick="closeModal()"
          class="w-full py-2.5 bg-aecsaNavy text-white rounded-xl text-xs font-extrabold hover:bg-slate-800 transition"
        >
          Entendido
        </button>
      </div>
    </div>

    <!-- Detail Modal for Evaluation Report -->
    <div
      id="detalle-modal"
      class="hidden fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
    >
      <div
        class="bg-white rounded-3xl p-6 md:p-8 max-w-2xl w-full shadow-2xl border border-gray-200 my-8 relative"
      >
        <button
          onclick="cerrarDetalleModal()"
          class="absolute top-4 right-4 w-8 h-8 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center text-gray-500 hover:text-gray-800 transition"
        >
          <i class="fa-solid fa-xmark"></i>
        </button>
        <div id="detalle-modal-content">
          <!-- Filled dynamically by JS -->
        </div>
        <div class="mt-6 pt-4 border-t border-gray-200">
          <button
            onclick="cerrarDetalleModal()"
            class="w-full py-2.5 bg-aecsaNavy text-white rounded-xl text-xs font-extrabold hover:bg-slate-800 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer
      class="bg-aecsaNavy text-gray-400 py-6 text-xs border-t border-slate-800 mt-12"
    >
      <div class="max-w-7xl mx-auto px-4 text-center space-y-2">
        <p class="font-bold text-gray-300">
          AECSA • Innovación en capacitación procesal autónoma
        </p>
        <p>
          Basado estrictamente en los Artículos 372 y 373 del Código General del
          Proceso (CGP) • Colombia
        </p>
        <p class="text-aecsaGreen font-script text-base">Contigo Siempre</p>
      </div>
    </footer>
    <script src="js/index.js?id=1.0.1"></script>
  </body>
</html>
