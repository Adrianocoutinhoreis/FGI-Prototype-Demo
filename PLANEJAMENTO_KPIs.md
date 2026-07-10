# Planejamento: KPIs dos Jogos

**Data do planejamento:** 10 de Julho de 2026
**Versão:** 0.1 (Protótipo)

---

## Visão Geral

KPIs (Key Performance Indicators) são métricas coletadas durante a execução dos jogos para avaliar o desempenho, progresso e comportamento do aluno. Esses dados alimentam os relatórios do professor e o dashboard de progresso do aluno.

---

## KPIs Atuais (Implementados)

### KPIs Básicos

| KPI | Onde é coletado | Onde é exibido | Descrição |
|-----|-----------------|----------------|-----------|
| **Acertos (hits)** | `game001/script.js:418` | `resultado.html:350` | Fichas corretas de primeira |
| **Erros Acolhidos (misses)** | `game001/script.js:419` | `resultado.html:358` | Fichas devolvidas sem punição |
| **Aproveitamento (%)** | `resultado.html:467` | `resultado.html:333` | `hits / (hits + misses) * 100` |
| **Tempo de Sessão** | `game.html:82-85` | `resultado.html:342` | Duração total da partida |

### KPIs Calculados no Relatório

| KPI | Fórmula | Onde é exibido |
|-----|---------|----------------|
| **Proficiência** | `Inicial`, `Familiar`, `Proficiente`, `Avançado` | `resultado.html:470-477` |
| **Tempo por Questão** | Distribuição ponderada do tempo total | `resultado.html:509-516` |

### Dados Enviados pelo Jogo (postMessage Atual)

```javascript
// game001/script.js:416-420
window.parent.postMessage({
    type: "GAME_FINISHED",
    hits: estado.acertosPrimeira,    // ✅ KPI
    misses: estado.erros || 0        // ✅ KPI
    // ❌ NÃO envia: duration, level, skills, gameId
}, "*");
```

---

## KPIs que Estão Faltando

### Essenciais (Devem Ser Adicionados)

| KPI | Descrição | Como coletar |
|-----|-----------|--------------|
| **Duração (duration)** | Tempo total de jogo | `game.html` já calcula, mas não envia para o jogo |
| **Nível jogado (level)** | Nível de dificuldade utilizado | Passado via URL, mas não retornado |
| **Total de questões** | Quantidade de questões respondidas | `TOTAL_PERGUNTAS` (fixo em 8) |
| **Tempo por questão** | Tempo individual de cada resposta | Precisa ser medido no `script.js` |

### Avançados (Para Relatório Mais Rico)

| KPI | Descrição | Como coletar |
|-----|-----------|--------------|
| **Tentativas por questão** | Quantas vezes tentou antes de acertar | Contar erros por questão |
| **Tempo de primeira tentativa** | Tempo até a primeira resposta | Medir desde início da questão |
| **Sequência de acertos** | Maior sequência sem erros | Contar acertos consecutivos |
| **Uso de ajuda** | Quantas vezes pediu ajuda | Contar cliques no botão de ajuda |
| **Dicas recebidas** | Quantas dicas o sistema mostrou | Contar dicas exibidas |

### Comportamentais (Para Perfis TEA)

| KPI | Descrição | Como coletar |
|-----|-----------|--------------|
| **Pausas longas** | Tempo ocioso entre questões | Detectar intervalos > 30s |
| **Padrão de interação** | Uso de drag vs teclado | Contar tipo de interação |
| **Regulação emocional** | Resposta a erros | Tempo após erro antes de tentar novamente |
| **Engajamento** | Mantém foco no jogo | Proporção do tempo ativo vs ocioso |

---

## Sugestão de postMessage Completo

