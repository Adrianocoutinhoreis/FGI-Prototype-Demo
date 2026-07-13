/* ============================================================
   Jogo da Subtração — lógica
   Construído inteiramente sobre GameComponents (games/shared/js/).
   Mesmos princípios de acessibilidade do game001: sem limite de
   tempo, erro nunca é punido, feedback acolhedor, som opcional.
   ============================================================ */

(function () {
    "use strict";

    var TOTAL_PERGUNTAS = 8;

    var NIVEIS = {
        1: { max: 5 },   // subtrações com resultado até 5
        2: { max: 10 },  // subtrações com resultado até 10
        3: { max: 20 }   // subtrações com resultado até 20
    };

    var DESENHOS = ["🍎", "⭐", "🐟", "🌸", "🍓", "🐤", "🧩", "🎈"];

    var estado = {
        nivel: 1,
        perguntaAtual: 0,
        acertosPrimeira: 0,
        errouNesta: false,
        a: 0,
        b: 0,
        respondida: false,
        erros: 0,
        streakAtual: 0,
        maxStreak: 0,
        inicioJogo: 0
    };

    var el = {
        grupoA: document.getElementById("grupo-a"),
        grupoB: document.getElementById("grupo-b"),
        numeroA: document.getElementById("numero-a"),
        numeroB: document.getElementById("numero-b"),
        interrogacao: document.getElementById("interrogacao"),
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

        // Integração FGI: iniciar automaticamente no nível vindo da URL
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
            { id: 1, nome: "Começando", desc: "Subtrações até 5", icone: "🌱" },
            { id: 2, nome: "Praticando", desc: "Subtrações até 10", icone: "🌿" },
            { id: 3, nome: "Avançando", desc: "Subtrações até 20", icone: "🌳" }
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
        var max = NIVEIS[estado.nivel].max;

        // a >= b garante resultado não-negativo
        estado.b = util.sortear(1, max - 1);
        estado.a = util.sortear(estado.b, max);
        estado.respondida = false;
        estado.errouNesta = false;

        var resultado = estado.a - estado.b;
        var desenho = DESENHOS[util.sortear(0, DESENHOS.length - 1)];

        el.numeroA.textContent = estado.a;
        el.numeroB.textContent = estado.b;
        el.interrogacao.textContent = "?";
        el.interrogacao.classList.remove("respondida", "pronta");

        desenharGrupo(el.grupoA, desenho, estado.a);
        desenharGrupo(el.grupoB, desenho, estado.b);

        var opcoes = [resultado];
        while (opcoes.length < 3) {
            var alternativa = resultado + util.sortear(-3, 3);
            if (alternativa >= 0 && alternativa !== resultado && opcoes.indexOf(alternativa) === -1) {
                opcoes.push(alternativa);
            }
        }
        util.embaralhar(opcoes);

        // Reinicia o sistema de arrastar e soltar para esta questão
        GameComponents.dragdrop.clearAll();
        GameComponents.dragdrop.init({
            margin: 24,
            onDrop: function (data) { verificarResposta(data.valor, data.resultado); }
        });
        GameComponents.dragdrop.setTarget(el.interrogacao, { highlight: true });

        el.opcoes.innerHTML = "";
        opcoes.forEach(function (valor, indice) {
            var ficha = criarFicha(valor, indice, resultado);
            el.opcoes.appendChild(ficha);
            GameComponents.dragdrop.makeDraggable(ficha, { valor: valor, resultado: resultado });
        });

        GameComponents.feedback.clear();
        el.botaoProxima.classList.add("escondido");
        GameComponents.hud.updateProgress(estado.perguntaAtual, TOTAL_PERGUNTAS);
    }

    function desenharGrupo(container, desenho, quantidade) {
        container.innerHTML = "";
        for (var i = 0; i < quantidade; i++) {
            var item = document.createElement("span");
            item.className = "item-visual";
            item.textContent = desenho;
            item.style.animationDelay = (i * 0.06) + "s";
            container.appendChild(item);
        }
    }

    function criarFicha(valor, indice, resultado) {
        var ficha = document.createElement("button");
        ficha.className = "botao-opcao ficha-" + (indice + 1);
        ficha.textContent = valor;
        ficha.setAttribute(
            "aria-label",
            "Ficha com o número " + valor + ". Arraste até o quadradinho da resposta ou pressione Enter para colocar."
        );
        return ficha;
    }

    // ---------- Resposta ----------

    function verificarResposta(valor, resultado) {
        if (estado.respondida) return;

        // Encontra a ficha correspondente ao valor arrastado ainda habilitada
        var ficha = Array.prototype.filter.call(el.opcoes.querySelectorAll("button"), function (f) {
            return !f.disabled && parseInt(f.textContent, 10) === valor;
        })[0];

        if (valor === resultado) {
            estado.respondida = true;
            if (!estado.errouNesta) {
                estado.acertosPrimeira++;
                estado.streakAtual++;
                estado.maxStreak = Math.max(estado.maxStreak, estado.streakAtual);
            }

            if (ficha) ficha.classList.add("correta");
            desabilitarFichas();

            el.interrogacao.textContent = resultado;
            el.interrogacao.classList.remove("pronta");
            el.interrogacao.classList.add("respondida");

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
            summary: "Você completou as " + TOTAL_PERGUNTAS + " subtrações. Parabéns pelo seu esforço!"
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
                gameId: "mat-game002",
                hits: estado.acertosPrimeira,
                misses: estado.erros,
                totalQuestions: TOTAL_PERGUNTAS,
                level: estado.nivel,
                duration: duracaoFormatada,
                skills: ["contagem", "subtracao", "raciocinio-logico"]
            }, "*");
        }
    }
})();
