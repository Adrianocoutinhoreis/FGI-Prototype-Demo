# Planejamento: Organização dos Jogos — Matemática e Português

**Data do planejamento:** 10 de Julho de 2026
**Versão:** 0.1 (Protótipo)

---

## Visão Geral

O projeto FGI terá jogos educativos nas disciplinas de **Matemática** e **Português**, organizados por pastas separadas com metadados detalhados para cada jogo.

---

## Estrutura de Pastas

```
games/
├── matematica/
│   ├── game001/                    # Jogo da Soma (já existe)
│   │   ├── index.html
│   │   ├── script.js
│   │   ├── style.css
│   │   └── manifest.json           # Metadados do jogo
│   │
│   ├── game002/                    # Jogo da Subtração
│   │   ├── index.html
│   │   ├── script.js
│   │   ├── style.css
│   │   └── manifest.json
│   │
│   ├── game003/                    # Jogo da Multiplicação
│   │   └── ...
│   │
│   ├── game004/                    # Jogo da Divisão
│   │   └── ...
│   │
│   ├── game005/                    # Jogo de Frações
│   │   └── ...
│   │
│   └── game006/                    # Jogo de Geometria
│       └── ...
│
├── portugues/
│   ├── game001/                    # Jogo de Soletração
│   │   ├── index.html
│   │   ├── script.js
│   │   ├── style.css
│   │   └── manifest.json
│   │
│   ├── game002/                    # Jogo de Completar Palavras
│   │   └── ...
│   │
│   ├── game003/                    # Jogo de Associação (imagem ↔ palavra)
│   │   └── ...
│   │
│   ├── game004/                    # Jogo de Leitura de Frases
│   │   └── ...
│   │
│   ├── game005/                    # Jogo de Ordernar Palavras
│   │   └── ...
│   │
│   ├── game006/                    # Jogo de Interpretação
│   │   └── ...
│   │
│   ├── game007/                    # Jogo de Criar Frases
│   │   └── ...
│   │
│   └── game008/                    # Jogo de Concordância
│       └── ...
│
└── shared/                         # Recursos compartilhados entre jogos
    ├── css/
    │   └── game-base.css           # Estilos base para todos os jogos
    ├── js/
    │   └── game-engine.js          # Funções compartilhadas (som, drag-drop, feedback)
    └── assets/
        ├── sounds/                 # Sons compartilhados
        └── mascotes/               # Imagens dos mascotes
```

---

## Metadados do Jogo (manifest.json)

Cada jogo terá um arquivo `manifest.json` com informações detalhadas:

```json
{
  "id": "mat-game001",
  "nome": "Jogo da Soma",
  "descricao": "Aprenda a somar arrastando números para o resultado correto",
  "disciplina": "matematica",
  "tipo": "aritmetica",
  "subtipo": "soma",
  "icone": "➕",
  "mascote": "🐢",
  "corTema": "#4CAF50",

  "nivelDificuldade": ["facil", "medio", "dificil"],
  "nivelMinimo": 1,
  "nivelMaximo": 3,

  "perfilCompativel": ["T", "T1", "T2", "T3", "TD", "DX", "DC", "DI"],
  "requisitosPrevios": [],
  "habilidades": ["contagem", "soma", "raciocinio-logico"],

  "tempoEstimado": {
    "facil": "5 min",
    "medio": "8 min",
    "dificil": "12 min"
  },

  "totalPerguntas": 8,
  "interacao": "drag-and-drop",
  "fallbackTeclado": true,
  "sonsProcedurais": true,

  "versao": "1.0.0",
  "autor": "FGI",
  "dataCriacao": "2026-07-10"
}
```

### Campos Explicados

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| `id` | Identificador único do jogo | `mat-game001` |
| `nome` | Nome exibido para o aluno | `Jogo da Soma` |
| `descricao` | Breve descrição | `Aprenda a somar...` |
| `disciplina` | `matematica` ou `portugues` | `matematica` |
| `tipo` | Categoria dentro da disciplina | `aritmetica`, `leitura`, `escrita` |
| `subtipo` | Subcategoria específica | `soma`, `subtracao`, `soletracao` |
| `icone` | Emoji/ícone para exibição | `➕` |
| `mascote` | Mascote do jogo | `🐢` |
| `corTema` | Cor principal do jogo | `#4CAF50` |
| `nivelDificuldade` | Níveis disponíveis | `["facil", "medio", "dificil"]` |
| `nivelMinimo` | Nível mínimo | `1` |
| `nivelMaximo` | Nível máximo | `3` |
| `perfilCompativel` | Perfis de apoio compatíveis | `["T", "T1", "T2"]` |
| `requisitosPrevios` | Jogos que devem ser feitos antes | `["mat-game001"]` |
| `habilidades` | Habilidades trabalhadas | `["contagem", "soma"]` |
| `tempoEstimado` | Tempo por nível | `{"facil": "5 min"}` |
| `totalPerguntas` | Quantidade de questões | `8` |
| `interacao` | Tipo de interação | `drag-and-drop`, `clique`, `teclado` |
| `fallbackTeclado` | Suporte a teclado | `true` |
| `sonsProcedurais` | Sons gerados no navegador | `true` |
| `versao` | Versão do jogo | `1.0.0` |
| `autor` | Autor/criador | `FGI` |
| `dataCriacao` | Data de criação | `2026-07-10` |

