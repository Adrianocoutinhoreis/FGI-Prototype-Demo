# Planejamento: Configuração do Jogo (Professor → Jogo)

**Data do planejamento:** 10 de Julho de 2026
**Versão:** 0.1 (Protótipo)

---

## Visão Geral

O professor configura ~60 parâmetros técnicos para cada sessão de jogo. Essa configuração precisa ser transmitida do `sessao.html` até o `game001/script.js`, que irá aplicar as configurações na interface e comportamento do jogo.

---

## Situação Atual

```
PROFESSOR CONFIGURA (~60 parâmetros)
         │
         ▼
    sessao.html
         │
         │ Clica "Iniciar Jogo"
         ▼
    Converte para 4 parâmetros simples:
    ├── time = "2min" ou "none"
    ├── sound = "on" ou "off"
    ├── narrator = "on" ou "off"
    └── difficulty = "easy" | "medium" | "hard"
         │
         ▼
    tutorial.html → game.html
         │
         │ Monta URL do iframe
         ▼
    game001/index.html?nivel=2&som=on
         │
         │ Jogo lê apenas:
         ├── nivel (1, 2 ou 3)
         └── som (on ou off)
         │
         ▼
    ❌ PERDA DE 56 PARÂMETROS!
```

### Parâmetros que Estão Sendo Perdidos

| Categoria | Parâmetros Perdidos |
|-----------|---------------------|
| **Timer** | visible, duration, pausable, countDown |
| **Dificuldade** | autoAdjust, minLevel, maxLevel |
| **Áudio** | narrationEnabled, narrationSpeed, narrationRepeat, bgMusic, negativeSound |
| **Visual** | contrast, colorMode, fontSize, fontFamily, animations, pictograms |
| **Feedback** | type, positiveReinforcement, errorTolerance, hints, hintDelay, celebration |
| **Matemática** | mode, abacus, colorBlocks, numberLine, fingers, groupingSize |
| **Ajuda** | enabled, type, alwaysVisible, stepByStep |
| **Interação** | targetSize, dragEnabled, confirmation, inputMethod |
| **Gamificação** | enabled, points, medals, mode |
| **Interface** | focusMode, singleTask, predictable, simplifiedText, speed, distraction |

---

## Soluções Propostas

### Para o Protótipo (sem backend)

#### Opção 1: URL Estendida (Simples)

Passar mais parâmetros pela URL do iframe:

```
game001/index.html?
  nivel=2
  &som=on
  &contraste=high
  &fonte=lg
  &cor=pastel
  &pictogramas=on
  &ajuda=on
  &tolerancia=lenient
  &animacoes=off
```

| Vantagem | Desvantagem |
|----------|-------------|
| Simples de implementar | Limite de ~2000 caracteres na URL |
| Não precisa de storage | O jogo precisa mudar para ler todos |
| Funciona offline | Não escala bem |

---

#### Opção 2: localStorage (Recomendado para protótipo)

Salvar o GameConfig completo no `localStorage` e o jogo ler de lá:

```
PROFESSOR CONFIGURA
         │
         ▼
    sessao.html
         │
         │ Clica "Iniciar Jogo"
         ▼
    Salva no localStorage:
    {
      "fgi_session": {
        "config": { /* 60 parâmetros */ },
        "student": "Lucas",
        "profile": "T1"
      }
    }
         │
         ▼
    game.html carrega iframe:
    game001/index.html?session=abc123
         │
         ▼
    game001/script.js:
    var config = JSON.parse(localStorage.getItem("fgi_session")).config;
    // Aplica configuração completa
```

| Vantagem | Desvantagem |
|----------|-------------|
| Guarda todos os 60 parâmetros | Só funciona na mesma máquina |
| Simples de implementar | Não sincroniza entre dispositivos |
| Não precisa de backend | Dados persistem até limpar o cache |

---

#### Opção 3: Hash/ID + localStorage (Melhor para protótipo) ✅

Gerar um ID de sessão e salvar a configuração com esse ID:

