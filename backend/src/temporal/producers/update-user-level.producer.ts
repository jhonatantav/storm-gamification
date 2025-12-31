import { Injectable } from '@nestjs/common';
import { TemporalClientProvider } from '../temporal-client.provider';
import { Logger } from 'nestjs-pino';
import { updateUserLevelWorkflow } from '../workflows/update-user-level.workflow';
import { TemporalQueue, TemporalWorkflow } from '../enums';
import type { UpdateUserLevelInput } from '../workflows/update-user-level.workflow';

@Injectable()
export class UpdateUserLevelProducer {
  constructor(
    private readonly temporalClientProvider: TemporalClientProvider,
    private readonly logger: Logger,
  ) {}

  /**
   * Dispara um workflow para atualizar o nível do usuário
   * após ganhar XP
   */
  async execute(input: UpdateUserLevelInput): Promise<void> {
    try {
      const client = this.temporalClientProvider.getClient();
      const workflowId = `${TemporalWorkflow.UPDATE_USER_LEVEL}-${input.userId}-${Date.now()}`;

      await client.workflow.start(updateUserLevelWorkflow, {
        taskQueue: TemporalQueue.USER_LEVEL,
        workflowId,
        args: [input],
      });

      this.logger.log(
        `[Temporal Producer] Workflow ${workflowId} iniciado para atualizar nível do usuário ${input.userId}`,
      );
    } catch (error) {
      this.logger.error(
        '[Temporal Producer] Erro ao iniciar workflow de atualização de nível',
        error,
      );
      throw error;
    }
  }
}
