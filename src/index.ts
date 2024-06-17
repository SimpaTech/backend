import express from 'express';
import cors from 'cors';
import SqlDataSource from './data-source';
import router from './routes';
import { cadastrarUsuarioPadrao } from './services/UsuarioServices';
import { connectMongo } from './mongoDB';
import TratamentoServices from './services/TratamentoServices';
import cron from 'node-cron';

const app = express();
const port = 4000;

app.use(express.json());

app.use(cors());

app.use(router);

app.get('/', (req, res) => {
    res.send('Backend API está sendo executado!');
});

async function iniciarTratamentoMedidas() {
    await TratamentoServices.processarMedidas();
}

// Agenda a execução do tratamento das medidas a cada 1 minuto
cron.schedule('*/1 * * * *', async () => {
    console.log('Executando o tratamento das medidas...');
    await iniciarTratamentoMedidas();
});

SqlDataSource.initialize()
    .then(() => {
        cadastrarUsuarioPadrao()
            .then(() => {
                connectMongo()
                    .then(() => {
                        app.listen(port, () => {
                            console.log(`Servidor está rodando em http://localhost:${port}`);
                            iniciarTratamentoMedidas();
                        });
                    })
                    .catch((error) => {
                        console.error("Erro ao conectar ao MongoDB Atlas:", error);
                    });
            })
            .catch((error) => {
                console.error("Erro ao cadastrar o usuário padrão:", error);
            });
    })
    .catch((e) => {
        console.error("Erro na inicialização do Data Source:", e);
    });