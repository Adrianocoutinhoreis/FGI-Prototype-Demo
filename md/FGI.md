# FGI.md

# FGI - Prototype Demo

Versão: 0.1

## Objetivo

Construir um protótipo navegável extremamente simples para apresentação da ideia do projeto FGI (Framework de Jogos Inclusivos para crianças com Transtorno do Espectro Autista).

Este NÃO é o produto final.

Este NÃO é o MVP definitivo.

O objetivo é apenas demonstrar visualmente como será a futura plataforma.

A prioridade é experiência visual, clareza e facilidade de navegação.

---

# Regras importantes

Utilizar apenas:

* HTML
* CSS
* JavaScript

Não utilizar:

* React
* Next.js
* Node
* Banco de Dados
* APIs
* Frameworks
* Backend

Todo o projeto deverá funcionar apenas abrindo o arquivo index.html.

---

# Objetivo da demonstração

O visitante deverá conseguir:

Entrar no sistema

↓

Escolher um aluno

↓

Escolher um perfil

↓

Configurar um jogo

↓

Executar um jogo

↓

Visualizar um resultado

Tudo utilizando dados fictícios.

---

# Tema visual

Criar um sistema moderno, limpo e acolhedor.

A inspiração deve ser uma mistura de:

* Duolingo
* Khan Academy Kids
* Material Design
* Apple Human Interface
* Notion

Evitar aparência infantil exagerada.

Evitar aparência corporativa fria.

Utilizar:

* cantos arredondados
* sombras suaves
* muito espaço em branco
* poucas cores
* ícones simples
* animações discretas

---

# Estrutura do sistema

index.html

Dashboard

↓

Novo Atendimento

↓

Configuração (com filtros de Aluno e Perfil de Apoio)

↓

Tutorial

↓

Jogo

↓

Resultado

---

# Dashboard

Mostrar quatro cartões.

Novo Atendimento

Meus Alunos

Jogos

Configurações

Somente "Novo Atendimento" deverá funcionar.

Os demais podem apresentar um aviso:

"Funcionalidade disponível nas próximas versões."

---

# Configuração

Na mesma tela de configuração, exibir filtros para:

Escola (rede): lista das escolas da rede em que o professor participa

Turma: lista das turmas da escola selecionada

Aluno (nome fictício: Lucas, Maria, Pedro ou Ana)

Perfil de Apoio: Aluno típico, TEA Nível 1, TEA Nível 2, TEA Nível 3, TDAH, Dislexia

Todo aluno cadastrado na base de dados começa, por padrão, com o perfil "Aluno Típico". O professor pode trocar o perfil de apoio manualmente na tela de Configuração; a troca não é permanente, vale apenas para a sessão/demonstração atual.

Os filtros são em cascata: selecionar a Escola atualiza a lista de Turmas disponíveis; selecionar a Turma atualiza a lista de Alunos disponíveis.

O professor só pode ver Escolas em que participa (dados fictícios), não a rede toda.

Ao trocar o perfil, adaptar automaticamente os parâmetros do jogo para esse perfil.

PENDENTE: filtro de Escola/Turma ainda não implementado no protótipo (planejado, apenas documentado aqui). A implementação deve seguir a mesma regra de dados fictícios e sem backend/banco de dados.

Abaixo dos filtros, exibir os parâmetros técnicos da atividade:

Tempo

( ) Sem limite

( ) 2 minutos

Som

Ligado / Desligado

Narração

Ligada / Desligada

Dificuldade

Fácil

Média

Difícil

Botão:

Iniciar Jogo

Não é necessário salvar nada.

As escolhas podem existir apenas durante a demonstração.

---

# Tutorial

Mostrar uma pequena ilustração.

Explicar rapidamente a atividade.

Botão:

Começar

---

# Gameplay

IMPORTANTE

Não criar um novo jogo.

Utilizar o jogo HTML já existente como exemplo.

O jogo atual será utilizado apenas para demonstrar como os jogos funcionarão dentro da plataforma.

A tela deverá possuir um cabeçalho contendo:

Nome do aluno

Perfil selecionado

Botão Voltar

Botão Reiniciar

Abaixo desse cabeçalho deverá existir uma área destinada ao jogo.

O código do jogo deverá permanecer separado do restante do sistema para que futuramente possa ser substituído por novos jogos.

Criar um container chamado:

GameContainer

O jogo existente deverá ser carregado dentro desse container.

Não modificar sua mecânica principal.

Apenas integrá-lo visualmente ao sistema.

---

# Resultado

Após finalizar o jogo mostrar:

Parabéns!

Atividade concluída.

Tempo:

01:35

Acertos:

8

Erros:

2

Esses dados podem ser simulados.

Botões:

Jogar novamente

Novo Atendimento

Dashboard

---

# Arquitetura

Organizar o projeto da seguinte forma.

/

index.html

/css

style.css

/js

app.js

/pages

dashboard.html

config.html

tutorial.html

game.html

result.html

/assets

/img

/icons

/games

/game001

(index.html do jogo atual)

(style.css)

(script.js)

---

# Integração do jogo

O jogo HTML já existente deverá ser tratado como um módulo independente.

Ele não deve ser reescrito.

Ele deve permanecer dentro da pasta:

games/game001

A página game.html deverá apenas carregá-lo dentro do GameContainer.

O objetivo é demonstrar que futuramente a plataforma poderá possuir diversos jogos.

---

# Acessibilidade

Sempre utilizar:

Botões grandes

Fonte mínima de 18px

Alto contraste

Pouco texto

Uma ação principal por tela

Feedback positivo

Sem sons automáticos

Sem animações rápidas

Sem flashes

---

# Dados

Todos os dados podem ser simulados.

Perfil inicial padrão de todo aluno na base: "Aluno Típico". Nenhum aluno nasce já classificado em um perfil de apoio (TEA, TDAH, Dislexia etc.) — essa classificação é sempre um ajuste feito pelo professor na tela de Configuração.

Não criar banco de dados.

Não utilizar LocalStorage.

Não criar autenticação.

---

# Objetivo final

Ao finalizar o projeto, o usuário deverá sentir que está utilizando um produto real, mesmo que toda a navegação seja simulada.

O código deve ser organizado, comentado e preparado para evoluir futuramente para uma arquitetura modular.