```
PROFESSOR CONFIGURA
         │
         ▼
    sessao.html
         │
         │ Clica "Liberar Sessão"
         ▼
    Gera ID: "sess_4729"
    Salva no localStorage:
    {
      "fgi_sessions": {
        "sess_4729": {
          "config": { /* 60 parâmetros */ },
          "student": "Lucas",
          "profile": "T1",
          "createdAt": "2026-07-10T14:30:00"
        }
      }
    }
         │
         ▼
    Mostra código: 4729
         │
         ▼
    ALUNO INSERE CÓDIGO 4729
         │
         ▼
    aluno/dashboard.html lê:
    localStorage.getItem("fgi_sessions")["sess_4729"]
         │
         ▼
    aluno/game.html carrega:
    game001/index.html?session=sess_4729
         │
         ▼
    game001/script.js:
    var session = JSON.parse(localStorage.getItem("fgi_sessions"))[sessionId];
    var config = session.config;
    // Aplica configuração completa
```

| Vantagem | Desvantagem |
|----------|-------------|
| Guarda todos os parâmetros | Só funciona na mesma máquina/mesmo navegador |
| Permite múltiplas sessões | Precisa limpar sessões antigas |
| Código de acesso funciona | Não sincroniza entre dispositivos |
| Pronto para evoluir para backend | — |

---

### Para a Fase Final (com backend)

#### Opção A: API REST + Banco de Dados

```
PROFESSOR CONFIGURA
         │
         ▼
    POST /api/sessions
    {
      "config": { /* 60 parâmetros */ },
      "studentId": "lucas_001",
      "profileCode": "T1",
      "teacherId": "prof_001"
    }
         │
         ▼
    Resposta: { "sessionId": "sess_abc123", "code": "4729" }
         │
         ▼
    ALUNO INSERE CÓDIGO 4729
         │
         ▼
    GET /api/sessions/code/4729
         │
         ▼
    Resposta: { "config": { /* 60 parâmetros */ }, "student": "Lucas" }
         │
         ▼
    game001/index.html?session=sess_abc123
         │
         ▼
    GET /api/sessions/sess_abc123/config
         │
         ▼
    Jogo recebe configuração completa
```

| Vantagem | Desvantagem |
|----------|-------------|
| Sincroniza entre dispositivos | Precisa de servidor |
| Dados persistem no banco | Precisa de autenticação |
| Escala para milhares de usuários | Custo de infraestrutura |
| Permite relatórios avançados | Mais complexo de implementar |

---

#### Opção B: Firebase/Supabase (BaaS)

```
PROFESSOR CONFIGURA
         │
         ▼
    Salva no Firestore/Supabase:
    sessions/sess_abc123 {
      config: { /* 60 parâmetros */ },
      student: "Lucas",
      profile: "T1"
    }
         │
         ▼
    ALUNO ACESSA
         │
         ▼
    Lê do Firestore/Supabase:
    sessions/code/4729
         │
         ▼
    Jogo recebe configuração completa
```

| Vantagem | Desvantagem |
|----------|-------------|
| Sincroniza em tempo real | Depende de serviço externo |
| Sem backend próprio | Custo mensal |
| Fácil de implementar | Menos controle |

---

## Recomendação

| Fase | Solução | Motivo |
|------|---------|--------|
| **Protótipo** | Opção 3: Hash/ID + localStorage | Simples, offline, fluxo completo testável |
| **Fase Final** | Opção A: API REST + Banco | Sincroniza entre dispositivos, escala, persistente |

---

## Estrutura de Dados da Sessão

### localStorage (Protótipo)

