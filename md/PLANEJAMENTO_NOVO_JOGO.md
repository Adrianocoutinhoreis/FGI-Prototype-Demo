# Planejamento: Como Criar um Novo Jogo

**Data do planejamento:** 10 de Julho de 2026
**Versão:** 0.1 (Protótipo)

---

## Visão Geral

Para adicionar um novo jogo ao FGI, não basta apenas criar os arquivos do jogo. É necessário registrar o jogo em **2 lugares** para que ele apareça no dashboard do aluno.

---

## Checklist Completo

### Fase 1: Criar Arquivos do Jogo

| # | Arquivo | Descrição | Obrigatório |
|---|---------|-----------|-------------|
| 1 | `games/matematica/game002/` | Criar pasta do jogo | ✅ |
| 2 | `index.html` | Estrutura HTML (3 telas) | ✅ |
| 3 | `script.js` | Lógica do jogo | ✅ |
| 4 | `style.css` | Estilos específicos do jogo | ✅ |
| 5 | `manifest.json` | Metadados do jogo | ✅ |

### Fase 2: Registrar no Sistema

| # | Arquivo | Local | O que fazer |
|---|---------|-------|-------------|
| 6 | `games/catalog.js` | Array `matematica` | Adicionar objeto do jogo |
| 7 | `aluno/dashboard.html` | Array `GAMES` (linha ~226) | Adicionar card do jogo |

### Fase 3: Criar Páginas de Apoio

| # | Arquivo | Descrição | Obrigatório |
|---|---------|-----------|-------------|
| 8 | `aluno/tutorial-contagem.html` | Tutorial do jogo para o aluno | Recomendado |
| 9 | `professor/tutorial-contagem.html` | Tutorial do jogo para o professor | Opcional |

### Fase 4: Atualizar Wrapper do Jogo

| # | Arquivo | Mudança | Obrigatório |
|---|---------|---------|-------------|
| 10 | `aluno/game.html` | Aceitar parâmetro `gameId` na URL | Recomendado |

---

## Estrutura de Pastas

```
games/matematica/
├── game001/                    # Jogo da Soma (já existe)
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── manifest.json
│
└── game002/                    # Jogo da Contagem (NOVO)
    ├── index.html
    ├── script.js
    ├── style.css
    └── manifest.json
```

---

## Template: manifest.json

```json
{
  "id": "mat-game002",
  "nome": "Jogo da Contagem",
  "descricao": "Aprenda a contar objetos e reconhecer números",
  "disciplina": "matematica",
  "tipo": "numeros",
  "subtipo": "contagem",
  "icone": "🔢",
  "mascote": "🐢",
  "corTema": "#55a08a",

  "nivelDificuldade": ["facil", "medio", "dificil"],
  "nivelMinimo": 1,
  "nivelMaximo": 3,

  "perfilCompativel": ["T", "T1", "T2", "T3", "TD", "DX", "DC", "DI"],
  "requisitosPrevios": [],
  "habilidades": ["contagem", "reconhecimento-numeros", "correspondencia-um-para-um"],

  "tempoEstimado": {
    "facil": "5 min",
    "medio": "8 min",
    "dificil": "12 min"
  },

  "totalPerguntas": 8,
  "interacao": "clique",
  "fallbackTeclado": true,
  "sonsProcedurais": true,

  "versao": "1.0.0",
  "autor": "FGI",
  "dataCriacao": "2026-07-10"
}
```

### Campos Obrigatórios

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| `id` | ID único (disciplina-gameXXX) | `mat-game002` |
| `nome` | Nome exibido | `Jogo da Contagem` |
| `descricao` | Breve descrição | `Aprenda a contar...` |
| `disciplina` | `matematica` ou `portugues` | `matematica` |
| `tipo` | Categoria | `numeros`, `aritmetica`, `leitura` |
| `subtipo` | Subcategoria | `contagem`, `soma`, `soletracao` |
| `icone` | Emoji | `🔢` |
| `mascote` | Emoji do mascote | `🐢` |
| `nivelMinimo` | Nível mínimo | `1` |
| `nivelMaximo` | Nível máximo | `3` |
| `perfilCompativel` | Perfis compatíveis | `["T", "T1", "T2"]` |
| `habilidades` | Habilidades trabalhadas | `["contagem"]` |
| `totalPerguntas` | Questões por sessão | `8` |

---

## Template: games/catalog.js

