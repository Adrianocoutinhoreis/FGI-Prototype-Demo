/* ==========================================================================
   FGI - Componente: Som (games/shared/js/components/sound.js)
   Tons suaves gerados no navegador (Web Audio API) — mesma técnica do
   game001 (Jogo da Soma), generalizada para qualquer jogo.
   ========================================================================== */

(function () {
    "use strict";

    window.GameComponents = window.GameComponents || {};

    var contextoAudio = null;
    var habilitado = true;
    var volume = 0.12;

    function tocarTom(frequencia, duracao, atraso) {
        if (!habilitado) return;
        try {
            if (!contextoAudio) {
                contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
            }
            var inicio = contextoAudio.currentTime + (atraso || 0);
            var oscilador = contextoAudio.createOscillator();
            var ganho = contextoAudio.createGain();

            oscilador.type = "sine";
            oscilador.frequency.value = frequencia;

            ganho.gain.setValueAtTime(0, inicio);
            ganho.gain.linearRampToValueAtTime(volume, inicio + 0.05);
            ganho.gain.linearRampToValueAtTime(0, inicio + duracao);

            oscilador.connect(ganho);
            ganho.connect(contextoAudio.destination);
            oscilador.start(inicio);
            oscilador.stop(inicio + duracao);
        } catch (e) {
            // Sem suporte a áudio: o jogo segue normalmente, sem som
        }
    }

    GameComponents.sound = {
        // Inicializar sistema de som
        init: function (options) {
            options = options || {};
            habilitado = options.enabled !== false;
            if (typeof options.volume === "number") volume = options.volume;
        },

        // Som de acerto (dó + mi)
        playSuccess: function () {
            tocarTom(523.25, 0.25, 0);
            tocarTom(659.25, 0.3, 0.18);
        },

        // Som de apoio — único tom calmo, nunca estridente
        playSupport: function () {
            tocarTom(392, 0.3, 0);
        },

        // Som curto de clique/navegação
        playClick: function () {
            tocarTom(440, 0.08, 0);
        },

        // Som de conclusão da atividade (mesmo timbre do acerto, mais longo)
        playComplete: function () {
            tocarTom(523.25, 0.25, 0);
            tocarTom(659.25, 0.3, 0.18);
            tocarTom(783.99, 0.35, 0.36);
        },

        // Ligar/desligar som
        setEnabled: function (enabled) {
            habilitado = !!enabled;
        },

        // Verificar se o som está ligado
        isEnabled: function () {
            return habilitado;
        }
    };
})();
