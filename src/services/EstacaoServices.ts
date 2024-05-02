import { v4 as uuidv4 } from 'uuid';
import { Estacao } from "../entities/Estacao";
import SqlDataSource from "../data-source";
import { Parametro_Alerta } from '../entities/ParametroAlerta';

async function createEstacao(Nome: string, Latitude: number, Longitude: number, Data_Instalacao: Date, Tipo_Estacao: string, Indicativo_Ativa: boolean): Promise<Estacao> {
    const estacaoRepository = SqlDataSource.getRepository(Estacao)

    const estacao = new Estacao();
    estacao.UID = uuidv4(); 
    estacao.Nome = Nome;
    estacao.Latitude = Latitude;
    estacao.Longitude = Longitude;
    estacao.Data_Instalacao = Data_Instalacao;
    estacao.Tipo_Estacao = Tipo_Estacao;
    estacao.Indicativo_Ativa = true;

    return await estacaoRepository.save(estacao);
}

async function editarEstacao(ID_Estacao: number, dadosAtualizados: { 
    Nome?: string, 
    Latitude?: number, 
    Longitude?: number, 
    Data_Instalacao?: Date, 
    Tipo_Estacao?: string, 
    Indicativo_Ativa?: boolean 
}): Promise<Estacao | null> {
    const estacaoRepository = SqlDataSource.getRepository(Estacao);
    
    // Verifica se a estação com o ID fornecido existe
    const estacaoExistente = await estacaoRepository.findOne({ where: { ID_Estacao: ID_Estacao } })
    if (!estacaoExistente) {
        return null; 
    }

    if (dadosAtualizados.Nome !== undefined && dadosAtualizados.Nome !== "") {
        estacaoExistente.Nome = dadosAtualizados.Nome;
    }
    if (dadosAtualizados.Latitude !== undefined) {
        estacaoExistente.Latitude = dadosAtualizados.Latitude;
    }
    if (dadosAtualizados.Longitude !== undefined) {
        estacaoExistente.Longitude = dadosAtualizados.Longitude;
    }
    if (dadosAtualizados.Data_Instalacao !== undefined) {
        estacaoExistente.Data_Instalacao = dadosAtualizados.Data_Instalacao;
    }
    if (dadosAtualizados.Tipo_Estacao !== undefined && dadosAtualizados.Tipo_Estacao !== "") {
        estacaoExistente.Tipo_Estacao = dadosAtualizados.Tipo_Estacao;
    }
    if (dadosAtualizados.Indicativo_Ativa !== undefined) {
        estacaoExistente.Indicativo_Ativa = dadosAtualizados.Indicativo_Ativa;
    }

    await estacaoRepository.save(estacaoExistente);

    return estacaoExistente;
}

async function removerEstacao(ID_Estacao: number): Promise<{ success: boolean, error?: string }> {
    const estacaoRepository = SqlDataSource.getRepository(Estacao);

    try {
        const estacaoExistente = await estacaoRepository.findOne({ where: { ID_Estacao: ID_Estacao } });
        if (!estacaoExistente) {
            throw new Error('Estação não encontrada'); 
        }

        await estacaoRepository.remove(estacaoExistente);

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function listarEstacaoPorID(ID_Estacao: number): Promise<Estacao | null> {
    const estacaoRepository = SqlDataSource.getRepository(Estacao);
    
    const estacao = await estacaoRepository.createQueryBuilder("estacao")
        .leftJoinAndSelect("estacao.parametros", "parametro")
        .leftJoinAndSelect("parametro.tipoParametro", "tipoParametro")
        .where("estacao.ID_Estacao = :id", { id: ID_Estacao })
        .getOne();

    if (!estacao) return null;


    for (const parametro of estacao.parametros) {
        const parametroAlertaRepository = SqlDataSource.getRepository(Parametro_Alerta);
        const parametroAlertas =  await parametroAlertaRepository.createQueryBuilder("parametroAlerta")
            .leftJoinAndSelect("parametroAlerta.tipoAlerta", "tipoAlerta")
            .where("parametroAlerta.parametro = :parametroId", { parametroId: parametro.ID_Parametro })
            .getMany();

        parametro.parametroAlertas = parametroAlertas;
    }

    return estacao;
}

async function listarTodasEstacoes(): Promise<Estacao[]> {
    const estacaoRepository = SqlDataSource.getRepository(Estacao);
    return await estacaoRepository.find();
}

async function listarTodasEstacoesAtivas(): Promise<Estacao[] | null> {
    const estacaoRepository = SqlDataSource.getRepository(Estacao);
    try {
        const estacoesAtivas = await estacaoRepository.find({ where: { Indicativo_Ativa: true } });
        return estacoesAtivas;
    } catch (error) {
        return null;
    }
}

async function alternarStatusEstacao(ID_Estacao: number): Promise<{ success: boolean, error?: string }> {
    const estacaoRepository = SqlDataSource.getRepository(Estacao);

    try {
        const estacaoExistente = await estacaoRepository.findOne({ where: { ID_Estacao: ID_Estacao } });
        if (!estacaoExistente) {
            throw new Error('Estação não encontrada'); 
        }

        estacaoExistente.Indicativo_Ativa = !estacaoExistente.Indicativo_Ativa;

        await estacaoRepository.save(estacaoExistente);

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export { createEstacao, editarEstacao, removerEstacao, listarEstacaoPorID, listarTodasEstacoes, alternarStatusEstacao, listarTodasEstacoesAtivas };
