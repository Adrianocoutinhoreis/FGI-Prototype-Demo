# Planejamento: Componentes Reutilizáveis

**Data do planejamento:** 10 de Julho de 2026
**Versão:** 0.1 (Protótipo)

---

## Visão Geral

Com múltiplos jogos de Matemática e Português, é essencial criar componentes reutilizáveis que garantem consistência visual, reduzem duplicação de código e aceleram o desenvolvimento de novos jogos.

---

## Componentes Identificados

### Análise do Jogo Atual (game001)

O "Jogo da Soma" possui os seguintes elementos que se repetirão em outros jogos:

| Componente | Onde aparece | Pode ser reutilizado? |
|------------|--------------|----------------------|
| **Barra superior (HUD)** | `barra-topo` | ✅ Sim - Todos os jogos |
| **Botão de som** | `botao-som` | ✅ Sim - Todos os jogos |
| **Botão voltar/início** | `botao-voltar` | ✅ Sim - Todos os jogos |
| **Barra de progresso** | `progresso` | ✅ Sim - Todos os jogos |
| **Área de instrução** | `instrucao` | ✅ Sim - Todos os jogos |
| **Área de feedback** | `feedback` | ✅ Sim - Todos os jogos |
| **Botão próxima questão** | `botao-proxima` | ✅ Sim - Todos os jogos |
| **Tela inicial com níveis** | `escolha-nivel` | ⚠️ Parcial - Formato varia |
| **Área visual (conteúdo)** | `area-visual` | ❌ Não - Específica de cada jogo |
| **Equação/operação** | `conta` | ❌ Não - Específica de cada jogo |
| **Opções de resposta** | `opcoes` | ⚠️ Parcial - Drag-and-drop é comum |
| **Tela final com estrelas** | `tela-final` | ✅ Sim - Todos os jogos |
| **Mascote** | `mascote` | ✅ Sim - Todos os jogos |

---

## Estrutura de Componentes Proposta

```
games/shared/
├── css/
│   ├── game-base.css           # Estilos base (já existe)
│   ├── components/
│   │   ├── hud.css             # Barra superior
│   │   ├── buttons.css         # Botões reutilizáveis
│   │   ├── progress.css        # Barra de progresso
│   │   ├── feedback.css        # Área de feedback
│   │   ├── screens.css         # Transições de tela
│   │   ├── mascot.css          # Mascote
│   │   ├── cards.css           # Cartões de nível
│   │   └── results.css         # Tela de resultados
│   └── themes/
│       ├── matematica.css      # Tema de matemática (verde)
│       └── portugues.css       # Tema de português (azul)
│
├── js/
│   ├── game-engine.js          # Funções compartilhadas (já existe)
│   ├── components/
│   │   ├── hud.js              # Lógica da barra superior
│   │   ├── progress.js         # Lógica de progresso
│   │   ├── feedback.js         # Lógica de feedback
│   │   ├── screens.js          # Gerenciamento de telas
│   │   ├── sound.js            # Sistema de som
│   │   ├── dragdrop.js         # Sistema de arrastar e soltar
│   │   ├── results.js          # Tela de resultados
│   │   └── config.js           # Leitura de configuração da sessão
│   └── utils.js                # Funções utilitárias
│
└── assets/
    ├── mascotes/               # Imagens dos mascotes
    └── sounds/                 # Sons compartilhados (opcional)
```

---

## Componentes Detalhados

### 1. HUD (Barra Superior)

**Arquivo:** `components/hud.js` + `components/hud.css`

O HUD é a barra que aparece no topo durante o jogo, contendo controles essenciais.

```
┌─────────────────────────────────────────────────────────┐
│  🏠 Início    ●●●○○○○○    🔊 Som                        │
└─────────────────────────────────────────────────────────┘
```

**Funcionalidades:**
- Botão voltar/início
- Barra de progresso (bolinhas)
- Botão ligar/desligar som
- Timer (opcional)

**API:**

