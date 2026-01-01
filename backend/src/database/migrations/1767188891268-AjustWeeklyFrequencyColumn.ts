import { MigrationInterface, QueryRunner } from "typeorm";

export class AjustWeeklyFrequencyColumn1767188891268 implements MigrationInterface {
    name = 'AjustWeeklyFrequencyColumn1767188891268'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_db55af84c226af9dce09487b61b"`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "weekly_frequency"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "weekly_frequency" integer array NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "user_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_db55af84c226af9dce09487b61b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tasks" DROP CONSTRAINT "FK_db55af84c226af9dce09487b61b"`);
        await queryRunner.query(`ALTER TABLE "tasks" ALTER COLUMN "user_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" DROP COLUMN "weekly_frequency"`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD "weekly_frequency" text NOT NULL`);
        await queryRunner.query(`ALTER TABLE "tasks" ADD CONSTRAINT "FK_db55af84c226af9dce09487b61b" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
