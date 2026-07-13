# Planejamento: Propagação de Configuração Visual para Jogos

## Índice

1. [Visão Geral](#visão-geral)
2. [Situação Atual](#situação-atual)
3. [Problema](#problema)
4. [Objetivo](#objetivo)
5. [Parâmetros Visuais](#parâmetros-visuais)
6. [Estratégia: CSS Variables + Data Attributes](#estratégia-css-variables--data-attributes)
7. [Fluxo Completo](#fluxo-completo)
8. [Arquitetura de Arquivos](#arquitetura-de-arquivos)
9. [Responsabilidades por Camada](#responsabilidades-por-camada)
10. [Implementação por Fase](#implementação-por-fase)
11. [Exemplos de Uso](#exemplos-de-uso)
12. [Compatibilidade com Jogos Existentes](#compatibilidade-com-jogos-existentes)
13. [Referências](#referências)

---

## Visão Geral

O FGI (Framework de Jogos Inclusivos) precisa propagar as configurações visuais definidas pelo professor na tela de configuração (`sessao.html`) até os jogos executados pelo aluno. Cada perfil de apoio (TEA Nível 1, 2, 3, TDAH, Dislexia) possui uma configuração visual padrão que impacta diretamente a experiência do aluno.

---

## Situação Atual

### Fluxo de Configuração

```
Professor (sessao.html)
    ↓ monta GameConfig completo
localStorage (fgi_config_{aluno})
    ↓ salva objeto com todos os grupos
Aluno (dashboard.html)
    ↓ lê config, extrai time/sound/narrator/difficulty
URL → tutorial.html → game.html
    ↓ passa apenas nivel e som ao iframe
Jogo (ex: soma/script.js)
    ↓ lê ?nivel=&som=
Execução com configuração parcial
```

### O que funciona

| Camada | Status |
|---|---|
| `sessao.html` — montagem do GameConfig | ✅ |
| `localStorage` — persistência por aluno | ✅ |
| `aluno/dashboard.html` — leitura da config | ✅ |
| `catalog.js` — mapeamento de jogos | ✅ |

### O que NÃO funciona

| Camada | Problema |
|---|---|
| `aluno/dashboard.html` → URL | Passa apenas 4 campos simplificados |
| `aluno/game.html` → iframe | Recebe apenas `nivel` e `som` |
| Jogos | Ignoram visual, contraste, fonte, animações |

---

## Problema

O `GameConfig` completo é salvo no `localStorage`, mas **se perde no caminho** até os jogos. As configurações visuais — que são críticas para alunos com TEA — nunca chegam aos jogos.

**Exemplo concreto:** Um aluno TEA Nível 3 tem `colorMode: "monochrome"` e `animationsEnabled: false` configurados. Ao jogar, ele recebe cores vibrantes e animações — exatamente o oposto do que precisa.

---

## Objetivo

Garantir que toda configuração visual definida pelo professor seja aplicada automaticamente a **qualquer jogo** do catálogo, sem necessidade de modificar o código de cada jogo individualmente.

---

## Parâmetros Visuais

### Grupo `visual` do GameConfig

| Parâmetro | Tipo | Valores | Efeito Esperado |
|---|---|---|---|
| `contrast` | select | `normal`, `high`, `inverted` | Paleta de cores de alto contraste ou invertida |
| `colorMode` | select | `full`, `pastel`, `monochrome`, `reduced` | Modo de cores do jogo |
| `fontSize` | select | `sm`, `md`, `lg`, `xl` | Tamanho da fonte base |
| `fontFamily` | select | `default`, `dyslexic` | Família tipográfica (OpenDyslexic) |
| `animationsEnabled` | bool | `true` / `false` | Liga/desliga animações |
| `pictogramsEnabled` | bool | `true` / `false` | Mostra/esconde pictogramas de apoio |

### Grupo `ui` do GameConfig

| Parâmetro | Tipo | Valores | Efeito Esperado |
|---|---|---|---|
| `focusMode` | bool | `true` / `false` | Remove decorações não essenciais |
| `singleTaskMode` | bool | `true` / `false` | Um elemento de interação por vez |
| `predictableStructure` | bool | `true` / `false` | Layout fixo, sem surpresas visuais |
| `simplifiedText` | bool | `true` / `false` | Enunciados simplificados |
| `gameSpeed` | select | `slow`, `normal`, `fast` | Ritmo geral do jogo |
| `distractionReduction` | select | `none`, `low`, `high` | Redução de elementos secundários |

### Presets por Perfil

| Perfil | colorMode | contrast | fontSize | animationsEnabled | focusMode |
|---|---|---|---|---|---|
| T (Típico) | full | normal | md | true | false |
| T1 (TEA Nível 1) | pastel | high | lg | true | true |
| T2 (TEA Nível 2) | pastel | high | xl | false | true |
| T3 (TEA Nível 3) | **monochrome** | high | xl | **false** | true |
| TD (TDAH) | full | normal | md | true | false |
| DX (Dislexia) | full | normal | xl | true | false |

---

## Estratégia: CSS Variables + Data Attributes

### Por que essa abordagem?

1. **Não modifica jogos individualmente** — regras CSS globais aplicam automaticamente
2. **Escalável** — novo jogo herda suporte sem código extra
3. **Performático** — CSS é resolvido pelo browser, sem JS desnecessário
4. **Flexível** — cada jogo pode sobrescrever se precisar de comportamento especial

### Como funciona

```
1. game.html lê GameConfig do localStorage
2. game.html carrega iframe do jogo
3. game.html detecta onload do iframe
4. game.html injeta data attributes no <html> do jogo
5. CSS global (game-themes.css) aplica estilos baseado nos data attributes
6. JS do jogo lê config via config-adapter.js (quando necessário)
```

---

## Fluxo Completo

```
┌─────────────────────────────────────────────────────────────┐
│                     PROFESSOR                                │
│  sessao.html                                                 │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Monta GameConfig com todos os grupos:               │    │
│  │ timer, difficulty, audio, visual, feedback,         │    │
│  │ math, help, interaction, gamification, ui           │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│  localStorage.setItem("fgi_config_Lucas", JSON.stringify()) │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                      ALUNO                                   │
│  dashboard.html                                              │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ Lê fgi_config_Lucas do localStorage                 │    │
│  │ Monta URL com gameConfig (JSON em base64)           │    │
│  └─────────────────────────────────────────────────────┘    │
│                          ↓                                   │
│  tutorial.html?config=eyJ2aXN1YSI6ey...                     │
│                          ↓                                   │
│  game.html?config=eyJ2aXN1YSI6ey...                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ 1. Decodifica gameConfig da URL                     │    │
│  │ 2. Monta URL do iframe: games/matematica/soma/      │    │
│  │ 3. Aguarda onload do iframe                         │    │
│  │ 4. Injeta data attributes no <html> do jogo:        │    │
│  │    <html data-contrast="high"                       │    │
│  │         data-color-mode="monochrome"                │    │
│  │         data-font-size="xl"                         │    │
│  │         data-font-family="dyslexic"                 │    │
│  │         data-animations="disabled"                  │    │
│  │         data-pictograms="enabled"                   │    │
│  │         data-focus-mode="enabled">                  │    │
│  │ 5. Injeta <style> com CSS variables no iframe       │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────┐
│                       JOGO                                   │
│  games/matematica/soma/index.html                           │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ <html data-color-mode="monochrome" ...>             │    │
│  │   <head>                                            │    │
│  │     <link rel="stylesheet" href="../../css/style.css">│   │
│  │     <link rel="stylesheet" href="../../css/game-themes.css">│ │
│  │     <script src="../../games/shared/js/config-adapter.js">│  │
│  │   </head>                                           │    │
│  │   ...                                              │    │
│  │   <script>                                          │    │
│  │     // GAME_CONFIG disponível globalmente           │    │
│  │     if (!GAME_CONFIG.visual.animationsEnabled) {    │    │
│  │       // desabilitar animações                      │    │
│  │     }                                              │    │
│  │   </script>                                         │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

---

## Arquitetura de Arquivos

### Estrutura Atual

```
TEA_ANTIGRAVITY/
├── css/
│   └── style.css
├── games/
│   ├── catalog.js
│   ├── shared/
│   │   └── js/
│   │       └── components/
│   │           ├── dragdrop.js
│   │           └── sound.js
│   └── matematica/
│       ├── soma/
│       │   ├── index.html
│       │   ├── script.js
│       │   ├── manifest.json
│       │   └── style.css
│       ├── subtracao/
│       │   ├── index.html
│       │   ├── script.js
│       │   ├── manifest.json
│       │   └── style.css
│       └── valor-posicional/
│           ├── index.html
│           ├── script.js
│           ├── manifest.json
│           └── style.css
├── aluno/
│   ├── dashboard.html
│   ├── game.html
│   ├── tutorial.html
│   └── login.html
├── professor/
│   ├── dashboard.html
│   ├── sessao.html
│   ├── game.html
│   └── tutorial.html
└── js/
    └── app.js
```

### Estrutura Proposta

```
TEA_ANTIGRAVITY/
├── css/
│   ├── style.css
│   └── game-themes.css        ← NOVO: regras visuais por perfil
├── games/
│   ├── catalog.js             ← ATUALIZADO: adiciona configRequisitos
│   ├── shared/
│   │   └── js/
│   │       ├── config-adapter.js  ← NOVO: lê e aplica config
│   │       └── components/
│   │           ├── dragdrop.js
│   │           └── sound.js
│   └── matematica/
│       ├── soma/
│       │   ├── index.html     ← ATUALIZADO: inclui config-adapter.js
│       │   ├── script.js      ← ATUALIZADO: usa GAME_CONFIG
│       │   ├── manifest.json
│       │   └── style.css
│       ├── subtracao/
│       │   └── ...
│       └── valor-posicional/
│           └── ...
├── aluno/
│   ├── dashboard.html         ← ATUALIZADO: passa config completa
│   ├── game.html              ← ATUALIZADO: injeta config no iframe
│   ├── tutorial.html
│   └── login.html
├── professor/
│   ├── dashboard.html
│   ├── sessao.html
│   ├── game.html
│   └── tutorial.html
├── docs/
│   └── PLANILHA-VISUAL-TEA.md ← ESTE DOCUMENTO
└── js/
    └── app.js
```

---

## Responsabilidades por Camada

### 1. `css/game-themes.css`

Regras CSS que respondem aos data attributes injetados pelo `game.html`.

**Responsabilidades:**
- Definir variáveis CSS base para cada modo visual
- Aplicar filtros CSS (grayscale, invert, etc.)
- Ajustar tamanhos de fonte
- Controlar visibilidade de animações
- Suportar todos os modos: monochrome, high contrast, inverted, pastel, reduced

### 2. `games/shared/js/config-adapter.js`

Módulo JS que lê a configuração e prepara o ambiente do jogo.

**Responsabilidades:**
- Ler `gameConfig` de URL (base64) ou localStorage
- Exportar objeto `GAME_CONFIG` global para uso dos jogos
- Aplicar data attributes no `<html>` do jogo
- Disparar evento `configready` quando pronto
- Fornecer utilitários: `GAME_CONFIG.getVisual()`, `GAME_CONFIG.isAnimationsEnabled()`, etc.

### 3. `aluno/game.html`

Wrapper que carrega o jogo em iframe.

**Responsabilidades:**
- Decodificar `gameConfig` da URL
- Montar URL do iframe com parâmetros básicos (nivel, som)
- Após `onload` do iframe, injetar data attributes via `contentDocument`
- Injetar `<link>` para `game-themes.css` no iframe
- Injetar `<script>` para `config-adapter.js` no iframe

### 4. `aluno/dashboard.html`

Painel do aluno que inicia os jogos.

**Responsabilidades:**
- Ler `gameConfig` completo do localStorage
- Codificar em base64 para URL
- Passar para `tutorial.html` e `game.html`

### 5. Cada jogo (`index.html` + `script.js`)

**Responsabilidades:**
- Incluir `config-adapter.js` no `<head>`
- Ler `GAME_CONFIG` para lógica específica (ex: desabilitar animações)
- Usar classes CSS condicionais baseadas em data attributes
- Respeitar `singleTaskMode`, `focusMode`, etc.

---

## Implementação por Fase

### Fase 1: CSS Themes (Baixo esforço)

**Arquivo:** `css/game-themes.css`

**O que fazer:**
- Criar regras CSS para cada modo de cor
- Suportar `data-color-mode`, `data-contrast`, `data-font-size`, `data-font-family`
- Suportar `data-animations`, `data-focus-mode`

**Resultado:** Qualquer elemento HTML com os data attributes correto recebe o estilo adequado.

### Fase 2: Config Adapter (Médio esforço)

**Arquivo:** `games/shared/js/config-adapter.js`

**O que fazer:**
- Ler `gameConfig` de URL params ou localStorage
- Aplicar data attributes no `<html>`
- Exportar `GAME_CONFIG` global
- Disparar evento customizado

**Resultado:** Todos os jogos têm acesso à config via `GAME_CONFIG`.

### Fase 3: Propagação no game.html (Médio esforço)

**Arquivo:** `aluno/game.html`

**O que fazer:**
- Decodificar config da URL
- Após iframe load, injetar data attributes
- Injetar CSS e JS necessários

**Resultado:** Config chega ao iframe do jogo.

### Fase 4: Atualização dos Jogos (Baixo esforço por jogo)

**Arquivos:** Cada `index.html` e `script.js`

**O que fazer:**
- Adicionar `<script src="config-adapter.js">` no `<head>`
- Substituir valores hardcoded por `GAME_CONFIG`
- Adicionar verificações de `animationsEnabled`, `focusMode`, etc.

**Resultado:** Cada jogo respeita a config visual.

### Fase 5: Configurações Avançadas (Alto esforço)

**O que fazer:**
- Implementar `ui.focusMode` (remover elementos)
- Implementar `ui.singleTaskMode` (um item por vez)
- Implementar `ui.distractionReduction` (ocultar secundários)
- Implementar `ui.predictableStructure` (layout fixo)

**Resultado:** Configurações completas de interface.

---

## Exemplos de Uso

### Exemplo 1: Monochrome para TEA Nível 3

**Configuração no sessao.html:**
```json
{
  "visual": {
    "colorMode": "monochrome",
    "contrast": "high",
    "fontSize": "xl",
    "animationsEnabled": false
  }
}
```

**Data attributes injetados:**
```html
<html data-color-mode="monochrome"
      data-contrast="high"
      data-font-size="xl"
      data-animations="disabled">
```

**CSS resultante:**
```css
[data-color-mode="monochrome"] {
    filter: grayscale(100%);
}

[data-contrast="high"] {
    --color-primary: #000000;
    --color-bg-app: #ffffff;
    --color-border: #000000;
}

[data-font-size="xl"] {
    font-size: 28px;
}

[data-animations="disabled"] *,
[data-animations="disabled"] *::before,
[data-animations="disabled"] *::after {
    animation: none !important;
    transition: none !important;
}
```

### Exemplo 2: Dislexia

**Configuração:**
```json
{
  "visual": {
    "fontFamily": "dyslexic",
    "fontSize": "xl",
    "colorMode": "full"
  }
}
```

**CSS resultante:**
```css
[data-font-family="dyslexic"] {
    --font-family: 'OpenDyslexic', sans-serif;
}

[data-font-size="xl"] {
    font-size: 28px;
}
```

### Exemplo 3: Acessibilidade via JS

**No script.js de um jogo:**
```javascript
// Ler config
var config = window.GAME_CONFIG || {};

// Desabilitar animações se configurado
if (config.visual && !config.visual.animationsEnabled) {
    // Usar transições instantâneas
    document.documentElement.style.setProperty('--transition-speed', '0s');
}

// Ajustar tamanho do alvo baseado no perfil
if (config.interaction && config.interaction.clickTargetSize === 'xl') {
    document.querySelectorAll('.opcao').forEach(function(el) {
        el.style.minWidth = '80px';
        el.style.minHeight = '80px';
    });
}
```

---

## Compatibilidade com Jogos Existentes

### Jogos Atuais

| Jogo | Precisa de mudanças? | Esforço |
|---|---|---|
| `soma/index.html` | Sim — incluir `config-adapter.js` | Baixo |
| `soma/script.js` | Sim — ler `GAME_CONFIG` | Baixo |
| `subtracao/index.html` | Sim — incluir `config-adapter.js` | Baixo |
| `subtracao/script.js` | Sim — ler `GAME_CONFIG` | Baixo |
| `valor-posicional/index.html` | Sim — incluir `config-adapter.js` | Baixo |
| `valor-posicional/script.js` | Sim — ler `GAME_CONFIG` | Baixo |

### Jogos Futuros

Novos jogos precisam apenas:
1. Incluir `config-adapter.js` no `<head>`
2. Ler `GAME_CONFIG` quando necessário
3. Usar classes CSS condicionais

**Não precisam** de lógica para ler localStorage, decodificar URLs, ou aplicar CSS manualmente.

---

## Referências

- [WCAG 2.1 - Understanding Conformance](https://www.w3.org/WAI/WCAG21/Understanding/conformance)
- [Inclusive Design Principles](https://inclusivedesignprinciples.org/)
- [OpenDyslexic Font](https://opendyslexic.org/)
- [CSS Custom Properties (Variables)](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [Data Attributes - MDN](https://developer.mozilla.org/en-US/docs/Learn/HTML/Howto/Use_data_attributes)

---

## Status

| Fase | Estado | Responsável |
|---|---|---|
| Fase 1: CSS Themes | Pendente | — |
| Fase 2: Config Adapter | Pendente | — |
| Fase 3: game.html | Pendente | — |
| Fase 4: Jogos | Pendente | — |
| Fase 5: UI Avançada | Pendente | — |

---

*Documento criado em: 13 de Julho de 2026*
*Projeto: FGI — Framework de Jogos Inclusivos*
