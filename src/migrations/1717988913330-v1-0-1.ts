import { MigrationInterface, QueryRunner } from "typeorm";

export class V1011717988913330 implements MigrationInterface {
    name = 'V1011717988913330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`estacao\` ADD \`Data_Instalacao\` datetime NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`estacao\` ADD \`Tipo_Estacao\` varchar(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`estacao\` ADD \`Indicativo_Ativa\` tinyint NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`estacao\` DROP COLUMN \`Indicativo_Ativa\``);
        await queryRunner.query(`ALTER TABLE \`estacao\` DROP COLUMN \`Tipo_Estacao\``);
        await queryRunner.query(`ALTER TABLE \`estacao\` DROP COLUMN \`Data_Instalacao\``);
    }

}