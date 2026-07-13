/* ==========================================================================
   FGI - Componente: Progresso (games/shared/js/components/progress.js)
   Requer games/shared/css/components/progress.css
   ========================================================================== */

(function () {
    "use strict";

    window.GameComponents = window.GameComponents || {};

    var estadoProgresso = {
        container: null,
        type: "dots",
        total: 0,
        current: 0,
        showLabels: false
    };

    function renderDots() {
        estadoProgresso.container.innerHTML = "";
        for (var i = 0; i < estadoProgresso.total; i++) {
            var ponto = document.createElement("span");
            ponto.className = "ponto";
            if (i < estadoProgresso.current) ponto.classList.add("feito");
            if (i === estadoProgresso.current - 1) ponto.classList.add("recem-feito");
            if (i === estadoProgresso.current) ponto.classList.add("atual");
            if (estadoProgresso.showLabels) ponto.textContent = String(i + 1);
            estadoProgresso.container.appendChild(ponto);
        }
    }

    function renderBar() {
        var pct = estadoProgresso.total > 0 ? Math.round((estadoProgresso.current / estadoProgresso.total) * 100) : 0;
        estadoProgresso.container.innerHTML =
            '<div class="progresso-barra"><div class="progresso-barra-preenchimento" style="width:' + pct + '%"></div></div>';
    }

    function renderPercentage() {
        var pct = estadoProgresso.total > 0 ? Math.round((estadoProgresso.current / estadoProgresso.total) * 100) : 0;
        estadoProgresso.container.innerHTML = '<span class="progresso-porcentagem">' + pct + "%</span>";
    }

    function render() {
        if (!estadoProgresso.container) return;
        if (estadoProgresso.type === "bar") renderBar();
        else if (estadoProgresso.type === "percentage") renderPercentage();
        else renderDots();
    }

    GameComponents.progress = {
        // Criar barra/pontos de progresso dentro de um container
        create: function (container, options) {
            options = options || {};
            estadoProgresso.container = container;
            estadoProgresso.type = options.type || "dots";
            estadoProgresso.total = options.total || 0;
            estadoProgresso.current = options.current || 0;
            estadoProgresso.showLabels = !!options.showLabels;
            render();
        },

        // Atualizar o item atual
        update: function (current) {
            estadoProgresso.current = current;
            render();
        },

        // Marcar um item específico como concluído (variante dots)
        markDone: function (index) {
            if (index >= estadoProgresso.current) {
                estadoProgresso.current = index + 1;
            }
            render();
        },

        // Reiniciar progresso
        reset: function () {
            estadoProgresso.current = 0;
            render();
        }
    };
})();