Adicionar no array `matematica`:

```javascript
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
        // ========== NOVO JOGO ==========
        {
            id: "mat-game002",
            nome: "Jogo da Contagem",
            descricao: "Aprenda a contar objetos e reconhecer números.",
            icone: "🔢",
            caminho: "matematica/game002/",
            nivelMinimo: 1,
            nivelMaximo: 3,
            perfilCompativel: ["T", "T1", "T2", "T3", "TD", "DX", "DC", "DI"],
            habilidades: ["contagem", "reconhecimento-numeros"]
        }
        // ========== FIM NOVO JOGO ==========
    ],
    portugues: []
};
```

---

## Template: aluno/dashboard.html

Adicionar no array `GAMES` (linha ~226):

```javascript
var GAMES = [
    {
        subject: "matematica",
        icon: "➕",
        name: "Jogo da Soma",
        stars: 4,
        href: "tutorial.html"
    },
    // ========== NOVO JOGO ==========
    {
        subject: "matematica",
        icon: "🔢",
        name: "Jogo da Contagem",
        stars: 0,
        href: "tutorial-contagem.html"
    }
    // ========== FIM NOVO JOGO ==========
];
```

---

## Template: index.html (Estrutura do Jogo)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jogo da Contagem</title>
    <link rel="stylesheet" href="style.css?v=1">
</head>
<body>

    <!-- ===================== TELA INICIAL ===================== -->
    <section id="tela-inicio" class="tela ativa">
        <div class="cartao cartao-inicio">
            <div class="mascote" aria-hidden="true">🐢</div>
            <h1>Jogo da Contagem</h1>
            <p class="subtitulo">Vamos contar juntos, no seu tempo.</p>

            <div class="escolha-nivel">
                <p class="rotulo-nivel">Escolha como quer jogar:</p>
                <button class="botao-nivel" data-nivel="1">
                    <span class="icone-nivel" aria-hidden="true">🌱</span>
                    <span class="texto-nivel">
                        <strong>Começando</strong>
                        <small>Contar até 5</small>
                    </span>
                </button>
                <button class="botao-nivel" data-nivel="2">
                    <span class="icone-nivel" aria-hidden="true">🌿</span>
                    <span class="texto-nivel">
                        <strong>Praticando</strong>
                        <small>Contar até 10</small>
                    </span>
                </button>
                <button class="botao-nivel" data-nivel="3">
                    <span class="icone-nivel" aria-hidden="true">🌳</span>
                    <span class="texto-nivel">
                        <strong>Avançando</strong>
                        <small>Contar até 20</small>
                    </span>
                </button>
            </div>
        </div>
    </section>

    <!-- ===================== TELA DO JOGO ===================== -->
    <section id="tela-jogo" class="tela">
        <header class="barra-topo">
            <button id="botao-voltar" class="botao-icone" title="Voltar ao início" aria-label="Voltar ao início">
                🏠 <span class="texto-botao-topo">Início</span>
            </button>

            <div id="progresso" class="progresso" aria-label="Progresso da atividade"></div>

            <button id="botao-som" class="botao-icone" title="Ligar ou desligar o som" aria-label="Ligar ou desligar o som" aria-pressed="true">
                🔊 <span class="texto-botao-topo">Som</span>
            </button>
        </header>

        <main class="cartao cartao-jogo">
            <p id="instrucao" class="instrucao">Conte os desenhos e <strong>clique</strong> no número certo.</p>

            <div id="area-visual" class="area-visual" aria-hidden="true">
                <!-- Objetos para contar serão renderizados aqui -->
            </div>

            <div id="opcoes" class="opcoes"></div>

            <div id="feedback" class="feedback" role="status" aria-live="polite"></div>

            <button id="botao-proxima" class="botao-principal escondido">
                Próxima <span aria-hidden="true">→</span>
            </button>
        </main>
    </section>

    <!-- ===================== TELA FINAL ===================== -->
    <section id="tela-final" class="tela">
        <div class="cartao cartao-final">
            <div class="mascote" aria-hidden="true">🐢</div>
            <h2>Você terminou!</h2>
            <p id="resumo-final" class="subtitulo">Muito bem! Você completou todas as contagens.</p>
            <div id="estrelas-finais" class="estrelas-finais" aria-hidden="true"></div>
            <div class="botoes-finais">
                <button id="botao-jogar-novamente" class="botao-principal">Jogar de novo</button>
                <button id="botao-inicio-final" class="botao-secundario">Voltar ao início</button>
            </div>
        </div>
    </section>

    <script src="script.js?v=1"></script>