```javascript
GameComponents.hud = {
    // Inicializar HUD
    init: function(options) {
        // options.totalQuestions - Total de questões
        // options.showTimer - Mostrar cronômetro
        // options.showSound - Mostrar botão de som
        // options.onBack - Callback ao clicar voltar
        // options.onSoundToggle - Callback ao mudar som
    },

    // Atualizar progresso
    updateProgress: function(current, total) { /* ... */ },

    // Mostrar/ocultar timer
    setTimerVisible: function(visible) { /* ... */ },

    // Atualizar tempo
    updateTimer: function(seconds) { /* ... */ },

    // Obter estado do som
    isSoundOn: function() { /* ... */ },

    // Destruir HUD
    destroy: function() { /* ... */ }
};
```

**Uso em um jogo:**

```javascript
// No início do jogo
GameComponents.hud.init({
    totalQuestions: 8,
    showTimer: false,
    showSound: true,
    onBack: function() { mostrarTela("inicio"); },
    onSoundToggle: function(ligado) { estado.somLigado = ligado; }
});

// A cada questão respondida
GameComponents.hud.updateProgress(3, 8); // Questão 3 de 8
```

---

### 2. Sistema de Progresso

**Arquivo:** `components/progress.js` + `components/progress.css`

Barra de progresso visual com bolinhas que mostram avanço.

```
● ● ● ○ ○ ○ ○ ○
1 2 3       ← atual
```

**Variantes:**

| Variante | Uso | Exemplo |
|----------|-----|---------|
| **Bolinhas** | Jogos com questões fixas | Soma, Subtração |
| **Barra** | Jogos com progresso contínuo | Leitura |
| **Porcentagem** | Jogos com score | Interpretação |

**API:**

```javascript
GameComponents.progress = {
    // Criar barra de progresso
    create: function(container, options) {
        // options.type - "dots" | "bar" | "percentage"
        // options.total - Total de itens
        // options.current - Item atual
        // options.showLabels - Mostrar números
    },

    // Atualizar progresso
    update: function(current) { /* ... */ },

    // Marcar item como concluído
    markDone: function(index) { /* ... */ },

    // Resetar progresso
    reset: function() { /* ... */ }
};
```

**Uso:**

```javascript
// Criar progresso com bolinhas
GameComponents.progress.create(
    document.getElementById("progresso"),
    { type: "dots", total: 8, current: 0, showLabels: false }
);

// Avançar para questão 3
GameComponents.progress.update(3);
```

---

### 3. Sistema de Feedback

**Arquivo:** `components/feedback.js` + `components/feedback.css`

Área de feedback que mostra mensagens de acerto ou apoio.

```
┌─────────────────────────────────────────┐
│  ⭐ Muito bem!                          │
└─────────────────────────────────────────┘

ou

┌─────────────────────────────────────────┐
│  🐢 Quase! Tente outra vez.            │
└─────────────────────────────────────────┘
```

**Funcionalidades:**
- Mensagens de acerto (variadas)
- Mensagens de apoio (acolhedoras)
- Animações suaves
- Suporte a múltiplos ícones

**API:**

```javascript
GameComponents.feedback = {
    // Inicializar área de feedback
    init: function(container, options) {
        // options.mascot - Emoji do mascote (padrão: 🐢)
        // options.successPhrases - Frases de acerto
        // options.supportPhrase - Frase de apoio
        // options.duration - Duração da mensagem (ms)
    },

    // Mostrar acerto
    showSuccess: function(customMessage) { /* ... */ },

    // Mostrar apoio (erro)
    showSupport: function(customMessage) { /* ... */ },

    // Limpar feedback
    clear: function() { /* ... */ },

    // Configurar frases personalizadas
    setPhrases: function(success, support) { /* ... */ }
};
```

**Uso:**

```javascript
// Inicializar feedback
GameComponents.feedback.init(
    document.getElementById("feedback"),
    { mascot: "🐢", duration: 2000 }
);

// Ao acertar
GameComponents.feedback.showSuccess();

// Ao errar
GameComponents.feedback.showSupport();

// Com mensagem personalizada
GameComponents.feedback.showSuccess("Incrível! Você é demais!");
```

