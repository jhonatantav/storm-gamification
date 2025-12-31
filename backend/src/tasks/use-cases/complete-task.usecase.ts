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
    const now = new Date();

    const taskHasMoreThan24Hours = this.hasMoreThan24Hours(now, task.createdAt);

    if (!taskHasMoreThan24Hours) {
      throw new BadRequestException(
        'A tarefa só pode ser completada após 24 horas de sua criação',
      );
    }

    if (!task) {
      throw new NotFoundException(`Tarefa com ID ${taskId} não encontrada`);
    }

    // 2. Busca ou cria a streak ativa para esta task
    let streak = await this.taskStreakService.findActiveByTaskId(taskId);

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
    this.temporalService.updateUserLevel({
      userId: task.userId,
      taskName: task.name,
      weeklyFrequency: task.weeklyFrequency,
      currentStreakCount,
    });

    // Recarrega a streak com todas as relações para retornar completa
    const fullStreak = await this.taskStreakService.findById(streak.id);

    return {
      task,
      streak: fullStreak,
      message:
        'Tarefa completada com sucesso! XP sendo calculado e processado...',
    };
  }

  private hasMoreThan24Hours(date1: Date, date2: Date): boolean {
    return Math.abs(date1.getTime() - date2.getTime()) > 24 * 60 * 60 * 1000;
  }
}
