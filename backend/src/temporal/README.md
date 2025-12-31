# Temporal Integration - Complete Task Feature

## 📋 Visão Geral

Sistema de conclusão de tasks com processamento assíncrono de XP e níveis usando Temporal.io.

## 🏗️ Arquitetura

### Padrão Producer/Consumer (similar ao Bull Queue)

```
┌─────────────────────────────────────────────────────────────┐
│                     Use Case (Business Logic)                │
│                                                               │
│  ✓ Valida dados                                              │
│  ✓ Atualiza banco de dados                                   │
│  ✓ Calcula valores                                           │
│  ✓ Chama TemporalService                                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ this.temporalService.updateUserLevel(data)
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              TemporalService (Facade/Orchestrator)           │
│                                                               │
│  • Interface pública para use cases                          │
│  • Delega para o producer apropriado                         │
│  • Sem lógica de conexão                                     │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ producer.execute(data)
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                 Producer (Dispara Workflow)                  │
│                                                               │
│  ✓ Injeta TemporalClientProvider                             │
│  ✓ Obtém client do provider                                  │
│  ✓ Gera workflowId único                                     │
│  ✓ Define fila (taskQueue)                                   │
│  ✓ Inicia workflow                                           │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Usa client do provider
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│          TemporalClientProvider (Connection Manager)         │
│                                                               │
│  • Gerencia conexão com Temporal (singleton)                 │
│  • OnModuleInit: conecta ao Temporal                         │
│  • OnModuleDestroy: fecha conexão                            │
│  • getClient(): retorna client reutilizável                  │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Workflow adicionado à fila
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              Temporal Server (Orquestrador)                  │
│                                                               │
│  • Armazena workflows na fila                                │
│  • Garante entrega e retry                                   │
│  • Monitora execução                                         │
└─────────────────────┬───────────────────────────────────────┘
                      │
                      │ Worker pega workflow da fila
                      │
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Worker (Processa)                         │
│                                                               │
│  1. Escuta fila do Temporal                                  │
│  2. Pega workflow pendente                                   │
│  3. Executa workflow                                         │
│     └─> Chama activity                                       │
│         └─> Activity executa lógica                          │
│             └─> Atualiza banco de dados                      │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo Simplificado

```
GraphQL Mutation (completeTask)
    ↓
CompleteTaskUseCase
    ├── Atualiza Streak (síncrono)
    ├── Calcula XP (síncrono)
    └── TemporalService.updateUserLevel()
            ↓
        UpdateUserLevelProducer.execute()
            ↓
    Temporal Worker processa
            ↓
    UpdateUserLevelActivity
            ↓
    Atualiza XP e Nível do Usuário
```

## 🚀 Como usar

### 1. Iniciar o Temporal (via Docker)

```bash
cd backend
docker compose up -d temporal temporal-ui
```

O Temporal UI estará disponível em: http://localhost:8080

### 2. Iniciar a aplicação

```bash
pnpm dev
```

### 3. Iniciar o Temporal Worker

Em um terminal separado:

```bash
pnpm worker
```

Ou com watch mode:

```bash
pnpm worker:watch
```

### 4. Completar uma Task

Mutation GraphQL:

```graphql
mutation CompleteTask($taskId: String!) {
  completeTask(taskId: $taskId) {
    task {
      id
      name
      category
      weeklyFrequency
    }
    streak {
      id
      currentStreak
      longestStreak
      lastCompletedAt
    }
    message
  }
}
```

Variáveis:

```json
{
  "taskId": "uuid-da-task"
}
```

## 📦 Estrutura de Arquivos

```
src/
├── temporal/
│   ├── temporal.module.ts               # Módulo global do Temporal
│   ├── temporal-client.provider.ts      # Provider de conexão (singleton)
│   ├── temporal.service.ts              # Service facade (API pública)
│   ├── enums/
│   │   ├── temporal-queue.enum.ts       # Enums de filas
│   │   └── temporal-workflow.enum.ts    # Enums de workflows
│   ├── producers/
│   │   └── update-user-level.producer.ts  # Producer para disparar workflow
│   ├── workflows/
│   │   └── update-user-level.workflow.ts  # Workflow de atualização de nível
│   └── activities/
│       └── update-user-level.activity.ts  # Activity que executa a lógica
├── tasks/
│   ├── use-cases/
│   │   └── complete-task.usecase.ts       # Use case de completar task
│   └── dtos/
│       └── complete-task-response.dto.ts  # DTO de resposta
└── temporal-worker.ts                     # Script do worker
```

## 🔄 Fluxo de Execução

### Quando o usuário completa uma task:

1. **Validação** (TaskOwnershipGuard)
   - Verifica se a task pertence ao usuário

2. **Atualização de Streak** (Síncrono)
   - Busca ou cria streak ativa
   - Verifica se já foi completada hoje
   - Calcula nova streak (mantém ou reinicia)
   - Atualiza no banco de dados

3. **Disparo do Workflow** (Assíncrono via Service)

   ```typescript
   // Use case chama o service
   await this.temporalService.updateUserLevel({
     userId,
     taskName: task.name,
     weeklyFrequency: task.weeklyFrequency,
     currentStreakCount,
   });

   // Service delega para o producer
   // Producer inicia workflow no Temporal
   ```

   - Não bloqueia a resposta ao usuário

4. **Processamento pelo Worker** (Background)
   - Worker recebe o workflow
   - Executa a Activity
   - Chama `userService.addXpToUser()`
   - Atualiza XP e recalcula nível
   - Loga resultado

## 🎯 Benefícios da Abordagem

✅ **Resposta Rápida**: Usuário recebe resposta imediata sem esperar cálculo de nível

✅ **Escalabilidade**: Workers podem processar múltiplas tasks em paralelo

✅ **Resiliência**: Temporal garante retry automático em caso de falha

✅ **Auditoria**: Temporal UI permite visualizar histórico de workflows

✅ **Desacoplamento**: Lógica de nível separada da conclusão (via Producers)

✅ **Testabilidade**: Producers podem ser facilmente mockados em testes

## 🔄 Comparação com Bull Queue

| Aspecto              | Bull Queue                     | Temporal                                |
| -------------------- | ------------------------------ | --------------------------------------- |
| **Use Case**         | `queueService.sendEmail(data)` | `temporalService.updateUserLevel(data)` |
| **Service**          | `QueueService` (facade)        | `TemporalService` (facade)              |
| **Producer**         | `queue.add(jobName, data)`     | `producer.execute(data)`                |
| **Consumer**         | `@Process(jobName)`            | Worker + Activity                       |
| **Fila**             | Redis                          | Temporal Server                         |
| **UI**               | Bull Board                     | Temporal UI                             |
| **Retry**            | Configurável                   | Automático                              |
| **Workflow**         | Simples                        | Complexo (sagas, child workflows)       |
| **State Management** | Básico                         | Avançado                                |

### Exemplo de código similar:

**Bull Queue:**

```typescript
// Use case
await this.queueService.sendWelcomeEmail({ email, name });

