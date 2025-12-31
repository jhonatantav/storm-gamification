import { Module, Global } from '@nestjs/common';
import { TemporalClientProvider } from './temporal-client.provider';
import { TemporalService } from './temporal.service';
import { UpdateUserLevelActivity } from './activities/update-user-level.activity';
import { UpdateUserLevelProducer } from './producers/update-user-level.producer';
import { UsersModule } from '../users/users.module';

@Global()
@Module({
  imports: [UsersModule],
  providers: [
    TemporalClientProvider, // Provider de conexão (base)
    UpdateUserLevelProducer, // Producers usam o provider
    TemporalService, // Service usa os producers
    UpdateUserLevelActivity, // Activity para o worker
  ],
  exports: [
    TemporalService, // Apenas o service é exportado
    UpdateUserLevelActivity, // Activity precisa ser exportada para o worker
  ],
})
export class TemporalModule {}
