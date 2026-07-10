# Planejamento: Sessão Professor × Sessão Aluno

**Data do planejamento:** 10 de Julho de 2026
**Versão:** 0.1 (Protótipo)

---

## Visão Geral

Dividir o projeto FGI em duas   

- **Sessão Professor:** Configuração de sessões, acompanhamento de alunos, relatórios
- **Sessão Aluno:** Acesso aos jogos, progresso pessoal, gamificação

Ambas as sessões são acessadas por meio de uma **tela de login inicial** que separia os perfis de usuário.

---

## Fluxo Geral com Login

```
┌─────────────────────────────────────────────────┐
│              TELA INICIAL (LOGIN)               │
│                                                 │
│    ┌─────────────┐       ┌─────────────┐        │
│    │  PROFESSOR  │       │   ALUNO     │        │
│    │  🔐 Senha   │       │  🔢 Código   │        │
│    └──────┬──────┘       └──────┬──────┘        │
└───────────┼─────────────────────┼───────────────┘
            │                     │
            ▼                     ▼
┌───────────────────┐   ┌───────────────────┐
│  DASHBOARD PROF   │   │  DASHBOARD ALUNO  │
│  - Novo Atendimento│   │  - Jogos do Perfil│
│  - Meus Alunos    │   │  - Progresso      │
│  - Relatórios     │   │  - Medalhas       │
└───────────────────┘   └───────────────────┘
```

---

## Como Funciona a Conexão Professor → Aluno

**Cenário:** Professor configura uma sessão no tablet dele. Aluno entra no tablet dele com código de 4 dígitos.

```
PROFESSOR (tablet/PC)                    ALUNO (tablet/celular)
         │                                        │
    1. Login com senha                           │
         │                                        │
    2. Seleciona aluno: "Lucas"                  │
    3. Seleciona perfil: "TEA Nível 1"           │
    4. Configura parâmetros                      │
         │                                        │
    5. Clica "Liberar Sessão"                    │
         │                                        │
    6. Gera código: 4 7 2 9 ──────────────→  7. Login com código 4729
                                               │
                                          8. Vê dashboard:
                                             "Olá Lucas! 🧩"
                                             Jogos disponíveis:
                                             - Jogo da Soma ⭐
                                             - (futuros jogos)
                                               │
                                          9. Seleciona jogo
                                               │
                                         10. Entra no jogo
```

---

## Fluxo Detalhado do Professor

```
LOGIN (senha fixa)
     │
     ▼
DASHBOARD PROFESSOR
     │
     ├── [Novo Atendimento] → TELA DE SESSÃO
     │        │
     │        ├── Seleciona Turma
     │        ├── Seleciona Aluno (cascata)
     │        ├── Seleciona Perfil de Apoio
     │        ├── Configura parâmetros (~60 params)
     │        │
     │        └── [Liberar Sessão] → GERA CÓDIGO 4 DÍGITOS
     │                                  │
     │                                  ├── Código aparece na tela
     │                                  ├── QR Code opcional
     │                                  └── Aluno entra com esse código
     │
     ├── [Meus Alunos] → HISTÓRICO
     │        │
     │        ├── Lista de alunos por turma
     │        ├── Progresso por aluno
     │        └── Última sessão de cada aluno
     │
     └── [Relatórios] → BI DASHBOARD
              │
              ├── Aproveitamento da turma
              ├── Comparativo entre alunos
              └── Exportar dados (JSON)
```

---

## Fluxo Detalhado do Aluno

```
LOGIN (código 4 dígitos)
     │
     ▼
DASHBOARD ALUNO
     │
     ├── Saudação personalizada: "Olá Lucas! 🧩"
     │
     ├── JOGOS DISPONÍVEIS (baseado no perfil)
     │        │
     │        ├── Card: Jogo da Soma
     │        │   - Ícone 🎮
     │        │   - Última nota: ⭐⭐⭐⭐
     │        │   - [Jogar]
     │        │
     │        └── (futuros jogos aparecerão aqui)
     │
     ├── MEU PROGRESSO
     │        │
     │        ├── Pontos acumulados: 1.250 pts
     │        ├── Medalhas conquistadas: 🥇🥈🥉
     │        ├── Sequência de acertos: 5 🔥
     │        └── Nível atual: Estudante
     │
     └── [Sair] → volta para tela de login
```

