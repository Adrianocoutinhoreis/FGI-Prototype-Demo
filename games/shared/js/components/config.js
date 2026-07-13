/* ==========================================================================
   FGI - Componente: Leitor de Configuração (games/shared/js/components/config.js)

   IMPORTANTE: o protótipo não usa localStorage nem um código de sessão real
   (ver PLANEJAMENTO_SESSOES.md — escopo atual é só a reestruturação de
   pastas, sem login funcional). Hoje, professor/game.html e aluno/game.html
   só repassam dois parâmetros ao iframe do jogo: "nivel" e "som". Este
   componente lê exatamente isso da URL e organiza num objeto de config no
   mesmo formato do GameConfig (~60 params) para que os jogos já sejam
   escritos contra o formato final — quando mais parâmetros passarem a ser
   repassados, só é preciso expandir a função load() abaixo.
   ========================================================================== */

(function () {
    "use strict";

    window.GameComponents = window.GameComponents || {};

    var configCarregada = null;

    GameComponents.config = {
        // Carregar configuração da sessão a partir dos parâmetros da URL
        load: function () {
            var params = new URLSearchParams(window.location.search);
            var nivel = parseInt(params.get("nivel"), 10);
            if (isNaN(nivel) || nivel < 1) nivel = 1;

            configCarregada = {
                difficulty: {
                    level: nivel
                },
                audio: {
                    sfxEnabled: params.get("som") !== "off"
                },
                timer: {
                    visible: false
                },
                visual: {}
            };

            return configCarregada;
        },

        // Aplicar as configurações visuais no documento (placeholder para
        // quando o GameConfig completo passar a ser repassado ao jogo)
        applyVisual: function (config) {
            if (!config || !config.visual) return;
            var raiz = document.documentElement;
            if (config.visual.contrast === "high") {
                raiz.style.setProperty("--cor-texto", "#000000");
            }
            if (config.visual.fontSize) {
                var escalas = { sm: "0.9", md: "1", lg: "1.15", xl: "1.3" };
                raiz.style.setProperty("--fgi-escala-fonte", escalas[config.visual.fontSize] || "1");
            }
        },

        // Obter a configuração de um grupo específico (ex: "audio", "difficulty")
        get: function (group) {
            if (!configCarregada) this.load();
            return configCarregada[group] || {};
        },

        // Verificar se uma configuração booleana está ativa
        is: function (group, key) {
            var grupo = this.get(group);
            return !!grupo[key];
        }
    };
})();
