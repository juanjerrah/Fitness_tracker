# Tasks — Fitness Tracker — Mobile

> **Escopo:** Sistema completo (7 features)  
> **Frente:** Mobile (Expo / React Native)  
> **Arquitetura:** `.specs/architecture.md`  
> **Módulos:** `.specs/modules.md`  
> **Origem:** PRD v1.1 + features `.specs/*/feature.md`  
> **Data:** 2026-07-05  
> **Gerado por:** Engenheiro de Software (skill)

---

## Resumo da frente

Esta frente entrega o **app mobile completo** offline-first: bootstrap Expo + Drizzle, 7 módulos de domínio, telas Expo Router, timer com notificações, gráficos e exportação. **43 tasks** em 7 ondas sequenciais. Premissa: projeto greenfield — MO-001 cria o repositório de código.

---

## Módulos desta frente

| Módulo | Caminho | Ação | Tasks |
|--------|---------|------|-------|
| `database` | `src/data/db/` | Criar | MO-002, MO-006 |
| `settings` | `use-cases/settings/` | Criar | MO-007, MO-013, MO-014 |
| `exercises` | `use-cases/exercises/` | Criar | MO-008, MO-015–017 |
| `plans` | `use-cases/plans/` | Criar | MO-009, MO-018–021 |
| `sessions` | `use-cases/sessions/` | Criar | MO-010, MO-023–029 |
| `notifications` | `infrastructure/notifications/` | Criar | MO-027 |
| `calendar` | `use-cases/calendar/` | Criar | MO-011, MO-031–032 |
| `analytics` | `use-cases/analytics/` | Criar | MO-012, MO-033–035 |
| `export` | `use-cases/export/` | Criar | MO-037–039 |
| `shared-ui` / i18n | `src/ui/`, `src/i18n/` | Criar | MO-003–005, MO-014, MO-040–043 |

---

## Contexto técnico

| Item | Valor |
|------|-------|
| **Stack** | Expo SDK (latest stable), TypeScript strict, Expo Router, Zustand, expo-sqlite, Drizzle, i18next, victory-native, expo-notifications |
| **Padrões** | Clean Architecture, Repository pattern, DI container, ADR-001–006 |
| **Segurança** | Validação em use cases; sem rede; export explícito; Drizzle parametrizado |
| **Dependências externas** | Nenhuma frente além de mobile no MVP |

---

## Ordem de execução (ondas)

### Onda 1 — Bootstrap (MO-001 → MO-005)
### Onda 2 — Data layer (MO-006 → MO-012) — após Onda 1
### Onda 3 — Core: settings, exercises, plans (MO-013 → MO-022) — após Onda 2
### Onda 4 — Workout (MO-023 → MO-030) — após Onda 3
### Onda 5 — Insights (MO-031 → MO-036) — após Onda 4
### Onda 6 — Export (MO-037 → MO-039) — após Onda 4
### Onda 7 — Polish (MO-040 → MO-043) — após Ondas 5–6

### Paralelização possível

- **Após MO-006:** MO-007..MO-012 repositórios em paralelo (dev solo: sequencial)
- **Após MO-022:** MO-031..MO-036 (insights) paralelo com MO-037..MO-039 (export)

---

## Tasks

### MO-001 — Scaffold Expo + estrutura de pastas

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `shared-ui` — Criar |
| **Caminho** | raiz do repo |
| **Rastreabilidade** | ADR-001, ADR-006 |
| **Depende de** | — |
| **Desbloqueia** | MO-002..MO-005 |

#### Descrição

Criar app Expo com TypeScript, Expo Router (tabs template), ESLint/Prettier, estrutura `src/` conforme `architecture.md`.

#### Escopo

- [x] `npx create-expo-app@latest . --template tabs` (ou equivalente)
- [x] Pastas: `src/domain`, `src/data`, `src/infrastructure`, `src/ui`, `src/stores`, `src/shared/di`, `src/i18n`
- [x] `tsconfig.json` strict; path aliases `@/domain`, `@/data`, etc.
- [x] Scripts: `lint`, `typecheck`, `test`