---

## Estrutura de Pastas Proposta

```
TEA_ANTIGRAVITY/
├── index.html                     # TELA DE LOGIN (seleciona professor/aluno)
│
├── shared/                        # Recursos compartilhados
│   ├── css/
│   │   ├── style.css              # Design system global (já existe)
│   │   ├── login.css              # Estilos da tela de login
│   │   ├── professor.css          # Estilos específicos do professor
│   │   └── aluno.css              # Estilos específicos do aluno
│   ├── js/
│   │   ├── app.js                 # Namespace FGI (já existe, expandir)
│   │   ├── auth.js                # Lógica de autenticação
│   │   └── shared-state.js        # Estado compartilhado via URL
│   └── assets/
│       └── fonts/                 # Fontes locais (opcional)
│
├── professor/                     # SESSÃO DO PROFESSOR
│   ├── dashboard.html             # Dashboard do professor
│   ├── sessao.html                # Tela de configuração de sessão
│   ├── historico.html             # Histórico de alunos
│   └── relatorios.html            # BI Dashboard
│
├── aluno/                         # SESSÃO DO ALUNO
│   ├── dashboard.html             # Dashboard do aluno
│   ├── progresso.html             # Progresso e medalhas
│   └── sala-espera.html           # Aguardando liberação (opcional)
│
├── games/                         # Jogos (permanece igual)
│   └── game001/
│       ├── index.html
│       ├── script.js
│       └── style.css
│
├── pages/                         # Páginas atuais (migrar para professor/)
│   ├── config.html                # → professor/sessao.html
│   ├── tutorial.html              # → manter ou integrar ao jogo
│   ├── game.html                  # → manter (wrapper do jogo)
│   ├── result.html                # → professor/resultado.html ou aluno/
│   └── historico.html             # → professor/historico.html
│
├── configurador/                  # Ferramenta independente (manter)
│   └── FGI_Configurador.html
│
└── md/                            # Documentação (manter)
    └── FGI.md
```

---

## Sistema de Login

### Tela de Login

```
┌─────────────────────────────────┐
│         🧩 FGI                  │
│    Framework de Jogos Inclusivos│
│                                 │
│      ┌─────────────────┐        │
│      │  👨‍🏫 PROFESSOR    │        │
│      │                 │        │
│      │  Senha: [____]  │        │
│      │                 │        │
│      │  [Entrar]       │        │
│      └─────────────────┘        │
│                                 │
│      ┌─────────────────┐        │
│      │  👦 ALUNO        │        │
│      │                 │        │
│      │  Código: [____] │        │
│      │                 │        │
│      │  [Entrar]       │        │
│      └─────────────────┘        │
│                                 │
└─────────────────────────────────┘
```

### Regras de Autenticação

| Usuário | Método | Exemplo | Validade |
|---------|--------|---------|----------|
| Professor | Senha fixa | `1234` ou `prof2026` | Sem expiração |
| Aluno | Código de 4 dígitos | `4729` | 30 minutos ou até professor encerrar sessão |

### Como o Código Funciona

1. Professor configura sessão → clica "Liberar Sessão"
2. Sistema gera código de 4 dígitos (ex: `4729`)
3. Código aparece na tela do professor + QR Code (opcional)
4. Aluno abre o app no tablet → insere `4729`
5. Sistema valida:
   - Código existe?
   - Não expirou?
   - Sessão ainda está ativa?
6. Se válido → redireciona para dashboard do aluno com dados da sessão

---

## Dados Compartilhados entre Sessões