```javascript
// Chave principal
localStorage.getItem("fgi_sessions")

// Estrutura
{
  "sess_4729": {
    "code": "4729",
    "student": "Lucas",
    "profile": "TEA Nível 1",
    "profileCode": "T1",
    "createdAt": "2026-07-10T14:30:00",
    "expiresAt": "2026-07-10T15:00:00",
    "active": true,
    "config": {
      "timer": {
        "enabled": true,
        "visible": false,
        "duration": 300,
        "pausable": true,
        "countDown": false
      },
      "difficulty": {
        "level": 2,
        "autoAdjust": false,
        "minLevel": 1,
        "maxLevel": 3
      },
      "audio": {
        "sfxEnabled": true,
        "narrationEnabled": true,
        "narrationSpeed": "slow",
        "narrationRepeatEnabled": true,
        "bgMusicEnabled": false,
        "negativeSound": false
      },
      "visual": {
        "contrast": "high",
        "colorMode": "pastel",
        "fontSize": "lg",
        "fontFamily": "default",
        "animationsEnabled": true,
        "pictogramsEnabled": true
      },
      "feedback": {
        "type": "visual",
        "positiveReinforcement": "high",
        "errorTolerance": "lenient",
        "showHints": true,
        "hintDelay": 10,
        "celebrationEffect": "simple"
      },
      "math": {
        "mode": "both",
        "useAbacus": true,
        "useColorBlocks": true,
        "useNumberLine": true,
        "useFingers": true,
        "groupingSize": 5
      },
      "help": {
        "enabled": true,
        "type": "both",
        "alwaysVisible": true,
        "stepByStep": true
      },
      "interaction": {
        "clickTargetSize": "lg",
        "dragEnabled": true,
        "confirmationRequired": false,
        "inputMethod": "both"
      },
      "gamification": {
        "enabled": true,
        "showPoints": true,
        "showMedals": true,
        "mode": "individual"
      },
      "ui": {
        "focusMode": true,
        "singleTaskMode": true,
        "predictableStructure": true,
        "simplifiedText": true,
        "gameSpeed": "slow",
        "distractionReduction": "low"
      }
    }
  }
}
```

### API Response (Fase Final)

```javascript
// GET /api/sessions/sess_4729
{
  "sessionId": "sess_4729",
  "code": "4729",
  "student": {
    "id": "lucas_001",
    "name": "Lucas",
    "turma": "1o Ano A"
  },
  "profile": {
    "code": "T1",
    "label": "TEA Nível 1"
  },
  "config": {
    // Mesma estrutura do protótipo
  },
  "createdAt": "2026-07-10T14:30:00",
  "expiresAt": "2026-07-10T15:00:00",
  "status": "active"
}
```

---

## Mudanças Necessárias no Código

### 1. `js/app.js` — Adicionar funções de sessão

```javascript
// Novas funções necessárias:
FGI.session = {
    // Gerar ID único
    generateId: function() {
        return "sess_" + Math.random().toString(36).substr(2, 9);
    },

    // Gerar código de 4 dígitos
    generateCode: function() {
        return Math.floor(1000 + Math.random() * 9000).toString();
    },

    // Criar sessão
    create: function(data) {
        var sessions = JSON.parse(localStorage.getItem("fgi_sessions") || "{}");
        var id = this.generateId();
        var code = this.generateCode();

        sessions[id] = {
            code: code,
            student: data.student,
            profile: data.profile,
            profileCode: data.profileCode,
            config: data.config,
            createdAt: new Date().toISOString(),
            expiresAt: new Date(Date.now() + 30 * 60 * 1000).toISOString(), // 30 min
            active: true
        };

        localStorage.setItem("fgi_sessions", JSON.stringify(sessions));
        return { id: id, code: code };
    },

    // Buscar por ID
    get: function(sessionId) {
        var sessions = JSON.parse(localStorage.getItem("fgi_sessions") || "{}");
        return sessions[sessionId] || null;
    },

    // Buscar por código
    getByCode: function(code) {
        var sessions = JSON.parse(localStorage.getItem("fgi_sessions") || "{}");
        for (var id in sessions) {
            if (sessions[id].code === code && sessions[id].active) {
                return { id: id, session: sessions[id] };
            }
        }
        return null;
    },

    // Validar se não expirou
    isValid: function(session) {
        return session && session.active && new Date(session.expiresAt) > new Date();
    },

    // Encerrar sessão
    destroy: function(sessionId) {
        var sessions = JSON.parse(localStorage.getItem("fgi_sessions") || "{}");
        if (sessions[sessionId]) {
            sessions[sessionId].active = false;
            localStorage.setItem("fgi_sessions", JSON.stringify(sessions));
        }
    },

    // Limpar sessões expiradas
    cleanExpired: function() {
        var sessions = JSON.parse(localStorage.getItem("fgi_sessions") || "{}");
        var now = new Date();
        for (var id in sessions) {
            if (new Date(sessions[id].expiresAt) < now) {
                delete sessions[id];
            }
        }
        localStorage.setItem("fgi_sessions", JSON.stringify(sessions));
    }
};
```