#### Critérios de aceite

- [x] App inicia em iOS/Android simulator
- [x] Estrutura de pastas conforme architecture.md
- [x] ESLint passa sem erros

> **Concluída em:** 2026-07-05 — Expo SDK 57, tabs template; scaffold via `_expo_scaffold` (dir não vazio). Export web validado.

---

### MO-002 — Drizzle + expo-sqlite + migração v1

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `database` — Criar |
| **Rastreabilidade** | RF-13, ADR-002 |
| **Depende de** | MO-001 |
| **Desbloqueia** | MO-006 |

#### Descrição

Configurar expo-sqlite sync API, Drizzle ORM, drizzle-kit, client singleton e hook de inicialização no `_layout.tsx`.

#### Escopo

- [x] Instalar: `expo-sqlite`, `drizzle-orm`, `drizzle-kit`
- [x] `src/data/db/client.ts`, `drizzle.config.ts`
- [x] POC: insert + select em tabela de teste; remover após MO-006
- [x] Executar migrations no app start

#### Critérios de aceite

- [x] SQLite abre offline; migration roda idempotentemente
- [x] POC insert/query documentado em comentário ou teste

> **Concluída em:** 2026-07-05 — expo-sqlite + Drizzle; migration v1 POC `_poc_healthcheck`; `DatabaseProvider` no root layout.

### MO-003 — DI container e wiring base

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `shared-ui` — Criar |
| **Rastreabilidade** | architecture.md (injeção) |
| **Depende de** | MO-002 |
| **Desbloqueia** | MO-007+ |

#### Escopo

- [x] `src/shared/di/container.ts` — factory de repositórios e use cases
- [x] `src/shared/di/context.tsx` — React context para telas
- [x] Regra: telas só acessam use cases via hook `useAppContainer()`

> **Concluída em:** 2026-07-05 — Container com `db`; provider no root layout.

---

### MO-004 — i18n setup (i18next + expo-localization)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `i18n` — Criar |
| **Rastreabilidade** | RF-15, UC-07 |
| **Depende de** | MO-001 |
| **Desbloqueia** | MO-014, MO-040 |

#### Escopo

- [x] `src/i18n/index.ts`, locales `pt-BR.json`, `es-ES.json`, `en-US.json`
- [x] Detecção locale 1º launch; fallback `en-US`
- [x] Integrar no root `_layout.tsx`
- [x] Namespace `common` com strings de tabs e botões base

> **Concluída em:** 2026-07-05 — i18next + expo-localization; tabs traduzidas.

---

### MO-005 — Design system mínimo (UI shared)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P1 |
| **Estimativa** | M |
| **Módulo alvo** | `shared-ui` — Criar |
| **Depende de** | MO-001 |
| **Desbloqueia** | MO-013+ |

#### Escopo

- [x] `Button`, `Input`, `Card`, `Screen`, `EmptyState`, `Loading`
- [x] Tema cores/spacing consistente; suporte a safe area
- [x] `SetInputSheet` (bottom sheet reps + carga) — usado em MO-025

> **Concluída em:** 2026-07-05 — Design system em `src/ui/` + `@gorhom/bottom-sheet`.

---

### MO-006 — Schema Drizzle completo + índices

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `database` — Criar |
| **Rastreabilidade** | RF-13, RN-03, architecture ER |
| **Depende de** | MO-002 |
| **Desbloqueia** | MO-007..MO-012 |

#### Escopo

- [ ] `src/data/db/schema.ts`: `exercises`, `workout_plans`, `plan_exercises`, `workout_sessions`, `session_exercises`, `set_logs`, `user_settings`
- [ ] Índices: `idx_sessions_completed_at`, `idx_set_logs_session_exercise`, `idx_plan_exercises_plan`
- [ ] Migration v1 via drizzle-kit
- [ ] Entidades em `src/domain/entities/*.ts`

---

