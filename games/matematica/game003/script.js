/* ============================================================
   Jogo do Valor Posicional — lógica
   Construído inteiramente sobre GameComponents (games/shared/js/).
   Mesmos princípios de acessibilidade dos demais jogos: sem limite
   de tempo, erro nunca é punido, feedback acolhedor, som opcional.
   ============================================================ */

(function () {
    "use strict";

    var TOTAL_PERGUNTAS = 8;

    // Quantidade de algarismos por nível (define quais valores posicionais existem)
    var NIVEIS = {
        1: { digitos: 2 },  // números de 10 a 99 — Unidade e Dezena
        2: { digitos: 3 },  // números de 100 a 999 — + Centena
        3: { digitos: 4 }   // números de 1000 a 9999 — + Milhar
    };

    // Nomes na ordem da direita (unidade) para a esquerda (milhar)
    var NOMES_VALOR = ["Unidade", "Dezena", "Centena", "Milhar"];

    var estado = {
        nivel: 1,
        perguntaAtual: 0,
        acertosPrimeira: 0,
        errouNesta: false,
        numero: "",
        posicaoAlvo: 0,
        nomeCorreto: "",
        respondida: false,
        erros: 0,
        streakAtual: 0,
        maxStreak: 0,
        inicioJogo: 0
    };

    var el = {
        casas: document.getElementById("casas-numericas"),
        respostaAlvo: document.getElementById("resposta-alvo"),
        opcoes: document.getElementById("opcoes"),
        botaoProxima: document.getElementById("botao-proxima")
    };

    var util = GameComponents.util;

    // ---------- Inicialização ----------

    document.addEventListener("DOMContentLoaded", function () {
        var config = GameComponents.config.load();
        GameComponents.config.applyVisual(config);

        GameComponents.screens.register([
            { id: "inicio", element: document.getElementById("tela-inicio") },
            { id: "jogo", element: document.getElementById("tela-jogo") },
            { id: "final", element: document.getElementById("tela-final") }
        ]);

        GameComponents.mascot.create(document.getElementById("mascote-container"), { emoji: "🐢" });

        GameComponents.sound.init({ enabled: GameComponents.config.is("audio", "sfxEnabled") });

        GameComponents.hud.init({
            totalQuestions: TOTAL_PERGUNTAS,
            showTimer: false,
            showSound: true,
            onBack: function () { GameComponents.screens.show("inicio"); },
            onSoundToggle: function (ligado) { GameComponents.sound.setEnabled(ligado); }
        });

        GameComponents.feedback.init(document.getElementById("feedback"), { mascot: "🐢" });

        renderizarNiveis();

        var nivelInicial = config.difficulty.level;
        if (nivelInicial >= 1 && nivelInicial <= 3) {
            comecarJogo(nivelInicial);
        }

        el.botaoProxima.addEventListener("click", proximaPergunta);
    });

    // ---------- Tela inicial ----------

    function renderizarNiveis() {
        var container = document.getElementById("nivel-selector");
        var niveis = [
            { id: 1, nome: "Começando", desc: "Números de 2 algarismos", icone: "🌱" },
            { id: 2, nome: "Praticando", desc: "Números de 3 algarismos", icone: "🌿" },
            { id: 3, nome: "Avançando", desc: "Números de 4 algarismos", icone: "🌳" }
        ];

        container.innerHTML = '<p class="rotulo-nivel">Escolha como quer jogar:</p>' +
            niveis.map(function (n) {
                return '<button class="botao-nivel" data-nivel="' + n.id + '">' +
                    '<span class="icone-nivel" aria-hidden="true">' + n.icone + "</span>" +
                    '<span class="texto-nivel"><strong>' + n.nome + "</strong><small>" + n.desc + "</small></span>" +
                    "</button>";
            }).join("");

        container.querySelectorAll(".botao-nivel").forEach(function (botao) {
            botao.addEventListener("click", function () {
                comecarJogo(parseInt(botao.getAttribute("data-nivel"), 10));
            });
        });
    }

    // ---------- Fluxo do jogo ----------

    function comecarJogo(nivel) {
        estado.nivel = nivel;
        estado.perguntaAtual = 0;
        estado.acertosPrimeira = 0;
        estado.erros = 0;
        estado.streakAtual = 0;
        estado.maxStreak = 0;
        estado.inicioJogo = Date.now();

        GameComponents.screens.show("jogo");
        gerarPergunta();
    }

    function gerarPergunta() {
        var digitos = NIVEIS[estado.nivel].digitos;
        var min = Math.pow(10, digitos - 1);
        var max = Math.pow(10, digitos) - 1;

        estado.numero = String(util.sortear(min, max));
        estado.posicaoAlvo = util.sortear(0, digitos - 1); // índice a partir da esquerda
        estado.respondida = false;
        estado.errouNesta = false;

        var posicaoDaDireita = digitos - 1 - estado.posicaoAlvo;
        estado.nomeCorreto = NOMES_VALOR[posicaoDaDireita];

        renderizarCasas();

        el.respostaAlvo.textContent = "?";
        el.respostaAlvo.classList.remove("respondida", "pronta");

        // Opções: todos os valores posicionais válidos para este nível
        var opcoes = util.embaralhar(NOMES_VALOR.slice(0, digitos));

        // Reinicia o sistema de arrastar e soltar para esta questão
        GameComponents.dragdrop.clearAll();
        GameComponents.dragdrop.init({
            margin: 24,
            onDrop: function (data) { verificarResposta(data.nome, data.correto); }
        });
        GameComponents.dragdrop.setTarget(el.respostaAlvo, { highlight: true });

        el.opcoes.innerHTML = "";
        opcoes.forEach(function (nome, indice) {
            var ficha = criarFicha(nome, indice);
            el.opcoes.appendChild(ficha);
            GameComponents.dragdrop.makeDraggable(ficha, { nome: nome, correto: estado.nomeCorreto });
        });

        GameComponents.feedback.clear();
        el.botaoProxima.classList.add("escondido");
        GameComponents.hud.updateProgress(estado.perguntaAtual, TOTAL_PERGUNTAS);
    }

    function renderizarCasas() {
        el.casas.innerHTML = "";
        for (var i = 0; i < estado.numero.length; i++) {
            var casa = document.createElement("span");
            casa.className = "casa-digito";
            if (i === estado.posicaoAlvo) casa.classList.add("casa-alvo");
            casa.textContent = estado.numero[i];
            el.casas.appendChild(casa);
        }
    }

    function criarFicha(nome, indice) {
        var ficha = document.createElement("button");
        ficha.className = "botao-opcao ficha-" + (indice + 1);
        ficha.textContent = nome;
        ficha.setAttribute(
            "aria-label",
            "Ficha " + nome + ". Arraste até o quadradinho da resposta ou pressione Enter para colocar."
        );
        return ficha;
    }

    // ---------- Resposta ----------

    function verificarResposta(nome, correto) {
        if (estado.respondida) return;

        var ficha = Array.prototype.filter.call(el.opcoes.querySelectorAll("button"), function (f) {
            return !f.disabled && f.textContent === nome;
        })[0];

        if (nome === correto) {
            estado.respondida = true;
            if (!estado.errouNesta) {
                estado.acertosPrimeira++;
                estado.streakAtual++;
                estado.maxStreak = Math.max(estado.maxStreak, estado.streakAtual);
            }

            if (ficha) ficha.classList.add("correta");
            desabilitarFichas();

            el.respostaAlvo.textContent = correto;
            el.respostaAlvo.classList.remove("pronta");
            el.respostaAlvo.classList.add("respondida");

            GameComponents.feedback.showSuccess();
            GameComponents.sound.playSuccess();

            el.botaoProxima.classList.remove("escondido");
            el.botaoProxima.focus();
        } else {
            estado.errouNesta = true;
            estado.erros++;
            estado.streakAtual = 0;

            if (ficha) {
                ficha.classList.add("tentar-novamente");
                ficha.disabled = true;
            }

            GameComponents.feedback.showSupport();
            GameComponents.sound.playSupport();
        }
    }

    function desabilitarFichas() {
        el.opcoes.querySelectorAll("button").forEach(function (f) { f.disabled = true; });
    }

    function proximaPergunta() {
        estado.perguntaAtual++;
        if (estado.perguntaAtual >= TOTAL_PERGUNTAS) {
            mostrarFinal();
        } else {
            gerarPergunta();
        }
    }

    function mostrarFinal() {
        GameComponents.dragdrop.clearAll();

        var duracaoSegundos = Math.floor((Date.now() - estado.inicioJogo) / 1000);
        var duracaoFormatada = util.formatarTempo(duracaoSegundos);

        GameComponents.results.init(document.getElementById("results-container"), {
            mascot: "🐢",
            title: "Você terminou!",
            showStars: true,
            summary: "Você completou as " + TOTAL_PERGUNTAS + " perguntas de valor posicional. Parabéns pelo seu esforço!"
        });

        GameComponents.results.show({
            hits: estado.acertosPrimeira,
            misses: estado.erros,
            total: TOTAL_PERGUNTAS,
            duration: duracaoFormatada,
            maxStreak: estado.maxStreak
        });

        GameComponents.results.setActions({
            playAgain: function () { comecarJogo(estado.nivel); },
            goHome: function () { GameComponents.screens.show("inicio"); }
        });

        GameComponents.screens.show("final");
        GameComponents.sound.playComplete();

        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: "GAME_FINISHED",
                gameId: "mat-game003",
                hits: estado.acertosPrimeira,
                misses: estado.erros,
                totalQuestions: TOTAL_PERGUNTAS,
                level: estado.nivel,
                duration: duracaoFormatada,
                skills: ["valor-posicional", "composicao-numerica", "raciocinio-logico"]
            }, "*");
        }
    }
})();
