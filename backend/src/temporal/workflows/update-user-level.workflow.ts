import { proxyActivities } from '@temporalio/workflow';
import type * as activities from '../activities/update-user-level.activity';
import { Weekday } from '../../tasks/enums/weekday.enum';

const { updateUserLevel } = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
});

export interface UpdateUserLevelInput {
  userId: string;
  taskName: string;
  weeklyFrequency: Weekday[];
  currentStreakCount: number;
}

/**
 * Workflow para atualizar o nível do usuário após ganhar XP
 * Este workflow é executado de forma assíncrona pelo Temporal
 */
export async function updateUserLevelWorkflow(
  input: UpdateUserLevelInput,
): Promise<void> {
  await updateUserLevel(input);
}
