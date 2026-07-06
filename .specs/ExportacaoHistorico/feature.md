# Exportação de Histórico

> **Prioridade:** Must (P0)  
> **Status:** Rascunho  
> **Jornada(s):** Configurar app e proteger dados

---

## Resumo

Permite gerar arquivo com histórico completo de treinos para backup manual, mitigando risco de perda de dados em armazenamento exclusivamente local.

---

## Contexto

### Problema que resolve
Dados só no aparelho (SQLite) estão vulneráveis a troca ou reset do dispositivo; exportação é a mitigação principal do MVP.

### Objetivos de negócio atendidos
| Objetivo (PRD) | Como esta feature contribui |
|----------------|----------------------------|
| Objetivo 4 — Proteger histórico local | Arquivo gerado com todos os treinos registrados |

---

## Atores e permissões

| Ator / Persona | O que pode fazer nesta feature |
|----------------|-------------------------------|
| Praticante de musculação | Exportar histórico; escolher JSON ou CSV; salvar/compartilhar arquivo via SO |

---

## Casos de uso e user stories

| ID | Caso de uso / User story | Prioridade |
|----|--------------------------|------------|
| UC-06 | Como praticante, quero exportar meu histórico em arquivo para não perder meus dados | Must |

### Fluxo principal
1. Usuário acessa opção de exportação (configurações ou área de dados)
2. App valida existência de histórico
3. Usuário escolhe formato: JSON ou CSV
4. Usuário confirma exportação
5. App serializa dump completo (sessões, séries, fichas, configurações, biblioteca)
6. Usuário salva ou compartilha via diálogo nativo do sistema operacional

### Fluxos alternativos e exceções
| Cenário | Comportamento esperado |
|---------|------------------------|
| Sem histórico | Ação desabilitada ou mensagem informando ausência de dados |
| Falha ao escrever arquivo | Mensagem de erro; nenhum arquivo parcial/corrompido |
| Histórico grande | Exportação conclui em tempo aceitável [definir na arquitetura] |

---

## Requisitos funcionais

| ID | Requisito | Descrição | Rastreabilidade PRD |
|----|-----------|-----------|---------------------|
| RF-14 | Exportação | Gerar arquivo JSON **ou** CSV com dump completo | UC-06 |
| RF-13 | Persistência local | Ler dados de SQLite para serialização | UC-06 |

---

## Regras de negócio

| ID | Regra | Condição | Ação / resultado |
|----|-------|----------|------------------|
| — | Exportação completa | Usuário solicita exportação | Incluir sessões, séries, fichas, configurações e biblioteca de exercícios |

---

## Requisitos não funcionais (escopo desta feature)

| Categoria | Requisito | Critério de aceite |
|-----------|-----------|-------------------|
| Performance | Exportar 1 ano de histórico | Concluir em ≤ 10 s em dispositivo médio |
| Segurança | Dados locais | Arquivo gerado apenas sob ação explícita do usuário |
| Disponibilidade offline | Exportação sem rede | 100% funcional offline |

---

## Dados e integrações

### Entidades / dados manipulados
| Entidade | Campos relevantes | Observações |
|----------|-------------------|-------------|
| WorkoutSession | todos os campos | Incluído na exportação |
| SetLog | todos os campos | Incluído na exportação |
| WorkoutPlan | todos os campos | Fichas ativas e arquivadas |
| UserSettings | todos os campos | Preferências do usuário |
| Exercise | todos os campos | Biblioteca curada + customizados |
| ExportFile | format, generatedAt, payload | Arquivo gerado |

### Integrações
| Sistema / Feature | Tipo | Propósito |
|-------------------|------|-----------|
| SessaoTreino | Entrada | Fonte de sessões e séries |
| SQLite | Entrada | Leitura do histórico |
| Sistema de arquivos do SO | Saída | Salvar/compartilhar arquivo |

---

## Dependências

### Features (internas)
| Feature | Tipo | Descrição |
|---------|------|-----------|
| SessaoTreino | Bloqueante | Histórico de sessões para exportar |

### Ordem relativa
- **Pode iniciar após:** SessaoTreino
- **Desbloqueia:** Nenhuma

---

## Critérios de aceite

- [ ] Usuário exporta histórico completo em arquivo
- [ ] Usuário escolhe entre JSON e CSV antes de exportar
- [ ] Arquivo contém dump completo: sessões, séries, fichas, configurações e biblioteca
- [ ] Exportação funciona offline
- [ ] Sem histórico: ação bloqueada com mensagem clara
- [ ] Arquivo salvo/compartilhado via diálogo nativo do SO
- [ ] Formato do arquivo documentado (schema JSON ou colunas CSV)

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

- Importação/restauração de backup (backlog v2+)
- Backup automático em nuvem
- Criptografia do arquivo exportado

---

## Decisões de produto aplicadas

| Decisão | Resultado |
|---------|-----------|
| Formato | **JSON e CSV** — usuário escolhe na exportação |
| Escopo | **Dump completo** — sessões, fichas, configurações e biblioteca |

---

## Premissas

- [PREMISSA] Schema JSON documentado para eventual importação futura

---

## Perguntas em aberto

*Nenhuma pendência de produto.*

---

## Rastreabilidade PRD

| Referência PRD | Seção / item |
|----------------|--------------|
| RF-14 | Exportação |
| UC-06 | Exportar histórico |
| Objetivo 4 | Proteger histórico local |
