/* ==========================================================================
   FGI - Framework de Jogos Inclusivos
   Funções compartilhadas entre jogos (games/shared/js/game-engine.js)
   Disponível para novos jogos usarem; os jogos já existentes não são
   obrigados a usá-lo (não modificar a mecânica de jogos prontos).
   ========================================================================== */

(function () {
    "use strict";

    var GameEngine = {
        // Sistema de som procedural
        som: {
            tocarTom: function (frequencia, duracao, atraso) {
                var ctx = GameEngine._audioCtx || (GameEngine._audioCtx = new (window.AudioContext || window.webkitAudioContext)());
                var osc = ctx.createOscillator();
                var gain = ctx.createGain();
                osc.frequency.value = frequencia;
                osc.connect(gain);
                gain.connect(ctx.destination);
                var start = ctx.currentTime + (atraso || 0);
                gain.gain.setValueAtTime(0.2, start);
                gain.gain.exponentialRampToValueAtTime(0.001, start + duracao);
                osc.start(start);
                osc.stop(start + duracao);
            },
            somAcerto: function () {
                GameEngine.som.tocarTom(523.25, 0.15, 0);
                GameEngine.som.tocarTom(659.25, 0.15, 0.12);
            },
            somApoio: function () {
                GameEngine.som.tocarTom(349.23, 0.2, 0);
            }
        },

        // Sistema de drag-and-drop
        dragDrop: {
            iniciar: function (elemento, opcoes) {
                elemento.setAttribute("draggable", "true");
                elemento.addEventListener("dragstart", function (e) {
                    e.dataTransfer.setData("text/plain", elemento.id);
                    if (opcoes && opcoes.onStart) opcoes.onStart(elemento);
                });
            },
            verificarAlvo: function (evento, alvo) {
                evento.preventDefault();
                var id = evento.dataTransfer.getData("text/plain");
                var arrastado = document.getElementById(id);
                return arrastado && alvo ? { arrastado: arrastado, alvo: alvo } : null;
            }
        },

        // Feedback e frases
        feedback: {
            frasesAcerto: ["Muito bem!", "Isso mesmo!", "Você conseguiu!"],
            fraseApoio: "Quase! Tente outra vez. Você consegue!",
            mostrarAcerto: function (elemento) {
                if (!elemento) return;
                elemento.className = "feedback acerto";
                elemento.textContent = GameEngine.feedback.frasesAcerto[Math.floor(Math.random() * GameEngine.feedback.frasesAcerto.length)];
            },
            mostrarApoio: function (elemento) {
                if (!elemento) return;
                elemento.className = "feedback apoio";
                elemento.textContent = GameEngine.feedback.fraseApoio;
            }
        },

        // Progresso
        progresso: {
            desenhar: function (container, atual, total) {
                if (!container) return;
                container.textContent = atual + " / " + total;
            }
        },

        // Navegação entre telas
        telas: {
            mostrar: function (nome) {
                document.querySelectorAll(".tela").forEach(function (tela) {
                    tela.classList.toggle("ativa", tela.id === nome);
                });
            }
        },

        // Utilitários
        util: {
            sortear: function (min, max) {
                return Math.floor(Math.random() * (max - min + 1)) + min;
            },
            embaralhar: function (lista) {
                var copia = lista.slice();
                for (var i = copia.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var tmp = copia[i];
                    copia[i] = copia[j];
                    copia[j] = tmp;
                }
                return copia;
            }
        }
    };

    window.GameEngine = GameEngine;
})();
