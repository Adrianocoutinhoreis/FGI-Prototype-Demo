/* ==========================================================================
   FGI - Componente: Mascote (games/shared/js/components/mascot.js)
   Requer games/shared/css/components/mascot.css
   ========================================================================== */

(function () {
    "use strict";

    window.GameComponents = window.GameComponents || {};

    var elMascote = null;
    var elFala = null;
    var falaTimeout = null;

    GameComponents.mascot = {
        // Criar mascote dentro de um container
        create: function (container, options) {
            options = options || {};
            var emoji = options.emoji || "🐢";

            elMascote = document.createElement("div");
            elMascote.className = "mascote";
            elMascote.setAttribute("aria-hidden", "true");
            elMascote.textContent = emoji;
            container.appendChild(elMascote);

            return elMascote;
        },

        // Mostrar uma mensagem em um balão de fala temporário
        say: function (message, duration) {
            if (!elMascote) return;
            duration = duration || 2500;

            if (falaTimeout) {
                window.clearTimeout(falaTimeout);
                falaTimeout = null;
            }
            if (!elFala) {
                elFala = document.createElement("div");
                elFala.className = "mascote-fala";
                elMascote.parentNode.insertBefore(elFala, elMascote);
            }
            elFala.textContent = message;
            elFala.style.display = "block";

            falaTimeout = window.setTimeout(function () {
                if (elFala) elFala.style.display = "none";
            }, duration);
        },

        // Trocar o emoji do mascote
        change: function (newEmoji) {
            if (elMascote) elMascote.textContent = newEmoji;
        },

        // Pausar a animação de "respiração"
        pause: function () {
            if (elMascote) elMascote.classList.add("pausado");
        },

        // Retomar a animação
        resume: function () {
            if (elMascote) elMascote.classList.remove("pausado");
        }
    };
})();
