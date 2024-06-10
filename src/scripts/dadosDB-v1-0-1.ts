import { DataSource } from "typeorm";
import { Estacao } from '../entities/Estacao';
import { Parametro } from '../entities/Parametro';
import { Medida } from '../entities/Medida';
import { Ocorrencias } from '../entities/Ocorrencias';
import { Parametro_Alerta } from '../entities/ParametroAlerta';
import { TipoAlerta } from '../entities/TipoAlerta';
import { TipoParametro } from '../entities/TipoParametro';
import { Usuario } from '../entities/Usuario';
import { config } from 'dotenv';

config();

const connection = new DataSource({
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: 'simpatech',
    entities: [
        Estacao,
        Parametro,
        Medida,
        Ocorrencias,
        Parametro_Alerta,
        TipoAlerta,
        TipoParametro,
        Usuario,
    ],
    synchronize: false,
});

async function seedDatabase() {
    try {
        await connection.initialize();
        console.log("Conexão para inserção de dados de amostra iniciada!");

        const existingEstacaoRepository = connection.getRepository(Estacao);
        const existingEstacao = await existingEstacaoRepository.find();
        if (existingEstacao.length > 0) {
            console.log('Dados iniciais já foram inseridos, abortando script.');
            await connection.destroy();
            return;
        }

        const tipoParametro1 = new TipoParametro();
        tipoParametro1.Fator = 1.0;
        tipoParametro1.Offset = 0.0;
        tipoParametro1.Unidade = 'C';
        tipoParametro1.Json = 'Temp';
        tipoParametro1.Nome_Tipo_Parametro = 'Temperatura';
        tipoParametro1.Indicativo_Ativa = true;
        await connection.manager.save(tipoParametro1);

        const tipoParametro2 = new TipoParametro();
        tipoParametro2.Fator = 1.0;
        tipoParametro2.Offset = 0.0;
        tipoParametro2.Unidade = '%';
        tipoParametro2.Json = 'Umidade';
        tipoParametro2.Nome_Tipo_Parametro = 'Umidade';
        tipoParametro2.Indicativo_Ativa = true;
        await connection.manager.save(tipoParametro2);

        for (let i = 1; i <= 10; i++) {
            const estacao = new Estacao();
            estacao.UID = `123456789${i}`;
            estacao.Nome = `Estação ${i}`;
            estacao.Latitude = -23.55052 + i * 0.01;
            estacao.Longitude = -46.633308 + i * 0.01;
            estacao.Data_Instalacao = new Date(`2020-01-${i}`);
            estacao.Tipo_Estacao = `Estação Terrestre`;
            estacao.Indicativo_Ativa = true;
            await connection.manager.save(estacao);

            const parametroTemp = new Parametro();
            parametroTemp.estacao = estacao;
            parametroTemp.tipoParametro = tipoParametro1;
            await connection.manager.save(parametroTemp);

            const parametroUmid = new Parametro();
            parametroUmid.estacao = estacao;
            parametroUmid.tipoParametro = tipoParametro2;
            await connection.manager.save(parametroUmid);

            const medidaTemp = new Medida();
            medidaTemp.parametro = parametroTemp;
            medidaTemp.UnixTime = Math.floor(new Date().getTime() / 1000);
            medidaTemp.Valor = 10.0 + i;
            await connection.manager.save(medidaTemp);

            const medidaUmid = new Medida();
            medidaUmid.parametro = parametroUmid;
            medidaUmid.UnixTime = Math.floor(new Date().getTime() / 1000);
            medidaUmid.Valor = 60.0 + i * 2;
            await connection.manager.save(medidaUmid);

            const tipoAlertaTemp = new TipoAlerta();
            tipoAlertaTemp.Nome_Tipo_Alerta = `Alerta de Temperatura Alta ${i}`;
            tipoAlertaTemp.Valor = 9.0 + i;
            tipoAlertaTemp.Operador_Condicional = '>';
            tipoAlertaTemp.Indicativo_Ativa = true;
            await connection.manager.save(tipoAlertaTemp);

            const tipoAlertaUmid = new TipoAlerta();
            tipoAlertaUmid.Nome_Tipo_Alerta = `Alerta de Umidade Alta ${i}`;
            tipoAlertaUmid.Valor = 58.0 + i * 2;
            tipoAlertaUmid.Operador_Condicional = '>';
            tipoAlertaUmid.Indicativo_Ativa = true;
            await connection.manager.save(tipoAlertaUmid);

            const parametroAlertaTemp = new Parametro_Alerta();
            parametroAlertaTemp.parametro = parametroTemp;
            parametroAlertaTemp.tipoAlerta = tipoAlertaTemp;
            await connection.manager.save(parametroAlertaTemp);

            const parametroAlertaUmid = new Parametro_Alerta();
            parametroAlertaUmid.parametro = parametroUmid;
            parametroAlertaUmid.tipoAlerta = tipoAlertaUmid;
            await connection.manager.save(parametroAlertaUmid);

            const ocorrenciaTemp = new Ocorrencias();
            ocorrenciaTemp.medida = medidaTemp;
            ocorrenciaTemp.parametro_alerta = parametroAlertaTemp;
            await connection.manager.save(ocorrenciaTemp);

            const ocorrenciaUmid = new Ocorrencias();
            ocorrenciaUmid.medida = medidaUmid;
            ocorrenciaUmid.parametro_alerta = parametroAlertaUmid;
            await connection.manager.save(ocorrenciaUmid);
        }

        console.log('Dados fictícios inseridos com sucesso!');
        await connection.destroy();
    } catch (error) {
        console.error('Erro ao inserir dados fictícios:', error);
    }
}

seedDatabase();
