import 'dotenv/config';
import { execSync } from 'child_process';

const version = process.env.DADOS_DB_VERSION;

if (!version) {
    console.error('A versão da carga de dados não está definida no arquivo .env');
    process.exit(1);
}

const scriptName = `dadosDB-v${version}`;
const command = `ts-node ./src/scripts/${scriptName}`;

try {
    execSync(command, { stdio: 'inherit' });
    console.log('OK!');
} catch (error) {
    console.error('Erro ao inserir dados:', error);
}
