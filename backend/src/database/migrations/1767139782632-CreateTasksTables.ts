import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTasksTables1767139782632 implements MigrationInterface {
  name = 'CreateTasksTables1767139782632';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task_streaks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "seq_id" SERIAL NOT NULL, "status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "current_streak" integer NOT NULL DEFAULT '0', "longest_streak" integer NOT NULL DEFAULT '0', "last_completed_at" TIMESTAMP, "is_active" boolean NOT NULL DEFAULT true, "ended_at" TIMESTAMP, "task_id" uuid, "user_id" uuid, CONSTRAINT "PK_966f1127310eaf341552b43b5db" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."tasks_category_enum" AS ENUM('HEALTH', 'EDUCATION', 'WORK', 'PERSONAL', 'FITNESS', 'FINANCE', 'HOBBY', 'SOCIAL', 'OTHER')`,
    );
    await queryRunner.query(
      `CREATE TABLE "tasks" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "seq_id" SERIAL NOT NULL, "status" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "name" character varying(100) NOT NULL, "description" text, "category" "public"."tasks_category_enum" NOT NULL DEFAULT 'OTHER', "weekly_frequency" text NOT NULL, "user_id" uuid, "current_streak_id" uuid, CONSTRAINT "REL_08ac3d7b67b7970baa9b53c2c0" UNIQUE ("current_streak_id"), CONSTRAINT "PK_8d12ff38fcc62aaba2cab748772" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_streaks" ALTER COLUMN "task_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_streaks" ALTER COLUMN "user_id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_streaks" ADD CONSTRAINT "FK_2d0de8929df543e6e21d7c0f175" FOREIGN KEY ("task_id") REFERENCES "tasks"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_streaks" ADD CONSTRAINT "FK_e1b07b5f15d7b14bcc28e2c5155" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_db55af84c226af9dce09487b61b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" ADD CONSTRAINT "FK_08ac3d7b67b7970baa9b53c2c0c" FOREIGN KEY ("current_streak_id") REFERENCES "task_streaks"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_08ac3d7b67b7970baa9b53c2c0c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "tasks" DROP CONSTRAINT "FK_db55af84c226af9dce09487b61b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_streaks" DROP CONSTRAINT "FK_e1b07b5f15d7b14bcc28e2c5155"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_streaks" DROP CONSTRAINT "FK_2d0de8929df543e6e21d7c0f175"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_streaks" ALTER COLUMN "user_id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "task_streaks" ALTER COLUMN "task_id" DROP NOT NULL`,
    );
    await queryRunner.query(`DROP TABLE "tasks"`);
    await queryRunner.query(`DROP TYPE "public"."tasks_category_enum"`);
    await queryRunner.query(`DROP TABLE "task_streaks"`);
  }
}
