import { TipoAlerta } from "../entities/TipoAlerta";
import SqlDataSource from "../data-source";
import { Parametro } from "../entities/Parametro";

async function criarTipoAlerta(nome: string, valor: number, operadorCondicional: string, parametro: Parametro): Promise<TipoAlerta> {
    const tipoAlertaRepository = SqlDataSource.getRepository(TipoAlerta);

    const novoTipoAlerta = new TipoAlerta();
    novoTipoAlerta.Nome_Tipo_Alerta = nome;
    novoTipoAlerta.Valor = valor;
    novoTipoAlerta.Operador_Condicional = operadorCondicional;
    novoTipoAlerta.parametro = parametro;

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

export { criarTipoAlerta, editarTipoAlerta, removerTipoAlerta };
