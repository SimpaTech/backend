import { TipoParametro } from "../entities/TipoParametro";
import SqlDataSource from "../data-source";

async function adicionarTipoParametro(Fator: number, Offset: number, Unidade: string, Nome_Tipo_Parametro: string): Promise<TipoParametro> {
    const tipoParametroRepository = SqlDataSource.getRepository(TipoParametro)

    const tipoParametro = new TipoParametro();
    tipoParametro.Fator = Fator;
    tipoParametro.Offset = Offset;
    tipoParametro.Unidade = Unidade;
    tipoParametro.Nome_Tipo_Parametro = Nome_Tipo_Parametro;

    return await tipoParametroRepository.save(tipoParametro);
}

async function listarTodosTipoParametro() {
    const tipoParametroRepository = SqlDataSource.getRepository(TipoParametro);
    return await tipoParametroRepository.find();
}

async function procurarTipoParametroId(id) {
    const tipoParametroRepository = SqlDataSource.getRepository(TipoParametro);
    return await tipoParametroRepository.findOne({ where: { ID_Tipo_Parametro: id } })
}

async function procurarTipoParametro(filtro) {
    const tipoParametroRepository = SqlDataSource.getRepository(TipoParametro);
    return await tipoParametroRepository.find({ where: filtro });
}

async function atualizarTipoParametro(id, data) {
    const tipoParametroRepositoryRepository = SqlDataSource.getRepository(TipoParametro)
    const tipoparametro = await tipoParametroRepositoryRepository.findOne({ where: { ID_Tipo_Parametro: id } });

    if (!tipoparametro) {
        throw new Error("Tipo de parâmetro não encontrado!");
    }

    if (data.Nome_Tipo_Parametro !== undefined && data.Nome_Tipo_Parametro !== "") {
        tipoparametro.Nome_Tipo_Parametro = data.Nome_Tipo_Parametro;
    }

    if (data.Offset !== undefined && data.Offset !== "") {
        tipoparametro.Offset = data.Offset;
    }

    if (data.Unidade !== undefined && data.Unidade !== "") {
        tipoparametro.Unidade = data.Unidade;
    }

    if (data.Fator !== undefined && data.Fator !== "") {
        tipoparametro.Fator = data.Fator;
    }

    await tipoparametro.save()

    return tipoparametro
}

async function deletarTipoParametro(id) {
    const tipoParametroRepository = SqlDataSource.getRepository(TipoParametro)
    const tipoParametro = await tipoParametroRepository.findOne({ where: { ID_Tipo_Parametro: id} })

    if (!tipoParametro){
        throw new Error("Tipo de parâmetro não encontrado!");
    }

    const removerTipoParametro = await tipoParametroRepository.delete(id)
    return removerTipoParametro
}

async function alternarStatusTipoAlerta(ID_Tipo_Parametro: number): Promise<{ success: boolean, error?: string }> {
    const tipoParametroRepository = SqlDataSource.getRepository(TipoParametro);

    try {
        const tipoParametroExistente = await tipoParametroRepository.findOne({ where: { ID_Tipo_Parametro: ID_Tipo_Parametro } });
        if (!tipoParametroExistente) {
            throw new Error('Tipo de alerta não encontrado'); 
        }

        tipoParametroExistente.Indicativo_Ativa = !tipoParametroExistente.Indicativo_Ativa;

        await tipoParametroRepository.save(tipoParametroExistente);

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

export {adicionarTipoParametro, listarTodosTipoParametro, procurarTipoParametroId, procurarTipoParametro, atualizarTipoParametro, deletarTipoParametro, alternarStatusTipoAlerta}