import { execSync } from 'child_process';
import * as readline from 'readline';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Digite a versão da migração: (Formato X-Y-Z)', (version) => {
    const command = `typeorm-ts-node-commonjs -d ./src/data-source.ts migration:generate ./src/migrations/v${version}`;
    try {
        execSync(command, { stdio: 'inherit' });
        console.log('Migração gerada com sucesso!');
    } catch (error) {
        console.error('Erro ao gerar a migração:', error);
    }
    rl.close();
});