### MO-007 — Settings repository + use cases

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `settings` — Criar |
| **Rastreabilidade** | RF-15, RF-16, RF-21, RN-02 |
| **Depende de** | MO-006, MO-003 |
| **Desbloqueia** | MO-013 |

#### Escopo

- [ ] `ISettingsRepository`, `SettingsRepository`, mappers
- [ ] `GetSettingsUseCase`, `UpdateSettingsUseCase`
- [ ] Defaults: locale device, `metric`, `timerAlert: both`
- [ ] Seed row id=1 on first launch
- [ ] Testes unitários use cases

---

### MO-008 — Exercise repository + seed

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `exercises` — Criar |
| **Rastreabilidade** | RF-01, RF-20 |
| **Depende de** | MO-006 |
| **Desbloqueia** | MO-015 |

#### Escopo

- [ ] `IExerciseRepository`, `ExerciseRepository`
- [ ] `src/infrastructure/seed/exercises.json` (~8–12/grupo, 8 grupos)
- [ ] `SeedExercisesOnFirstLaunch` idempotente
- [ ] `ListExercisesByGroupUseCase`, `SearchExercisesUseCase`, `CreateCustomExerciseUseCase`
- [ ] i18n keys para exercícios seed em 3 locales

---

### MO-009 — Plan repository + use cases

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `plans` — Criar |
| **Rastreabilidade** | RF-02, RF-03, RF-17, RN-03, UC-01, UC-08 |
| **Depende de** | MO-006, MO-008 |
| **Desbloqueia** | MO-018 |

#### Escopo

- [ ] `IPlanRepository`, `PlanRepository` — transação plan + plan_exercises
- [ ] `CreatePlanUseCase`, `UpdatePlanUseCase`, `ArchivePlanUseCase`, `DuplicatePlanUseCase`, `ListActivePlansUseCase`
- [ ] Validação: ≥1 exercício, séries ≥1, repMin ≤ repMax, rest ≥0
- [ ] Sem delete — só `status: archived`
- [ ] Testes: update plan não altera sessions existentes

---

### MO-010 — Session repository + use cases (domínio)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | L |
| **Módulo alvo** | `sessions` — Criar |
| **Rastreabilidade** | RF-04–07, RF-18, RN-01, RN-03–05 |
| **Depende de** | MO-009 |
| **Desbloqueia** | MO-023 |

#### Escopo

- [ ] `ISessionRepository`, `SessionRepository`
- [ ] `StartSessionUseCase` — snapshot plan_exercises → session_exercises (ADR-003)
- [ ] `LogSetUseCase` — insert set_log; validar reps≥0, load≥0; RN-05 volume
- [ ] `CompleteExerciseUseCase`, `CompleteSessionUseCase` — RN-01
- [ ] `GetActiveSessionUseCase` — RF-18 retomada
- [ ] `load_kg` canônico; converter input via `lib/units.ts` + settings
- [ ] Testes unitários RN-01, RN-03, RN-05

---

### MO-011 — Calendar repository + use cases

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `calendar` — Criar |
| **Rastreabilidade** | RF-08, RF-19, RN-04 |
| **Depende de** | MO-010 |
| **Desbloqueia** | MO-031 |

#### Escopo

- [ ] `ICalendarRepository`, `CalendarRepository`
- [ ] `GetCalendarMonthUseCase` — dias com check + count se >1
- [ ] `GetSessionsByDateUseCase` — lista sessões do dia
- [ ] Query por `date(completed_at)` local timezone

---

### MO-012 — Analytics repository + use cases

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `analytics` — Criar |
| **Rastreabilidade** | RF-09–12, RN-06, RN-06b |
| **Depende de** | MO-010 |
| **Desbloqueia** | MO-033 |

#### Escopo

- [ ] `IAnalyticsRepository`, `AnalyticsRepository`
- [ ] `GetLoadHistoryUseCase` — série temporal por exerciseId
- [ ] `GetWeeklyVolumeUseCase` — agregação semanal
- [ ] `GetPersonalRecordsUseCase` — MAX(load_kg) e MAX(reps*load_kg) por exercise
- [ ] Testes com fixtures SQLite in-memory