---

## Catálogo Central de Jogos

O sistema precisará de um catálogo central que lista todos os jogos disponíveis:

### games/catalog.js

```javascript
var GAME_CATALOG = {
  matematica: [
    {
      id: "mat-game001",
      nome: "Jogo da Soma",
      descricao: "Aprenda a somar",
      icone: "➕",
      caminho: "matematica/game001/",
      nivelMinimo: 1,
      nivelMaximo: 3,
      perfilCompativel: ["T", "T1", "T2", "T3", "TD", "DX", "DC", "DI"],
      habilidades: ["contagem", "soma"]
    },
    {
      id: "mat-game002",
      nome: "Jogo da Subtração",
      descricao: "Aprenda a subtrair",
      icone: "➖",
      caminho: "matematica/game002/",
      nivelMinimo: 1,
      nivelMaximo: 3,
      perfilCompativel: ["T", "T1", "T2", "T3", "TD", "DX", "DC", "DI"],
      habilidades: ["contagem", "subtracao"]
    },
    {
      id: "mat-game003",
      nome: "Jogo da Multiplicação",
      descricao: "Aprenda a multiplicar",
      icone: "✖️",
      caminho: "matematica/game003/",
      nivelMinimo: 1,
      nivelMaximo: 3,
      perfilCompativel: ["T", "T1", "T2", "TD"],
      habilidades: ["multiplicacao", "tabuada"]
    },
    {
      id: "mat-game004",
      nome: "Jogo da Divisão",
      descricao: "Aprenda a dividir",
      icone: "➗",
      caminho: "matematica/game004/",
      nivelMinimo: 1,
      nivelMaximo: 3,
      perfilCompativel: ["T", "T1", "T2", "TD"],
      habilidades: ["divisao", "raciocinio"]
    },
    {
      id: "mat-game005",
      nome: "Jogo de Frações",
      descricao: "Aprenda sobre frações",
      icone: "🔢",
      caminho: "matematica/game005/",
      nivelMinimo: 1,
      nivelMaximo: 3,
      perfilCompativel: ["T", "T1", "T2"],
      habilidades: ["fracoes", "representacao"]
    },
    {
      id: "mat-game006",
      nome: "Jogo de Geometria",
      descricao: "Aprenda sobre formas",
      icone: "🔷",
      caminho: "matematica/game006/",
      nivelMinimo: 1,
      nivelMaximo: 3,
      perfilCompativel: ["T", "T1", "T2", "T3", "TD", "DX", "DC", "DI"],
      habilidades: ["formas", "espacial"]
    }
  ],
  portugues: [
    {
      id: "port-game001",
      nome: "Jogo da Soletração",
      descricao: "Aprenda a soletrar",
      icone: "🔤",
      caminho: "portugues/game001/",
      nivelMinimo: 1,
      nivelMaximo: 3,
      perfilCompativel: ["T", "T1", "T2", "T3", "DX"],
      habilidades: ["consciencia-fonologica", "soletracao"]
    },
    {
      id: "port-game002",
      nome: "Completar Palavras",
      descricao: "Complete as palavras que faltam",
      icone: "✏️",
      caminho: "portugues/game002/",
      nivelMinimo: 1,
      nivelMaximo: 3,
      perfilCompativel: ["T", "T1", "T2", "DX"],
      habilidades: ["completar", "orthografia"]
    },
    {
      id: "port-game003",
      nome: "Associação (imagem ↔ palavra)",
      descricao: "Associe imagens às palavras",
      icone: "🖼️",
      caminho: "portugues/game003/",
      nivelMinimo: 1,
      nivelMaximo: 3,
      perfilCompativel: ["T", "T1", "T2", "T3", "TD", "DX", "DC", "DI"],
      habilidades: ["associacao", "reconhecimento"]
    },
    {
      id: "port-game004",
      nome: "Leitura de Frases",
      descricao: "Leia e entenda as frases",
      icone: "📖",
      caminho: "portugues/game004/",
      nivelMinimo: 1,
      nivelMaximo: 3,
      perfilCompativel: ["T", "T1", "T2", "DX"],
      habilidades: ["leitura", "fluencia"]
    },
    {
      id: "port-game005",
      nome: "Ordernar Palavras",
      descricao: "Organize as palavras para formar frases",
      icone: "📝",
      caminho: "portugues/game005/",
      nivelMinimo: 1,
      nivelMaximo: 3,
      perfilCompativel: ["T", "T1", "T2"],
      habilidades: ["ordem", "frase"]
    },
    {
      id: "port-game006",
      nome: "Interpretação",
      descricao: "Interprete textos e responda perguntas",
      icone: "❓",
      caminho: "portugues/game006/",
      nivelMinimo: 1,
      nivelMaximo: 3,
      perfilCompativel: ["T", "T1", "T2"],
      habilidades: ["interpretacao", "logica"]
    },
    {
      id: "port-game007",
      nome: "Criar Frases",
      descricao: "Crie suas próprias frases",
      icone: "✍️",
      caminho: "portugues/game007/",
      nivelMinimo: 1,
      nivelMaximo: 3,
      perfilCompativel: ["T", "T1", "T2"],
      habilidades: ["producao", "criatividade"]
    },
    {
      id: "port-game008",
      nome: "Concordância",
      descricao: "Pratique concordância nominal e verbal",
      icone: "✔️",
      caminho: "portugues/game008/",
      nivelMinimo: 1,
      nivelMaximo: 3,
      perfilCompativel: ["T", "T1", "T2"],
      habilidades: ["concordancia", "genero"]
    }
  ]
};
```

