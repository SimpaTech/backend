import { TipoAlerta } from "../entities/TipoAlerta";
import SqlDataSource from "../data-source";

async function criarTipoAlerta(nome: string, valor: number, operadorCondicional: string): Promise<TipoAlerta> {
    const tipoAlertaRepository = SqlDataSource.getRepository(TipoAlerta);

    const novoTipoAlerta = new TipoAlerta();
    novoTipoAlerta.Nome_Tipo_Alerta = nome;
    novoTipoAlerta.Valor = valor;
    novoTipoAlerta.Operador_Condicional = operadorCondicional;
    novoTipoAlerta.Indicativo_Ativa = true;

    return await tipoAlertaRepository.save(novoTipoAlerta);
}

async function editarTipoAlerta(ID_Tipo_Alerta: number, dadosAtualizados: { 
    Nome_Tipo_Alerta?: string, 
    Valor: number, 
    Operador_Condicional?: string 
}): Promise<TipoAlerta | null> {
    const tipoAlertaRepository = SqlDataSource.getRepository(TipoAlerta);
    
    const tipoAlertaExistente = await tipoAlertaRepository.findOne({ where: { ID_Tipo_Alerta: ID_Tipo_Alerta } })
    if (!tipoAlertaExistente) {
        return null; 
    }

    if (dadosAtualizados.Nome_Tipo_Alerta !== undefined && dadosAtualizados.Nome_Tipo_Alerta !== "") {
        tipoAlertaExistente.Nome_Tipo_Alerta = dadosAtualizados.Nome_Tipo_Alerta;
    }
    if (dadosAtualizados.Valor !== undefined) {
        tipoAlertaExistente.Valor = dadosAtualizados.Valor;
    }
    if (dadosAtualizados.Operador_Condicional !== undefined && dadosAtualizados.Operador_Condicional !== "") {
        tipoAlertaExistente.Operador_Condicional = dadosAtualizados.Operador_Condicional;
    }

    await tipoAlertaRepository.save(tipoAlertaExistente);

    return tipoAlertaExistente;
}

async function removerTipoAlerta(ID_Tipo_Alerta: number): Promise<{ success: boolean, error?: string }> {
    const tipoAlertaRepository = SqlDataSource.getRepository(TipoAlerta);

    try {
        const tipoAlertaExistente = await tipoAlertaRepository.findOne({ where: { ID_Tipo_Alerta: ID_Tipo_Alerta } });
        if (!tipoAlertaExistente) {
            throw new Error('Tipo de Alerta não encontrado'); 
        }

        await tipoAlertaRepository.remove(tipoAlertaExistente);

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function listarTodosTipoAlerta() {
    const tipoAlertaRepository = SqlDataSource.getRepository(TipoAlerta);
    return await tipoAlertaRepository.find();
}

async function listarTipoAlertaPorId(ID_Tipo_Alerta) {
    const tipoAlertaRepository = SqlDataSource.getRepository(TipoAlerta);
    return await tipoAlertaRepository.findOne({ where: { ID_Tipo_Alerta: ID_Tipo_Alerta } })
}

async function listarTipoAlertaPorCampo(campo) {
    const tipoAlertaRepository = SqlDataSource.getRepository(TipoAlerta);
    return await tipoAlertaRepository.find({ where: campo });
}

async function alternarStatusTipoAlerta(ID_Tipo_Alerta: number): Promise<{ success: boolean, error?: string }> {
    const tipoAlertaRepository = SqlDataSource.getRepository(TipoAlerta);

    try {
        const tipoAlertaExistente = await tipoAlertaRepository.findOne({ where: { ID_Tipo_Alerta: ID_Tipo_Alerta } });
        if (!tipoAlertaExistente) {
            throw new Error('Tipo de alerta não encontrado'); 
        }

        tipoAlertaExistente.Indicativo_Ativa = !tipoAlertaExistente.Indicativo_Ativa;

        await tipoAlertaRepository.save(tipoAlertaExistente);

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function listarTodosTiposAlertaAtivos(): Promise<TipoAlerta[] | null> {
    const tipoAlertaRepository = SqlDataSource.getRepository(TipoAlerta);
    try {
        const tipoAlertaAtivas = await tipoAlertaRepository.find({ where: { Indicativo_Ativa: true } });
        return tipoAlertaAtivas;
    } catch (error) {
        return null;
    }
}

export { criarTipoAlerta, editarTipoAlerta, removerTipoAlerta, listarTodosTipoAlerta, listarTipoAlertaPorId, listarTipoAlertaPorCampo, alternarStatusTipoAlerta, listarTodosTiposAlertaAtivos };
