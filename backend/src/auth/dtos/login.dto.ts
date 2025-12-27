import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class LoginDto {
  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Email ou nickname é obrigatório' })
  emailOrNickname: string;

  @Field()
  @IsString()
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  password: string;
}