---

## Como o Professor Libera Jogos

### Tela de Configuração de Sessão (Professor)

```
┌─────────────────────────────────────────────────────────────┐
│  🧩 Configuração da Sessão                                 │
│                                                             │
│  Aluno: Lucas | Perfil: TEA Nível 1                        │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  📚 SELECIONE OS JOGOS                              │    │
│  │                                                     │    │
│  │  MATEMÁTICA                                         │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │ ☑️ ➕ Jogo da Soma                          │    │    │
│  │  │    Nível: 1-3 | Tempo: ~8 min              │    │    │
│  │  ├─────────────────────────────────────────────┤    │    │
│  │  │ ☐ ➖ Jogo da Subtração                      │    │    │
│  │  │    Nível: 1-3 | Tempo: ~8 min              │    │    │
│  │  ├─────────────────────────────────────────────┤    │    │
│  │  │ ☐ ✖️ Jogo da Multiplicação                  │    │    │
│  │  │    Nível: 1-3 | Tempo: ~10 min             │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  │                                                     │    │
│  │  PORTUGUÊS                                          │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │ ☑️ 🔤 Jogo da Soletração                    │    │    │
│  │  │    Nível: 1-3 | Tempo: ~6 min              │    │    │
│  │  ├─────────────────────────────────────────────┤    │    │
│  │  │ ☐ ✏️ Completar Palavras                     │    │    │
│  │  │    Nível: 1-3 | Tempo: ~7 min              │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  │                                                     │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                             │
│  [Voltar]                                    [Liberar Sessão]│
└─────────────────────────────────────────────────────────────┘
```

### Dashboard do Aluno — Jogos Liberados

```
┌─────────────────────────────────────────────────────┐
│  🧩 Olá Lucas!                                      │
│  Perfil: TEA Nível 1                                │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  📚 JOGOS LIBERADOS                        │    │
│  │                                             │    │
│  │  MATEMÁTICA                                 │    │
│  │  ┌─────────────┐                            │    │
│  │  │ ➕ Soma     │                            │    │
│  │  │ ⭐⭐⭐⭐     │                            │    │
│  │  │ [Jogar]     │                            │    │
│  │  └─────────────┘                            │    │
│  │                                             │    │
│  │  PORTUGUÊS                                  │    │
│  │  ┌─────────────┐                            │    │
│  │  │ 🔤 Soletração│                           │    │
│  │  │ ⭐⭐⭐⭐⭐    │                           │    │
│  │  │ [Jogar]     │                            │    │
│  │  └─────────────┘                            │    │
│  └─────────────────────────────────────────────┘    │
│                                                     │
│  ┌─────────────────────────────────────────────┐    │
│  │  🏆 MEU PROGRESSO                          │    │
│  │  Pontos: 1.250  Medalhas: 🥇🥈  Seq: 5 🔥  │    │
│  └─────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────┘
```