```javascript
// O jogo deveria enviar:
window.parent.postMessage({
    type: "GAME_FINISHED",
    gameId: "mat-game001",
    
    // KPIs básicos
    hits: 6,                    // Acertos de primeira
    misses: 2,                  // Erros acolhidos
    totalQuestions: 8,           // Total de questões
    
    // KPIs de tempo
    duration: "02:45",          // Duração total
    avgTimePerQuestion: 18.5,   // Tempo médio por questão
    questionTimes: [12, 15, 22, 18, 16, 14, 20, 19], // Tempo por questão
    
    // KPIs de nível
    level: 2,                   // Nível jogado
    levelName: "Praticando",    // Nome do nível
    
    // KPIs comportamentais
    totalAttempts: 10,          // Total de tentativas (hits + misses)
    firstTryRate: 75,           // % de acertos de primeira
    maxStreak: 4,               // Maior sequência de acertos
    helpUsed: 0,                // Vezes que usou ajuda
    hintsReceived: 2,           // Dicas recebidas
    
    // Habilidades trabalhadas
    skills: ["contagem", "soma", "raciocinio-logico"]
}, "*");
```

---

## Classificação de Proficiência

### Baseada no Aproveitamento

| Aproveitamento | Proficiência | Cor | Descrição |
|----------------|--------------|-----|-----------|
| ≥ 90% | **Avançado** | 🟢 Verde | Domina o conteúdo, pronto para avançar |
| ≥ 75% | **Proficiente** | 🔵 Azul | Bom entendimento, precisa de prática |
| ≥ 50% | **Familiar** | 🟡 Amarelo | Conceito básico, precisa de reforço |
| < 50% | **Inicial** | 🟠 Laranja | Necessita de revisão e apoio |

### Baseada no Tempo (para jogos sem limite)

| Tempo Médio por Questão | Classificação | Interpretação |
|-------------------------|---------------|---------------|
| < 10 segundos | **Rápido** | Pode indicar adivinhação ou alta fluência |
| 10-20 segundos | **Normal** | Ritmo adequado de processamento |
| 20-30 segundos | **Reflexivo** | Cuidadoso, processa bem |
| > 30 segundos | **Lento** | Pode precisar de ajuda ou mais tempo |

### Baseada no Comportamento

| Comportamento | Indicador | Interpretação |
|---------------|-----------|---------------|
| **Muitas pausas longas** | intervalos > 30s | Possível sobrecarga cognitiva |
| **Alto uso de ajuda** | clicks no botão | Necessita de mais suporte visual |
| **Sequência de erros** | 3+ erros seguidos | Possível frustração, considerar ajustar nível |
| **Sequência de acertos** | 5+ acertos seguidos | Alto engajamento, possível elevar nível |

---

## KPIs para Diferentes Visualizações

### Dashboard do Professor (Visão Geral)

| KPI | Fonte | Visualização |
|-----|-------|--------------|
| **Aproveitamento médio da turma** | Média de todos os alunos | Gráfico de barras |
| **Evolução ao longo do tempo** | Histórico de sessões | Gráfico de linhas |
| **Alunos abaixo do esperado** | Proficiência < "Familiar" | Lista com alerta |
| **Jogos mais populares** | Contagem de jogos jogados | Ranking |
| **Tempo médio de sessão** | Média de duração | Card numérico |
| **Taxa de conclusão** | Jogos iniciados vs concluídos | Gráfico circular |

### Relatório Individual (Resultado do Jogo)

| KPI | Fonte | Visualização |
|-----|-------|--------------|
| **Aproveitamento** | hits / total | Donut chart (gráfico de rosca) |
| **Tempo total** | duration | Card numérico |
| **Acertos** | hits | Card com borda verde |
| **Erros Acolhidos** | misses | Card com borda amarela |
| **Tempo por questão** | questionTimes | Gráfico de barras |
| **Proficiência** | Cálculo | Badge de cor |

### Dashboard do Aluno (Progresso)

