# Progresso de Implementação

> **Última atualização:** 2026-07-05 23:10  
> **Gerenciado por:** skill `dev`

---

## Resumo

| Status | Quantidade |
|--------|------------|
| ✅ Concluídas | 12 |
| 🔄 Em andamento | 0 |
| ⏳ Pendentes | 31 |
| 🚫 Bloqueadas | 0 |

**Feature ativa:** Fitness Tracker (sistema completo)  
**Frente ativa:** Mobile — `tasks_mobile.md`  
**Próxima task sugerida:** MO-013 — Tela Configurações (Onda 3)

---

## Legenda

| Status | Significado |
|--------|-------------|
| ✅ Concluída | Implementada, testada e critérios de aceite verificados |
| 🔄 Em andamento | Task em desenvolvimento nesta sessão |
| ⏳ Pendente | Ainda não iniciada |
| 🚫 Bloqueada | Dependência ou decisão pendente |

---

## Fitness Tracker (sistema completo)

> **Pasta:** `.specs/`

### Mobile — `tasks_mobile.md`

| Task | Título | Status | Concluída em | Commit / PR | Notas |
|------|--------|--------|--------------|-------------|-------|
| MO-001 | Scaffold Expo + estrutura de pastas | ✅ Concluída | 2026-07-05 | — | Expo SDK 57, tabs; export web OK |
| MO-002 | Drizzle + expo-sqlite + migração v1 | ✅ Concluída | 2026-07-05 | — | POC `_poc_healthcheck`; migrations no boot |
| MO-003 | DI container e wiring base | ✅ Concluída | 2026-07-05 | — | `useAppContainer()` + provider root |
| MO-004 | i18n setup (i18next + expo-localization) | ✅ Concluída | 2026-07-05 | — | pt-BR, es-ES, en-US; namespace common |
| MO-005 | Design system mínimo (UI shared) | ✅ Concluída | 2026-07-05 | — | Button…SetInputSheet; tema + safe area |
| MO-006 | Schema Drizzle completo + índices | ✅ Concluída | 2026-07-05 | — | 7 tabelas + índices; entities domain |
| MO-007 | Settings repository + use cases | ✅ Concluída | 2026-07-05 | — | Seed id=1; defaults device locale |
| MO-008 | Exercise repository + seed | ✅ Concluída | 2026-07-05 | — | 64 exercícios; i18n 3 locales |
| MO-009 | Plan repository + use cases | ✅ Concluída | 2026-07-05 | — | Transações; archive-only delete |
| MO-010 | Session repository + use cases (domínio) | ✅ Concluída | 2026-07-05 | — | Snapshot ADR-003; lib/units |
| MO-011 | Calendar repository + use cases | ✅ Concluída | 2026-07-05 | — | Query por date local |
| MO-012 | Analytics repository + use cases | ✅ Concluída | 2026-07-05 | — | PRs on-read; teste in-memory |
| MO-013 | Tela Configurações | ⏳ Pendente | — | — | |
| MO-014 | lib/units + formatação localizada | ⏳ Pendente | — | — | |
| MO-015 | UI seletor de exercícios (modal) | ⏳ Pendente | — | — | |
| MO-016 | UI criar exercício customizado | ⏳ Pendente | — | — | |
| MO-017 | Soft-delete exercício custom (sem vínculos) | ⏳ Pendente | — | — | |
| MO-018 | Tela lista de fichas | ⏳ Pendente | — | — | |
| MO-019 | Tela criar/editar ficha | ⏳ Pendente | — | — | |
| MO-020 | Tela Home / iniciar treino | ⏳ Pendente | — | — | |
| MO-021 | Tab navigation final (5 tabs) | ⏳ Pendente | — | — | |
| MO-022 | Testes integração repositórios (core) | ⏳ Pendente | — | — | |
| MO-023 | Zustand store sessão + timer UI | ⏳ Pendente | — | — | |
| MO-024 | Tela sessão de treino (lista exercícios) | ⏳ Pendente | — | — | |
| MO-025 | UI registro de série (SetInputSheet) | ⏳ Pendente | — | — | |
| MO-026 | Fluxo concluir exercício + treino | ⏳ Pendente | — | — | |
| MO-027 | RestTimerService + expo-notifications | ⏳ Pendente | — | — | |
| MO-028 | UI countdown timer descanso | ⏳ Pendente | — | — | |
| MO-029 | Testes use cases sessão | ⏳ Pendente | — | — | |
| MO-030 | Onda 4 DoD — treino E2E manual | ⏳ Pendente | — | — | |
| MO-031 | Tela calendário mensal | ⏳ Pendente | — | — | |
| MO-032 | Detalhe dia no calendário | ⏳ Pendente | — | — | |
| MO-033 | Tela evolução — seletor + tabela carga | ⏳ Pendente | — | — | |
| MO-034 | Gráficos victory-native | ⏳ Pendente | — | — | |
| MO-035 | UI recordes pessoais (PRs) | ⏳ Pendente | — | — | |
| MO-036 | Onda 5 DoD — insights | ⏳ Pendente | — | — | |
| MO-037 | Export use case + JsonExporter | ⏳ Pendente | — | — | |
| MO-038 | CsvExporter (séries flatten) | ⏳ Pendente | — | — | |
| MO-039 | Tela exportação + share sheet | ⏳ Pendente | — | — | |
| MO-040 | Script validação i18n keys | ⏳ Pendente | — | — | |
| MO-041 | Empty states e error boundaries | ⏳ Pendente | — | — | |
| MO-042 | Performance pass (registro série + gráficos) | ⏳ Pendente | — | — | |
| MO-043 | MVP DoD final + checklist segurança | ⏳ Pendente | — | — | |

---

## Histórico de conclusões

| Data | Feature | Frente | Task | Observação |
|------|---------|--------|------|------------|
| 2026-07-05 | Fitness Tracker | Mobile | MO-001 | Expo SDK 57 + estrutura src/ + ESLint/Prettier/Jest |
| 2026-07-05 | Fitness Tracker | Mobile | MO-002 | Drizzle + expo-sqlite + migration POC |
| 2026-07-05 | Fitness Tracker | Mobile | MO-003 | DI container + AppContainerProvider |
| 2026-07-05 | Fitness Tracker | Mobile | MO-004 | i18n pt/es/en + tabs traduzidas |
| 2026-07-05 | Fitness Tracker | Mobile | MO-005 | Design system + SetInputSheet |
| 2026-07-05 | Fitness Tracker | Mobile | MO-006 | Schema 7 tabelas + migration v1 |
| 2026-07-05 | Fitness Tracker | Mobile | MO-007 | Settings repo + use cases + seed |
| 2026-07-05 | Fitness Tracker | Mobile | MO-008 | Exercise repo + 64 seed + i18n |
| 2026-07-05 | Fitness Tracker | Mobile | MO-009 | Plan repo + CRUD use cases |
| 2026-07-05 | Fitness Tracker | Mobile | MO-010 | Session repo + RN-01/03/05 |
| 2026-07-05 | Fitness Tracker | Mobile | MO-011 | Calendar repo + use cases |
| 2026-07-05 | Fitness Tracker | Mobile | MO-012 | Analytics repo + PRs on-read |

---

## Bloqueios e pendências

| Task | Motivo | Desde | Ação necessária |
|------|--------|-------|-----------------|
| | | | |
