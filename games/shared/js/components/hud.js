/* ==========================================================================
   FGI - Componente: HUD / Barra Superior (games/shared/js/components/hud.js)
   Requer games/shared/css/components/hud.css
   ========================================================================== */

(function () {
    "use strict";

    window.GameComponents = window.GameComponents || {};

    var elBarra = null;
    var elProgresso = null;
    var elSom = null;
    var elTimer = null;
    var somLigado = true;
    var timerInterval = null;

    GameComponents.hud = {
        // Inicializar HUD dentro de um container (ex: <div id="game-hud">)
        init: function (options) {
            options = options || {};
            somLigado = options.soundEnabled !== false;

            var container = options.container || document.getElementById("game-hud");
            if (!container) return;

            var mostrarSom = options.showSound !== false;
            var mostrarTimer = !!options.showTimer;

            container.innerHTML =
                '<header class="barra-topo">' +
                '<button type="button" class="botao-icone" id="hud-botao-voltar" title="Voltar ao início" aria-label="Voltar ao início">' +
                '🏠 <span class="texto-botao-topo">Início</span></button>' +
                '<div id="hud-progresso" class="progresso" aria-label="Progresso da atividade"></div>' +
                (mostrarTimer ? '<span id="hud-timer" class="hud-timer">00:00</span>' : "") +
                (mostrarSom ?
                    '<button type="button" class="botao-icone" id="hud-botao-som" aria-pressed="true" title="Ligar ou desligar o som" aria-label="Ligar ou desligar o som">' +
                    '🔊 <span class="texto-botao-topo">Som</span></button>' : "") +
                "</header>";

            elBarra = container.querySelector(".barra-topo");
            elProgresso = container.querySelector("#hud-progresso");
            elSom = container.querySelector("#hud-botao-som");
            elTimer = container.querySelector("#hud-timer");

            container.querySelector("#hud-botao-voltar").addEventListener("click", function () {
                if (typeof options.onBack === "function") options.onBack();
            });

            if (elSom) {
                elSom.addEventListener("click", function () {
                    somLigado = !somLigado;
                    elSom.setAttribute("aria-pressed", String(somLigado));
                    elSom.innerHTML = (somLigado ? "🔊" : "🔇") + ' <span class="texto-botao-topo">Som</span>';
                    if (typeof options.onSoundToggle === "function") options.onSoundToggle(somLigado);
                });
            }

            if (options.totalQuestions && GameComponents.progress && elProgresso) {
                GameComponents.progress.create(elProgresso, { type: "dots", total: options.totalQuestions, current: 0 });
            }
        },

        // Atualizar progresso (delega ao componente de progresso)
        updateProgress: function (current, total) {
            if (!GameComponents.progress || !elProgresso) return;
            if (total) {
                GameComponents.progress.create(elProgresso, { type: "dots", total: total, current: current });
            } else {
                GameComponents.progress.update(current);
            }
        },

        // Mostrar/ocultar o timer
        setTimerVisible: function (visible) {
            if (elTimer) elTimer.style.display = visible ? "" : "none";
        },

        // Atualizar o texto do timer (segundos)
        updateTimer: function (seconds) {
            if (!elTimer) return;
            var util = GameComponents.util;
            elTimer.textContent = util ? util.formatarTempo(seconds) : String(seconds);
        },

        // Verificar se o som está ligado
        isSoundOn: function () {
            return somLigado;
        },

        // Remover o HUD do DOM
        destroy: function () {
            if (timerInterval) window.clearInterval(timerInterval);
            if (elBarra && elBarra.parentNode) elBarra.parentNode.innerHTML = "";
            elBarra = null;
            elProgresso = null;
            elSom = null;
            elTimer = null;
        }
    };
})();
