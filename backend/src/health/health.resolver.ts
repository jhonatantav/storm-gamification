import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class HealthResolver {
  @Query(() => String, { description: 'Health check endpoint' })
  health(): string {
    return 'OK';
  }

  @Query(() => String, { description: 'Returns the current server time' })
  serverTime(): string {
    return new Date().toISOString();
  }
}
