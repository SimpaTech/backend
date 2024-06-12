import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

config();

const databaseName = 'simpatech';  // O nome do banco de dados que você deseja criar

// Clone a configuração existente, mas sem especificar um banco de dados
const dataSourceOptions: DataSourceOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: process.env.DB_PASSWORD,
    database: '',  // Não especificar um banco de dados para esta conexão
    synchronize: false,
    logging: false,
};

const temporaryDataSource = new DataSource(dataSourceOptions);

async function createDatabase() {
    try {
        await temporaryDataSource.initialize();
        await temporaryDataSource.query(`CREATE DATABASE IF NOT EXISTS ${databaseName}`);
        console.log(`Banco de dados '${databaseName}' criado ou já existente.`);
    } catch (error) {
        console.error('Erro ao criar o banco de dados:', error);
    } finally {
        await temporaryDataSource.destroy();
    }
}

createDatabase().catch((error) => console.error(error));