---

## Filtros de Descoberta

O catálogo permite filtros flexíveis:

```javascript
// Filtrar jogos por disciplina
function jogosPorDisciplina(disciplina) {
  return GAME_CATALOG[disciplina] || [];
}

// Filtrar jogos por perfil do aluno
function jogosPorPerfil(perfil) {
  var todos = [];
  Object.keys(GAME_CATALOG).forEach(function(disc) {
    GAME_CATALOG[disc].forEach(function(jogo) {
      if (jogo.perfilCompativel.indexOf(perfil) !== -1) {
        todos.push(jogo);
      }
    });
  });
  return todos;
}

// Filtrar jogos liberados pelo professor
function jogosLiberados(liberados) {
  var todos = [];
  Object.keys(GAME_CATALOG).forEach(function(disc) {
    GAME_CATALOG[disc].forEach(function(jogo) {
      if (liberados.indexOf(jogo.id) !== -1) {
        todos.push(jogo);
      }
    });
  });
  return todos;
}
```

---

## Mapeamento Completo de Jogos

### Matemática

| ID | Nome | Tipo | Nível | Perfil | Habilidades |
|----|------|------|-------|--------|-------------|
| `mat-game001` | Jogo da Soma | Aritmética | 1-3 | Todos | contagem, soma |
| `mat-game002` | Jogo da Subtração | Aritmética | 1-3 | Todos | contagem, subtracao |
| `mat-game003` | Jogo da Multiplicação | Aritmética | 1-3 | T, T1, T2, TD | multiplicacao, tabuada |
| `mat-game004` | Jogo da Divisão | Aritmética | 1-3 | T, T1, T2, TD | divisao, raciocinio |
| `mat-game005` | Jogo de Frações | Números | 1-3 | T, T1, T2 | fracoes, representacao |
| `mat-game006` | Jogo de Geometria | Formas | 1-3 | Todos | formas, espacial |

### Português

| ID | Nome | Tipo | Nível | Perfil | Habilidades |
|----|------|------|-------|--------|-------------|
| `port-game001` | Jogo da Soletração | Consciência Fonológica | 1-3 | T, T1, T2, T3, DX | soletracao, fonemas |
| `port-game002` | Completar Palavras | Vocabulário | 1-3 | T, T1, T2, DX | completar, orthografia |
| `port-game003` | Associação (imagem ↔ palavra) | Vocabulário | 1-3 | Todos | associacao, reconhecimento |
| `port-game004` | Leitura de Frases | Fluência | 1-3 | T, T1, T2, DX | leitura, fluencia |
| `port-game005` | Ordernar Palavras | Sintaxe | 1-3 | T, T1, T2 | ordem, frase |
| `port-game006` | Interpretação | Compreensão | 1-3 | T, T1, T2 | interpretacao, logica |
| `port-game007` | Criar Frases | Produção | 1-3 | T, T1, T2 | producao, criatividade |
| `port-game008` | Concordância | Gramática | 1-3 | T, T1, T2 | concordancia, genero |

---

## Padrão de Código do Jogo

### Estrutura HTML (todas as telas)

```html
<!-- Tela Início -->
<section id="tela-inicio" class="tela ativa">
  <div class="cartao cartao-inicio">
    <div class="mascote" aria-hidden="true">🐢</div>
    <h1>Jogo da Soma</h1>
    <p class="subtitulo">Instruções do jogo</p>
    <div class="escolha-nivel">
      <!-- Botões de nível -->
    </div>
  </div>
</section>

<!-- Tela Jogo -->
<section id="tela-jogo" class="tela">
  <header class="barra-topo">
    <!-- Voltar, progresso, som -->
  </header>
  <main class="cartao cartao-jogo">
    <!-- Instrução, área visual, opções, feedback, botão próxima -->
  </main>
</section>

<!-- Tela Final -->
<section id="tela-final" class="tela">
  <div class="cartao cartao-final">
    <!-- Resumo, estrelas, botões -->
  </div>
</section>
```

### Comunicação (postMessage)

```javascript
// Todos os jogos enviam resultado no final:
window.parent.postMessage({
  type: "GAME_FINISHED",
  gameId: "mat-game001",        // ID do jogo
  hits: 6,                      // Acertos de primeira
  misses: 2,                    // Erros (acolhidos)
  duration: "02:45",            // Duração
  level: 2,                     // Nível jogado
  skills: ["contagem", "soma"]  // Habilidades trabalhadas
}, "*");
```

