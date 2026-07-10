/* ==========================================================================
   FGI - Framework de Jogos Inclusivos
   Catálogo Central de Jogos (games/catalog.js)
   ========================================================================== */

(function () {
    "use strict";

    var GAME_CATALOG = {
        matematica: [
            {
                id: "mat-game001",
                nome: "Jogo da Soma",
                descricao: "Aprenda a somar arrastando o número correto para o resultado da conta.",
                icone: "➕",
                caminho: "matematica/game001/",
                nivelMinimo: 1,
                nivelMaximo: 3,
                perfilCompativel: ["T", "T1", "T2", "T3", "TD", "DX"],
                habilidades: ["contagem", "soma"]
            }
        ],
        portugues: []
    };

    window.GAME_CATALOG = GAME_CATALOG;
})();
