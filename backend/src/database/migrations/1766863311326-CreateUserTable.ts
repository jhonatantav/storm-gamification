import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserTable1766863311326 implements MigrationInterface {
  name = 'CreateUserTable1766863311326';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "seq_id" SERIAL NOT NULL, "status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "full_name" character varying(255) NOT NULL, "nick_name" character varying(30) NOT NULL, "email" character varying(255) NOT NULL, "phone_number" character varying(20) NOT NULL, "password_hash" character varying(255) NOT NULL, "current_level" integer NOT NULL DEFAULT '1', "avatar_url" character varying(500), "current_xp" integer NOT NULL DEFAULT '0', "total_xp" integer NOT NULL DEFAULT '0', CONSTRAINT "UQ_65e29b09a064487efd3e96c4689" UNIQUE ("full_name"), CONSTRAINT "UQ_878678f951ec57decddec263213" UNIQUE ("nick_name"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_01eea41349b6c9275aec646eee0" UNIQUE ("phone_number"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "user"`);
  }
}
