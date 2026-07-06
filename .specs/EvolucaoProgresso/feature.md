# Evolução e Progresso

> **Prioridade:** Must (P0)  
> **Status:** Rascunho  
> **Jornada(s):** Analisar evolução e consistência

---

## Resumo

Transforma o histórico de treinos em insights acionáveis: evolução de carga por exercício, volume por sessão/semana, recordes pessoais (PRs) e gráficos temporais configuráveis por período.

---

## Contexto

### Problema que resolve
Comparar progresso manualmente no bloco de notas é trabalhoso e impreciso; o usuário precisa identificar estagnação ou evolução para ajustar o treino.

### Objetivos de negócio atendidos
| Objetivo (PRD) | Como esta feature contribui |
|----------------|----------------------------|
| Objetivo 2 — Evolução visível | Carga, volume, PRs e gráficos sem cálculo manual |
| Objetivo 1 — Substituir bloco de notas | Valor principal de longo prazo do app |

---

## Atores e permissões

| Ator / Persona | O que pode fazer nesta feature |
|----------------|-------------------------------|
| Praticante de musculação | Consultar métricas por exercício e período; visualizar PRs |

---

## Casos de uso e user stories

| ID | Caso de uso / User story | Prioridade |
|----|--------------------------|------------|
| UC-04 | Como praticante, quero ver minha evolução de carga, volume e PRs para ajustar meu treino | Must |

### Fluxo principal
1. Usuário acessa área de evolução/estatísticas
2. Seleciona exercício ou visão geral
3. Define período (semana, mês, customizado)
4. App exibe carga ao longo do tempo, volume agregado e PRs
5. Gráfico temporal da métrica selecionada é renderizado
6. Usuário identifica tendência de progresso ou estagnação

### Fluxos alternativos e exceções
| Cenário | Comportamento esperado |
|---------|------------------------|
| Histórico < 2 sessões para exercício | Mensagem indicando dados insuficientes (meta PRD: ≥ 2 sessões) |
| Sem treinos registrados | Estado vazio com orientação para executar primeiro treino |
| Troca de unidades | Métricas exibidas na unidade preferida (RN-02) |
| Novo PR registrado | Destaque visual na sessão e na tela de evolução (RN-06) |

---

## Requisitos funcionais

| ID | Requisito | Descrição | Rastreabilidade PRD |
|----|-----------|-----------|---------------------|
| RF-09 | Evolução de carga | Carga máxima ou média por exercício ao longo do tempo | UC-04 |
| RF-10 | Volume de treino | Volume (séries × reps × carga) por sessão e semanal | UC-04, RN-05 |
| RF-11 | Recordes pessoais | Melhor carga **e** melhor volume por exercício (PRs distintos) | UC-04, RN-06 |
| RF-12 | Gráficos temporais | Visualização gráfica por período configurável | UC-04 |
| RF-16 | Unidades | Métricas na unidade preferida | UC-04, RN-02 |

---

## Regras de negócio

| ID | Regra | Condição | Ação / resultado |
|----|-------|----------|------------------|
| RN-05 | Cálculo de volume | Série com reps R e carga C | Volume da série = R × C |
| RN-06 | Recorde pessoal de carga | Nova série com carga maior que PR histórico | PR de carga atualizado e destacado |
| RN-06b | Recorde pessoal de volume | Nova série com volume (R×C) maior que PR histórico | PR de volume atualizado e destacado |
| RN-02 | Unidades | Exibição em lb ou kg | Converter na apresentação; base interna em kg |

---

## Requisitos não funcionais (escopo desta feature)

| Categoria | Requisito | Critério de aceite |
|-----------|-----------|-------------------|
| Performance | Carregar gráficos | ≤ 2 s para histórico de até 1 ano |
| Disponibilidade offline | Consulta sem rede | 100% funcional offline |
| Usabilidade | Comparar evolução | Selecionar exercício e ver gráfico em ≤ 4 toques |

---

## Dados e integrações

### Entidades / dados manipulados
| Entidade | Campos relevantes | Observações |
|----------|-------------------|-------------|
| SetLog | reps, loadKg, completedAt | Fonte primária de métricas |
| WorkoutSession | completedAt | Agregação por sessão/semana |
| PersonalRecord (view) | exerciseId, bestLoadKg, bestVolume, loadAchievedAt, volumeAchievedAt | Dois PRs independentes por exercício |

### Integrações
| Sistema / Feature | Tipo | Propósito |
|-------------------|------|-----------|
| SessaoTreino | Entrada | Histórico de séries e sessões |
| ConfiguracoesApp | Entrada | Unidades e formatação |
| SQLite | Entrada | Agregações e consultas |

---

## Dependências

### Features (internas)
| Feature | Tipo | Descrição |
|---------|------|-----------|
| SessaoTreino | Bloqueante | Dados de séries concluídas |

### Ordem relativa
- **Pode iniciar após:** SessaoTreino (com sessões concluídas para testar)
- **Desbloqueia:** Nenhuma

---

## Critérios de aceite

- [ ] Usuário visualiza evolução de carga por exercício em tabela e/ou gráfico
- [ ] Volume exibido por sessão e agregado semanal
- [ ] PRs de carga e volume identificados e destacados separadamente por exercício
- [ ] Gráfico temporal obrigatório por exercício/métrica (não adiar)
- [ ] Estado vazio quando histórico insuficiente (< 2 sessões)
- [ ] Métricas respeitam unidade configurada (kg/lb)
- [ ] Funciona offline
- [ ] Novo PR destacado ao ser alcançado em sessão

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

- Calendário de frequência (CalendarioTreinos)
- Exportação de dados (ExportacaoHistorico)
- Recomendações automáticas de progressão de carga

---

## Decisões de produto aplicadas

| Decisão | Resultado |
|---------|-----------|
| PRs | **Ambos** — melhor carga e melhor volume por exercício |
| Gráficos no MVP | **Obrigatórios** — não substituir só por tabelas |

---

## Premissas

- [PREMISSA] PR de carga = maior carga em série única; PR de volume = maior (reps × carga) em série única

---

## Perguntas em aberto

*Nenhuma pendência de produto.*

---

## Rastreabilidade PRD

| Referência PRD | Seção / item |
|----------------|--------------|
| RF-09 | Evolução de carga |
| RF-10 | Volume de treino |
| RF-11 | Recordes pessoais |
| RF-12 | Gráficos temporais |
| RN-05 | Cálculo de volume |
| RN-06 | Recorde pessoal |
| UC-04 | Consultar evolução |