---

### MO-013 — Tela Configurações

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `settings` — Estender (UI) |
| **Rastreabilidade** | UC-07, RF-15, RF-16, RF-21 |
| **Depende de** | MO-007, MO-004, MO-005 |
| **Desbloqueia** | MO-014 |

#### Escopo

- [ ] `app/(tabs)/settings.tsx`
- [ ] Pickers: idioma, unidades (kg/lb), alerta timer (som/vibração/ambos)
- [ ] Reflete imediatamente sem restart (RN-02)
- [ ] Link para exportação (MO-039)

---

### MO-014 — lib/units + formatação localizada

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `shared-ui` — Criar |
| **Rastreabilidade** | RN-02, RF-16 |
| **Depende de** | MO-007, MO-004 |
| **Desbloqueia** | MO-025, MO-033 |

#### Escopo

- [ ] `src/lib/units.ts`: `toDisplayKg`, `fromDisplayToKg`, `formatWeight`
- [ ] Hook `useWeightFormatter()` lê settings
- [ ] `src/lib/dates.ts` — formatação com locale i18n

---

### MO-015 — UI seletor de exercícios (modal)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `exercises` — Estender (UI) |
| **Rastreabilidade** | RF-01, UC-01 |
| **Depende de** | MO-008, MO-005 |
| **Desbloqueia** | MO-019 |

#### Escopo

- [ ] `ExercisePickerModal` — grupos expansíveis + busca
- [ ] Nomes seed via i18n; custom via `custom_name`
- [ ] Componente reutilizável em create/edit plan

---

### MO-016 — UI criar exercício customizado

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `exercises` — Estender (UI) |
| **Rastreabilidade** | RF-20 |
| **Depende de** | MO-015 |
| **Desbloqueia** | MO-019 |

#### Escopo

- [ ] Form: nome + grupo muscular
- [ ] `CreateCustomExerciseUseCase` on submit
- [ ] Exercício aparece imediatamente no picker

---

### MO-017 — Soft-delete exercício custom (sem vínculos)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P2 |
| **Estimativa** | S |
| **Módulo alvo** | `exercises` — Estender |
| **Rastreabilidade** | architecture.md (deleted_at) |
| **Depende de** | MO-008 |
| **Desbloqueia** | — |

#### Escopo

- [ ] Coluna `deleted_at` em exercises (migration v2 se necessário)
- [ ] `SoftDeleteCustomExerciseUseCase` — bloqueia se vinculado a plan ou session
- [ ] UI opcional na lista de exercícios custom

---

### MO-018 — Tela lista de fichas

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `plans` — Estender (UI) |
| **Rastreabilidade** | RF-02, UC-01 |
| **Depende de** | MO-009, MO-005 |
| **Desbloqueia** | MO-019 |

#### Escopo

- [ ] `app/(tabs)/plans/index.tsx` — lista fichas ativas
- [ ] Ações: criar, editar, duplicar, arquivar
- [ ] Empty state orientativo
- [ ] Sem opção excluir

---

### MO-019 — Tela criar/editar ficha

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `plans` — Estender (UI) |
| **Rastreabilidade** | RF-03, UC-01, UC-08 |
| **Depende de** | MO-018, MO-015 |
| **Desbloqueia** | MO-023 |

#### Escopo

- [ ] `app/(tabs)/plans/[id].tsx` e `plans/new.tsx`
- [ ] Adicionar/remover/reordenar exercícios
- [ ] Campos: séries, repMin, repMax, restSeconds por exercício
- [ ] Validação inline; salvar via use cases

---

### MO-020 — Tela Home / iniciar treino

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `sessions` — Estender (UI) |
| **Rastreabilidade** | UC-02 |
| **Depende de** | MO-019, MO-010 |
| **Desbloqueia** | MO-024 |

#### Escopo

