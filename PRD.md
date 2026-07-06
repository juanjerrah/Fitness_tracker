# PRD — Fitness Tracker (Gestão de Treinos de Musculação)

> **Versão:** 1.1  
> **Data:** 2026-07-05  
> **Autor:** Discovery com Product Manager  
> **Status:** Rascunho

---

## Resumo para stakeholders

Praticantes de musculação que registram treinos manualmente — hoje em blocos de notas — perdem organização e visibilidade de evolução ao longo do tempo. O Fitness Tracker é um app mobile multiplataforma, offline-first, para uso pessoal, que centraliza fichas de treino, registro série a série e métricas de progresso (carga, volume, PRs e gráficos). O MVP inclui biblioteca de exercícios por grupo muscular, timer de descanso configurável, calendário de dias treinados e exportação de histórico. Suporta três idiomas (pt-BR, es-ES, en-US) e unidades métricas ou imperiais conforme preferência do usuário. É um projeto solo em tempo livre, sem prazo fixo de lançamento.

---

## 1. Contexto e problema

### Situação atual

O usuário registra cada treino no bloco de notas do celular, anotando:

- Nome do exercício
- Quantidade de séries planejadas
- Faixa de repetições (margem alvo)
- Por série: número de repetições executadas e carga utilizada

A rotina segue uma ficha fixa (ex.: divisão semanal AB, ABC ou push/pull/legs), alterada periodicamente conforme o programa evolui.

### Problema

O registro em texto livre não oferece estrutura, consistência nos nomes dos exercícios nem visão agregada de progresso. Comparar evolução de carga, volume semanal, recordes pessoais ou frequência de treinos exige esforço manual e é propenso a erros.

### Impacto do problema

- Dificuldade em identificar progresso real (estagnação vs. evolução)
- Perda de histórico valioso em notas desorganizadas
- Impossibilidade de mensurar dias treinados de forma clara
- Tempo gasto reorganizando informações que um sistema estruturado resolveria automaticamente

---

## 2. Visão e objetivos

### Visão do produto

Ser o companheiro pessoal de treino que substitui o bloco de notas — organizado, confiável e sempre disponível offline — tornando a evolução na musculação visível e mensurável.

### Objetivos de negócio

| # | Objetivo | Métrica de sucesso | Meta |
|---|----------|-------------------|------|
| 1 | Substituir o bloco de notas no dia a dia | % de treinos registrados no app vs. notas | 100% dos treinos no app após 4 semanas de uso |
| 2 | Tornar a evolução visível | Usuário consegue consultar carga, volume, PRs e gráficos sem cálculo manual | Disponível para qualquer exercício com histórico ≥ 2 sessões |
| 3 | Mensurar consistência de treino | Dias treinados visíveis no calendário | Calendário reflete automaticamente cada treino concluído |
| 4 | Proteger o histórico local | Exportação funcional do histórico | Arquivo gerado com todos os treinos registrados |

### Objetivos fora de escopo deste PRD

- Monetização, assinaturas ou marketplace
- Rede social, compartilhamento público de treinos
- Integração com wearables (Apple Watch, Garmin, etc.)
- Planejamento nutricional

---

## 3. Usuários e stakeholders

### Personas / perfis de usuário

#### Persona 1 — Praticante de musculação (usuário principal)

- **Perfil:** Pessoa que treina musculação com ficha própria, uso pessoal, projeto desenvolvido pelo próprio usuário
- **Necessidades:** Montar e atualizar fichas; registrar séries durante o treino; ver evolução; saber quantos dias treinou; usar o app sem internet na academia
- **Dores atuais:** Bloco de notas desorganizado; sem gráficos; sem calendário de frequência; nomes de exercícios inconsistentes
- **Frequência de uso:** Diária (durante cada sessão de treino) + consultas semanais para análise de evolução

### Stakeholders

| Stakeholder | Papel | Interesse |
|-------------|-------|-----------|
| Usuário / desenvolvedor | Único usuário e builder | App útil no treino real; código sustentável em tempo livre |
| — | — | Sem stakeholders externos no MVP |

---

## 4. Escopo

### Dentro do escopo (MVP)