</body>
</html>
```

---

## Template: script.js (Lógica do Jogo)

```javascript
/* ============================================================
   Jogo da Contagem — lógica
   Princípios para o público TEA:
   - Sem limite de tempo
   - Erro nunca é punido
   - Feedback positivo e previsível
   - Sons suaves e opcionais
   - Layout previsível e com poucos elementos
   ============================================================ */

(function () {
    "use strict";

    // ---------- Configuração ----------
    var TOTAL_PERGUNTAS = 8;

    var NIVEIS = {
        1: { max: 5 },   // contar até 5
        2: { max: 10 },  // contar até 10
        3: { max: 20 }   // contar até 20
    };

    // Objetos para contar (um tipo por pergunta, para não confundir)
    var OBJETOS = ["🍎", "⭐", "🐟", "🌸", "🍓", "🐤", "🧩", "🎈", "🌺", "🐱"];

    var FRASES_ACERTO = [
        "Muito bem!",
        "Isso mesmo!",
        "Você conseguiu!",
        "Ótimo trabalho!",
        "Perfeito!"
    ];

    var FRASE_APOIO = "Quase! Conte novamente com calma. Você consegue!";

    // ---------- Estado ----------
    var estado = {
        nivel: 1,
        perguntaAtual: 0,
        acertosPrimeira: 0,
        errouNesta: false,
        quantidade: 0,
        respondida: false,
        somLigado: true,
        erros: 0,
        objeto: ""
    };

    // ---------- Elementos ----------
    var telas = {
        inicio: document.getElementById("tela-inicio"),
        jogo: document.getElementById("tela-jogo"),
        final: document.getElementById("tela-final")
    };

    var el = {
        botoesNivel: document.querySelectorAll(".botao-nivel"),
        botaoVoltar: document.getElementById("botao-voltar"),
        botaoSom: document.getElementById("botao-som"),
        progresso: document.getElementById("progresso"),
        areaVisual: document.getElementById("area-visual"),
        opcoes: document.getElementById("opcoes"),
        feedback: document.getElementById("feedback"),
        botaoProxima: document.getElementById("botao-proxima"),
        resumoFinal: document.getElementById("resumo-final"),
        estrelasFinais: document.getElementById("estrelas-finais"),
        botaoJogarNovamente: document.getElementById("botao-jogar-novamente"),
        botaoInicioFinal: document.getElementById("botao-inicio-final")
    };

    // ---------- Som ----------
    var contextoAudio = null;

    function tocarTom(frequencia, duracao, atraso) {
        if (!estado.somLigado) return;
        try {
            if (!contextoAudio) {
                contextoAudio = new (window.AudioContext || window.webkitAudioContext)();
            }
            var inicio = contextoAudio.currentTime + (atraso || 0);
            var oscilador = contextoAudio.createOscillator();
            var ganho = contextoAudio.createGain();
            oscilador.type = "sine";
            oscilador.frequency.value = frequencia;
            ganho.gain.setValueAtTime(0, inicio);
            ganho.gain.linearRampToValueAtTime(0.12, inicio + 0.05);
            ganho.gain.linearRampToValueAtTime(0, inicio + duracao);
            oscilador.connect(ganho);
            ganho.connect(contextoAudio.destination);
            oscilador.start(inicio);
            oscilador.stop(inicio + duracao);
        } catch (e) {}
    }

    function somAcerto() {
        tocarTom(523.25, 0.25, 0);
        tocarTom(659.25, 0.3, 0.18);
    }

    function somApoio() {
        tocarTom(392, 0.3, 0);
    }

    // ---------- Utilitários ----------
    function sortear(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function embaralhar(lista) {
        for (var i = lista.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var tmp = lista[i];
            lista[i] = lista[j];
            lista[j] = tmp;
        }
        return lista;
    }

    function mostrarTela(nome) {
        for (var chave in telas) {
            telas[chave].classList.remove("ativa");
        }
        telas[nome].classList.add("ativa");
    }

    // ---------- Progresso ----------
    function desenharProgresso() {
        el.progresso.innerHTML = "";
        for (var i = 0; i < TOTAL_PERGUNTAS; i++) {
            var ponto = document.createElement("span");
            ponto.className = "ponto";
            if (i < estado.perguntaAtual) ponto.classList.add("feito");
            if (i === estado.perguntaAtual - 1) ponto.classList.add("recem-feito");
            if (i === estado.perguntaAtual) ponto.classList.add("atual");
            el.progresso.appendChild(ponto);
        }
    }

    // ---------- Pergunta ----------
    function gerarPergunta() {
        var max = NIVEIS[estado.nivel].max;
        estado.quantidade = sortear(1, max);
        estado.respondida = false;
        estado.errouNesta = false;
        estado.objeto = OBJETOS[sortear(0, OBJETOS.length - 1)];

        // Renderizar objetos para contar
        el.areaVisual.innerHTML = "";
        for (var i = 0; i < estado.quantidade; i++) {
            var item = document.createElement("span");
            item.className = "item-visual";
            item.textContent = estado.objeto;
            item.style.animationDelay = (i * 0.08) + "s";
            el.areaVisual.appendChild(item);
        }

        // Opções: resposta certa + 2 alternativas
        var opcoes = [estado.quantidade];
        while (opcoes.length < 3) {
            var alternativa = estado.quantidade + sortear(-3, 3);
            if (alternativa >= 1 && alternativa !== estado.quantidade && opcoes.indexOf(alternativa) === -1) {
                opcoes.push(alternativa);
            }
        }
        embaralhar(opcoes);

        el.opcoes.innerHTML = "";
        opcoes.forEach(function (valor) {
            var botao = document.createElement("button");
            botao.className = "botao-opcao";
            botao.textContent = valor;
            botao.setAttribute("aria-label", "Resposta: " + valor);
            botao.addEventListener("click", function () {
                verificarResposta(valor);
            });
            botao.addEventListener("keydown", function (e) {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    verificarResposta(valor);
                }
            });
            el.opcoes.appendChild(botao);
        });

        el.feedback.textContent = "";
        el.feedback.className = "feedback";
        el.botaoProxima.classList.add("escondido");

        desenharProgresso();
    }

    // ---------- Resposta ----------
    function verificarResposta(valor) {
        if (estado.respondida) return;

        if (valor === estado.quantidade) {
            estado.respondida = true;
            if (!estado.errouNesta) {
                estado.acertosPrimeira++;
            }

            // Feedback positivo
            el.feedback.textContent = "⭐ " + FRASES_ACERTO[sortear(0, FRASES_ACERTO.length - 1)];
            el.feedback.className = "feedback acerto";
            somAcerto();

            // Desabilitar botões
            el.opcoes.querySelectorAll("button").forEach(function (btn) {
                btn.disabled = true;
            });

            el.botaoProxima.classList.remove("escondido");
            el.botaoProxima.focus();
        } else {
            estado.errouNesta = true;
            estado.erros++;

            el.feedback.textContent = "🐢 " + FRASE_APOIO;
            el.feedback.className = "feedback apoio";
            somApoio();

            // Desabilitar botão errado
            el.opcoes.querySelectorAll("button").forEach(function (btn) {
                if (parseInt(btn.textContent) === valor) {
                    btn.disabled = true;
                    btn.classList.add("desabilitado");
                }
            });
        }
    }

    // ---------- Fluxo ----------
    function comecarJogo(nivel) {
        estado.nivel = nivel;
        estado.perguntaAtual = 0;
        estado.acertosPrimeira = 0;
        estado.erros = 0;
        mostrarTela("jogo");
        gerarPergunta();
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
        mostrarTela("final");

        el.estrelasFinais.innerHTML = "";
        for (var i = 0; i < TOTAL_PERGUNTAS; i++) {
            var estrela = document.createElement("span");
            estrela.className = "estrela-final";
            estrela.textContent = i < estado.acertosPrimeira ? "⭐" : "🌟";
            estrela.style.animationDelay = (i * 0.25) + "s";
            el.estrelasFinais.appendChild(estrela);
        }

        el.resumoFinal.textContent =
            "Você completou as " + TOTAL_PERGUNTAS + " contagens. Parabéns pelo seu esforço!";

        somAcerto();

        // Enviar resultado para o pai (se estiver em iframe)
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: "GAME_FINISHED",
                gameId: "mat-game002",
                hits: estado.acertosPrimeira,
                misses: estado.erros || 0
            }, "*");
        }
    }

    // ---------- Eventos ----------
    el.botoesNivel.forEach(function (botao) {
        botao.addEventListener("click", function () {
            comecarJogo(parseInt(botao.getAttribute("data-nivel"), 10));
        });
    });

    el.botaoProxima.addEventListener("click", proximaPergunta);

    el.botaoVoltar.addEventListener("click", function () {
        mostrarTela("inicio");
    });

    el.botaoSom.addEventListener("click", function () {
        estado.somLigado = !estado.somLigado;
        el.botaoSom.setAttribute("aria-pressed", String(estado.somLigado));
        el.botaoSom.innerHTML = (estado.somLigado ? "🔊" : "🔇") +
            ' <span class="texto-botao-topo">Som</span>';
    });

    el.botaoJogarNovamente.addEventListener("click", function () {
        comecarJogo(estado.nivel);
    });

    el.botaoInicioFinal.addEventListener("click", function () {
        mostrarTela("inicio");
    });

    // ---------- Integração FGI ----------
    var urlParams = new URLSearchParams(window.location.search);
    var nivelParam = urlParams.get("nivel");
    var somParam = urlParams.get("som");

    if (somParam === "off") {
        estado.somLigado = false;
        if (el.botaoSom) {
            el.botaoSom.setAttribute("aria-pressed", "false");
            el.botaoSom.innerHTML = '🔇 <span class="texto-botao-topo">Som</span>';
        }
    }

    if (nivelParam) {
        var n = parseInt(nivelParam, 10);
        if (n >= 1 && n <= 3) {
            comecarJogo(n);
        }
    }
})();
```

---

## Template: style.css (Estilos do Jogo)

O `style.css` do jogo deve conter apenas estilos **específicos** do jogo da contagem. Os estilos base devem vir de `games/shared/css/game-base.css`.

```css
/* ============================================================
   Jogo da Contagem — estilos
   Estilos específicos deste jogo.
   Estilos base: games/shared/css/game-base.css
   ============================================================ */

