# Sessão de Treino

> **Prioridade:** Must (P0)  
> **Status:** Rascunho  
> **Jornada(s):** Executar treino do dia

---

## Resumo

Núcleo operacional do app: executa a ficha do dia, registra reps e carga série a série, aciona timer de descanso configurável, permite retomar sessão interrompida e conclui o treino somente quando todos os exercícios estão finalizados.

---

## Contexto

### Problema que resolve
Substitui o registro manual no bloco de notas durante o treino, com fluxo estruturado e persistência offline imediata.

### Objetivos de negócio atendidos
| Objetivo (PRD) | Como esta feature contribui |
|----------------|----------------------------|
| Objetivo 1 — Substituir bloco de notas | Registro série a série na academia |
| Objetivo 3 — Consistência de treino | Gera evento de conclusão para calendário (RN-04) |
| Objetivo 2 — Evolução visível | Produz dados de séries para métricas futuras |

---

## Atores e permissões

| Ator / Persona | O que pode fazer nesta feature |
|----------------|-------------------------------|
| Praticante de musculação | Iniciar treino; registrar séries; usar timer; concluir treino; retomar sessão |

---

## Casos de uso e user stories

| ID | Caso de uso / User story | Prioridade |
|----|--------------------------|------------|
| UC-02 | Como praticante, quero registrar reps e carga após cada série | Must |
| UC-03 | Como praticante, quero concluir o treino quando todos os exercícios estiverem feitos | Must |

### Fluxo principal
1. Usuário seleciona ficha e inicia sessão de treino
2. App exibe primeiro exercício com séries planejadas, faixa de reps e descanso
3. Após executar série, usuário informa reps e carga
4. App marca série concluída e inicia timer de descanso do exercício
5. Repete até concluir todas as séries do exercício; exercício marcado como concluído
6. Avança para próximo exercício até completar todos
7. Botão **Concluir treino** habilita; usuário confirma
8. Sessão persistida como concluída; evento emitido para calendário

### Fluxos alternativos e exceções
| Cenário | Comportamento esperado |
|---------|------------------------|
| Usuário sai do app no meio do treino | Sessão em andamento persistida; retomada ao reabrir (RF-18) |
| Exercícios pendentes | Botão **Concluir treino** desabilitado; indicador visual de pendentes (RN-01) |
| Sem conexão | Fluxo completo offline |
| Timer em background | Contagem continua ou recupera tempo restante ao retornar [definir na arquitetura] |
| Múltiplos treinos no mesmo dia | Permitido; cada sessão concluída é independente |
| Reps fora da faixa planejada | Aceitar sem validação ou aviso |
| Timer em background | Comportamento definido na fase de arquitetura |

---

## Requisitos funcionais

| ID | Requisito | Descrição | Rastreabilidade PRD |
|----|-----------|-----------|---------------------|
| RF-04 | Registro série a série | Reps e carga após cada série | UC-02 |
| RF-05 | Timer de descanso | Timer automático pós-série; alerta ao término | UC-02 |
| RF-06 | Conclusão de exercício | Exercício concluído quando todas séries registradas | UC-03 |
| RF-07 | Conclusão de treino | Botão habilitado só com todos exercícios concluídos | UC-03, RN-01 |
| RF-18 | Sessão em andamento | Pausar e retomar sem perda de dados | Should |
| RF-13 | Persistência local | Sessão e séries em SQLite offline | UC-02 |
| RF-16 | Unidades | Input de carga na unidade preferida do usuário | UC-02, RN-02 |

---

## Regras de negócio

| ID | Regra | Condição | Ação / resultado |
|----|-------|----------|------------------|
| RN-01 | Conclusão de treino | Exercícios pendentes | Botão **Concluir treino** desabilitado |
| RN-02 | Unidades | Carga informada em lb ou kg | Armazenar em kg internamente; exibir na unidade do usuário |
| RN-04 | Marcação no calendário | Treino concluído via botão | Emitir evento de conclusão para CalendarioTreinos |
| RN-05 | Cálculo de volume | Série com reps R e carga C | Volume = R × C |

---

