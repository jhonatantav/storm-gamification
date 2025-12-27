import { Injectable, ConflictException } from '@nestjs/common';
import { UserService } from '../user.service';
import { ICreateUser } from '../interfaces/create-user.interface';
import { IUser } from '../interfaces/user.interface';
import * as bcrypt from 'bcrypt';
import { Logger } from 'nestjs-pino';

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userService: UserService,
    private readonly logger: Logger,
  ) {}

  async execute(data: ICreateUser): Promise<IUser> {
    this.logger.log('Executing CreateUserUseCase with data:', data);
    // Verificar se o usuário já existe
    const existingUser = await this.userService.findUserByEmailWithoutError(
      data.email,
    );

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(data.password, 10);

    // Criar usuário com senha hasheada
    const userData: ICreateUser = {
      ...data,
      password: hashedPassword,
    };

    return this.userService.createUser(userData);
  }
}