- [ ] Biblioteca de exercícios agrupados por grupo muscular
- [ ] Exercícios customizados criados pelo usuário
- [ ] Criação, edição e troca de fichas/rotinas de treino (flexível, histórico preservado; apenas arquivar, sem exclusão)
- [ ] Execução de treino: registro série a série (reps + carga); múltiplos treinos no mesmo dia permitidos
- [ ] Timer de descanso configurável por exercício; alerta (som/vibração) configurável nas preferências
- [ ] Conclusão de treino com regra de desbloqueio (todos os exercícios concluídos)
- [ ] Calendário com marcação automática de dias treinados (check + contador se > 1 treino/dia)
- [ ] Evolução: carga por exercício, volume por treino/semana, PRs de carga e volume, gráficos temporais (obrigatórios no MVP)
- [ ] Armazenamento local offline (SQLite)
- [ ] Exportação em JSON ou CSV (dump completo: sessões, fichas, configurações, biblioteca)
- [ ] Internacionalização: pt-BR, es-ES, en-US
- [ ] Preferência de unidades: métrico (kg) ou imperial (lb)
- [ ] App multiplataforma (iOS e Android)

### Fora do escopo

| Item | Motivo |
|------|--------|
| Personal trainer / multiusuário | Explicitamente excluído do MVP; uso pessoal |
| Conta, login e sincronização em nuvem | Dados locais; sem backend no MVP |
| Importação automática do bloco de notas | Complexidade alta; exportação manual é suficiente no MVP |
| Vídeos ou instruções de execução de exercícios | Foco em registro e evolução, não em conteúdo educativo |
| Notificações push / lembretes de treino | Pode entrar em fase futura |
| Backup automático em nuvem | Exportação manual cobre necessidade imediata |

### Fases futuras (backlog de produto)

- Importação de dados (CSV/JSON)
- Backup/restauração automática (nuvem ou arquivo)
- Lembretes e notificações de treino
- Suporte a personal trainers e alunos
- Integração com wearables
- RPE (percepção de esforço) e tempo de descanso registrado por série
- Temas e personalização visual

---

## 5. Jornada do usuário e casos de uso

### Fluxo principal — Executar treino do dia

1. Usuário abre o app e seleciona a ficha/rotina do dia (ex.: Treino A)
2. App exibe lista de exercícios planejados com séries, faixa de reps e tempo de descanso configurado
3. Usuário inicia o primeiro exercício e executa a série
4. Após a série, registra reps e carga; app marca a série como concluída
5. Timer de descanso inicia automaticamente com duração definida para aquele exercício
6. Repete passos 3–5 até concluir todas as séries de todos os exercícios
7. Botão **Concluir treino** é habilitado somente quando todos os exercícios estão concluídos
8. Usuário toca em **Concluir treino**; calendário marca o dia; sessão entra no histórico

### Fluxo principal — Consultar evolução

1. Usuário acessa área de evolução/estatísticas
2. Seleciona exercício, período ou visão (semana/mês)
3. App exibe carga ao longo do tempo, volume agregado, PRs e gráficos
4. Usuário identifica progresso ou estagnação para ajustar treino

### Fluxo principal — Gerenciar ficha

1. Usuário acessa rotinas/fichas
2. Cria nova ficha ou edita existente (adiciona/remove exercícios da biblioteca, define séries, faixa de reps, descanso)
3. Salva alterações; histórico de treinos anteriores permanece intacto

### Casos de uso

| ID | Caso de uso | Ator | Pré-condições | Fluxo principal | Pós-condições | Prioridade |
|----|-------------|------|---------------|-----------------|---------------|------------|
| UC-01 | Montar ficha de treino | Praticante | Biblioteca de exercícios disponível | Criar ficha → adicionar exercícios → definir séries, reps e descanso → salvar | Ficha disponível para execução | Must |
| UC-02 | Executar treino e registrar séries | Praticante | Ficha do dia definida | Abrir treino → registrar reps/carga por série → timer de descanso | Séries registradas no histórico da sessão | Must |
| UC-03 | Concluir treino | Praticante | Todos exercícios da ficha concluídos | Tocar em Concluir treino | Sessão finalizada; calendário atualizado | Must |
| UC-04 | Consultar evolução | Praticante | ≥ 1 treino registrado | Selecionar métrica/exercício/período → visualizar dados | Usuário vê progresso | Must |
| UC-05 | Ver calendário de treinos | Praticante | ≥ 1 treino concluído | Abrir calendário → visualizar dias marcados | Frequência visível | Must |
| UC-06 | Exportar histórico | Praticante | ≥ 1 treino registrado | Acessar exportação → gerar arquivo | Arquivo salvo/compartilhado | Must |
| UC-07 | Configurar idioma e unidades | Praticante | App instalado | Acessar configurações → escolher idioma e sistema de unidades | UI e valores exibidos conforme preferência | Must |
| UC-08 | Editar ficha existente | Praticante | Ficha criada | Editar exercícios/parâmetros → salvar | Nova versão da ficha; histórico anterior preservado | Must |

