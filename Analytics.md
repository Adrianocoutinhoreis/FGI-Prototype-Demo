# Analytics — FGI

## Configuração GA4

1. Crie uma conta em [analytics.google.com](https://analytics.google.com)
2. Copie o ID de Medição (`G-XXXXXXXXXX`)
3. Substitua `G-XXXXXXXXXX` no snippet abaixo

### Snippet para `<head>` (todos os HTMLs)

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Eventos Customizados

Adicionar no `js/app.js` e nas páginas:

| Evento | Trigger | Parâmetros |
|--------|---------|------------|
| `sessao_iniciada` | `config.html` — botão Iniciar Jogo | `aluno`, `perfil` |
| `perfil_selecionado` | `config.html` — filtro "Perfil de Apoio" | `perfil` |
| `configuracao_definida` | `config.html` — formulário submit | `tempo`, `som`, `dificuldade` |
| `jogo_finalizado` | `game.html` — listener `GAME_FINISHED` | `aluno`, `perfil`, `acertos`, `erros`, `duracao` |
| `relatorio_visualizado` | `result.html` — DOMContentLoaded | `aluno`, `aproveitamento` |

## Exemplo de Envio

```javascript
// Em game.html, dentro do listener GAME_FINISHED
gtag('event', 'jogo_finalizado', {
  aluno: state.student,
  perfil: state.profile,
  acertos: event.data.hits,
  erros: event.data.misses,
  duracao: formatted
});
```

## Alternativa: Plausible (privacidade)

```html
<script defer data-domain="seudominio.com" src="https://plausible.io/js/script.js"></script>
```

Sem cookies, LGPD-ready, leve (~1KB).
