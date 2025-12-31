import { Injectable } from '@nestjs/common';
import { UserService } from '../../users/user.service';
import { Logger } from 'nestjs-pino';
import { Weekday } from '../../tasks/enums/weekday.enum';

export interface UpdateUserLevelInput {
  userId: string;
  taskName: string;
  weeklyFrequency: Weekday[];
  currentStreakCount: number;
}

@Injectable()
export class UpdateUserLevelActivity {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  private readonly BASE_XP = 10;

  /**
   * Calcula o XP baseado na frequência semanal e streak atual
   * Mesma lógica do TaskService.calculateTaskXp
   */
  private calculateTaskXp(
    weeklyFrequency: Weekday[],
    currentStreakCount: number,
  ): number {
    const frequency = weeklyFrequency.length;

    // Multiplicadores máximos por frequência
    const maxMultiplierMap: Record<number, number> = {
      1: 2.0,
      2: 2.2,
      3: 2.5,
      4: 3.0,
      5: 3.5,
      6: 4.0,
      7: 5.0,
    };

    const maxMultiplier = maxMultiplierMap[frequency] || 2.0;

    // Calcula o multiplicador baseado na streak
    let streakMultiplier: number;

    if (currentStreakCount < frequency) {
      const progress = currentStreakCount / frequency;
      streakMultiplier = 1.0 + progress * (maxMultiplier - 1.0);
    } else {
      streakMultiplier = maxMultiplier;
    }

    // XP = BASE_XP * frequência * multiplicador_streak
    const xp = this.BASE_XP * frequency * streakMultiplier;

    return Math.floor(xp);
  }

  /**
   * Activity que atualiza o nível do usuário baseado no XP ganho
   * É executada pelo Temporal de forma assíncrona
   */
  async execute(input: UpdateUserLevelInput): Promise<void> {
    const { userId, taskName, weeklyFrequency, currentStreakCount } = input;

    try {
      // Calcula o XP dentro do Temporal
      const xpEarned = this.calculateTaskXp(
        weeklyFrequency,
        currentStreakCount,
      );

      this.logger.log(
        `[Temporal Activity] Processando atualização de nível para usuário ${userId}`,
        {
          xpEarned,
          taskName,
          weeklyFrequency: weeklyFrequency.length,
          currentStreakCount,
        },
      );

      // Adiciona XP ao usuário (isso vai recalcular o nível automaticamente)
      const updatedUser = await this.userService.addXpToUser(userId, xpEarned);

      this.logger.log(
        `[Temporal Activity] Usuário ${userId} agora tem ${updatedUser.totalXp} XP total (Nível ${updatedUser.currentLevel})`,
        {
          previousXp: updatedUser.totalXp - xpEarned,
          newXp: updatedUser.totalXp,
          level: updatedUser.currentLevel,
        },
      );
    } catch (error) {
      this.logger.error(
        `[Temporal Activity] Erro ao atualizar nível do usuário ${userId}`,
        error,
      );
      throw error;
    }
  }
}

/**
 * Função exportada para ser usada pelo worker do Temporal
 */
export async function updateUserLevel(
  input: UpdateUserLevelInput,
): Promise<void> {
  // Esta função será injetada no worker do Temporal
  // A implementação real virá do UpdateUserLevelActivity.execute
  throw new Error(
    'Esta função deve ser chamada apenas através do worker do Temporal',
  );
}
