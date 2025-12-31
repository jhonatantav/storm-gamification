import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TaskService } from '../task.service';
import { TaskStreakService } from '../../task-streaks/task-streak.service';
import { TemporalService } from '../../temporal/temporal.service';
import { Logger } from 'nestjs-pino';
import { TaskStreakEntity } from '../../task-streaks/task-streak.entity';
import { TaskEntity } from '../tasks.entity';

export interface CompleteTaskOutput {
  task: TaskEntity;
  streak: TaskStreakEntity;
  message: string;
}

@Injectable()
export class CompleteTaskUseCase {
  constructor(
    private readonly taskService: TaskService,
    private readonly taskStreakService: TaskStreakService,
    private readonly temporalService: TemporalService,
    private readonly logger: Logger,
  ) {}

  async execute(taskId: string): Promise<CompleteTaskOutput> {
    const task = await this.taskService.findById(taskId);

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${taskId} não encontrada`);
    }

    // 2. Busca ou cria a streak ativa para esta task
    let streak = await this.taskStreakService.findActiveByTaskId(taskId);

    const now = new Date();
    let currentStreakCount = 1;

    if (streak) {
      // Verifica se já foi completada hoje
      const lastCompleted = streak.lastCompletedAt;
      if (lastCompleted) {
        const lastCompletedDate = new Date(lastCompleted);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        lastCompletedDate.setHours(0, 0, 0, 0);

        if (lastCompletedDate.getTime() === today.getTime()) {
          throw new BadRequestException('Esta tarefa já foi completada hoje');
        }

        // Verifica se mantém a streak (completou ontem)
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (lastCompletedDate.getTime() === yesterday.getTime()) {
          // Mantém a streak
          currentStreakCount = streak.currentStreak + 1;
        } else {
          // Perdeu a streak, reinicia
          currentStreakCount = 1;
        }
      }

      // Atualiza a streak existente
      streak = await this.taskStreakService.update(streak.id, {
        currentStreak: currentStreakCount,
        longestStreak: Math.max(currentStreakCount, streak.longestStreak),
        lastCompletedAt: now,
      });
    } else {
      // Cria nova streak
      streak = await this.taskStreakService.createStreak({
        taskId,
        userId: task.userId,
        currentStreak: 1,
        longestStreak: 1,
        lastCompletedAt: now,
        isActive: true,
      });
      currentStreakCount = 1;
    }

    // 4. Envia para o Temporal calcular XP e atualizar o nível (assíncrono)
    try {
      await this.temporalService.updateUserLevel({
        userId: task.userId,
        taskName: task.name,
        weeklyFrequency: task.weeklyFrequency,
        currentStreakCount,
      });
    } catch (error) {
      this.logger.error(
        'Erro ao iniciar workflow do Temporal para atualizar nível',
        error,
      );
      // Não falha a operação se o Temporal estiver indisponível
      // O XP será calculado e atualizado quando o worker processar
    }

    // Recarrega a streak com todas as relações para retornar completa
    const fullStreak = await this.taskStreakService.findById(streak.id);

    return {
      task,
      streak: fullStreak,
      message:
        'Tarefa completada com sucesso! XP sendo calculado e processado...',
    };
  }
}