### 2. `professor/sessao.html` — Botão "Liberar Sessão"

```javascript
// Substituir "Iniciar Jogo" por:
document.getElementById("btn-liberar").addEventListener("click", function() {
    // Criar sessão com configuração completa
    var result = FGI.session.create({
        student: state.student,
        profile: state.profile,
        profileCode: profileCode,
        config: deepCopy(currentConfig) // 60 parâmetros
    });

    // Mostrar código na tela
    showCodeOnScreen(result.code, result.id);
});

function showCodeOnScreen(code, sessionId) {
    // Criar modal/overlay mostrando o código
    var overlay = document.createElement("div");
    overlay.className = "session-overlay";
    overlay.innerHTML = `
        <div class="session-code-card">
            <h2>Código da Sessão</h2>
            <div class="code-display">${code.split("").join(" ")}</div>
            <p>Aluno deve usar este código para acessar</p>
            <p class="code-hint">Sessão: ${sessionId}</p>
            <button onclick="this.closest('.session-overlay').remove()">Fechar</button>
        </div>
    `;
    document.body.appendChild(overlay);
}
```

### 3. `aluno/login.html` — Validar código

```javascript
// Adicionar lógica de validação:
document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    var code = document.getElementById("code-input").value;

    var result = FGI.session.getByCode(code);

    if (!result) {
        showError("Código inválido ou sessão expirada");
        return;
    }

    if (!FGI.session.isValid(result.session)) {
        showError("Sessão expirada. Peça ao professor um novo código");
        return;
    }

    // Redirecionar para dashboard com sessionId
    window.location.href = "dashboard.html?session=" + result.id;
});
```

### 4. `aluno/dashboard.html` — Ler sessão

```javascript
// No início do script:
var state = FGI.getState();
var sessionId = state.session;
var session = FGI.session.get(sessionId);

if (!session || !FGI.session.isValid(session)) {
    window.location.href = "login.html";
    return;
}

// Usar dados da sessão
document.getElementById("student-name").textContent = session.student;
document.getElementById("profile-name").textContent = session.profile;
```

### 5. `aluno/game.html` — Passar sessionId

```javascript
// Montar URL com sessionId:
var state = FGI.getState();
var sessionId = state.session;

if (!sessionId) {
    window.location.href = "login.html";
    return;
}

var iframeUrl = "../games/matematica/game001/index.html?session=" + sessionId;
```

### 6. `games/matematica/game001/script.js` — Ler configuração completa

