import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TaskService } from '../task.service';
import { TaskStreakService } from 'src/task-streaks/task-streak.service';

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskStackService: TaskStreakService,
  ) {}

  async execute(taskId: string): Promise<void> {
    const task = await this.taskService.findById(taskId);
    if (task.deletedAt) {
      throw new BadRequestException(
        'Impossivel deletar tarefa previamente deletada',
      );
    }
    if (task.currentStreakId) {
      const currentStreakId = await this.taskStackService.findById(
        task.currentStreakId,
      );

      if (!currentStreakId) {
        throw new NotFoundException(
          'Erro ao localizar sequencia referente a tarefa.',
        );
      }

      const today = new Date();

      await this.taskStackService.update(task.currentStreakId, {
        endedAt: today,
      });
    }

    await this.taskService.delete(taskId);

    return;
  }
}
