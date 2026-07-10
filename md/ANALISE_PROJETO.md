# Análise do Projeto — FGI (Framework de Jogos Inclusivos)

**Data da análise:** 10 de Julho de 2026
**Versão do protótipo:** 0.1

---

## Resumo

**FGI — Framework de Jogos Inclusivos** é um protótipo navegável de plataforma educacional para crianças com Transtorno do Espectro Autista (TEA) e outras condições neurodesenvolvimentais (TDAH, Dislexia, Discalculia, Deficiência Intelectual).

O objetivo é permitir que professores e terapeutas configurem sessões de jogos matemáticos adaptados para alunos com necessidades específicas, utilizando um sistema de perfis com cerca de 60 parâmetros técnicos.

### Fluxo Principal

1. **Dashboard** → Novo Atendimento
2. **Configuração** → Selecionar aluno, perfil de apoio e parâmetros técnicos
3. **Tutorial** → Instrução visual antes do jogo
4. **Jogo** → "Jogo da Soma" com drag-and-drop e feedback acolhedor
5. **Resultado** → Dashboard BI com KPIs, gráficos e insights

### Tech Stack

- HTML5 + CSS3 + JavaScript vanilla
- Zero dependências, zero frameworks (conforme especificação em `md/FGI.md`)
- Google Fonts (Inter) como única dependência externa
- Web Audio API para sons procedurais (sine waves, sem arquivos de áudio)

### Idioma

Todo o sistema está em Português Brasileiro (pt-BR).

---

## Estrutura do Projeto

```
TEA_ANTIGRAVITY/
├── index.html                    # Dashboard principal
├── Analytics.md                  # Documentação GA4
├── configurador/
│   └── FGI_Configurador.html     # Editor JSON independente
├── css/
│   └── style.css                 # Design system global (718 linhas)
├── js/
│   └── app.js                    # Namespace FGI + utilitários (96 linhas)
├── pages/
│   ├── config.html               # Configuração técnica (744 linhas)
│   ├── tutorial.html             # Tutorial pré-jogo
│   ├── game.html                 # Wrapper do jogo com iframe
│   ├── result.html               # Relatório BI pós-jogo
│   └── historico.html            # Histórico de progresso
├── games/
│   └── game001/
│       ├── index.html            # Jogo da Soma
│       ├── script.js             # Lógica do jogo (479 linhas)
│       └── style.css             # Estilos do jogo (855 linhas)
└── md/
    └── FGI.md                    # Documento mestre de especificação
```

**Total:** 17 arquivos — 8 HTML, 3 CSS, 2 JS, 2 JSON, 2 Markdown

---

## Pontos Fortes

1. **Acessibilidade exemplar** — Fonte mínima 18px, alvos grandes (44-56px), contraste alto, suporte a `prefers-reduced-motion`, atributos `aria-*`, fallback por teclado para drag-and-drop.

2. **Design system coeso** — CSS custom properties bem organizadas, tema inspirado em Duolingo/Material Design, visual limpo e acolhedor.

3. **Game design para TEA** — Erros nunca punidos ("Erros Acolhidos"), sons suaves via Web Audio API, sem tempo limite, feedback positivo, tartaruga mascote.

4. **Arquitetura modular de jogos** — Jogos isolados em `/games/gameNNN/`, comunicação via `postMessage`, pronto para plugar novos jogos.

5. **Sistema de perfis robusto** — 8 perfis com ~60 parâmetros cada (T, T1, T2, T3, TD, DX, DC, DI), override tracking, visualização JSON.

6. **Documentação excelente** — `FGI.md` detalhado, comentários em todos os arquivos, `Analytics.md` com schema de eventos.

---

## Melhorias Recomendadas

### Críticas (Alto Impacto)

| # | Problema | Local | Sugestão |
|---|----------|-------|----------|
| 1 | `postMessage` com `*` como origem | `games/game001/script.js:420` | Usar origem específica em vez de `"*"` para segurança |
| 2 | Dados sensíveis na URL | `js/app.js` (state via query params) | Para produção, considerar sessionStorage ou state management mais robusto |
| 3 | Lógica duplicada `syntaxHL` | `pages/config.html:650` e `pages/result.html:598` | Extrair para `app.js` como função compartilhada |
| 4 | CSS inline excessivo | `index.html`, `pages/config.html` | Mover estilos inline para classes CSS no `style.css` |
| 5 | `select` options hardcoded | `pages/config.html:277-280` | Alunos e turmas já são definidos em JS (linha 348-351) mas duplicados no HTML |

### Importantes (Médio Impacto)

| # | Problema | Sugestão |
|---|----------|----------|
| 6 | Sem testes | Adicionar testes E2E simples (ex: verificação de navegação entre páginas) |
| 7 | `config.html` com 744 linhas | Decompor em módulos menores ou extrair a lógica de presets |
| 8 | Sem feedback de acessibilidade | Adicionar `aria-live` nas regiões de toast e feedback do jogo |
| 9 | CSS duplicado entre páginas | `config.html` e `result.html` definem estilos JSON panel duplicados |
| 10 | Sem service worker/PWA | Para uso em salas de aula com conexão instável |

### Melhorias Menores

| # | Sugestão |
|---|----------|
| 11 | Adicionar `loading="lazy"` nas imagens/ícones |
| 12 | Considerar `will-change` nas animações de barras do gráfico BI |
| 13 | Padronizar nomenclatura de IDs (alguns usam `kebab-case`, outros `camelCase`) |
| 14 | Adicionar favicon |
| 15 | Incluir `manifest.json` para instalação como app |

---

## Métricas do Código

| Métrica | Valor |
|---------|-------|
| Total de linhas estimadas | ~3.500 (HTML + CSS + JS) |
| Maior arquivo | `games/game001/style.css` (855 linhas) |
| Arquivo mais complexo | `pages/config.html` (744 linhas) |
| Dependências externas | Apenas Google Fonts (Inter) |
| Tamanho estimado | < 500KB total |
| Frameworks utilizados | Nenhum |
| Backend | Nenhum |
| Testes | Nenhum |

---

## Conclusão

O projeto é um protótipo visual extremamente bem executado para seu objetivo. A documentação é exemplar, a acessibilidade é prioridade real (não apenas checkbox), e a arquitetura de jogos modulares está pronta para escalar. As melhorias acima são preparação para quando o projeto evoluir de protótipo para MVP.