---

### 4. Gerenciador de Telas

**Arquivo:** `components/screens.js` + `components/screens.css`

Sistema de transições entre telas (início, jogo, final).

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Tela       │ ──▶ │  Tela       │ ──▶ │  Tela       │
│  Início     │     │  Jogo       │     │  Final      │
└─────────────┘     └─────────────┘     └─────────────┘
```

**Funcionalidades:**
- Transições suaves (fade)
- Controle de histórico (voltar)
- Animações de entrada/saída

**API:**

```javascript
GameComponents.screens = {
    // Registrar telas
    register: function(screens) {
        // screens = [
        //   { id: "inicio", element: document.getElementById("tela-inicio") },
        //   { id: "jogo", element: document.getElementById("tela-jogo") },
        //   { id: "final", element: document.getElementById("tela-final") }
        // ]
    },

    // Mostrar tela com transição
    show: function(screenId, options) {
        // options.animation - "fade" | "slide" | "none"
        // options.onComplete - Callback após transição
    },

    // Voltar para tela anterior
    back: function() { /* ... */ },

    // Obter tela atual
    current: function() { /* ... */ }
};
```

**Uso:**

```javascript
// Registrar telas
GameComponents.screens.register([
    { id: "inicio", element: document.getElementById("tela-inicio") },
    { id: "jogo", element: document.getElementById("tela-jogo") },
    { id: "final", element: document.getElementById("tela-final") }
]);

// Mostrar tela do jogo
GameComponents.screens.show("jogo", {
    animation: "fade",
    onComplete: function() { gerarPergunta(); }
});

// Voltar para início
GameComponents.screens.back();
```

---

### 5. Sistema de Som

**Arquivo:** `components/sound.js`

Sistema de sons procedurais (Web Audio API) - expandir o que já existe no `game-engine.js`.

**Funcionalidades:**
- Sons de acerto
- Sons de apoio (erro suave)
- Sons de navegação
- Volume configurável

**API:**

```javascript
GameComponents.sound = {
    // Inicializar áudio
    init: function(options) {
        // options.enabled - Som ligado por padrão
        // options.volume - Volume (0 a 1)
    },

    // Tocar som de acerto
    playSuccess: function() { /* ... */ },

    // Tocar som de apoio
    playSupport: function() { /* ... */ },

    // Tocar som de clique
    playClick: function() { /* ... */ },

    // Tocar som de conclusão
    playComplete: function() { /* ... */ },

    // Ligar/desligar som
    setEnabled: function(enabled) { /* ... */ },

    // Verificar se está ligado
    isEnabled: function() { /* ... */ }
};
```

---

### 6. Sistema de Drag-and-Drop

**Arquivo:** `components/dragdrop.js`

Sistema de arrastar e soltar com suporte a touch e mouse - expandir o que já existe no `game-engine.js`.

**Funcionalidades:**
- Arrastar com mouse
- Arrastar com touch (tablets)
- Detecção de alvo
- Feedback visual durante arrasto
- Fallback por teclado

**API:**

```javascript
GameComponents.dragdrop = {
    // Inicializar sistema
    init: function(options) {
        // options.margin - Margem extra para alvo (px)
        // options.ghostOpacity - Opacidade do fantasma (0 a 1)
        // options.onDrop - Callback ao soltar
        // options.onDragStart - Callback ao iniciar arrasto
    },

    // Tornar elemento arrastável
    makeDraggable: function(element, data) {
        // data - Dados a serem passados no drop
    },

    // Definir alvo de drop
    setTarget: function(element, options) {
        // options.onDrop - Callback específico deste alvo
        // options.highlight - Mostrar destaque ao hover
    },

    // Limpar todos os draggables
    clearAll: function() { /* ... */ }
};
```

**Uso:**

```javascript
// Inicializar sistema
GameComponents.dragdrop.init({
    margin: 24,
    ghostOpacity: 0.8,
    onDrop: function(data, target) {
        if (data.value === respostaCorreta) {
            // Acertou!
        } else {
            // Errou - ficha volta
        }
    }
});