### Cenários de exceção

| Cenário | Comportamento esperado |
|---------|------------------------|
| Usuário sai do app no meio do treino | Sessão em andamento é persistida localmente; retomada ao reabrir |
| Usuário tenta concluir treino com exercícios pendentes | Botão **Concluir treino** permanece desabilitado; feedback visual de exercícios incompletos |
| Treino sem conexão | App funciona normalmente (offline-first) |
| Exportação sem dados | Ação desabilitada ou mensagem informando ausência de histórico |
| Troca de unidades (kg ↔ lb) | Cargas exibidas convertidas; dados armazenados em unidade canônica interna |

---

## 6. Requisitos funcionais

| ID | Requisito | Descrição | Prioridade | Rastreabilidade |
|----|-----------|-----------|------------|-----------------|
| RF-01 | Biblioteca de exercícios | Listar exercícios agrupados por grupo muscular (ex.: peito, costas, pernas, ombros, bíceps, tríceps, abdômen, glúteos) | Must | UC-01 |
| RF-02 | CRUD de fichas | Criar, editar, duplicar e arquivar fichas; exclusão permanente não permitida | Must | UC-01, UC-08 |
| RF-03 | Parâmetros por exercício na ficha | Definir séries planejadas, faixa de repetições (mín–máx) e tempo de descanso (segundos) | Must | UC-01 |
| RF-04 | Registro série a série | Após cada série, registrar reps executadas e carga utilizada | Must | UC-02 |
| RF-05 | Timer de descanso | Iniciar timer automático após registro da série; duração conforme exercício; alerta ao término | Must | UC-02 |
| RF-06 | Conclusão de exercício | Marcar exercício como concluído quando todas as séries planejadas forem registradas | Must | UC-03 |
| RF-07 | Conclusão de treino | Botão habilitado apenas quando todos os exercícios da ficha estiverem concluídos | Must | UC-03, RN-01 |
| RF-08 | Calendário de treinos | Calendário mensal com check nos dias treinados; contador se > 1 treino/dia | Must | UC-05 |
| RF-09 | Evolução de carga | Gráfico/tabela de carga máxima ou média por exercício ao longo do tempo | Must | UC-04, Objetivo 2 |
| RF-10 | Volume de treino | Calcular e exibir volume (séries × reps × carga) por sessão e agregado semanal | Must | UC-04, Objetivo 2 |
| RF-11 | Recordes pessoais (PRs) | PR de melhor carga e PR de melhor volume por exercício | Must | UC-04, Objetivo 2 |
| RF-12 | Gráficos temporais | Visualização gráfica de métricas selecionadas por período configurável | Must | UC-04 |
| RF-13 | Persistência local | Todos os dados armazenados em SQLite; sem dependência de rede | Must | UC-02 |
| RF-14 | Exportação | Gerar JSON ou CSV (escolha do usuário) com dump completo de dados | Must | UC-06 |
| RF-15 | i18n | Interface em pt-BR, es-ES e en-US; idioma selecionável nas configurações | Must | UC-07 |
| RF-16 | Unidades de medida | Usuário escolhe sistema métrico (kg) ou imperial (lb); cargas exibidas e inputadas na unidade escolhida | Must | UC-07, RN-02 |
| RF-17 | Preservação de histórico | Edição de ficha não altera nem apaga registros de treinos já concluídos | Must | UC-08, RN-03 |
| RF-18 | Sessão em andamento | Permitir pausar e retomar treino no mesmo dia sem perda de dados | Should | Cenário de exceção |
| RF-19 | Contador de dias treinados | Exibir total de dias treinados no período selecionado (semana/mês/ano) | Should | UC-05 |
| RF-20 | Exercícios customizados | Usuário cria exercícios com nome e grupo muscular além da biblioteca curada | Must | UC-01 |
| RF-21 | Alerta do timer | Preferência configurável: som, vibração ou ambos | Must | UC-07, UC-02 |

### Regras de negócio