## Requisitos não funcionais (escopo desta feature)

| Categoria | Requisito | Critério de aceite |
|-----------|-----------|-------------------|
| Performance | Registrar série + iniciar timer | ≤ 500 ms |
| Usabilidade | Registrar série | ≤ 3 toques após abrir exercício |
| Usabilidade | Timer visível | Contagem visível; alerta sonoro/vibratório ao término |
| Disponibilidade offline | Treino completo sem rede | 100% funcional offline |

---

## Dados e integrações

### Entidades / dados manipulados
| Entidade | Campos relevantes | Observações |
|----------|-------------------|-------------|
| WorkoutSession | id, planId, planSnapshot, startedAt, completedAt, status | Snapshot da ficha no início (RN-03) |
| SessionExercise | id, sessionId, exerciseId, order, plannedSets, repMin, repMax, restSeconds | Cópia dos parâmetros da ficha |
| SetLog | id, sessionExerciseId, setNumber, reps, loadKg, completedAt | Uma entrada por série |

### Integrações
| Sistema / Feature | Tipo | Propósito |
|-------------------|------|-----------|
| GerenciamentoFichas | Entrada | Ficha a executar |
| CalendarioTreinos | Saída | Evento de conclusão (RN-04) |
| EvolucaoProgresso | Saída | Dados de séries para métricas |
| ExportacaoHistorico | Saída | Dados exportáveis |
| ConfiguracoesApp | Entrada | Unidades, idioma e preferência de alerta do timer |

---

## Dependências

### Features (internas)
| Feature | Tipo | Descrição |
|---------|------|-----------|
| GerenciamentoFichas | Bloqueante | Ficha existente para executar |
| ConfiguracoesApp | Integração | Unidades na entrada de carga |

### Ordem relativa
- **Pode iniciar após:** GerenciamentoFichas
- **Desbloqueia:** CalendarioTreinos, EvolucaoProgresso, ExportacaoHistorico

---

## Critérios de aceite

- [ ] Usuário inicia treino a partir de ficha existente
- [ ] Registra reps e carga por série; série marcada como concluída
- [ ] Timer inicia automaticamente com descanso configurado no exercício
- [ ] Alerta ao fim do timer conforme preferência (som, vibração ou ambos)
- [ ] Reps aceitas sem validação de faixa planejada
- [ ] Múltiplos treinos podem ser concluídos no mesmo dia
- [ ] Exercício concluído após todas as séries planejadas
- [ ] **Concluir treino** desabilitado com exercícios pendentes
- [ ] **Concluir treino** habilitado e finaliza sessão com todos concluídos
- [ ] Sessão interrompida é retomada sem perda de dados
- [ ] Fluxo completo funciona offline
- [ ] Carga aceita na unidade configurada (kg/lb)

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

- Visualização de evolução e gráficos (EvolucaoProgresso)
- Calendário mensal (CalendarioTreinos)
- Exportação de arquivo (ExportacaoHistorico)

---

## Decisões de produto aplicadas

| Decisão | Resultado |
|---------|-----------|
| Múltiplos treinos/dia | **Permitido** |
| Validação de reps | **Não validar** — aceitar qualquer valor |
| Alerta do timer | **Configurável** em ConfiguracoesApp (som, vibração ou ambos) |

---

## Premissas

- [PREMISSA] Snapshot da ficha é capturado no início da sessão para preservar contexto histórico

---

## Perguntas em aberto

*Nenhuma pendência de produto.*

> **Resolvida na arquitetura:** timer em background via `expo-notifications` (ADR-005 em `.specs/architecture.md`).

---

## Rastreabilidade PRD

| Referência PRD | Seção / item |
|----------------|--------------|
| RF-04 | Registro série a série |
| RF-05 | Timer de descanso |
| RF-06 | Conclusão de exercício |
| RF-07 | Conclusão de treino |
| RF-18 | Sessão em andamento |
| RN-01 | Conclusão de treino |
| RN-02 | Unidades |
| RN-04 | Marcação no calendário |
| RN-05 | Cálculo de volume |
| UC-02 | Executar treino |
| UC-03 | Concluir treino |
