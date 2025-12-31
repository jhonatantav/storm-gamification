import { Injectable } from '@nestjs/common';
import { UpdateUserLevelProducer } from './producers/update-user-level.producer';
import type { UpdateUserLevelInput } from './workflows/update-user-level.workflow';

/**
 * Service que abstrai operações do Temporal
 * Similar ao QueueService do Bull, delega para producers específicos
 */
@Injectable()
export class TemporalService {
  constructor(
    private readonly updateUserLevelProducer: UpdateUserLevelProducer,
  ) {}

  async updateUserLevel(data: UpdateUserLevelInput): Promise<void> {
    return this.updateUserLevelProducer.execute(data);
  }
}