| KPI | Fonte | Visualização |
|-----|-------|--------------|
| **Pontos acumulados** | Soma de pontos por jogo | Card numérico |
| **Medalhas conquistadas** | Conquistas desbloqueadas | Ícones de medalhas |
| **Sequência de acertos** | Maior streak | Card com fogo 🔥 |
| **Nível atual** | Baseado em pontos | Badge de nível |
| **Jogos concluídos** | Contagem | Card numérico |
| **Melhor pontuação** | Maior % de aproveitamento | Card numérico |

---

## Estrutura de Dados dos KPIs

### Dados Coletados pelo Jogo

```javascript
// Objeto que o jogo deve enviar via postMessage
var gameResult = {
    // Identificação
    gameId: "mat-game001",
    gameName: "Jogo da Soma",
    
    // KPIs básicos
    hits: 6,                        // Acertos de primeira
    misses: 2,                      // Erros acolhidos
    totalQuestions: 8,               // Total de questões
    
    // KPIs de tempo
    duration: "02:45",              // Duração total (formato MM:SS)
    durationSeconds: 165,           // Duração em segundos
    avgTimePerQuestion: 20.6,       // Tempo médio por questão (segundos)
    questionTimes: [                // Tempo por questão (segundos)
        { question: 1, time: 12, correct: true, attempts: 1 },
        { question: 2, time: 15, correct: true, attempts: 1 },
        { question: 3, time: 22, correct: false, attempts: 2 },
        { question: 4, time: 18, correct: true, attempts: 1 },
        { question: 5, time: 16, correct: true, attempts: 1 },
        { question: 6, time: 14, correct: true, attempts: 1 },
        { question: 7, time: 20, correct: false, attempts: 2 },
        { question: 8, time: 19, correct: true, attempts: 1 }
    ],
    
    // KPIs de nível
    level: 2,                       // Nível jogado (1-3)
    levelName: "Praticando",        // Nome do nível
    
    // KPIs comportamentais
    totalAttempts: 10,              // Total de tentativas
    firstTryRate: 75,               // % de acertos de primeira
    maxStreak: 4,                   // Maior sequência de acertos
    helpUsed: 0,                    // Vezes que usou ajuda
    hintsReceived: 2,               // Dicas recebidas
    
    // Interação
    interactionType: "drag-and-drop", // Tipo de interação usada
    keyboardUsed: false,            // Se usou teclado
    
    // Habilidades
    skills: ["contagem", "soma", "raciocinio-logico"]
};
```

### Dados Salvos na Sessão

```javascript
// Objeto completo da sessão (salvo no localStorage ou API)
var sessionData = {
    // Identificação
    sessionId: "sess_4729",
    code: "4729",
    
    // Dados do aluno
    student: {
        id: "lucas_001",
        name: "Lucas",
        turma: "1o Ano A"
    },
    
    // Perfil
    profile: {
        code: "T1",
        label: "TEA Nível 1"
    },
    
    // Configuração utilizada
    config: { /* 60 parâmetros */ },
    
    // Resultado do jogo
    result: {
        gameId: "mat-game001",
        hits: 6,
        misses: 2,
        totalQuestions: 8,
        duration: "02:45",
        durationSeconds: 165,
        avgTimePerQuestion: 20.6,
        questionTimes: [ /* ... */ ],
        level: 2,
        levelName: "Praticando",
        totalAttempts: 10,
        firstTryRate: 75,
        maxStreak: 4,
        skills: ["contagem", "soma", "raciocinio-logico"]
    },
    
    // Proficiência calculada
    proficiency: {
        level: "Proficiente",       // Inicial, Familiar, Proficiente, Avançado
        percentage: 75,             // % de aproveitamento
        color: "#3B82F6"            // Cor para visualização
    },
    
    // Timestamps
    createdAt: "2026-07-10T14:30:00",
    startedAt: "2026-07-10T14:35:00",
    finishedAt: "2026-07-10T14:37:45"
};
```

---

## Implementação por Fase

### Protótipo (localStorage)