// Tornar fichas arrastáveis
fichas.forEach(function(ficha) {
    GameComponents.dragdrop.makeDraggable(ficha, {
        value: ficha.textContent
    });
});

// Definir alvo
GameComponents.dragdrop.setTarget(
    document.getElementById("alvo"),
    { highlight: true }
);
```

---

### 7. Tela de Resultados

**Arquivo:** `components/results.js` + `components/results.css`

Tela final que mostra resumo do desempenho com estrelas e métricas.

```
┌─────────────────────────────────────────┐
│              🐢 Você terminou!          │
│                                         │
│         ⭐ ⭐ ⭐ ⭐ 🌟                   │
│                                         │
│    Acertos: 6/8  |  Tempo: 02:45       │
│                                         │
│  [Jogar de novo]    [Voltar ao início]  │
└─────────────────────────────────────────┘
```

**Funcionalidades:**
- Exibição de estrelas (animadas)
- Métricas de desempenho
- Botões de ação
- Mensagem personalizada

**API:**

```javascript
GameComponents.results = {
    // Inicializar tela de resultados
    init: function(container, options) {
        // options.mascot - Emoji do mascote
        // options.title - Título
        // options.showStars - Mostrar estrelas
        // options.metrics - Métricas a exibir
    },

    // Exibir resultados
    show: function(data) {
        // data.hits - Acertos
        // data.misses - Erros
        // data.total - Total
        // data.duration - Duração
        // data.maxStreak - Maior sequência
    },

    // Calcular estrelas
    calculateStars: function(hits, total) {
        // Retorna número de estrelas (0 a 5)
    },

    // Configurar botões de ação
    setActions: function(actions) {
        // actions.playAgain - Callback "Jogar de novo"
        // actions.goHome - Callback "Voltar ao início"
    }
};
```

**Uso:**

```javascript
// Inicializar resultados
GameComponents.results.init(
    document.getElementById("tela-final"),
    { mascot: "🐢", title: "Você terminou!", showStars: true }
);

// Exibir ao final do jogo
GameComponents.results.show({
    hits: 6,
    misses: 2,
    total: 8,
    duration: "02:45",
    maxStreak: 4
});

// Configurar botões
GameComponents.results.setActions({
    playAgain: function() { comecarJogo(nivel); },
    goHome: function() { mostrarTela("inicio"); }
});
```

---

### 8. Mascote

**Arquivo:** `components/mascot.js` + `components/mascot.css`

Componente do mascote que aparece nas telas de início e fim.

```
      🐢
   (respirando)
```

**Funcionalidades:**
- Animação de "respiração"
- Diferentes mascotes por disciplina
- Mensagens personalizadas

**API:**

```javascript
GameComponents.mascot = {
    // Criar mascote
    create: function(container, options) {
        // options.emoji - Emoji do mascote
        // options.name - Nome do mascote
        // options.animation - Tipo de animação
    },

    // Mostrar mensagem do mascote
    say: function(message) { /* ... */ },

    // Mudar mascote
    change: function(newEmoji) { /* ... */ },

    // Parar animação
    pause: function() { /* ... */ },

    // Retomar animação
    resume: function() { /* ... */ }
};
```

---

### 9. Leitor de Configuração

**Arquivo:** `components/config.js`

Componente que lê a configuração da sessão (localStorage ou URL) e aplica nos componentes.

**Funcionalidades:**
- Ler sessão do localStorage
- Ler parâmetros da URL (fallback)
- Aplicar configurações visuais
- Disponibilizar config para outros componentes

**API:**

```javascript
GameComponents.config = {
    // Carregar configuração da sessão
    load: function() {
        // Tenta ler do localStorage (sessão)
        // Fallback para URL params
        // Retorna objeto de configuração
    },

    // Aplicar configurações visuais
    applyVisual: function(config) {
        // config.visual.contrast
        // config.visual.fontSize
        // config.visual.colorMode
        // config.visual.animationsEnabled
    },

    // Obter configuração de um grupo
    get: function(group) {
        // group - "timer", "audio", "visual", etc.
    },

    // Verificar se uma config está ativa
    is: function(group, key) {
        // Ex: GameComponents.config.is("audio", "sfxEnabled")
    }
};
```

**Uso:**

```javascript
// Carregar configuração
var config = GameComponents.config.load();

