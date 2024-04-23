import { Parametro } from "../entities/Parametro";
import SqlDataSource from "../data-source";
import { Estacao } from "../entities/Estacao";
import { TipoParametro } from "../entities/TipoParametro";

async function criarParametro(ID_Estacao: number, ID_TipoParametro: number): Promise<Parametro> {
    const parametroRepository = SqlDataSource.getRepository(Parametro);
    const estacaoRepository = SqlDataSource.getRepository(Estacao);
    const tipoParametroRepository = SqlDataSource.getRepository(TipoParametro);

    const estacao = await estacaoRepository.findOne({ where: { ID_Estacao: ID_Estacao } });
    if (!estacao) {
        throw new Error('Estação não encontrada');
    }

    const tipoParametro = await tipoParametroRepository.findOne({ where: { ID_Tipo_Parametro: ID_TipoParametro } });
    if (!tipoParametro) {
        throw new Error('Tipo de Parâmetro não encontrado');
    }

    const parametro = new Parametro();
    parametro.estacao = estacao;
    parametro.tipoParametro = tipoParametro;

    return await parametroRepository.save(parametro);
}

async function removerParametro(ID_Parametro: number): Promise<{ success: boolean, error?: string }> {
    const parametroRepository = SqlDataSource.getRepository(Parametro);

    try {
        const parametroExistente = await parametroRepository.findOne({ where: { ID_Parametro: ID_Parametro } });
        if (!parametroExistente) {
            throw new Error('Parâmetro não encontrado');
        }

        await parametroRepository.remove(parametroExistente);

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function listarTodosParametros(): Promise<Parametro[]> {
    const parametroRepository = SqlDataSource.getRepository(Parametro);

    return await parametroRepository.createQueryBuilder("parametro")
        .leftJoinAndSelect("parametro.estacao", "estacao")
        .leftJoinAndSelect("parametro.tipoParametro", "tipoParametro")
        .getMany();
}

async function editarParametro(ID_Parametro: number, dadosAtualizados: {
    ID_Estacao?: number,
    ID_TipoParametro?: number
}): Promise<Parametro | null> {
    const parametroRepository = SqlDataSource.getRepository(Parametro);
    const estacaoRepository = SqlDataSource.getRepository(Estacao);
    const tipoParametroRepository = SqlDataSource.getRepository(TipoParametro);

    const parametroExistente = await parametroRepository.findOne({ where: { ID_Parametro: ID_Parametro } });
    if (!parametroExistente) {
        return null;
    }

    if (dadosAtualizados.ID_Estacao !== undefined) {
        const estacao = await estacaoRepository.findOne({ where: { ID_Estacao: dadosAtualizados.ID_Estacao } });
        if (!estacao) {
            throw new Error('Estação não encontrada');
        }
        parametroExistente.estacao = estacao;
    }

    if (dadosAtualizados.ID_TipoParametro !== undefined) {
        const tipoParametro = await tipoParametroRepository.findOne({ where: { ID_Tipo_Parametro: dadosAtualizados.ID_TipoParametro } });
        if (!tipoParametro) {
            throw new Error('Tipo de Parâmetro não encontrado');
        }
        parametroExistente.tipoParametro = tipoParametro;
    }

    await parametroRepository.save(parametroExistente);

    return parametroExistente;
}

export { criarParametro, removerParametro, listarTodosParametros, editarParametro };
