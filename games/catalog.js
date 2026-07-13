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
            },
            {
                id: "mat-game002",
                nome: "Jogo da Subtração",
                descricao: "Aprenda a subtrair arrastando o número correto para o resultado da conta.",
                icone: "➖",
                caminho: "matematica/game002/",
                nivelMinimo: 1,
                nivelMaximo: 3,
                perfilCompativel: ["T", "T1", "T2", "T3", "TD", "DX"],
                habilidades: ["contagem", "subtracao"]
            },
            {
                id: "mat-game003",
                nome: "Jogo do Valor Posicional",
                descricao: "Aprenda a identificar unidade, dezena, centena e milhar em um número.",
                icone: "🧮",
                caminho: "matematica/game003/",
                nivelMinimo: 1,
                nivelMaximo: 3,
                perfilCompativel: ["T", "T1", "T2", "T3", "TD", "DX"],
                habilidades: ["valor-posicional", "composicao-numerica"]
            }
        ],
        portugues: []
    };

    window.GAME_CATALOG = GAME_CATALOG;
})();
