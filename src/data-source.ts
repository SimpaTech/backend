import { DataSource } from "typeorm";
import { Usuario } from "./entities/Usuario";
import { TipoParametro } from "./entities/TipoParametro";
import { TipoAlerta } from "./entities/TipoAlerta";
import { Parametro_Alerta } from "./entities/ParametroAlerta";
import { Parametro } from "./entities/Parametro";
import { Ocorrencias } from "./entities/Ocorrencias";
import { Medida } from "./entities/Medida";
import { Estacao } from "./entities/Estacao";
import { config } from 'dotenv';

config();

const SqlDataSource = new DataSource({
    host: "localhost",
    port: 3306,
    username: "root",
    password: process.env.DB_PASSWORD,
    database: "simpatech",
    type: "mysql",
    synchronize: true,
    logging: false,
    entities: [
        Usuario,
        TipoParametro,
        TipoAlerta,
        Parametro_Alerta,
        Parametro,
        Ocorrencias,
        Medida,
        Estacao
    ],
    migrations: ["src/migrations/*.ts"],
});


SqlDataSource.initialize()
    .then(() => {
        console.log("Data Source inicializado!");
    })
    .catch((e) => {
        console.error("Erro na inicialização do Data Source:", e);
    });

export default SqlDataSource;
