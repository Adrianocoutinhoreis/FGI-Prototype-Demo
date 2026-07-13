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
                caminho: "matematica/soma/",
                nivelMinimo: 1,
                nivelMaximo: 3,
                perfilCompativel: ["T", "T1", "T2", "T3", "TD", "DX"],
                habilidades: ["contagem", "soma"],
                tutorial: {
                    titulo: "Como Jogar: Jogo da Soma",
                    instrucao: "Conte as maçãs na tela e <strong>arraste</strong> o cartão com o número correto para dentro do quadrado com a interrogação.",
                    tipo: "soma"
                }
            },
            {
                id: "mat-game002",
                nome: "Jogo da Subtração",
                descricao: "Aprenda a subtrair arrastando o número correto para o resultado da conta.",
                icone: "➖",
                caminho: "matematica/subtracao/",
                nivelMinimo: 1,
                nivelMaximo: 3,
                perfilCompativel: ["T", "T1", "T2", "T3", "TD", "DX"],
                habilidades: ["contagem", "subtracao"],
                tutorial: {
                    titulo: "Como Jogar: Jogo da Subtração",
                    instrucao: "Conte as maçãs restantes na tela e <strong>arraste</strong> o cartão com o número correto para dentro do quadrado com a interrogação.",
                    tipo: "subtracao"
                }
            },
            {
                id: "mat-game003",
                nome: "Jogo do Valor Posicional",
                descricao: "Aprenda a identificar unidade, dezena, centena e milhar em um número.",
                icone: "🧮",
                caminho: "matematica/valor-posicional/",
                nivelMinimo: 1,
                nivelMaximo: 3,
                perfilCompativel: ["T", "T1", "T2", "T3", "TD", "DX"],
                habilidades: ["valor-posicional", "composicao-numerica"],
                tutorial: {
                    titulo: "Como Jogar: Jogo do Valor Posicional",
                    instrucao: "Observe o número na tela e <strong>arraste</strong> o cartão com o valor correto para a casa indicada (unidade, dezena, centena ou milhar).",
                    tipo: "valor-posicional"
                }
            }
        ],
        portugues: []
    };

    window.GAME_CATALOG = GAME_CATALOG;
})();