- [ ] `app/(tabs)/index.tsx` — selecionar ficha + botão "Iniciar treino"
- [ ] Detectar sessão ativa (RF-18) → navegar para retomar
- [ ] `StartSessionUseCase` → redirect `app/workout/[sessionId]`

---

### MO-021 — Tab navigation final (5 tabs)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P1 |
| **Estimativa** | S |
| **Módulo alvo** | `shared-ui` — Estender |
| **Rastreabilidade** | ADR-006 |
| **Depende de** | MO-013, MO-018 |
| **Desbloqueia** | MO-031, MO-033 |

#### Escopo

- [ ] Tabs: Início, Fichas, Evolução, Calendário, Config
- [ ] Ícones + labels i18n
- [ ] Placeholders para Evolução/Calendário até ondas 5

---

### MO-022 — Testes integração repositórios (core)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P1 |
| **Estimativa** | M |
| **Módulo alvo** | `database` — Estender |
| **Depende de** | MO-007..MO-009 |
| **Desbloqueia** | MO-023 |

#### Escopo

- [ ] Testes integration: settings, exercises seed, plan CRUD + archive
- [ ] SQLite in-memory ou test db file

---

### MO-023 — Zustand store sessão + timer UI

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `sessions` — Estender |
| **Rastreabilidade** | RF-05, ADR-005 |
| **Depende de** | MO-010 |
| **Desbloqueia** | MO-024, MO-027 |

#### Escopo

- [ ] `src/stores/workoutStore.ts` — sessionId, currentExercise, restEndsAt
- [ ] Actions: syncFromDb, tickTimer, clearTimer
- [ ] Recalcular rest ao retornar do background

---

### MO-024 — Tela sessão de treino (lista exercícios)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `sessions` — Estender (UI) |
| **Rastreabilidade** | UC-02, RF-04, RF-06 |
| **Depende de** | MO-020, MO-023, MO-005 |
| **Desbloqueia** | MO-025 |

#### Escopo

- [ ] `app/workout/[sessionId].tsx`
- [ ] Lista session_exercises com progresso (séries feitas/planejadas)
- [ ] Indicador exercícios pendentes vs concluídos
- [ ] Botão **Concluir treino** disabled até RN-01

---

### MO-025 — UI registro de série (SetInputSheet)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `sessions` — Estender (UI) |
| **Rastreabilidade** | RF-04, RNF usabilidade (≤3 toques) |
| **Depende de** | MO-024, MO-014 |
| **Desbloqueia** | MO-026 |

#### Escopo

- [ ] Bottom sheet: reps + carga (unidade settings)
- [ ] Pré-preencher última carga do exercício
- [ ] Sem validação de faixa de reps (decisão produto)
- [ ] `LogSetUseCase` on confirm; ≤3 toques

---

### MO-026 — Fluxo concluir exercício + treino

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `sessions` — Estender |
| **Rastreabilidade** | RF-06, RF-07, RN-01, RN-04, UC-03 |
| **Depende de** | MO-025 |
| **Desbloqueia** | MO-031 |

#### Escopo

- [ ] Auto `CompleteExerciseUseCase` quando séries == plannedSets
- [ ] Botão **Concluir treino** → `CompleteSessionUseCase`
- [ ] Feedback visual PR se RN-06/06b (badge)
- [ ] Redirect pós-conclusão; invalidar calendar/analytics caches

---

### MO-027 — RestTimerService + expo-notifications

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `notifications` — Criar |
| **Rastreabilidade** | RF-05, RF-21, ADR-005 |
| **Depende de** | MO-023, MO-007 |
| **Desbloqueia** | MO-028 |

#### Escopo

- [ ] `RestTimerService.schedule/cancel`
- [ ] Notification id `rest-{sessionId}`
- [ ] Permissão solicitada no 1º treino
- [ ] Som/vibração conforme `UserSettings.timerAlert` + expo-haptics
- [ ] Fallback in-app se permissão negada

---

### MO-028 — UI countdown timer descanso

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `sessions` — Estender (UI) |
| **Rastreabilidade** | RF-05, RNF timer visível |
| **Depende de** | MO-027, MO-025 |
| **Desbloqueia** | MO-030 |

