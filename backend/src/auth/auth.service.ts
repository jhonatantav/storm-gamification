import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../users/user.service';
import { LoginDto } from './dtos/login.dto';
import { LoginResponse } from './dtos/login-response.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import * as bcrypt from 'bcrypt';
import { env } from 'src/environment';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponse> {
    const { emailOrNickname, password } = loginDto;

    // Busca usuário por email ou nickname
    const user =
      await this.userService.findUserByEmailOrNickname(emailOrNickname);

    // Verifica a senha
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Gera o token JWT
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      nickName: user.nickName,
    };

    const accessToken = this.jwtService.sign(payload);

    // Calcula a data de expiração
    const expiresIn = env.JWT_EXPIRES_IN || '7d';
    const expiresAt = this.calculateExpirationDate(expiresIn);

    return {
      accessToken,
      expiresAt: expiresAt.toISOString(),
    };
  }

  private calculateExpirationDate(expiresIn: string): Date {
    const now = new Date();
    const match = expiresIn.match(/^(\d+)([smhd])$/);

    if (!match) {
      // Se não conseguir parsear, assume 7 dias
      return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        return new Date(now.getTime() + value * 1000);
      case 'm':
        return new Date(now.getTime() + value * 60 * 1000);
      case 'h':
        return new Date(now.getTime() + value * 60 * 60 * 1000);
      case 'd':
        return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
      default:
        return new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    }
  }
}
