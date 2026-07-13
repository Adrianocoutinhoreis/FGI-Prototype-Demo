/* ==========================================================================
   FGI - Componente: Gerenciador de Telas (games/shared/js/components/screens.js)
   ========================================================================== */

(function () {
    "use strict";

    window.GameComponents = window.GameComponents || {};

    var telas = {};
    var ordemHistorico = [];
    var atual = null;

    GameComponents.screens = {
        // Registrar telas: [{ id, element }]
        register: function (listaTelas) {
            telas = {};
            ordemHistorico = [];
            atual = null;
            listaTelas.forEach(function (t) {
                telas[t.id] = t.element;
            });
        },

        // Mostrar tela com transição (fade via CSS já presente em .tela.ativa)
        show: function (screenId, options) {
            options = options || {};
            if (!telas[screenId]) return;

            Object.keys(telas).forEach(function (id) {
                telas[id].classList.remove("ativa");
            });
            telas[screenId].classList.add("ativa");

            if (atual && atual !== screenId) {
                ordemHistorico.push(atual);
            }
            atual = screenId;

            if (typeof options.onComplete === "function") {
                // .tela.ativa .cartao anima em 0.6s (fgi-entrar-suave); aguarda o fim
                window.setTimeout(options.onComplete, 600);
            }
        },

        // Voltar para a tela anterior no histórico
        back: function () {
            var anterior = ordemHistorico.pop();
            if (anterior) {
                this.show(anterior);
                // Evita duplicar a tela recém-exibida no histórico
                ordemHistorico.pop();
            }
        },

        // Obter o id da tela atual
        current: function () {
            return atual;
        }
    };
})();