// Aplicar visual
GameComponents.config.applyVisual(config);

// Verificar se som está ligado
if (GameComponents.config.is("audio", "sfxEnabled")) {
    GameComponents.sound.init({ enabled: true });
}

// Obter nível de dificuldade
var nivel = GameComponents.config.get("difficulty").level;
```

---

## Temas por Disciplina

### Tema Matemática (`themes/matematica.css`)

```css
:root {
    --tema-cor-primaria: #55a08a;      /* Verde */
    --tema-cor-primaria-escura: #3f8672;
    --tema-cor-primaria-clara: #dff0e8;
    --tema-mascote: "🐢";
    --tema-icone: "➕";
}
```

### Tema Português (`themes/portugues.css`)

```css
:root {
    --tema-cor-primaria: #7fa8d9;      /* Azul */
    --tema-cor-primaria-escura: #4f7cb3;
    --tema-cor-primaria-clara: #e1ecfa;
    --tema-mascote: "🦉";
    --tema-icone: "🔤";
}
```

---

## Como Usar em um Novo Jogo

### Exemplo: Jogo da Subtração

```html
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Jogo da Subtração</title>

    <!-- CSS dos componentes -->
    <link rel="stylesheet" href="../../shared/css/game-base.css">
    <link rel="stylesheet" href="../../shared/css/components/hud.css">
    <link rel="stylesheet" href="../../shared/css/components/progress.css">
    <link rel="stylesheet" href="../../shared/css/components/feedback.css">
    <link rel="stylesheet" href="../../shared/css/components/screens.css">
    <link rel="stylesheet" href="../../shared/css/components/mascot.css">
    <link rel="stylesheet" href="../../shared/css/components/results.css">

    <!-- Tema da disciplina -->
    <link rel="stylesheet" href="../../shared/css/themes/matematica.css">

    <!-- CSS específico do jogo (apenas o que é único) -->
    <link rel="stylesheet" href="style.css">
</head>
<body>

    <!-- Tela Início -->
    <section id="tela-inicio" class="tela ativa">
        <div class="cartao cartao-inicio">
            <div class="mascote" aria-hidden="true">🐢</div>
            <h1>Jogo da Subtração</h1>
            <p class="subtitulo">Vamos subtrair juntos, no seu tempo.</p>
            <div class="escolha-nivel" id="nivel-selector"></div>
        </div>
    </section>

    <!-- Tela Jogo -->
    <section id="tela-jogo" class="tela">
        <div id="game-hud"></div>
        <main class="cartao cartao-jogo">
            <p id="instrucao" class="instrucao"></p>
            <div id="area-visual" class="area-visual"></div>
            <div id="operacao" class="operacao"></div>
            <div id="opcoes" class="opcoes"></div>
            <div id="feedback" class="feedback" role="status" aria-live="polite"></div>
            <button id="botao-proxima" class="botao-principal escondido">
                Próxima <span aria-hidden="true">→</span>
            </button>
        </main>
    </section>

    <!-- Tela Final -->
    <section id="tela-final" class="tela">
        <div id="results-container"></div>
    </section>

    <!-- JS dos componentes -->
    <script src="../../shared/js/utils.js"></script>
    <script src="../../shared/js/components/config.js"></script>
    <script src="../../shared/js/components/sound.js"></script>
    <script src="../../shared/js/components/screens.js"></script>
    <script src="../../shared/js/components/progress.js"></script>
    <script src="../../shared/js/components/feedback.js"></script>
    <script src="../../shared/js/components/dragdrop.js"></script>
    <script src="../../shared/js/components/results.js"></script>
    <script src="../../shared/js/components/mascot.js"></script>

    <!-- JS específico do jogo -->
    <script src="script.js"></script>
