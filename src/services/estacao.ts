import { v4 as uuidv4 } from 'uuid';
import { Estacao } from "../entities/Estacao";
import SqlDataSource from "../data-source";

async function createEstacao(Nome: string, Latitude: number, Longitude: number, Data_Instalacao: Date, Tipo_Estacao: string, Indicativo_Ativa: boolean): Promise<Estacao> {
    const estacaoRepository = SqlDataSource.getRepository(Estacao)

    const estacao = new Estacao();
    estacao.UID = uuidv4(); 
    estacao.Nome = Nome;
    estacao.Latitude = Latitude;
    estacao.Longitude = Longitude;
    estacao.Data_Instalacao = Data_Instalacao;
    estacao.Tipo_Estacao = Tipo_Estacao;
    estacao.Indicativo_Ativa = Indicativo_Ativa;

    return await estacaoRepository.save(estacao);
}

export { createEstacao };
