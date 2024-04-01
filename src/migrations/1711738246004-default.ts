import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1711738246004 implements MigrationInterface {
    name = 'Default1711738246004'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`estacao\` (\`ID_Estacao\` int NOT NULL AUTO_INCREMENT, \`UID\` int NOT NULL, \`Nome\` varchar(255) NOT NULL, \`Latitude\` float NOT NULL, \`Longitude\` float NOT NULL, \`Data_Instalacao\` datetime NOT NULL, \`Tipo_Estacao\` varchar(255) NOT NULL, \`Indicativo_Ativa\` tinyint NOT NULL, UNIQUE INDEX \`IDX_d83e8a26ffa29755faefaf0c05\` (\`UID\`), PRIMARY KEY (\`ID_Estacao\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tipo_parametro\` (\`ID_Tipo_Parametro\` int NOT NULL AUTO_INCREMENT, \`Fator\` float NOT NULL, \`Offset\` float NOT NULL, \`Unidade\` varchar(255) NOT NULL, \`Nome_Tipo_Parametro\` varchar(255) NOT NULL, PRIMARY KEY (\`ID_Tipo_Parametro\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tipo_alerta\` (\`ID_Tipo_Alerta\` int NOT NULL AUTO_INCREMENT, \`Nome_Tipo_Alerta\` varchar(255) NOT NULL, \`Valor\` float NOT NULL, \`Operador_Condicional\` varchar(255) NOT NULL, \`parametroIDParametro\` int NULL, PRIMARY KEY (\`ID_Tipo_Alerta\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`medida\` (\`ID_Medida\` int NOT NULL AUTO_INCREMENT, \`UnixTime\` int NOT NULL, \`Valor\` float NOT NULL, \`parametroIDParametro\` int NULL, PRIMARY KEY (\`ID_Medida\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`parametro\` (\`ID_Parametro\` int NOT NULL AUTO_INCREMENT, \`estacaoIDEstacao\` int NULL, \`tipoParametroIDTipoParametro\` int NULL, PRIMARY KEY (\`ID_Parametro\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`usuario\` (\`ID_Usuario\` int NOT NULL AUTO_INCREMENT, \`Nome_Usuario\` varchar(255) NOT NULL, \`CPF_Usuario\` varchar(255) NOT NULL, \`Role\` varchar(255) NOT NULL, \`Senha\` varchar(255) NOT NULL, UNIQUE INDEX \`IDX_e8e6a306e71b43e9921f911e36\` (\`CPF_Usuario\`), PRIMARY KEY (\`ID_Usuario\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`ocorrencias\` (\`ID_Ocorrencia\` int NOT NULL AUTO_INCREMENT, \`medidaIDMedida\` int NULL, \`tipoAlertaIDTipoAlerta\` int NULL, PRIMARY KEY (\`ID_Ocorrencia\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`tipo_alerta\` ADD CONSTRAINT \`FK_cb43eefcf3fe836f7349cd5e16d\` FOREIGN KEY (\`parametroIDParametro\`) REFERENCES \`parametro\`(\`ID_Parametro\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`medida\` ADD CONSTRAINT \`FK_4f933dec749eea09a865d7b0e79\` FOREIGN KEY (\`parametroIDParametro\`) REFERENCES \`parametro\`(\`ID_Parametro\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`parametro\` ADD CONSTRAINT \`FK_7e83dff0200dd7418ceedf25235\` FOREIGN KEY (\`estacaoIDEstacao\`) REFERENCES \`estacao\`(\`ID_Estacao\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`parametro\` ADD CONSTRAINT \`FK_8648a8648e1d710606171fcbca8\` FOREIGN KEY (\`tipoParametroIDTipoParametro\`) REFERENCES \`tipo_parametro\`(\`ID_Tipo_Parametro\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ocorrencias\` ADD CONSTRAINT \`FK_e9e1711ded4c033693729c54d84\` FOREIGN KEY (\`medidaIDMedida\`) REFERENCES \`medida\`(\`ID_Medida\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`ocorrencias\` ADD CONSTRAINT \`FK_6483f3f00d708ff83ea782224bb\` FOREIGN KEY (\`tipoAlertaIDTipoAlerta\`) REFERENCES \`tipo_alerta\`(\`ID_Tipo_Alerta\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`ocorrencias\` DROP FOREIGN KEY \`FK_6483f3f00d708ff83ea782224bb\``);
        await queryRunner.query(`ALTER TABLE \`ocorrencias\` DROP FOREIGN KEY \`FK_e9e1711ded4c033693729c54d84\``);
        await queryRunner.query(`ALTER TABLE \`parametro\` DROP FOREIGN KEY \`FK_8648a8648e1d710606171fcbca8\``);
        await queryRunner.query(`ALTER TABLE \`parametro\` DROP FOREIGN KEY \`FK_7e83dff0200dd7418ceedf25235\``);
        await queryRunner.query(`ALTER TABLE \`medida\` DROP FOREIGN KEY \`FK_4f933dec749eea09a865d7b0e79\``);
        await queryRunner.query(`ALTER TABLE \`tipo_alerta\` DROP FOREIGN KEY \`FK_cb43eefcf3fe836f7349cd5e16d\``);
        await queryRunner.query(`DROP TABLE \`ocorrencias\``);
        await queryRunner.query(`DROP INDEX \`IDX_e8e6a306e71b43e9921f911e36\` ON \`usuario\``);
        await queryRunner.query(`DROP TABLE \`usuario\``);
        await queryRunner.query(`DROP TABLE \`parametro\``);
        await queryRunner.query(`DROP TABLE \`medida\``);
        await queryRunner.query(`DROP TABLE \`tipo_alerta\``);
        await queryRunner.query(`DROP TABLE \`tipo_parametro\``);
        await queryRunner.query(`DROP INDEX \`IDX_d83e8a26ffa29755faefaf0c05\` ON \`estacao\``);
        await queryRunner.query(`DROP TABLE \`estacao\``);
    }

}
