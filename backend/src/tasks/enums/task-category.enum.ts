import { registerEnumType } from '@nestjs/graphql';

export enum TaskCategory {
  HEALTH = 'HEALTH',
  EDUCATION = 'EDUCATION',
  WORK = 'WORK',
  PERSONAL = 'PERSONAL',
  FITNESS = 'FITNESS',
  FINANCE = 'FINANCE',
  HOBBY = 'HOBBY',
  SOCIAL = 'SOCIAL',
  OTHER = 'OTHER',
}

registerEnumType(TaskCategory, {
  name: 'TaskCategory',
  description: 'Categoria da tarefa',
});