```javascript
// Substituir leitura simples por:
(function () {
    "use strict";

    var urlParams = new URLSearchParams(window.location.search);
    var sessionId = urlParams.get("session");
    var config = null;

    // Tentar ler configuração da sessão
    if (sessionId && window.FGI && FGI.session) {
        var session = FGI.session.get(sessionId);
        if (session && FGI.session.isValid(session)) {
            config = session.config;
        }
    }

    // Fallback para parâmetros simples (compatibilidade)
    if (!config) {
        config = {
            difficulty: { level: parseInt(urlParams.get("nivel")) || 1 },
            audio: { sfxEnabled: urlParams.get("som") !== "off" },
            visual: { contrast: "normal", colorMode: "full", fontSize: "md" },
            feedback: { errorTolerance: "moderate" },
            // ... outros defaults
        };
    }

    // Aplicar configuração ao jogo
    function aplicarConfiguracao(config) {
        // Timer
        if (config.timer) {
            if (!config.timer.enabled) {
                // Ocultar cronômetro
            }
            if (config.timer.visible === false) {
                // Ocultar visual do timer
            }
        }

        // Dificuldade
        if (config.difficulty) {
            estado.nivel = config.difficulty.level;
        }

        // Áudio
        if (config.audio) {
            estado.somLigado = config.audio.sfxEnabled;
        }

        // Visual
        if (config.visual) {
            // Aplicar contraste
            if (config.visual.contrast === "high") {
                document.body.classList.add("high-contrast");
            }

            // Aplicar tamanho da fonte
            var fontSizes = { sm: "14px", md: "16px", lg: "20px", xl: "24px" };
            document.documentElement.style.fontSize = fontSizes[config.visual.fontSize] || "16px";

            // Aplicar modo de cor
            if (config.visual.colorMode === "pastel") {
                document.body.classList.add("pastel-mode");
            }

            // Desabilitar animações
            if (config.visual.animationsEnabled === false) {
                document.body.classList.add("no-animations");
            }

            // Mostrar pictogramas
            if (config.visual.pictogramsEnabled) {
                document.body.classList.add("show-pictograms");
            }
        }

        // Feedback
        if (config.feedback) {
            // Configurar tolerância a erros
            // Configurar dicas
            // Configurar celebração
        }

        // Interface
        if (config.ui) {
            // Modo foco
            if (config.ui.focusMode) {
                document.body.classList.add("focus-mode");
            }

            // Redução de distrações
            if (config.ui.distractionReduction === "high") {
                document.body.classList.add("minimal-ui");
            }
        }
    }

    // Chamar aplicação da configuração
    aplicarConfiguracao(config);

    // ... resto do script.js original
})();
```

---

## Fluxo Completo (Protótipo)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO COM PROTÓTIPO                          │
└─────────────────────────────────────────────────────────────────┘

1. PROFESSOR ACESSA sessao.html
   │
   ├── Seleciona: Lucas, TEA Nível 1
   ├── Configura: contraste=high, fonte=lg, som=on, etc.
   │
   └── Clica [Liberar Sessão]
            │
            ▼
       SISTEMA GERA:
       ├── SessionId: "sess_4729"
       ├── Code: "4729"
       └── Salva no localStorage:
           {
             "fgi_sessions": {
               "sess_4729": {
                 "code": "4729",
                 "config": { /* 60 parâmetros */ },
                 "student": "Lucas",
                 "profile": "TEA Nível 1",
                 "profileCode": "T1"
               }
             }
           }
            │
            ▼
       TELA MOSTRA:
       ┌─────────────────────────────┐
       │  Código da Sessão: 4 7 2 9 │
       │  (Aluno deve usar este código)│
       └─────────────────────────────┘

2. ALUNO ACESSA login.html
   │
   └── Insere código: 4729
            │
            ▼
       SISTEMA VALIDA:
       ├── Busca no localStorage: "fgi_sessions"
       ├── Encontra sessão com code "4729"
       ├── Verifica se não expirou
       └── Redireciona para dashboard.html?session=sess_4729

3. ALUNO ACESSA dashboard.html
   │
   ├── Lê sessão do localStorage
   ├── Mostra: "Olá Lucas! Perfil: TEA Nível 1"
   ├── Lista jogos compatíveis com o perfil
   │
   └── Clica [Jogar] no Jogo da Soma
            │
            ▼
       Redireciona para:
       game.html?session=sess_4729

4. ALUNO ACESSA game.html
   │
   ├── Lê sessão do localStorage
   ├── Monta URL do iframe:
   │   game001/index.html?session=sess_4729
   │
   └── Iframe carrega o jogo
            │
            ▼
5. JOGO (game001/script.js)
   │
   ├── Lê sessionId da URL
   ├── Busca sessão no localStorage
   ├── Extrai config completa (60 parâmetros)
   │
   └── Aplica configuração:
       ├── nivel = config.difficulty.level
       ├── som = config.audio.sfxEnabled
       ├── contraste = config.visual.contrast
       ├── fonte = config.visual.fontSize
       ├── cor = config.visual.colorMode
       ├── pictogramas = config.visual.pictogramsEnabled
       ├── tolerancia = config.feedback.errorTolerance
       ├── ajuda = config.help.enabled
       └── ... (demais parâmetros)