</body>
</html>
```

### JavaScript do Jogo (script.js)

```javascript
(function () {
    "use strict";

    // ========== CONFIGURAÇÃO ==========
    var TOTAL_PERGUNTAS = 8;
    var NIVEIS = {
        1: { max: 5 },   // subtrações com resultado até 5
        2: { max: 10 },  // subtrações com resultado até 10
        3: { max: 20 }   // subtrações com resultado até 20
    };

    // ========== ESTADO ==========
    var estado = {
        nivel: 1,
        perguntaAtual: 0,
        acertosPrimeira: 0,
        errouNesta: false,
        a: 0,
        b: 0,
        respondida: false,
        somLigado: true,
        erros: 0
    };

    // ========== INICIALIZAÇÃO ==========
    document.addEventListener("DOMContentLoaded", function () {
        // Carregar configuração da sessão
        var config = GameComponents.config.load();
        GameComponents.config.applyVisual(config);

        // Inicializar componentes
        GameComponents.screens.register([
            { id: "inicio", element: document.getElementById("tela-inicio") },
            { id: "jogo", element: document.getElementById("tela-jogo") },
            { id: "final", element: document.getElementById("tela-final") }
        ]);

        GameComponents.hud.init({
            totalQuestions: TOTAL_PERGUNTAS,
            showTimer: config.timer && config.timer.visible,
            showSound: true,
            onBack: function() { GameComponents.screens.back(); },
            onSoundToggle: function(ligado) { estado.somLigado = ligado; }
        });

        GameComponents.feedback.init(
            document.getElementById("feedback"),
            { mascot: "🐢" }
        );

        GameComponents.sound.init({
            enabled: config.audio ? config.audio.sfxEnabled : true
        });

        GameComponents.dragdrop.init({
            margin: 24,
            onDrop: function(data, target) {
                verificarResposta(data.value);
            }
        });

        // Renderizar níveis
        renderizarNiveis();
    });

    // ========== RENDERIZAÇÃO ==========
    function renderizarNiveis() {
        var container = document.getElementById("nivel-selector");
        var niveis = [
            { id: 1, nome: "Começando", desc: "Subtrações até 5", icone: "🌱" },
            { id: 2, nome: "Praticando", desc: "Subtrações até 10", icone: "🌿" },
            { id: 3, nome: "Avançando", desc: "Subtrações até 20", icone: "🌳" }
        ];

        container.innerHTML = niveis.map(function(n) {
            return '<button class="botao-nivel" data-nivel="' + n.id + '">' +
                '<span class="icone-nivel" aria-hidden="true">' + n.icone + '</span>' +
                '<span class="texto-nivel">' +
                '<strong>' + n.nome + '</strong>' +
                '<small>' + n.desc + '</small>' +
                '</span></button>';
        }).join("");

        container.querySelectorAll(".botao-nivel").forEach(function(btn) {
            btn.addEventListener("click", function() {
                comecarJogo(parseInt(btn.getAttribute("data-nivel")));
            });
        });
    }

    // ========== LÓGICA DO JOGO ==========
    function comecarJogo(nivel) {
        estado.nivel = nivel;
        estado.perguntaAtual = 0;
        estado.acertosPrimeira = 0;
        estado.erros = 0;

        GameComponents.screens.show("jogo");
        gerarPergunta();
    }

    function gerarPergunta() {
        var max = NIVEIS[estado.nivel].max;
        estado.b = sortear(1, max - 1);
        estado.a = sortear(estado.b, max); // a >= b para resultado não-negativo
        estado.respondida = false;
        estado.errouNesta = false;

        // Renderizar questão
        renderizarQuestao();

        // Atualizar HUD
        GameComponents.hud.updateProgress(estado.perguntaAtual, TOTAL_PERGUNTAS);

        // Limpar feedback
        GameComponents.feedback.clear();
    }

    function renderizarQuestao() {
        // ... lógica específica de renderização da subtração
    }

    function verificarResposta(valor) {
        var resultado = estado.a - estado.b;

        if (valor === resultado) {
            // Acertou!
            estado.respondida = true;
            if (!estado.errouNesta) {
                estado.acertosPrimeira++;
            }

            GameComponents.feedback.showSuccess();
            GameComponents.sound.playSuccess();

            document.getElementById("botao-proxima").classList.remove("escondido");
        } else {
            // Errou - acolher
            estado.errouNesta = true;
            estado.erros++;

            GameComponents.feedback.showSupport();
            GameComponents.sound.playSupport();

            // Desabilitar ficha errada
        }
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
        GameComponents.results.init(
            document.getElementById("results-container"),
            { mascot: "🐢", title: "Você terminou!", showStars: true }
        );

        GameComponents.results.show({
            hits: estado.acertosPrimeira,
            misses: estado.erros,
            total: TOTAL_PERGUNTAS,
            duration: calcularDuracao(),
            maxStreak: calcularMaxStreak()
        });

        GameComponents.results.setActions({
            playAgain: function() { comecarJogo(estado.nivel); },
            goHome: function() { GameComponents.screens.show("inicio"); }
        });

        GameComponents.screens.show("final");

        // Eniar resultado para o pai (se estiver em iframe)
        if (window.parent && window.parent !== window) {
            window.parent.postMessage({
                type: "GAME_FINISHED",
                gameId: "mat-game002",
                hits: estado.acertosPrimeira,
                misses: estado.erros,
                totalQuestions: TOTAL_PERGUNTAS,
                level: estado.nivel,
                duration: calcularDuracao(),
                skills: ["contagem", "subtracao", "raciocinio-logico"]
            }, "*");
        }
    }

    // ========== UTILITÁRIOS ==========
    function sortear(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function calcularDuracao() {
        // ... calcular tempo decorrido
        return "00:00";
    }

    function calcularMaxStreak() {
        // ... calcular maior sequência de acertos
        return 0;
    }
})();
```

---

## Vantagens da Abordagem

| Aspecto | Antes (Duplicado) | Depois (Componentes) |
|---------|-------------------|----------------------|
| **Código por jogo** | ~500-800 linhas | ~200-300 linhas |
| **CSS por jogo** | ~800+ linhas | ~100-200 linhas |
| **Tempo de desenvolvimento** | 1-2 semanas por jogo | 3-5 dias por jogo |
| **Consistência visual** | Variável | Garantida |
| **Manutenção** | Atualizar cada jogo | Atualizar componente uma vez |
| **Acessibilidade** | Implementar por jogo | Implementar uma vez no componente |

---

## Checklist de Componentes por Jogo

| Componente | Obrigatório | Matemática | Português |
|------------|-------------|------------|-----------|
| HUD | ✅ | ✅ | ✅ |
| Progresso | ✅ | ✅ | ✅ |
| Feedback | ✅ | ✅ | ✅ |
| Telas | ✅ | ✅ | ✅ |
| Som | ✅ | ✅ | ✅ |
| Drag-and-Drop | ⚠️ | ✅ | ⚠️ |
| Resultados | ✅ | ✅ | ✅ |
| Mascote | ✅ | 🐢 | 🦉 |
| Níveis | ✅ | ✅ | ✅ |

---

## Próximos Passos

1. Criar estrutura de pastas `games/shared/css/components/` e `games/shared/js/components/`
2. Implementar `hud.js` + `hud.css`
3. Implementar `progress.js` + `progress.css`
4. Implementar `feedback.js` + `feedback.css`
5. Implementar `screens.js` + `screens.css`
6. Implementar `sound.js` (expandir game-engine.js)
7. Implementar `dragdrop.js` (expandir game-engine.js)
8. Implementar `results.js` + `results.css`
9. Implementar `config.js`
10. Criar temas `matematica.css` e `portugues.css`
11. Criar novo jogo (game002 - Subtração) usando componentes
12. Comparar código do game001 (antigo) vs game002 (novo)
