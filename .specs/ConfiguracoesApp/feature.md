# Configurações do App

> **Prioridade:** Must (P0)  
> **Status:** Rascunho  
> **Jornada(s):** Configurar app e proteger dados

---

## Resumo

Centraliza preferências do usuário: idioma da interface (pt-BR, es-ES, en-US) e sistema de unidades (métrico kg / imperial lb), com reflexo imediato em todo o app sem reinício.

---

## Contexto

### Problema que resolve
Usuários em diferentes idiomas e preferências de unidade precisam de app adaptado; hardcoded strings e kg fixo limitariam adoção pessoal e manutenção.

### Objetivos de negócio atendidos
| Objetivo (PRD) | Como esta feature contribui |
|----------------|----------------------------|
| Objetivo 1 — Substituir bloco de notas | UX no idioma e unidade preferidos |
| Objetivo 2 — Evolução visível | Métricas exibidas na unidade escolhida (RN-02) |

---

## Atores e permissões

| Ator / Persona | O que pode fazer nesta feature |
|----------------|-------------------------------|
| Praticante de musculação | Alterar idioma; alternar entre kg e lb; configurar alerta do timer (som/vibração) |

---

## Casos de uso e user stories

| ID | Caso de uso / User story | Prioridade |
|----|--------------------------|------------|
| UC-07 | Como praticante, quero configurar idioma e unidades para usar o app no meu contexto | Must |

### Fluxo principal
1. Usuário acessa tela de configurações
2. Seleciona idioma: pt-BR, es-ES ou en-US
3. Seleciona unidades: métrico (kg) ou imperial (lb)
4. Configura alerta do timer: som, vibração ou ambos
5. App persiste preferências e atualiza UI imediatamente
6. Cargas e métricas em todas as telas refletem nova unidade

### Fluxos alternativos e exceções
| Cenário | Comportamento esperado |
|---------|------------------------|
| Troca de idioma em sessão ativa | UI atualiza; dados da sessão preservados |
| Troca kg → lb | Valores convertidos na exibição; armazenamento interno em kg (RN-02) |
| Primeira abertura | Idioma = locale do dispositivo; fallback `en-US` se não suportado; unidade = métrico (kg) |

---

## Requisitos funcionais

| ID | Requisito | Descrição | Rastreabilidade PRD |
|----|-----------|-----------|---------------------|
| RF-15 | i18n | Interface em pt-BR, es-ES, en-US; selecionável | UC-07 |
| RF-16 | Unidades de medida | Métrico (kg) ou imperial (lb) | UC-07, RN-02 |
| RF-21 | Alerta do timer | Preferência: som, vibração ou ambos | UC-07, UC-02 |
| RF-13 | Persistência local | Preferências em SQLite/secure storage | UC-07 |

---

## Regras de negócio

| ID | Regra | Condição | Ação / resultado |
|----|-------|----------|------------------|
| RN-02 | Unidades de medida | Preferência alterada | Converter exibição; armazenar carga em kg internamente |

---

## Requisitos não funcionais (escopo desta feature)

| Categoria | Requisito | Critério de aceite |
|-----------|-----------|-------------------|
| Internacionalização | i18n completo | 100% strings de UI nos 3 idiomas |
| Localização | Troca de unidades | Reflete imediatamente sem reinício do app |
| Localização | Formatação | Datas e números conforme locale |
| Disponibilidade offline | Configuração sem rede | 100% funcional offline |

---

## Dados e integrações

### Entidades / dados manipulados
| Entidade | Campos relevantes | Observações |
|----------|-------------------|-------------|
| UserSettings | locale, unitSystem, timerAlert (sound/vibration/both) | Singleton local |

### Integrações
| Sistema / Feature | Tipo | Propósito |
|-------------------|------|-----------|
| Framework i18n | Bidirecional | Traduções e troca de locale |
| SessaoTreino | Saída | Preferência de alerta do timer |
| Todas as features de UI | Saída | Propaga idioma e unidades |

---

## Dependências

### Features (internas)
| Feature | Tipo | Descrição |
|---------|------|-----------|
| — | Paralela | Pode iniciar desde o início; integra com todas |

### Dependências externas
| Sistema / API | Impacto se indisponível |
|---------------|-------------------------|
| SQLite | Preferências não persistem |

### Ordem relativa
- **Pode iniciar após:** Nada (recomendado na Onda 1)
- **Desbloqueia:** Experiência correta em todas as features

---

## Critérios de aceite

- [ ] Usuário seleciona entre pt-BR, es-ES e en-US
- [ ] 100% das strings de UI traduzidas nos 3 idiomas
- [ ] Usuário alterna entre kg e lb
- [ ] Troca de unidade reflete imediatamente em inputs e métricas
- [ ] Cargas armazenadas internamente em kg independente da exibição
- [ ] Usuário configura alerta do timer: som, vibração ou ambos
- [ ] Primeira abertura usa locale do dispositivo; fallback `en-US`
- [ ] Preferências persistem após fechar o app
- [ ] Formatação de data e número localizada

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

- Exportação de histórico (ExportacaoHistorico)
- Temas visuais / dark mode (backlog v2+)

---

## Decisões de produto aplicadas

| Decisão | Resultado |
|---------|-----------|
| Idioma padrão | **Locale do dispositivo**; fallback `en-US` |
| Unidade padrão | **Métrico (kg)** |
| Alerta do timer | **Configurável** — som, vibração ou ambos |

---

## Premissas

- [PREMISSA] Preferências persistem após fechar o app

---

## Perguntas em aberto

*Nenhuma pendência de produto.*

---

## Rastreabilidade PRD

| Referência PRD | Seção / item |
|----------------|--------------|
| RF-15 | i18n |
| RF-16 | Unidades de medida |
| RN-02 | Unidades de medida |
| UC-07 | Configurar idioma e unidades |
