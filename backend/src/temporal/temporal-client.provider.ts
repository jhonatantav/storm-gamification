import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { Connection, Client } from '@temporalio/client';
import { env } from '../environment';
import { Logger } from 'nestjs-pino';

/**
 * Provider que gerencia a conexão com o Temporal
 * Responsável apenas por criar e manter o client
 */
@Injectable()
export class TemporalClientProvider implements OnModuleInit, OnModuleDestroy {
  private connection: Connection;
  private client: Client;

  constructor(private readonly logger: Logger) {}

  async onModuleInit() {
    try {
      this.connection = await Connection.connect({
        address: env.TEMPORAL_ADDRESS,
      });

      this.client = new Client({
        connection: this.connection,
      });

      this.logger.log('Conectado ao Temporal com sucesso');
    } catch (error) {
      this.logger.error('Erro ao conectar ao Temporal', error);
      throw error;
    }
  }

  async onModuleDestroy() {
    await this.connection?.close();
    this.logger.log('Conexão com Temporal fechada');
  }

  getClient(): Client {
    if (!this.client) {
      throw new Error('Temporal client não está inicializado');
    }
    return this.client;
  }
}