// QueueService
sendWelcomeEmail(data) {
  return this.emailQueue.add('send-welcome', data);
}

// Consumer
@Process('send-welcome')
async sendWelcome(job: Job) {
  await this.emailService.send(job.data);
}
```

**Temporal:**

```typescript
// Use case
await this.temporalService.updateUserLevel({
  userId,
  taskName: task.name,
  weeklyFrequency: task.weeklyFrequency,
  currentStreakCount,
});

// TemporalService
updateUserLevel(data) {
  return this.updateUserLevelProducer.execute(data);
}

// Activity (no worker)
async updateUserLevel(input) {
  // Calcula o XP baseado na frequência e streak
  const xpEarned = this.calculateTaskXp(
    input.weeklyFrequency,
    input.currentStreakCount,
  );

  // Adiciona XP ao usuário
  await this.userService.addXpToUser(input.userId, xpEarned);
}
```

## 📊 Monitoramento

### Temporal UI

Acesse http://localhost:8080 para:

- Ver workflows em execução
- Histórico de execuções
- Erros e retries
- Tempo de processamento

### Logs

O worker loga cada etapa:

```
[Temporal Activity] Processando atualização de nível para usuário {userId}
[Temporal Activity] Usuário {userId} agora tem {totalXp} XP total (Nível {level})
```

## ⚠️ Tratamento de Erros

### Se o Temporal estiver offline:

- A task ainda é completada
- Streak é atualizada normalmente
- XP calculado e retornado
- Workflow não é disparado (log de erro)
- Worker processará quando voltar online

### Se o worker não estiver rodando:

- Workflows ficam pendentes na fila
- Serão processados quando worker iniciar
- Nenhuma perda de dados

## 🔧 Configuração

### Variáveis de Ambiente

```env
TEMPORAL_ADDRESS=localhost:7233
```

### Scripts NPM

```json
{
  "worker": "Roda o worker em modo normal",
  "worker:watch": "Roda o worker com auto-reload",
  "worker:prod": "Roda o worker em produção"
}
```

## 📝 Exemplo de Resposta

```json
{
  "data": {
    "completeTask": {
      "task": {
        "id": "123",
        "name": "Estudar GraphQL",
        "category": "STUDY",
        "weeklyFrequency": ["MONDAY", "WEDNESDAY", "FRIDAY"]
      },
      "streak": {
        "id": "456",
        "currentStreak": 5,
        "longestStreak": 10,
        "lastCompletedAt": "2025-12-27T10:30:00Z"
      },
      "message": "Tarefa completada com sucesso! XP sendo calculado e processado..."
    }
  }
}
```

## 🚨 Validações

- ✅ Task deve existir
- ✅ Task deve pertencer ao usuário (via TaskOwnershipGuard)
- ✅ Task não pode ser completada mais de uma vez por dia
- ✅ Streak é mantida se completada no dia seguinte
- ✅ Streak reinicia se houver gap de dias

## 🔮 Próximos Passos

- [ ] Adicionar notificações push quando nível sobe
- [ ] Implementar conquistas (achievements)
- [ ] Criar ranking de usuários
- [ ] Adicionar sistema de recompensas
