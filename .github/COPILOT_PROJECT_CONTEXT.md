# Github Copilot - Project Context

Este arquivo serve para informar o contexto do projeto para Github Copilot e automações relacionadas. Ele descreve o objetivo principal do backend do app e especifica todas as principais stacks e dependências utilizadas. Se precisar de informações sobre o projeto, sempre consulte este arquivo antes!

---

## 🎮 Contexto do Projeto

**Nome:** Gamificação de Streaks (missões e rotinas)

**Objetivo:**  
Criar um backend para um aplicativo mobile (Expo) que auxilia usuários a manterem rotinas diárias de forma gamificada.  
O usuário cria missões principais (rotinas, ex: estudar, ir à academia) e secundárias (tarefas do dia a dia, ex: comprar leite, ir à farmácia). Ao completar missões, o usuário ganha XP, sobe de nível, desbloqueia medalhas, montanhas e mantém streaks diários.

---

## 🛠️ Stacks e Tecnologias utilizadas no Backend

- **NestJS:** Estrutura principal do backend (modular, escalável)
- **GraphQL (Apollo):** API principal para comunicação (queries, mutations)
- **Temporal.io:** Orquestra eventos assíncronos e recorrentes (ex: workflows diários de verificação de streak, notificações)
- **PostgreSQL:** Banco de dados relacional (entidades: usuário, missão, streak, níveis, medalhas, montanhas)
- **TypeORM (ou Prisma):** ORM para mapear entidades e facilitar queries
- **JWT (Passport.js):** Autenticação
- **class-validator:** Validação dos DTOs e entradas GraphQL
- **Docker:** Para serviços como PostgreSQL e Temporal -**TYPE-ORM** Para gerenciar nossa conexão com o baco
- **(Opcional) Bull/BullMQ:** Para filas simples que não envolvam workflow complexo, mas Temporal é prioridade.
- **(Opcional) Expo Push Notification Integration:** Para disparo de notificações push (uso via workflow Temporal)

---

## Principais Features do Backend

- CRUD completo de missões, usuários, streaks, medalhas, montanhas
- Gamificação: sistema de XP para subir de nível e desbloquear conquistas
- Streaks: lógica para missões diárias com recompensas extras
- Temporal workflows para:
  - Verificação automática de streaks diariamente
  - Envio de notificações se missões não forem concluídas
  - Reset/reinicialização das rotinas diárias
- API GraphQL exposta para o frontend mobile (React Native/Expo)
- Segurança via JWT em todas rotas protegidas

---

## Convenções para scripts, exemplos e automações

- Sempre considere as stacks acima como base do backend.
- Assume que toda comunicação é via GraphQL (não REST).
- As automações assíncronas e recorrentes devem ser modeladas como workflows/funções do Temporal.
- Os exemplos de banco, migrations e queries devem assumir PostgreSQL.
- Toda autenticação é feita via JWT.
- Sempre utilize tipos do TypeScript para interfaces entre backend e frontend, quando possível.

---

## Limite do contexto

Este contexto é EXCLUSIVO para o backend deste projeto.  
Não inclua nada sobre frontend, UX, Expo código mobile ou interface do usuário.

---

## Manutenção

Mantenha este arquivo atualizado conforme as stacks ou escopo mudarem!  
Se for automatizar ou usar Copilot para gerar arquivos, **referencie sempre este contexto**.