#### Escopo

- [ ] Componente `RestTimerBanner` fixo na tela workout
- [ ] Countdown 1s em foreground; sync ao resume
- [ ] Botão skip descanso (cancel notification)

---

### MO-029 — Testes use cases sessão

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P1 |
| **Estimativa** | M |
| **Módulo alvo** | `sessions` — Estender |
| **Depende de** | MO-010, MO-026 |
| **Desbloqueia** | MO-030 |

#### Escopo

- [ ] Testes: snapshot RN-03, RN-01 block complete, multi session/day
- [ ] Teste retomada RF-18

---

### MO-030 — Onda 4 DoD — treino E2E manual

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `sessions` — Validar |
| **Depende de** | MO-026..MO-028 |
| **Desbloqueia** | Onda 5 |

#### Critérios de aceite (feature SessaoTreino)

- [ ] Fluxo completo offline: iniciar → séries → timer → concluir
- [ ] Retomada após fechar app
- [ ] Múltiplos treinos/dia permitidos
- [ ] Critérios de aceite `SessaoTreino/feature.md` verificados

---

### MO-031 — Tela calendário mensal

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `calendar` — Estender (UI) |
| **Rastreabilidade** | RF-08, RF-19, UC-05 |
| **Depende de** | MO-011, MO-021, MO-030 |
| **Desbloqueia** | MO-032 |

#### Escopo

- [ ] `app/(tabs)/calendar.tsx` — grid mensal
- [ ] Check em dias treinados; badge count se >1
- [ ] Contador dias/semana/mês/ano
- [ ] Navegação meses

---

### MO-032 — Detalhe dia no calendário

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P1 |
| **Estimativa** | S |
| **Módulo alvo** | `calendar` — Estender (UI) |
| **Rastreabilidade** | CalendarioTreinos (toque no dia) |
| **Depende de** | MO-031 |

#### Escopo

- [ ] Modal/sheet: sessões do dia (ficha, horário, exercícios count)

---

### MO-033 — Tela evolução — seletor + tabela carga

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `analytics` — Estender (UI) |
| **Rastreabilidade** | RF-09, UC-04 |
| **Depende de** | MO-012, MO-021 |
| **Desbloqueia** | MO-034 |

#### Escopo

- [ ] `app/(tabs)/analytics.tsx`
- [ ] Seletor exercício + período
- [ ] Tabela carga por sessão
- [ ] Empty state histórico < 2 sessões

---

### MO-034 — Gráficos victory-native

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `analytics` — Estender (UI) |
| **Rastreabilidade** | RF-12 (obrigatório MVP) |
| **Depende de** | MO-033 |
| **Desbloqueia** | MO-036 |

#### Escopo

- [ ] Gráfico linha: carga × tempo
- [ ] Gráfico barra: volume semanal
- [ ] Render ≤2s para 1 ano (RNF)
- [ ] Spike: trocar lib se bundle excessivo — documentar decisão

---

### MO-035 — UI recordes pessoais (PRs)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `analytics` — Estender (UI) |
| **Rastreabilidade** | RF-11, RN-06, RN-06b |
| **Depende de** | MO-033 |

#### Escopo

- [ ] Card PR carga + PR volume por exercício
- [ ] Destaque na sessão quando novo PR (integração MO-026)

---

### MO-036 — Onda 5 DoD — insights

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Depende de** | MO-031..MO-035 |

#### Critérios de aceite

- [ ] CalendarioTreinos + EvolucaoProgresso feature.md critérios OK
- [ ] Gráficos obrigatórios presentes

---

### MO-037 — Export use case + JsonExporter

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | M |
| **Módulo alvo** | `export` — Criar |
| **Rastreabilidade** | RF-14, dump completo |
| **Depende de** | MO-010 |
| **Desbloqueia** | MO-039 |

#### Escopo

