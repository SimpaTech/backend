import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1715644917892 implements MigrationInterface {
    name = 'M3-1715644917892'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tipo_parametro\` ADD \`Json\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tipo_parametro\` DROP COLUMN \`Json\``);
    }

}
