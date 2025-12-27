import { Module } from '@nestjs/common';
import { userProviders } from './user.provider';

@Module({
  providers: [...userProviders],
  exports: [...userProviders],
})
export class UsersModule {}
