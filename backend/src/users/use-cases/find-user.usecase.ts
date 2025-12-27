import { Injectable } from '@nestjs/common';
import { IUser } from '../interfaces/user.interface';
import { UserService } from '../user.service';

@Injectable()
export class FindUserUseCase {
  constructor(private readonly userService: UserService) {}

  async execute(email: string): Promise<IUser | null> {
    return this.userService.findUserByEmail(email);
  }
}