| KPI | Status | Como implementar |
|-----|--------|------------------|
| hits | ✅ Já existe | Mantido |
| misses | ✅ Já existe | Mantido |
| duration | ✅ Já existe | `game.html` calcula |
| aproveitamento | ✅ Já existe | Calculado no `resultado.html` |
| totalQuestions | ❌ Não existe | Adicionar em `script.js` |
| avgTimePerQuestion | ❌ Não existe | Medir tempo por questão |
| questionTimes | ❌ Não existe | Medir tempo individual |
| level | ❌ Não existe | Retornar nível jogado |
| firstTryRate | ❌ Não existe | Calcular: `hits / totalAttempts * 100` |
| maxStreak | ❌ Não existe | Contar acertos consecutivos |

### Fase Final (API + Banco)

| KPI | Status | Onde armazenar |
|-----|--------|----------------|
| Todos os acima | ✅ Implementados | Tabela `game_results` |
| Histórico de sessões | ❌ Não existe | Tabela `sessions` com timestamps |
| Evolução ao longo do tempo | ❌ Não existe | Queries de agregação |
| Comparativo entre alunos | ❌ Não existe | Queries de agregação |
| Alertas de performance | ❌ Não exists | Triggers ou jobs |

---

## KPIs por Tipo de Jogo

### Matemática

| KPI | Descrição | Relevância |
|-----|-----------|------------|
| **Aproveitamento** | % de acertos | Mede compreensão do conceito |
| **Tempo por questão** | Velocidade de processamento | Indica fluência |
| **Tentativas por questão** | Persistência | Indica regulação emocional |
| **Uso de recursos visuais** | Ábaco, reta numérica, dedos | Indica estratégias de contagem |

### Português

| KPI | Descrição | Relevância |
|-----|-----------|------------|
| **Aproveitamento** | % de acertos | Mede compreensão |
| **Tempo de leitura** | Tempo para ler instruções | Indica fluência de leitura |
| **Acertos de primeira** | Respostas imediatas | Indica reconhecimento automático |
| **Uso de narração** | Se ativou áudio | Indica necessidade de suporte |

---

## Regras de Negócio para KPIs

### Regra 1: Erros Nunca São Punidos

```javascript
// O KPI "misses" NÃO é negativo
// Ele indica "oportunidades de aprendizagem"
// NUNCA exibir mensagem como "Você errou X vezes"
// SEMPRE exibir como "A tartaruga ajudou X vezes"
```

### Regra 2: Tempo Não É Competição

```javascript
// O KPI "duration" NÃO deve ser comparado entre alunos
// Cada aluno tem seu ritmo
// Exibir apenas como referência, nunca como ranking
```

### Regra 3: Proficiência é Privada

```javascript
// O KPI "proficiency" NÃO deve ser exibido para outros alunos
// Apenas professor e aluno devem ver
// Nunca mostrar "Lucas está abaixo do esperado" para a turma
```

### Regra 4: Progresso é Individual

```javascript
// O KPI "evolution" compara o aluno consigo mesmo
// NUNCA comparar com outros alunos
// Exibir: "Você melhorou 15% desde a última vez"
// NUNCA exibir: "Você está abaixo da média da turma"
```

---

## Visualização dos KPIs

### Dashboard do Professor

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Painel de KPIs - Turma 1º Ano A                        │
│                                                             │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │ 📈 78%    │ │ ⏱️ 2:15   │ │ ✅ 6.2    │ │ 🐢 1.8    │   │
│  │ Aproveit. │ │ Tempo Med │ │ Acertos   │ │ Erros     │   │
│  │ Médio     │ │ Sessão    │ │ Médios    │ │ Acolhidos │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📈 Evolução da Turma (Últimas 5 sessões)           │   │
│  │  [Gráfico de linhas mostrando melhoria]             │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  ⚠️ Alunos que precisam de atenção                   │   │
│  │  • Pedro - 45% aproveitamento (Inicial)             │   │
│  │  • Maria - 52% aproveitamento (Familiar)            │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Relatório Individual