### game-engine.js — Funções Compartilhadas

```javascript
// Funções que podem ser reutilizadas entre jogos:

var GameEngine = {
  // Sistema de som procedural
  som: {
    tocarTom: function(frequencia, duracao, atraso) { /* ... */ },
    somAcerto: function() { /* ... */ },
    somApoio: function() { /* ... */ }
  },

  // Sistema de drag-and-drop
  dragDrop: {
    iniciar: function(elemento, opcoes) { /* ... */ },
    verificarAlvo: function(evento, alvo) { /* ... */ }
  },

  // Feedback e frases
  feedback: {
    frasesAcerto: ["Muito bem!", "Isso mesmo!", "Você conseguiu!"],
    fraseApoio: "Quase! Tente outra vez. Você consegue!",
    mostrarAcerto: function(elemento) { /* ... */ },
    mostrarApoio: function(elemento) { /* ... */ }
  },

  // Progresso
  progresso: {
    desenhar: function(container, atual, total) { /* ... */ }
  },

  // Navegação entre telas
  telas: {
    mostrar: function(nome) { /* ... */ }
  },

  // Utilitários
  util: {
    sortear: function(min, max) { /* ... */ },
    embaralhar: function(lista) { /* ... */ }
  }
};
```

### game-base.css — Estilos Compartilhados

```css
/* Estilos base que todos os jogos herdam */

:root {
  --cor-primaria: #4CAF50;
  --cor-acerto: #22C55E;
  --cor-apoio: #F59E0B;
  --cor-fundo: #F8FAFC;
  --cor-texto: #1E293B;
  --raio-borda: 16px;
  --sombra-suave: 0 4px 12px rgba(0, 0, 0, 0.08);
}

/* Reset e base */
* { box-sizing: border-box; margin: 0; padding: 0; }
body { font-family: 'Inter', sans-serif; background: var(--cor-fundo); }

/* Telas */
.tela { display: none; min-height: 100vh; }
.tela.ativa { display: flex; align-items: center; justify-content: center; }

/* Cartões */
.cartao { background: white; border-radius: var(--raio-borda); box-shadow: var(--sombra-suave); padding: 32px; }

/* Botões */
.botao-principal { background: var(--cor-primaria); color: white; border: none; border-radius: 12px; padding: 16px 32px; font-size: 18px; cursor: pointer; }
.botao-secundario { background: transparent; color: var(--cor-texto); border: 2px solid #E2E8F0; border-radius: 12px; padding: 16px 32px; font-size: 18px; cursor: pointer; }

/* Feedback */
.feedback { padding: 16px; border-radius: 12px; font-size: 18px; font-weight: 600; text-align: center; min-height: 60px; }
.feedback.acerto { background: #DCFCE7; color: #166534; }
.feedback.apoio { background: #FEF3C7; color: #92400E; }

/* Acessibilidade */
@media (prefers-reduced-motion: reduce) {
  * { animation: none !important; transition: none !important; }
}

/* Responsivo */
@media (max-width: 600px) {
  .cartao { padding: 20px; margin: 16px; }
  .botao-principal, .botao-secundario { padding: 14px 24px; font-size: 16px; }
}
```

---

## Resumo da Organização

| Aspecto | Decisão |
|---------|---------|
| **Estrutura de pastas** | `games/matematica/` e `games/portugues/` |
| **Numeração** | `game001`, `game002`, etc. por disciplina |
| **Metadados** | `manifest.json` detalhado em cada jogo |
| **Catálogo central** | `games/catalog.js` com todos os jogos |
| **Descoberta** | Aluno vê apenas jogos liberados pelo professor |
| **Compartilhamento** | `games/shared/` com CSS, JS e assets comuns |
| **Padrão HTML** | 3 telas (início, jogo, final) em todos |
| **Comunicação** | `postMessage` com `GAME_FINISHED` + metadados |

---

## Próximos Passos

1. Criar estrutura de pastas `games/matematica/` e `games/portugues/`
2. Mover `games/game001/` para `games/matematica/game001/`
3. Criar `games/shared/` com estilos e funções compartilhadas
4. Criar `games/catalog.js` com o catálogo de jogos
5. Criar `manifest.json` para o jogo existente (game001)
6. Criar tela de seleção de jogos no `professor/sessao.html`
7. Criar dashboard do aluno com cards de jogos liberados
8. Desenvolver novos jogos seguindo o padrão estabelecido
