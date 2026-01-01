import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import type { ICreateUser } from './interfaces/create-user.interface';
import type { IUser } from './interfaces/user.interface';
import type { IUserRepository } from './repositories/user.repository.interface';
import { USERS_REPOSITORY_TOKEN } from './user.provider';

@Injectable()
export class UserService {
  // Tabela de XP necessário para cada nível
  // Progressão gradativa do nível 1 ao 10, depois mantém média
  private readonly XP_REQUIRED_PER_LEVEL: Record<number, number> = {
    1: 0, // Começa no nível 1
    2: 30, // ~6 tasks freq 5 (5 XP cada inicial)
    3: 70, // +40 (~8 tasks)
    4: 120, // +50 (~10 tasks)
    5: 180, // +60 (~12 tasks)
    6: 250, // +70 (~14 tasks)
    7: 330, // +80 (~16 tasks)
    8: 420, // +90 (~18 tasks)
    9: 520, // +100 (~20 tasks)
    10: 630, // +110 (~22 tasks) = total ~126 tasks simples
    // Mas com streak, fica ~45-50 tasks freq 5 para chegar aqui
  };

  // XP médio necessário para níveis 11+
  private readonly XP_PER_LEVEL_AFTER_10 = 120;

  constructor(
    @Inject(USERS_REPOSITORY_TOKEN)
    private readonly userRepository: IUserRepository,
    private readonly logger: Logger,
  ) {}

  createUser(data: ICreateUser): Promise<IUser> {
    return this.userRepository.createAndSave(data);
  }

  async findUserByEmailWithoutError(email: string): Promise<IUser | null> {
    return this.userRepository.findOneByEmail(email);
  }

  async findUserByEmail(email: string): Promise<IUser> {
    const user = await this.userRepository.findOneByEmail(email);

    if (!user) {
      throw new NotFoundException('Email não atrelado a nenhum usuário');
    }

    return user;
  }

  async findUserByNickname(nickname: string): Promise<IUser | null> {
    return this.userRepository.findOneByNickname(nickname);
  }

  async findUserByEmailOrNickname(emailOrNickname: string): Promise<IUser> {
    const user =
      await this.userRepository.findOneByEmailOrNickname(emailOrNickname);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  async findUserById(id: string): Promise<IUser> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }

  /**
   * Adiciona XP ao usuário e atualiza o nível se necessário.
   * O sistema de níveis tem progressão gradativa do 1 ao 10:
   * - Níveis iniciais requerem menos XP
   * - Níveis mais altos requerem progressivamente mais XP
   * - Do nível 11 em diante, mantém uma média constante
   * - O totalXp sempre aumenta e nunca é resetado
   *
   * @param userId - ID do usuário
   * @param xpAmount - Quantidade de XP a adicionar
   * @returns O usuário atualizado com novo XP e nível
   */
  async addXpToUser(userId: string, xpAmount: number): Promise<IUser> {
    const user = await this.findUserById(userId);

    const newTotalXp = user.totalXp + xpAmount;
    const newLevel = this.calculateLevelFromTotalXp(newTotalXp);
    const newCurrentXp = this.calculateCurrentXpForLevel(newTotalXp, newLevel);

    // Log de subida de nível
    if (newLevel > user.currentLevel) {
      const levelsGained = newLevel - user.currentLevel;
      this.logger.log(
        `🎉 Usuário ${user.nickName} subiu ${levelsGained} nível(is)! Nível atual: ${newLevel}`,
      );
    }

    const updatedUser = await this.userRepository.updateUser(userId, {
      currentXp: newCurrentXp,
      totalXp: newTotalXp,
      currentLevel: newLevel,
    });

    const xpToNextLevel = this.getXpRequiredForLevel(newLevel + 1) - newTotalXp;

    this.logger.log(
      `Usuário ${user.nickName} ganhou ${xpAmount} XP. Progresso: ${newCurrentXp}/${this.getXpForCurrentLevel(newLevel)} XP (faltam ${xpToNextLevel} XP para o nível ${newLevel + 1})`,
    );

    return updatedUser;
  }

  /**
   * Calcula o nível baseado no XP total acumulado
   *
   * @param totalXp - XP total do usuário
   * @returns O nível correspondente ao XP total
   */
  private calculateLevelFromTotalXp(totalXp: number): number {
    // Para níveis 1-10, usa a tabela
    for (let level = 10; level >= 1; level--) {
      if (totalXp >= this.XP_REQUIRED_PER_LEVEL[level]) {
        // Se passou do nível 10, calcula baseado na média
        if (level === 10) {
          const xpAfter10 = totalXp - this.XP_REQUIRED_PER_LEVEL[10];
          const additionalLevels = Math.floor(
            xpAfter10 / this.XP_PER_LEVEL_AFTER_10,
          );
          return 10 + additionalLevels;
        }
        return level;
      }
    }
    return 1;
  }

  /**
   * Calcula o XP atual dentro do nível (para barra de progresso)
   *
   * @param totalXp - XP total do usuário
   * @param currentLevel - Nível atual do usuário
   * @returns XP atual dentro do nível (0 até XP necessário para próximo nível)
   */
  private calculateCurrentXpForLevel(
    totalXp: number,
    currentLevel: number,
  ): number {
    const xpForCurrentLevel = this.getXpRequiredForLevel(currentLevel);
    return totalXp - xpForCurrentLevel;
  }

  /**
   * Retorna quanto XP total é necessário para alcançar um nível específico
   *
   * @param level - O nível desejado
   * @returns XP total necessário para alcançar o nível
   */
  private getXpRequiredForLevel(level: number): number {
    if (level <= 10) {
      return this.XP_REQUIRED_PER_LEVEL[level] || 0;
    }
    // Para níveis acima de 10
    const levelsAbove10 = level - 10;
    return (
      this.XP_REQUIRED_PER_LEVEL[10] +
      levelsAbove10 * this.XP_PER_LEVEL_AFTER_10
    );
  }

  /**
   * Retorna quanto XP é necessário para completar o nível atual
   * (diferença entre o nível atual e o próximo)
   *
   * @param level - O nível atual
   * @returns XP necessário para completar o nível
   */
  private getXpForCurrentLevel(level: number): number {
    const nextLevelXp = this.getXpRequiredForLevel(level + 1);
    const currentLevelXp = this.getXpRequiredForLevel(level);
    return nextLevelXp - currentLevelXp;
  }

  /**
   * Retorna informações detalhadas sobre a progressão de nível do usuário
   *
   * @param user - O usuário
   * @returns Objeto com informações de progressão
   */
  getLevelProgress(user: IUser) {
    const currentLevelXp = this.getXpRequiredForLevel(user.currentLevel);
    const nextLevelXp = this.getXpRequiredForLevel(user.currentLevel + 1);
    const xpForThisLevel = nextLevelXp - currentLevelXp;
    const xpToNextLevel = nextLevelXp - user.totalXp;
    const progressPercentage = (user.currentXp / xpForThisLevel) * 100;

    return {
      currentLevel: user.currentLevel,
      currentXp: user.currentXp,
      totalXp: user.totalXp,
      xpForThisLevel,
      xpToNextLevel,
      progressPercentage: Math.floor(progressPercentage),
      nextLevel: user.currentLevel + 1,
    };
  }
}
