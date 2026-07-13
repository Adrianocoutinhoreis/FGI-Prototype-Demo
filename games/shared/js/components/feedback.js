/* ==========================================================================
   FGI - Componente: Feedback (games/shared/js/components/feedback.js)
   Requer games/shared/css/components/feedback.css
   ========================================================================== */

(function () {
    "use strict";

    window.GameComponents = window.GameComponents || {};

    var elFeedback = null;
    var mascoteEmoji = "🐢";
    var frasesAcerto = ["Muito bem!", "Isso mesmo!", "Você conseguiu!", "Ótimo trabalho!"];
    var fraseApoio = "Quase! Tente outra vez. Você consegue!";

    GameComponents.feedback = {
        // Inicializar área de feedback
        init: function (container, options) {
            options = options || {};
            elFeedback = container;
            mascoteEmoji = options.mascot || "🐢";
            if (options.successPhrases) frasesAcerto = options.successPhrases;
            if (options.supportPhrase) fraseApoio = options.supportPhrase;

            elFeedback.setAttribute("role", "status");
            elFeedback.setAttribute("aria-live", "polite");
        },

        // Mostrar mensagem de acerto
        showSuccess: function (customMessage) {
            if (!elFeedback) return;
            var util = GameComponents.util;
            var frase = customMessage || frasesAcerto[util ? util.sortear(0, frasesAcerto.length - 1) : 0];
            elFeedback.textContent = "⭐ " + frase;
            elFeedback.className = "feedback acerto";
        },

        // Mostrar mensagem de apoio (erro acolhido, nunca punitivo)
        showSupport: function (customMessage) {
            if (!elFeedback) return;
            elFeedback.textContent = mascoteEmoji + " " + (customMessage || fraseApoio);
            elFeedback.className = "feedback apoio";
        },

        // Limpar feedback
        clear: function () {
            if (!elFeedback) return;
            elFeedback.textContent = "";
            elFeedback.className = "feedback";
        },

        // Configurar frases personalizadas
        setPhrases: function (success, support) {
            if (success) frasesAcerto = success;
            if (support) fraseApoio = support;
        }
    };
})();
