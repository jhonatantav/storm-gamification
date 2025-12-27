import { IUser } from '../interfaces/user.interface';
import { ICreateUser } from '../interfaces/create-user.interface';

export interface IUserRepository {
  createAndSave(data: ICreateUser): Promise<IUser>;
  findOneByEmail(email: string): Promise<IUser | null>;
}