| Dado | Professor define | Aluno recebe |
|------|------------------|--------------|
| Nome do aluno | ✅ (seleciona) | Exibe no dashboard |
| Perfil de apoio | ✅ (seleciona) | Define quais jogos aparecem |
| Parâmetros do jogo | ✅ (configura) | Joga com essas configurações |
| Código de acesso | ✅ (gera) | Usa para entrar |
| Resultados do jogo | — | ✅ (gera) | Professor vê nos relatórios |

---

## Comunicação entre Sessões (Sem Backend)

Como o projeto não usa backend, a comunicação será via:

### Opção A: URL compartilhada (atual)

- Professor compartilha link com código
- Ex: `aluno/dashboard.html?code=4729`

### Opção B: Código de 4 dígitos + localStorage

- Professor salva sessão no `localStorage`
- Aluno insere código → busca no `localStorage`
- Funciona na mesma rede (Wi-Fi da escola)

### Opção C (recomendada para protótipo): Código na URL

- Professor gera: `aluno/dashboard.html?c=4729&s=Lucas&p=T1`
- Aluno insere código → sistema valida e redireciona
- Simples, sem backend, funciona no protótipo

---

## Páginas a Criar/Modificar

### Novas páginas

| Página | Descrição | Prioridade |
|--------|-----------|------------|
| `index.html` (modificado) | Tela de login com dois botões | Alta |
| `shared/js/auth.js` | Lógica de autenticação e código | Alta |
| `professor/dashboard.html` | Dashboard do professor | Alta |
| `professor/sessao.html` | Configuração de sessão + geração de código | Alta |
| `aluno/dashboard.html` | Dashboard do aluno com jogos | Alta |
| `aluno/sala-espera.html` | Tela de espera (opcional) | Baixa |
| `shared/css/login.css` | Estilos da tela de login | Alta |
| `shared/css/professor.css` | Estilos específicos do professor | Média |
| `shared/css/aluno.css` | Estilos específicos do aluno | Média |

### Páginas existentes a modificar

| Página | Mudança | Prioridade |
|--------|---------|------------|
| `pages/config.html` | Mover para `professor/sessao.html`, adicionar botão "Liberar Sessão" | Alta |
| `pages/game.html` | Adaptar para receber código de sessão | Alta |
| `pages/result.html` | Dividir: professor vê relatório completo, aluno vê resumo | Média |
| `js/app.js` | Expandir para suportar autenticação e sessão | Alta |

---

## Fluxo Completo (User Journey)

```
┌─────────────────────────────────────────────────────────────┐
│                    FLUXO COMPLETO                           │
└─────────────────────────────────────────────────────────────┘

1. ABRE O APP → TELA DE LOGIN
   │
   ├── Professor clica "Professor" → entra com senha
   │        │
   │        ▼
   │   DASHBOARD PROFESSOR
   │        │
   │        ├── [Novo Atendimento]
   │        │        │
   │        │        ▼
   │        │   SESSÃO DE ATENDIMENTO
   │        │        │
   │        │        ├── Seleciona: Turma 1ºA
   │        │        ├── Seleciona: Aluno Lucas
   │        │        ├── Seleciona: Perfil TEA Nível 1
   │        │        ├── Configura parâmetros
   │        │        │
   │        │        └── [Liberar Sessão]
   │        │                 │
   │        │                 ▼
   │        │            CÓDIGO: 4729
   │        │            (aparece na tela)
   │        │
   │        ├── [Meus Alunos] → vê progresso
   │        └── [Relatórios] → vê BI
   │
   └── Aluno clica "Aluno" → entra com código 4729
            │
            ▼
       DASHBOARD ALUNO
            │
            ├── "Olá Lucas! 🧩"
            ├── Perfil: TEA Nível 1
            │
            ├── JOGOS DISPONÍVEIS:
            │        │
            │        └── 🎮 Jogo da Soma
            │             - Última nota: ⭐⭐⭐⭐
            │             - [Jogar]
            │
            ├── MEU PROGRESSO:
            │        ├── Pontos: 1.250
            │        ├── Medalhas: 🥇🥈🥉
            │        └── Sequência: 5 🔥
            │
            └── [Sair]
```

---

