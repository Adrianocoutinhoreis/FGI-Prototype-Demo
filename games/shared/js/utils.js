/* ==========================================================================
   FGI - Framework de Jogos Inclusivos
   Namespace base e utilitários (games/shared/js/utils.js)
   Deve ser o primeiro script de componentes carregado — os demais
   componentes assumem que window.GameComponents já existe.
   ========================================================================== */

(function () {
    "use strict";

    window.GameComponents = window.GameComponents || {};

    GameComponents.util = {
        // Sorteia um inteiro entre min e max (inclusive)
        sortear: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },

        // Embaralha uma lista (Fisher-Yates), retorna a mesma lista
        embaralhar: function (lista) {
            for (var i = lista.length - 1; i > 0; i--) {
                var j = Math.floor(Math.random() * (i + 1));
                var tmp = lista[i];
                lista[i] = lista[j];
                lista[j] = tmp;
            }
            return lista;
        },

        // Formata segundos como "MM:SS"
        formatarTempo: function (segundosTotais) {
            var minutos = Math.floor(segundosTotais / 60);
            var segundos = segundosTotais % 60;
            return (minutos < 10 ? "0" : "") + minutos + ":" + (segundos < 10 ? "0" : "") + segundos;
        }
    };
})();
