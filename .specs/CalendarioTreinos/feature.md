# Calendário de Treinos

> **Prioridade:** Must (P0)  
> **Status:** Rascunho  
> **Jornada(s):** Executar treino do dia, Analisar evolução e consistência

---

## Resumo

Exibe calendário mensal com marcação visual (check) nos dias em que o usuário concluiu treino, permitindo mensurar frequência e consistência de forma clara.

---

## Contexto

### Problema que resolve
No bloco de notas não há visão de dias treinados; o usuário não consegue avaliar consistência semanal ou mensal rapidamente.

### Objetivos de negócio atendidos
| Objetivo (PRD) | Como esta feature contribui |
|----------------|----------------------------|
| Objetivo 3 — Mensurar consistência | Calendário reflete automaticamente cada treino concluído |
| Objetivo 1 — Substituir bloco de notas | Frequência visível sem contagem manual |

---

## Atores e permissões

| Ator / Persona | O que pode fazer nesta feature |
|----------------|-------------------------------|
| Praticante de musculação | Visualizar calendário; ver dias treinados; consultar contador por período |

---

## Casos de uso e user stories

| ID | Caso de uso / User story | Prioridade |
|----|--------------------------|------------|
| UC-05 | Como praticante, quero ver no calendário os dias em que treinei | Must |
| — | Como praticante, quero saber quantos dias treinei na semana/mês | Should (RF-19) |

### Fluxo principal
1. Usuário acessa calendário de treinos
2. App exibe visão mensal com dias marcados (check) onde houve treino concluído
3. Usuário navega entre meses
4. Usuário visualiza contador de dias treinados no período (semana/mês/ano)

### Fluxos alternativos e exceções
| Cenário | Comportamento esperado |
|---------|------------------------|
| Nenhum treino concluído | Calendário vazio com mensagem orientativa |
| Múltiplos treinos no mesmo dia | Exibir check no dia + contador numérico (ex.: "2") quando > 1 treino |
| Toque em dia treinado | Exibir lista/resumo das sessões do dia (ficha, horário, exercícios) |

---

## Requisitos funcionais

| ID | Requisito | Descrição | Rastreabilidade PRD |
|----|-----------|-----------|---------------------|
| RF-08 | Calendário de treinos | Calendário mensal com check nos dias com treino concluído | UC-05, RN-04 |
| RF-19 | Contador de dias treinados | Total de dias no período selecionado | UC-05 |
| RF-13 | Persistência local | Dados derivados de sessões em SQLite | UC-05 |

---

## Regras de negócio

| ID | Regra | Condição | Ação / resultado |
|----|-------|----------|------------------|
| RN-04 | Marcação no calendário | Usuário conclui treino via SessaoTreino | Dia da conclusão recebe marcação |

---

## Requisitos não funcionais (escopo desta feature)

| Categoria | Requisito | Critério de aceite |
|-----------|-----------|-------------------|
| Performance | Renderizar calendário mensal | ≤ 500 ms |
| Usabilidade | Identificar dias treinados | Check visível sem legenda obrigatória |
| Disponibilidade offline | Consulta sem rede | 100% funcional offline |

---

## Dados e integrações

### Entidades / dados manipulados
| Entidade | Campos relevantes | Observações |
|----------|-------------------|-------------|
| WorkoutSession | completedAt, status | Fonte para dias marcados |
| CalendarDay (view) | date, sessionCount, hasWorkout | Projeção derivada |

### Integrações
| Sistema / Feature | Tipo | Propósito |
|-------------------|------|-----------|
| SessaoTreino | Entrada | Eventos de conclusão de treino |
| SQLite | Entrada | Consulta de sessões concluídas |
| ConfiguracoesApp | Entrada | Formatação de datas |

---

## Dependências

### Features (internas)
| Feature | Tipo | Descrição |
|---------|------|-----------|
| SessaoTreino | Bloqueante | Sessões concluídas geram marcações |

### Ordem relativa
- **Pode iniciar após:** SessaoTreino (primeira sessão concluída)
- **Desbloqueia:** Nenhuma

---

## Critérios de aceite

- [ ] Calendário mensal exibe check em dias com treino concluído
- [ ] Marcação ocorre automaticamente ao concluir treino (sem ação manual no calendário)
- [ ] Navegação entre meses funciona corretamente
- [ ] Contador exibe total de dias treinados na semana/mês/ano selecionado
- [ ] Funciona offline
- [ ] Dia com múltiplos treinos exibe check + contador (ex.: "2")
- [ ] Toque no dia lista sessões concluídas naquele dia
- [ ] Dias sem treino não exibem check

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

- Lembretes/notificações de treino
- Agendamento de fichas por dia da semana
- Gráficos de evolução (EvolucaoProgresso)

---

## Decisões de produto aplicadas

| Decisão | Resultado |
|---------|-----------|
| Múltiplos treinos/dia | **Permitido** — check + contador no calendário |

---

## Premissas

- [PREMISSA] Marcação usa data local do dispositivo no momento da conclusão

---

## Perguntas em aberto

*Nenhuma pendência de produto.*

---

## Rastreabilidade PRD

| Referência PRD | Seção / item |
|----------------|--------------|
| RF-08 | Calendário de treinos |
| RF-19 | Contador de dias treinados |
| RN-04 | Marcação no calendário |
| UC-05 | Ver calendário |
