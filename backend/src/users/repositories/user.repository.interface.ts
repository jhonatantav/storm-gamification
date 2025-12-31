import { IUser } from '../interfaces/user.interface';
import { ICreateUser } from '../interfaces/create-user.interface';

export interface IUserRepository {
  createAndSave(data: ICreateUser): Promise<IUser>;
  findOneByEmail(email: string): Promise<IUser | null>;
  findOneByNickname(nickname: string): Promise<IUser | null>;
  findOneByEmailOrNickname(emailOrNickname: string): Promise<IUser | null>;
  findById(id: string): Promise<IUser | null>;
  updateUser(id: string, data: Partial<IUser>): Promise<IUser>;
}
