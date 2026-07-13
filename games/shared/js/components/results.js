/* ==========================================================================
   FGI - Componente: Tela de Resultados (games/shared/js/components/results.js)
   Requer games/shared/css/components/results.css
   ========================================================================== */

(function () {
    "use strict";

    window.GameComponents = window.GameComponents || {};

    var elContainer = null;
    var conf = { mascot: "🐢", title: "Você terminou!", showStars: true, metrics: [] };
    var acoes = { playAgain: null, goHome: null };

    function render(data) {
        var totalEstrelas = GameComponents.results.calculateStars(data.hits, data.total);

        var estrelasHtml = "";
        if (conf.showStars) {
            var partes = [];
            for (var i = 0; i < data.total; i++) {
                var acertou = i < data.hits;
                partes.push('<span class="estrela-final" style="animation-delay:' + (i * 0.25) + 's">' + (acertou ? "⭐" : "🌟") + "</span>");
            }
            estrelasHtml = '<div class="estrelas-finais" aria-hidden="true">' + partes.join("") + "</div>";
        }

        var metricasHtml = "";
        if (typeof data.duration !== "undefined" || typeof data.misses !== "undefined") {
            var itens = [];
            itens.push("<span>Acertos: <strong>" + data.hits + "/" + data.total + "</strong></span>");
            if (typeof data.duration !== "undefined") itens.push("<span>Tempo: <strong>" + data.duration + "</strong></span>");
            if (typeof data.maxStreak !== "undefined") itens.push("<span>Maior sequência: <strong>" + data.maxStreak + "</strong></span>");
            metricasHtml = '<div class="metricas-finais">' + itens.join("") + "</div>";
        }

        elContainer.innerHTML =
            '<div class="cartao cartao-final">' +
            '<div class="mascote" aria-hidden="true">' + conf.mascot + "</div>" +
            "<h2>" + conf.title + "</h2>" +
            '<p class="subtitulo" id="results-resumo">' + (conf.summary || "Muito bem! Você completou a atividade.") + "</p>" +
            estrelasHtml +
            metricasHtml +
            '<div class="botoes-finais">' +
            '<button type="button" class="botao-principal" id="results-jogar-novamente">Jogar de novo</button>' +
            '<button type="button" class="botao-secundario" id="results-voltar-inicio">Voltar ao início</button>' +
            "</div></div>";

        var btnJogar = elContainer.querySelector("#results-jogar-novamente");
        var btnVoltar = elContainer.querySelector("#results-voltar-inicio");
        if (btnJogar) btnJogar.addEventListener("click", function () { if (acoes.playAgain) acoes.playAgain(); });
        if (btnVoltar) btnVoltar.addEventListener("click", function () { if (acoes.goHome) acoes.goHome(); });
    }

    GameComponents.results = {
        // Inicializar tela de resultados dentro de um container
        init: function (container, options) {
            options = options || {};
            elContainer = container;
            conf.mascot = options.mascot || "🐢";
            conf.title = options.title || "Você terminou!";
            conf.showStars = options.showStars !== false;
            conf.summary = options.summary;
        },

        // Exibir os resultados. data = { hits, misses, total, duration, maxStreak }
        show: function (data) {
            if (!elContainer) return;
            render(data);
        },

        // Calcular quantas estrelas o desempenho merece (0 a 5)
        calculateStars: function (hits, total) {
            if (!total) return 0;
            var proporcao = hits / total;
            return Math.max(0, Math.min(5, Math.round(proporcao * 5)));
        },

        // Configurar callbacks dos botões de ação
        setActions: function (actions) {
            actions = actions || {};
            acoes.playAgain = actions.playAgain || null;
            acoes.goHome = actions.goHome || null;
        }
    };
})();
