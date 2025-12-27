import { BasicInterface } from 'src/common/basic.interface';

export interface IUser extends BasicInterface {
  fullName: string;
  email: string;
  passwordHash: string;
  nickName: string;
  phoneNumber: string;
  currentLevel: number;
  avatarUrl?: string;
  currentXp: number;
  totalXp: number;
}