## Resumo das Entregas para o Protótipo

| Fase | O que fazer | Esforço |
|------|-------------|---------|
| **1. Tela de Login** | Criar `index.html` com dois botões (Professor/Aluno) | Baixo |
| **2. Auth.js** | Lógica de senha do professor + validação de código | Médio |
| **3. Dashboard Professor** | Migrar cards existentes + adicionar "Liberar Sessão" | Médio |
| **4. Geração de Código** | Botão que gera código 4 dígitos e mostra na tela | Baixo |
| **5. Dashboard Aluno** | Cards de jogos + progresso + medalhas | Médio |
| **6. Conexão via URL** | Professor passa dados do aluno pela URL | Baixo |
| **7. Testar fluxo completo** | Login → Config → Código → Login Aluno → Jogar | Baixo |

---

## Especificações Técnicas

### auth.js — Funções Principais

```javascript
// Funções que o auth.js deve implementar:

FGI.auth = {
    // Senha do professor (fixa no protótipo)
    PROFESSOR_PASSWORD: "1234",

    // Gerar código de 4 dígitos
    generateCode: function() { /* ... */ },

    // Validar código de aluno
    validateCode: function(code) { /* ... */ },

    // Salvar sessão ativa
    saveSession: function(code, sessionData) { /* ... */ },

    // Buscar sessão por código
    getSession: function(code) { /* ... */ },

    // Encerrar sessão
    endSession: function(code) { /* ... */ },

    // Login do professor
    loginProfessor: function(password) { /* ... */ },

    // Login do aluno
    loginAluno: function(code) { /* ... */ }
};
```

### Estrutura de Dados da Sessão

```javascript
// Objeto de sessão que o professor gera:
{
    code: "4729",                    // Código de 4 dígitos
    student: "Lucas",                // Nome do aluno
    profile: "TEA Nível 1",          // Perfil de apoio
    profileCode: "T1",               // Código do perfil (T, T1, T2, T3, TD, DX, DC, DI)
    turma: "1º Ano A",               // Turma
    gameConfig: {                    // Configuração do jogo (~60 params)
        timer: { enabled: true, visible: false, duration: 300, ... },
        difficulty: { level: 2, ... },
        audio: { sfxEnabled: true, narrationEnabled: true, ... },
        visual: { contrast: "high", colorMode: "pastel", ... },
        // ... mais 6 grupos de parâmetros
    },
    createdAt: "2026-07-10T14:30:00", // Data de criação
    expiresAt: "2026-07-10T15:00:00", // Expiração (30 min)
    active: true                     // Sessão ativa
}
```

### localStorage — Estrutura Proposta

```javascript
// Chaves no localStorage:
localStorage.setItem("fgi_sessions", JSON.stringify({
    "4729": { /* dados da sessão */ },
    "8312": { /* dados de outra sessão */ }
}));

// Ou Simplificado para protótipo:
localStorage.setItem("fgi_active_session", JSON.stringify({
    code: "4729",
    student: "Lucas",
    profile: "TEA Nível 1",
    // ... resto dos dados
}));
```

---

## Considerações para o Protótipo

1. **Sem backend:** Tudo funciona via `localStorage` e URL params
2. **Mesma rede:** Para o protótipo, professor e aluno devem estar na mesma rede Wi-Fi
3. **Código único:** Apenas um aluno pode entrar com o mesmo código por vez
4. **Sessão única:** Para simplificar, apenas uma sessão ativa por vez
5. **Dados fictícios:** Alunos, turmas e perfis continuam sendo simulados
6. **Mobile-first:** Dashboard do aluno otimizado para tablet/celular

---

## Próximos Passos

1. Criar tela de login (`index.html` modificado)
2. Implementar `auth.js` com lógica de código
3. Migrar dashboard do professor para `professor/dashboard.html`
4. Criar `professor/sessao.html` com botão "Liberar Sessão"
5. Criar `aluno/dashboard.html` com cards de jogos
6. Testar fluxo completo: Login → Config → Código → Login Aluno → Jogar
