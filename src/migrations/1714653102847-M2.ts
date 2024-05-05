import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1714653102847 implements MigrationInterface {
    name = 'M2-1714653102847'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tipo_parametro\` ADD \`Indicativo_Ativa\` tinyint NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`tipo_alerta\` ADD \`Indicativo_Ativa\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`tipo_alerta\` DROP COLUMN \`Indicativo_Ativa\``);
        await queryRunner.query(`ALTER TABLE \`tipo_parametro\` DROP COLUMN \`Indicativo_Ativa\``);
    }

}