```
┌─────────────────────────────────────────────────────────────┐
│  📋 Relatório de Desempenho - Lucas                        │
│  Perfil: TEA Nível 1 | Jogo: Soma | Nível: 2              │
│                                                             │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │ 🍩 75%    │ │ ⏱️ 02:45  │ │ ✅ 6      │ │ 🐢 2      │   │
│  │ Aproveit. │ │ Duração   │ │ Acertos   │ │ Erros     │   │
│  │ Profic.   │ │           │ │           │ │ Acolhidos │   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📊 Tempo por Questão                               │   │
│  │  Q1: 12s ✓  Q2: 15s ✓  Q3: 22s ✗  Q4: 18s ✓      │   │
│  │  Q5: 16s ✓  Q6: 14s ✓  Q7: 20s ✗  Q8: 19s ✓      │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  💡 Insights                                        │   │
│  │  🐢 Lucas manteve calma após erros                  │   │
│  │  📈 Melhor sequência: 4 acertos seguidos            │   │
│  │  ⏱️ Ritmo adequado para o perfil TEA                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Dashboard do Aluno

```
┌─────────────────────────────────────────────────────────────┐
│  🏆 Meu Progresso                                          │
│                                                             │
│  ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐   │
│  │ 🌟 1.250  │ │ 🥇🥈🥉    │ │ 🔥 5      │ │ 📚 12     │   │
│  │ Pontos    │ │ Medalhas  │ │ Sequência │ │ Jogos     │   │
│  │ Acumulados│ │           │ │ Acertos   │ │ Concluídos│   │
│  └───────────┘ └───────────┘ └───────────┘ └───────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  📈 Minha Evolução                                  │   │
│  │  [Gráfico mostrando melhoria ao longo do tempo]     │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │  🎯 Próximas Conquistas                             │   │
│  │  • Jogar 5 jogos de Matemática (3/5)                │   │
│  │  • Conseguir 90% em um jogo (melhor: 85%)           │   │
│  │  • Sequência de 10 acertos (melhor: 5)              │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## Resumo dos KPIs

### Essenciais (Mínimo para Protótipo)

| KPI | Tipo | Coleta | Exibição |
|-----|------|--------|----------|
| hits | Numérico | `script.js` | resultado.html |
| misses | Numérico | `script.js` | resultado.html |
| duration | Tempo | `game.html` | resultado.html |
| aproveitamento | Percentual | Cálculo | resultado.html (donut) |
| level | Numérico | URL | resultado.html |
| totalQuestions | Numérico | Constante | resultado.html |

### Recomendados (Para Protótipo Melhorado)

| KPI | Tipo | Coleta | Exibição |
|-----|------|--------|----------|
| avgTimePerQuestion | Tempo | `script.js` | resultado.html (gráfico) |
| questionTimes | Array | `script.js` | resultado.html (barras) |
| firstTryRate | Percentual | Cálculo | resultado.html |
| maxStreak | Numérico | `script.js` | resultado.html |
| proficiency | Texto | Cálculo | resultado.html (badge) |

### Avançados (Para Fase Final)

| KPI | Tipo | Coleta | Exibição |
|-----|------|--------|----------|
| helpUsed | Numérico | `script.js` | resultado.html |
| hintsReceived | Numérico | `script.js` | resultado.html |
| interactionType | Texto | `script.js` | analytics |
| pausePattern | Array | `script.js` | analytics |
| emotionalRegulation | Texto | Cálculo | relatório professor |

---

## Próximos Passos

1. Atualizar `game001/script.js` para coletar KPIs adicionais
2. Atualizar `postMessage` para enviar todos os KPIs
3. Atualizar `game.html` para receber e armazenar KPIs
4. Atualizar `resultado.html` para exibir novos KPIs
5. Criar funções de cálculo de proficiência em `app.js`
6. Testar fluxo completo de coleta e exibição
