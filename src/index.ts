import express from 'express';
import cors from 'cors';
import SqlDataSource from './data-source';
import router from './routes';

const app = express();
const port = 4000;

app.use(express.json());

app.use(cors());

app.use(router);

app.get('/', (req, res) => {
  res.send('Backend API está sendo executado!');
});


SqlDataSource.initialize()
    .then(() => {
        app.listen(port, () => {
            console.log(`Servidor está rodando em http://localhost:${port}`);
        });
    })
    .catch((e) => {
        console.error("Erro na inicialização do Data Source:", e);
    });
