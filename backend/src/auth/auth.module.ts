import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { env } from 'src/environment';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: env.JWT_SECRET || 'your-secret-key',
      signOptions: {
        expiresIn: (env.JWT_EXPIRES_IN || '7d') as any,
      },
    }),
    UsersModule,
  ],
  providers: [JwtStrategy, AuthService, AuthResolver],
  exports: [JwtModule, PassportModule],
})
export class AuthModule {}
