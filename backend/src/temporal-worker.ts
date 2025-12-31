import { NestFactory } from '@nestjs/core';
import { Worker, NativeConnection } from '@temporalio/worker';
import { AppModule } from './app.module';
import { UpdateUserLevelActivity } from './temporal/activities/update-user-level.activity';
import { TemporalQueue } from './temporal/enums';
import { env } from './environment';
import * as path from 'path';

async function run() {
  // Cria o contexto do NestJS para injetar dependências nas activities
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  const updateUserLevelActivity = app.get(UpdateUserLevelActivity);

  // Configura as activities com as instâncias do NestJS
  const activities = {
    updateUserLevel: async (input: any) => {
      return updateUserLevelActivity.execute(input);
    },
  };

  // Conecta ao Temporal usando NativeConnection
  const connection = await NativeConnection.connect({
    address: env.TEMPORAL_ADDRESS,
  });

  // Cria o worker do Temporal
  const worker = await Worker.create({
    workflowsPath: path.resolve(__dirname, './temporal/workflows'),
    activities,
    taskQueue: TemporalQueue.USER_LEVEL,
    connection,
  });

  console.log(
    `🚀 Temporal Worker iniciado e escutando na fila: ${TemporalQueue.USER_LEVEL}`,
  );
  console.log(`📡 Conectado ao Temporal em: ${env.TEMPORAL_ADDRESS}`);

  await worker.run();
}

run().catch((err) => {
  console.error('❌ Erro ao iniciar Temporal Worker:', err);
  process.exit(1);
});