- [ ] `ExportFullDumpUseCase`
- [ ] `src/infrastructure/export/JsonExporter.ts`
- [ ] Schema version `1.0`; inclui settings, exercises, plans, sessions
- [ ] `docs/export-schema-v1.json`

---

### MO-038 — CsvExporter (séries flatten)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `export` — Criar |
| **Rastreabilidade** | RF-14 (CSV) |
| **Depende de** | MO-037 |
| **Desbloqueia** | MO-039 |

#### Escopo

- [ ] CSV flat de set_logs com metadados de sessão/exercício
- [ ] [PREMISSA] JSON = dump completo; CSV = séries flatten (spike ZIP adiado)

---

### MO-039 — Tela exportação + share sheet

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Módulo alvo** | `export` — Estender (UI) |
| **Rastreabilidade** | UC-06 |
| **Depende de** | MO-037, MO-038, MO-013 |

#### Escopo

- [ ] `app/settings/export.tsx` ou seção em settings
- [ ] Escolha JSON / CSV
- [ ] `expo-file-system` write + `expo-sharing.shareAsync`
- [ ] Disabled se sem histórico

---

### MO-040 — Script validação i18n keys

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P1 |
| **Estimativa** | S |
| **Módulo alvo** | `i18n` — Estender |
| **Rastreabilidade** | RNF i18n 100% |
| **Depende de** | MO-004 |

#### Escopo

- [ ] `scripts/check-i18n.ts` — compara chaves pt-BR, es-ES, en-US
- [ ] npm script `check:i18n`

---

### MO-041 — Empty states e error boundaries

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P1 |
| **Estimativa** | S |
| **Módulo alvo** | `shared-ui` — Estender |
| **Depende de** | Ondas 3–6 |

#### Escopo

- [ ] Empty states consistentes em todas as tabs
- [ ] Error boundary root com retry

---

### MO-042 — Performance pass (registro série + gráficos)

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P1 |
| **Estimativa** | S |
| **Rastreabilidade** | RNF performance |
| **Depende de** | MO-025, MO-034 |

#### Escopo

- [ ] Profiling LogSet ≤500ms
- [ ] Gráficos ≤2s; memoização queries

---

### MO-043 — MVP DoD final + checklist segurança

| Campo | Conteúdo |
|-------|----------|
| **Prioridade** | P0 |
| **Estimativa** | S |
| **Depende de** | MO-036, MO-039, MO-040..MO-042 |

#### Critérios de aceite

- [ ] PRD seção 11 — todos os Must
- [ ] architecture.md checklist segurança
- [ ] `npm audit` sem críticas
- [ ] Testes passando; app offline completo

---

## Integração entre ondas

| Onda | Entrega testável |
|------|------------------|
| 1–2 | DB + repos funcionais via testes |
| 3 | Fichas + settings + biblioteca na UI |
| 4 | Treino completo substitui bloco de notas |
| 5 | Calendário + evolução + gráficos |
| 6 | Export JSON/CSV |
| 7 | MVP release-ready |

---

## Definition of Done (frente mobile)

- [ ] MO-001..MO-043 implementadas nos módulos de `modules.md`
- [ ] Critérios de aceite das 7 features cobertos
- [ ] Controles de segurança de `architecture.md` aplicados
- [ ] Telas não importam `data/repositories` diretamente
- [ ] Testes: use cases core + integration repos
- [ ] App funciona 100% offline após instalação

---

## Premissas

- [PREMISSA] Desenvolvedor solo executa tasks sequencialmente por onda
- [PREMISSA] CSV MVP = flatten set_logs; JSON = dump completo
- [PREMISSA] EAS Build configurado apenas em MO-043 ou task futura se necessário

---

## Perguntas em aberto

| # | Pergunta | Impacto | Bloqueia |
|---|----------|---------|----------|
| 1 | CSV ZIP multi-file | Baixo | MO-038 (opcional upgrade) |
| 2 | victory-native vs alternativa | Médio | MO-034 (spike inline) |

---

## Próximo passo

Invocar skill **`dev`** com `tasks_mobile.md` e começar por **MO-001** (Onda 1).