6. JOGO FINALIZA
   │
   ├── Envia postMessage para game.html:
   │   { type: "GAME_FINISHED", hits: 6, misses: 2, duration: "02:45" }
   │
   └── game.html redireciona para:
       resultado.html?session=sess_4729&hits=6&misses=2&duration=02:45

7. PROFESSOR ACESSA resultado.html
   │
   ├── Lê sessão do localStorage
   ├── Mostra relatório completo com:
   │   ├── Dados do aluno
   │   ├── Configuração utilizada
   │   ├── Métricas de performance
   │   └── Insights inteligentes
   │
   └── Pode comparar com outras sessões
```

---

## Fluxo Completo (Fase Final)

```
┌─────────────────────────────────────────────────────────────────┐
│                    FLUXO COM BACKEND                            │
└─────────────────────────────────────────────────────────────────┘

1. PROFESSOR ACESSA sessao.html
   │
   ├── Seleciona: Lucas, TEA Nível 1
   ├── Configura parâmetros
   │
   └── Clica [Liberar Sessão]
            │
            ▼
       POST /api/sessions
       {
         "config": { /* 60 parâmetros */ },
         "studentId": "lucas_001",
         "profileCode": "T1",
         "teacherId": "prof_001"
       }
            │
            ▼
       Resposta:
       {
         "sessionId": "sess_abc123",
         "code": "4729",
         "expiresAt": "2026-07-10T15:00:00"
       }
            │
            ▼
       TELA MOSTRA: Código 4729

2. ALUNO INSERE CÓDIGO 4729
   │
   ▼
   GET /api/sessions/code/4729
            │
            ▼
   Resposta:
   {
     "sessionId": "sess_abc123",
     "config": { /* 60 parâmetros */ },
     "student": { "name": "Lucas", "profile": "T1" }
   }
            │
            ▼
   Redireciona para:
   dashboard.html?session=sess_abc123

3. ALUNO ACESSA game.html
   │
   ▼
   GET /api/sessions/sess_abc123/config
            │
            ▼
   Recebe config completa
            │
            ▼
   Monta iframe:
   game001/index.html?session=sess_abc123

4. JOGO (game001/script.js)
   │
   ▼
   GET /api/sessions/sess_abc123/config
            │
            ▼
   Recebe e aplica configuração completa

5. JOGO FINALIZA
   │
   ▼
   POST /api/sessions/sess_abc123/results
   {
     "hits": 6,
     "misses": 2,
     "duration": "02:45"
   }
            │
            ▼
   Salva no banco de dados
   Atualiza dashboard do professor em tempo real
```

---

## Resumo das Entregas

### Protótipo (localStorage)

| Arquivo | Mudança | Prioridade |
|---------|---------|------------|
| `js/app.js` | Adicionar `FGI.session` com funções create, get, getByCode, isValid, destroy | Alta |
| `professor/sessao.html` | Substituir "Iniciar Jogo" por "Liberar Sessão" com geração de código | Alta |
| `aluno/login.html` | Validar código contra localStorage | Alta |
| `aluno/dashboard.html` | Ler sessão do localStorage | Alta |
| `aluno/game.html` | Passar sessionId na URL do iframe | Alta |
| `games/matematica/game001/script.js` | Ler config completa do localStorage e aplicar | Alta |

### Fase Final (API REST)

| Componente | Tecnologia | Prioridade |
|------------|------------|------------|
| Backend API | Node.js/Express ou Python/FastAPI | Alta |
| Banco de dados | PostgreSQL ou MongoDB | Alta |
| Autenticação | JWT ou Session-based | Alta |
| Endpoints | POST /sessions, GET /sessions/:id, GET /sessions/code/:code | Alta |
| Real-time | WebSocket ou Server-Sent Events | Média |

---

## Próximos Passos

1. Implementar `FGI.session` em `js/app.js`
2. Modificar `professor/sessao.html` para gerar código
3. Modificar `aluno/login.html` para validar código
4. Modificar `aluno/dashboard.html` para ler sessão
5. Modificar `aluno/game.html` para passar sessionId
6. Modificar `game001/script.js` para ler config completa
7. Testar fluxo completo: Login → Config → Código → Login Aluno → Jogo com config
