# Biblioteca de Exercícios

> **Prioridade:** Must (P0)  
> **Status:** Rascunho  
> **Jornada(s):** Preparar e manter fichas de treino

---

## Resumo

Fornece a lista curada de exercícios de musculação agrupados por grupo muscular, permitindo seleção consistente ao montar fichas. Elimina digitação livre e nomes inconsistentes do bloco de notas.

---

## Contexto

### Problema que resolve
Sem biblioteca estruturada, exercícios são digitados manualmente com variações de nome, dificultando comparação de evolução ao longo do tempo.

### Objetivos de negócio atendidos
| Objetivo (PRD) | Como esta feature contribui |
|----------------|----------------------------|
| Objetivo 1 — Substituir bloco de notas | Padroniza nomes de exercícios na montagem de fichas |
| Objetivo 2 — Evolução visível | Garante identificação consistente do exercício no histórico |

---

## Atores e permissões

| Ator / Persona | O que pode fazer nesta feature |
|----------------|-------------------------------|
| Praticante de musculação | Consultar e buscar exercícios por grupo muscular; selecionar para fichas; criar exercícios customizados |

---

## Casos de uso e user stories

| ID | Caso de uso / User story | Prioridade |
|----|--------------------------|------------|
| UC-01 | Como praticante, quero escolher exercícios de uma lista por grupo muscular para montar minha ficha | Must |
| — | Como praticante, quero criar exercícios customizados quando não encontro na biblioteca | Must |

### Fluxo principal
1. Usuário acessa seletor de exercícios (durante criação/edição de ficha)
2. App exibe grupos musculares (peito, costas, pernas, ombros, bíceps, tríceps, abdômen, glúteos)
3. Usuário expande grupo e visualiza exercícios disponíveis
4. Usuário seleciona exercício para adicionar à ficha

### Fluxo principal — Criar exercício customizado
1. Usuário acessa opção de criar exercício
2. Informa nome e seleciona grupo muscular
3. Salva exercício; aparece na biblioteca marcado como customizado
4. Exercício fica disponível para fichas e buscas

### Fluxos alternativos e exceções
| Cenário | Comportamento esperado |
|---------|------------------------|
| Busca por nome | Filtrar exercícios em todos os grupos por texto digitado |
| Biblioteca vazia (erro de seed) | Mensagem de erro; impedir criação de ficha sem exercícios |
| Idioma alterado | Nomes exibidos no idioma configurado (integração com ConfiguracoesApp) |

---

## Requisitos funcionais

| ID | Requisito | Descrição | Rastreabilidade PRD |
|----|-----------|-----------|---------------------|
| RF-01 | Biblioteca de exercícios | Listar exercícios agrupados por grupo muscular | UC-01 |
| RF-20 | Exercícios customizados | Criar exercício com nome e grupo muscular; disponível para fichas | UC-01 |
| RF-13 | Persistência local | Exercícios pré-populados e customizados em SQLite; consulta offline | UC-01 |

---

## Regras de negócio

| ID | Regra | Condição | Ação / resultado |
|----|-------|----------|------------------|
| RN-C01 | Exercício da biblioteca curada | Usuário tenta editar exercício do seed | Ação não disponível; apenas exercícios customizados são editáveis |
| RN-C02 | Exercício customizado | Usuário criou exercício | Pode editar nome e grupo; não pode excluir se vinculado a ficha ou histórico [definir na arquitetura] |

---

## Requisitos não funcionais (escopo desta feature)

| Categoria | Requisito | Critério de aceite |
|-----------|-----------|-------------------|
| Performance | Listagem de exercícios | Grupos e lista renderizados em ≤ 500 ms |
| Disponibilidade offline | Consulta sem rede | 100% funcional offline após instalação |
| Internacionalização | Nomes traduzidos | Exercícios exibidos em pt-BR, es-ES, en-US |

---

## Dados e integrações

### Entidades / dados manipulados
| Entidade | Campos relevantes | Observações |
|----------|-------------------|-------------|
| Exercise | id, muscleGroup, nameKey (i18n) ou name (custom), slug, isCustom | Seed + exercícios criados pelo usuário |
| MuscleGroup | id, nameKey, sortOrder | Enum ou tabela de referência |

### Integrações
| Sistema / Feature | Tipo | Propósito |
|-------------------|------|-----------|
| SQLite | Entrada | Persistência e seed da biblioteca |
| ConfiguracoesApp | Entrada | Idioma para exibição dos nomes |
| GerenciamentoFichas | Saída | Fornece exercícios selecionáveis |

---

## Dependências

### Features (internas)
| Feature | Tipo | Descrição |
|---------|------|-----------|
| ConfiguracoesApp | Integração | Tradução dos nomes de exercícios e grupos |

### Dependências externas
| Sistema / API | Impacto se indisponível |
|---------------|-------------------------|
| SQLite | Feature inoperante |

### Ordem relativa
- **Pode iniciar após:** Nada (fundação)
- **Desbloqueia:** GerenciamentoFichas

---

## Critérios de aceite

- [ ] Biblioteca exibe exercícios agrupados por: peito, costas, pernas, ombros, bíceps, tríceps, abdômen, glúteos
- [ ] Usuário busca exercício por nome em qualquer grupo
- [ ] Lista funciona 100% offline após instalação
- [ ] Nomes exibidos corretamente nos 3 idiomas suportados
- [ ] Usuário cria exercício customizado com nome e grupo muscular
- [ ] Exercícios customizados aparecem na busca e seleção de fichas
- [ ] Exercícios do seed não são editáveis pelo usuário
- [ ] Seed populado na primeira execução sem intervenção do usuário

---

## Definition of Done (DoD)

- [ ] Código implementado conforme requisitos e regras de negócio
- [ ] Critérios de aceite validados (QA ou equivalente)
- [ ] Tratamento de erros e cenários de exceção documentados e testados
- [ ] Requisitos não funcionais aplicáveis verificados
- [ ] Documentação técnica mínima atualizada (se aplicável no projeto)
- [ ] Sem regressões conhecidas nas features dependentes
- [ ] Aprovado pelo Product Owner ou stakeholder designado

---

## Fora de escopo desta feature

- Editar exercícios da biblioteca curada (seed)
- Vídeos ou instruções de execução
- Integração com API externa de exercícios

---

## Decisões de produto aplicadas

| Decisão | Resultado |
|---------|-----------|
| Exercícios customizados no MVP | **Sim** — usuário pode criar além da biblioteca curada |

---

## Premissas

- [PREMISSA] Biblioteca curada pré-populada pelo desenvolvedor
- [PREMISSA] Quantidade de exercícios por grupo muscular definida na curadoria do seed

---

## Perguntas em aberto

| # | Pergunta | Impacto | Responsável sugerido |
|---|----------|---------|----------------------|
| 1 | Excluir exercício customizado sem vínculos? | Baixo | Desenvolvedor (arquitetura) |

---

## Rastreabilidade PRD

| Referência PRD | Seção / item |
|----------------|--------------|
| RF-01 | Biblioteca de exercícios |
| RF-13 | Persistência local |
| UC-01 | Montar ficha de treino |
