import { IUser } from './user.interface';

export interface ICreateUser extends Omit<
  IUser,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'deletedAt'
  | 'passwordHash'
  | 'currentLevel'
  | 'currentXp'
  | 'totalXp'
> {
  password: string;
}