| ID | Regra | Condição | Ação/resultado |
|----|-------|----------|----------------|
| RN-01 | Conclusão de treino | Nem todos os exercícios da ficha estão concluídos | Botão **Concluir treino** desabilitado |
| RN-02 | Unidades de medida | Usuário altera preferência de kg para lb (ou vice-versa) | Valores convertidos na exibição; armazenamento interno em unidade canônica (kg) |
| RN-03 | Integridade do histórico | Ficha é editada após treinos já registrados | Treinos passados mantêm snapshot dos dados registrados na sessão |
| RN-04 | Marcação no calendário | Usuário conclui treino via botão | Dia atual recebe marcação de treino realizado |
| RN-05 | Cálculo de volume | Série registrada com reps = R e carga = C | Volume da série = R × C (na unidade escolhida pelo usuário) |
| RN-06 | Recorde pessoal de carga | Nova série supera melhor carga histórica do exercício | PR de carga atualizado e destacado |
| RN-06b | Recorde pessoal de volume | Nova série supera melhor volume (reps × carga) histórico | PR de volume atualizado e destacado |

---

## 7. Requisitos não funcionais

| Categoria | Requisito | Critério de aceite |
|-----------|-----------|-------------------|
| Disponibilidade offline | App funciona sem conexão | 100% das funções do MVP operam offline após instalação |
| Performance | Registro de série e início de timer | Ação concluída em ≤ 500 ms em dispositivo médio (2 anos de idade) |
| Performance | Carregamento de gráficos | Gráficos renderizados em ≤ 2 s para histórico de até 1 ano |
| Usabilidade | Registro durante treino | Registrar uma série em ≤ 3 toques após abrir exercício |
| Usabilidade | Timer visível | Timer de descanso visível durante contagem; alerta sonoro/vibratório configurável |
| Compatibilidade | Multiplataforma | iOS 15+ e Android 10+ (versões mínimas a confirmar na estimativa técnica) |
| Internacionalização | i18n completo | 100% das strings de UI traduzidas nos 3 idiomas; formatação de data/número localizada |
| Localização | Unidades | Troca de unidades reflete imediatamente em toda a UI sem reinício do app |
| Segurança / privacidade | Dados locais | Sem transmissão de dados pessoais; sem coleta analítica obrigatória no MVP |
| Manutenibilidade | Projeto solo | Código modular; camada de dados desacoplada da UI; adequado para evolução em tempo livre |
| Armazenamento | SQLite | Schema versionado com migrações; sem perda de dados em atualizações do app |

---

## 8. Integrações e dependências

| Sistema/API | Tipo | Propósito | Responsável |
|-------------|------|-----------|-------------|
| SQLite | Banco local | Persistência de fichas, sessões, exercícios e configurações | Desenvolvedor |
| Sistema de arquivos do SO | Exportação | Salvar/compartilhar arquivo de histórico | Desenvolvedor |
| Framework i18n | Biblioteca | Traduções pt-BR, es-ES, en-US | Desenvolvedor |

*Nenhuma integração externa (API, nuvem, OAuth) no MVP.*

---

## 9. Restrições, premissas e riscos

### Restrições

- **Prazo:** Projeto solo em tempo livre; sem data fixa de lançamento
- **Orçamento:** Zero — desenvolvimento próprio
- **Tecnologia/equipe:** Único desenvolvedor; stack multiplataforma a definir na fase de arquitetura
- **Regulatório:** Sem tratamento de dados de terceiros; LGPD/GDPR de baixo risco (dados locais, sem conta)

### Premissas

- O usuário é o único utilizador do app no MVP
- A biblioteca de exercícios será pré-populada com lista curada (não depende de API externa)
- Cargas são armazenadas internamente em kg; conversão para exibição em lb
- Um treino por dia é o caso mais comum; **múltiplos treinos no mesmo dia são permitidos** (decisão 2026-07-05)
- Academia com conectividade instável — offline é requisito, não opcional

### Riscos

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| Perda de dados por troca/reset do aparelho | Média | Alto | Exportação em arquivo no MVP; documentar rotina de backup |
| Escopo grande para projeto solo | Alta | Alto | Priorizar Must; entregar em incrementos usáveis (ficha → treino → evolução) |
| Biblioteca de exercícios incompleta | Média | Médio | Permitir exercício customizado em fase futura; curadoria inicial ampla |
| Complexidade de gráficos atrasa MVP | Média | Médio | Implementar tabelas primeiro; gráficos como incremento na mesma release se possível |
| i18n aumenta esforço de manutenção | Baixa | Médio | Externalizar strings desde o início; evitar texto hardcoded |

