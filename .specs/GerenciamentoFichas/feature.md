# Gerenciamento de Fichas

> **Prioridade:** Must (P0)  
> **Status:** Rascunho  
> **Jornada(s):** Preparar e manter fichas de treino

---

## Resumo

Permite criar, editar, duplicar e arquivar fichas de treino com exercícios da biblioteca, definindo séries, faixa de repetições e tempo de descanso. Preserva histórico de treinos concluídos mesmo quando a ficha é alterada.

---

## Contexto

### Problema que resolve
O usuário segue fichas fixas que mudam periodicamente; precisa flexibilidade para atualizar rotinas sem perder registros passados.

### Objetivos de negócio atendidos
| Objetivo (PRD) | Como esta feature contribui |
|----------------|----------------------------|
| Objetivo 1 — Substituir bloco de notas | Estrutura a preparação do treino de forma organizada |
| Objetivo 2 — Evolução visível | Mantém integridade do histórico ao editar fichas (RN-03) |

---

## Atores e permissões

| Ator / Persona | O que pode fazer nesta feature |
|----------------|-------------------------------|
| Praticante de musculação | CRUD de fichas; adicionar/remover/reordenar exercícios; definir parâmetros; arquivar (sem exclusão) |

---

## Casos de uso e user stories

| ID | Caso de uso / User story | Prioridade |
|----|--------------------------|------------|
| UC-01 | Como praticante, quero montar uma ficha de treino para seguir minha rotina | Must |
| UC-08 | Como praticante, quero editar uma ficha existente sem apagar meu histórico | Must |

### Fluxo principal — Criar ficha
1. Usuário acessa lista de fichas e toca em criar nova
2. Define nome da ficha (ex.: "Treino A")
3. Adiciona exercícios da biblioteca
4. Para cada exercício, define séries planejadas, faixa de reps (mín–máx) e descanso (segundos)
5. Salva ficha

### Fluxo principal — Editar ficha
1. Usuário seleciona ficha existente
2. Altera exercícios ou parâmetros
3. Salva alterações
4. Treinos já concluídos mantêm snapshot original da sessão

### Fluxos alternativos e exceções
| Cenário | Comportamento esperado |
|---------|------------------------|
| Ficha sem exercícios | Impedir salvar; exibir validação |
| Duplicar ficha | Criar cópia com sufixo "(cópia)" para variar rotina rapidamente |
| Arquivar ficha | Ocultar da lista ativa sem apagar histórico vinculado |
| Tentativa de excluir ficha | Ação indisponível; orientar usuário a arquivar |

---

## Requisitos funcionais

| ID | Requisito | Descrição | Rastreabilidade PRD |
|----|-----------|-----------|---------------------|
| RF-02 | CRUD de fichas | Criar, editar, duplicar e arquivar fichas | UC-01, UC-08 |
| RF-03 | Parâmetros por exercício | Séries, faixa reps (mín–máx), descanso (s) | UC-01 |
| RF-17 | Preservação de histórico | Edição não altera sessões concluídas | UC-08, RN-03 |
| RF-13 | Persistência local | Fichas em SQLite, offline | UC-01 |

---

## Regras de negócio

| ID | Regra | Condição | Ação / resultado |
|----|-------|----------|------------------|
| RN-03 | Integridade do histórico | Ficha editada após treinos registrados | Sessões passadas mantêm snapshot dos dados da execução |

---

## Requisitos não funcionais (escopo desta feature)

| Categoria | Requisito | Critério de aceite |
|-----------|-----------|-------------------|
| Usabilidade | Criar ficha básica | Ficha com 5 exercícios configurável em ≤ 5 min |
| Disponibilidade offline | CRUD sem rede | 100% funcional offline |
| Performance | Salvar ficha | Persistência em ≤ 500 ms |

---

## Dados e integrações

### Entidades / dados manipulados
| Entidade | Campos relevantes | Observações |
|----------|-------------------|-------------|
| WorkoutPlan | id, name, status (active/archived), createdAt, updatedAt | Ficha/rotina |
| PlanExercise | id, planId, exerciseId, order, plannedSets, repMin, repMax, restSeconds | Exercício na ficha |

### Integrações
| Sistema / Feature | Tipo | Propósito |
|-------------------|------|-----------|
| BibliotecaExercicios | Entrada | Seleção de exercícios |
| SessaoTreino | Saída | Fornece ficha para execução |
| SQLite | Bidirecional | Persistência |

---

## Dependências

### Features (internas)
| Feature | Tipo | Descrição |
|---------|------|-----------|
| BibliotecaExercicios | Bloqueante | Exercícios selecionáveis |
| ConfiguracoesApp | Integração | Labels e formatação de UI |

### Ordem relativa
- **Pode iniciar após:** BibliotecaExercicios
- **Desbloqueia:** SessaoTreino

---

## Critérios de aceite

- [ ] Usuário cria ficha com nome e ≥ 1 exercício da biblioteca
- [ ] Usuário define séries, faixa de reps e descanso por exercício
- [ ] Usuário edita, duplica e arquiva fichas existentes
- [ ] Exclusão de ficha não está disponível; apenas arquivar
- [ ] Após editar ficha, treinos concluídos anteriormente exibem dados originais da sessão
- [ ] Validação impede salvar ficha vazia
- [ ] Operações funcionam offline

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

- Execução e registro de séries (SessaoTreino)
- Seleção automática da ficha do dia por dia da semana [PREMISSA: usuário escolhe manualmente no MVP]

---

## Decisões de produto aplicadas

| Decisão | Resultado |
|---------|-----------|
| Ficha com histórico | **Só arquivar** — exclusão permanente não permitida |

---

## Premissas

- [PREMISSA] Usuário seleciona manualmente qual ficha executar no dia (sem agendamento por dia da semana no MVP)

---

## Perguntas em aberto

*Nenhuma pendência de produto.*

---

## Rastreabilidade PRD

| Referência PRD | Seção / item |
|----------------|--------------|
| RF-02 | CRUD de fichas |
| RF-03 | Parâmetros por exercício |
| RF-17 | Preservação de histórico |
| RN-03 | Integridade do histórico |
| UC-01 | Montar ficha |
| UC-08 | Editar ficha |
