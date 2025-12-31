import { Field, InputType } from '@nestjs/graphql';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { TaskCategory } from '../enums/task-category.enum';
import { Weekday } from '../enums/weekday.enum';

@InputType()
export class UpdateTaskDto {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => TaskCategory, { nullable: true })
  @IsEnum(TaskCategory)
  @IsOptional()
  category?: TaskCategory;

  @Field(() => [Weekday], { nullable: true })
  @IsArray()
  @IsEnum(Weekday, { each: true })
  @IsOptional()
  weeklyFrequency?: Weekday[];
}