---

## 10. Cronograma e marcos (alto nível)

| Marco | Entregável | Data alvo |
|-------|------------|-----------|
| Discovery concluída | PRD aprovado | 2026-07-05 |
| Arquitetura e stack | `architecture.md` + decisões técnicas | A definir |
| Incremento 1 — Core | Fichas + execução de treino + timer | A definir |
| Incremento 2 — Insights | Evolução, PRs, gráficos, calendário | A definir |
| Incremento 3 — Polish | i18n, unidades, exportação | A definir |
| MVP completo | Todos os Must implementados | A definir |

---

## 11. Critérios de aceite do MVP

- [ ] Usuário cria ficha com exercícios da biblioteca, séries, faixa de reps e descanso
- [ ] Usuário executa treino completo offline, registrando reps e carga por série
- [ ] Timer de descanso dispara após cada série com duração configurada por exercício
- [ ] Botão **Concluir treino** só habilita quando todos os exercícios estão concluídos
- [ ] Calendário exibe check no dia após conclusão do treino
- [ ] Usuário visualiza evolução de carga, volume semanal, PRs e gráfico por exercício
- [ ] Exportação gera arquivo com histórico completo
- [ ] App disponível em pt-BR, es-ES e en-US com troca nas configurações
- [ ] Usuário alterna entre kg e lb sem inconsistência nos valores
- [ ] Edição de ficha preserva histórico de treinos anteriores
- [ ] Todos os requisitos **Must** implementados e testados em iOS e Android

---

## 12. Decisões de produto (fechadas em 2026-07-05)

| # | Tópico | Decisão |
|---|--------|---------|
| 1 | Múltiplos treinos no mesmo dia | **Permitir.** Calendário exibe check no dia; se houver mais de um treino, mostra contador (ex.: "2") |
| 2 | Formato de exportação | **JSON e CSV** — usuário escolhe no momento da exportação |
| 3 | Alerta do timer de descanso | **Configurável** nas configurações: som, vibração ou ambos |
| 4 | Validação de faixa de reps | **Não validar** — aceitar qualquer valor de reps informado |
| 5 | Exercícios customizados | **Incluir no MVP** — usuário pode criar exercícios além da biblioteca curada |
| 6 | Exclusão de ficha com histórico | **Só arquivar** — nunca excluir ficha; histórico sempre preservado |
| 7 | Recordes pessoais (PRs) | **Ambos** — PR de melhor carga e PR de melhor volume por exercício |
| 8 | Gráficos de evolução | **Obrigatórios no MVP** — não adiar para fase seguinte |
| 9 | Escopo da exportação | **Dump completo** — sessões, séries, fichas, configurações e biblioteca |
| 10 | Idioma padrão | **Locale do dispositivo** na primeira abertura; fallback `en-US` se idioma não suportado |
| 11 | Unidade padrão | **Métrico (kg)** na primeira abertura |

---

## 13. Perguntas em aberto

| # | Pergunta | Responsável | Prazo para resposta |
|---|----------|-------------|---------------------|
| 1 | CSV export: arquivo flat ou ZIP com múltiplos? | Desenvolvedor | Spike ExportacaoHistorico |
| 2 | Soft-delete de exercício custom sem vínculos — UX | Desenvolvedor | BibliotecaExercicios |

> **Resolvidas em `.specs/architecture.md`:** versões mínimas (defaults Expo SDK), timer em background (notificação local), seed ~8–12 exercícios/grupo, stack Expo + Drizzle.

---

## 14. Histórico de revisões

| Versão | Data | Autor | Alterações |
|--------|------|-------|------------|
| 1.0 | 2026-07-05 | Discovery PM | Versão inicial |
| 1.1 | 2026-07-05 | Product Owner | Decisões de produto fechadas; perguntas resolvidas |

---

## Próximos passos recomendados

1. **Definir arquitetura técnica** — stack multiplataforma, schema SQLite, i18n, timer em background
2. **Curadoria da biblioteca de exercícios** — listar exercícios iniciais por grupo muscular nos 3 idiomas
4. **Priorizar incrementos** — entregar valor usável cedo (ficha + treino) antes de gráficos e polish
5. **Curadoria da biblioteca de exercícios** — listar exercícios iniciais por grupo muscular nos 3 idiomas