/* ---------- Área Visual ---------- */
.area-visual {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 12px;
    padding: 24px;
    min-height: 120px;
    background: var(--cor-fundo-area, #f0fdf4);
    border-radius: 16px;
    margin-bottom: 24px;
}

.item-visual {
    font-size: 2.5rem;
    animation: aparecer 0.3s ease both;
}

@keyframes aparecer {
    from {
        opacity: 0;
        transform: scale(0.5);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

/* ---------- Opções ---------- */
.opcoes {
    display: flex;
    justify-content: center;
    gap: 16px;
    margin-bottom: 16px;
}

.botao-opcao {
    width: 80px;
    height: 80px;
    font-size: 2rem;
    font-weight: 700;
    border-radius: 16px;
    border: 3px solid var(--cor-borda);
    background: white;
    color: var(--cor-texto);
    cursor: pointer;
    transition: all 0.2s ease;
}

.botao-opcao:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.botao-opcao.desabilitado {
    opacity: 0.4;
    cursor: not-allowed;
    transform: none;
}

/* ---------- Feedback ---------- */
.feedback {
    min-height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.feedback.acerto {
    background: #DCFCE7;
    color: #166534;
    border: 2px solid #86EFAC;
}

.feedback.apoio {
    background: #FEF3C7;
    color: #92400E;
    border: 2px solid #FCD34D;
}

/* ---------- Botão Próxima ---------- */
.botao-principal {
    background: var(--cor-primaria);
    color: white;
    border: none;
    border-radius: 12px;
    padding: 16px 32px;
    font-size: 18px;
    cursor: pointer;
    transition: all 0.2s ease;
}

.botao-principal:hover {
    filter: brightness(0.95);
}

.escondido {
    display: none;
}

/* ---------- Responsivo ---------- */
@media (max-width: 600px) {
    .item-visual {
        font-size: 2rem;
    }

    .botao-opcao {
        width: 64px;
        height: 64px;
        font-size: 1.5rem;
    }
}
```

---

## Template: tutorial-contagem.html (Tutorial do Aluno)

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Como Jogar - Contagem - FGI</title>
    <link rel="stylesheet" href="../css/style.css">
    <style>
        .tutorial-illustration {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 16px;
            font-size: 2.5rem;
            margin: 32px 0;
            padding: 32px;
            background: #F0FDF4;
            border-radius: 16px;
            border: 2px dashed #86EFAC;
        }
        .tutorial-arrow {
            font-size: 2rem;
            color: var(--color-text-muted);
            animation: apontar 1.5s ease-in-out infinite;
        }
        @keyframes apontar {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(8px); }
        }
        .tutorial-number {
            font-size: 2.5rem;
            font-weight: 800;
            color: var(--color-primary);
            background: white;
            border: 3px solid var(--color-primary);
            border-radius: 12px;
            width: 60px;
            height: 60px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    </style>
</head>
<body>
    <div class="app-container">
        <header class="app-header">
            <div class="logo-container">
                <span class="logo-emoji" aria-hidden="true">🧩</span>
                <span class="logo-text">FGI — Aluno</span>
            </div>
            <div style="text-align: right; font-size: 16px;">
                <div>Aluno: <span id="header-student-name" class="game-meta-value">-</span></div>
                <div>Perfil: <span id="header-profile-name" class="game-meta-value">-</span></div>
            </div>
        </header>

        <div class="step-progress"></div>

        <main class="card">
            <h1 class="app-title" style="margin-bottom: 8px;">Como Jogar: Jogo da Contagem</h1>
            <p class="app-subtitle" style="margin-bottom: 24px;">Veja a instrução abaixo antes de começarmos.</p>

            <div class="tutorial-illustration">
                <span>🍎</span>
                <span>🍎</span>
                <span>🍎</span>
                <span class="tutorial-arrow">→</span>
                <span class="tutorial-number">3</span>
            </div>

            <p style="font-size: 18px; text-align: center; margin-bottom: 32px; color: var(--color-text-muted);">
                Conte os objetos e <strong>clique</strong> no número certo!
            </p>

            <div class="btn-group" style="justify-content: center;">
                <button type="button" id="btn-voltar" class="btn btn-secondary">
                    <span aria-hidden="true">←</span> Voltar
                </button>
                <button type="button" id="btn-comecar" class="btn btn-primary">
                    Começar Atividade <span aria-hidden="true">→</span>
                </button>
            </div>
        </main>
    </div>

    <script src="../js/app.js"></script>
    <script>
        document.addEventListener("DOMContentLoaded", function () {
            FGI.updateStepProgress(2);

            var state = FGI.getState();

            document.getElementById("header-student-name").textContent = state.student || "Lucas";
            document.getElementById("header-profile-name").textContent = state.profile || "TEA Nível 1";

            document.getElementById("btn-voltar").addEventListener("click", function () {
                window.location.href = "dashboard.html";
            });

            document.getElementById("btn-comecar").addEventListener("click", function () {
                window.location.href = FGI.buildUrl("game.html?gameId=mat-game002", state);
            });
        });
    </script>
</body>
</html>
```

---

## Atualização: aluno/game.html

Para o `game.html` aceitar diferentes jogos via `gameId`, adicionar esta lógica:

```javascript
// No início do script, após ler o state:
var gameId = FGI.getParam("gameId") || "mat-game001";

// Mapear gameId para caminho do iframe
var GAME_PATHS = {
    "mat-game001": "../games/matematica/game001/index.html",
    "mat-game002": "../games/matematica/game002/index.html"
    // Adicionar novos jogos aqui
};

var gamePath = GAME_PATHS[gameId] || GAME_PATHS["mat-game001"];
var iframeUrl = gamePath + "?nivel=" + level + "&som=" + state.sound;
```

---

## Resumo dos Arquivos

| Arquivo | Ação | Obrigatório |
|---------|------|-------------|
| `games/matematica/game002/index.html` | Criar | ✅ |
| `games/matematica/game002/script.js` | Criar | ✅ |
| `games/matematica/game002/style.css` | Criar | ✅ |
| `games/matematica/game002/manifest.json` | Criar | ✅ |
| `games/catalog.js` | Atualizar | ✅ |
| `aluno/dashboard.html` | Atualizar | ✅ |
| `aluno/tutorial-contagem.html` | Criar | Recomendado |
| `aluno/game.html` | Atualizar | Recomendado |

---

## Próximos Passos

1. Criar pasta `games/matematica/game002/`
2. Criar os 4 arquivos do jogo
3. Atualizar `games/catalog.js`
4. Atualizar `aluno/dashboard.html`
5. Criar `aluno/tutorial-contagem.html`
6. Atualizar `aluno/game.html` para aceitar `gameId`
7. Testar fluxo completo
