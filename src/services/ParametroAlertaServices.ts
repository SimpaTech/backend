import { Parametro_Alerta } from "../entities/ParametroAlerta";
import SqlDataSource from "../data-source";
import { Parametro } from "../entities/Parametro";
import { TipoAlerta } from "../entities/TipoAlerta";

async function criarParametroAlerta(ID_Parametro: number, ID_Tipo_Alerta: number): Promise<Parametro_Alerta> {
    const parametroAlertaRepository = SqlDataSource.getRepository(Parametro_Alerta);
    const parametroRepository = SqlDataSource.getRepository(Parametro);
    const tipoAlertaRepository = SqlDataSource.getRepository(TipoAlerta);

    const parametro = await parametroRepository.findOne({ where: { ID_Parametro: ID_Parametro } });
    if (!parametro) {
        throw new Error('Parâmetro não encontrado');
    }

    const tipoAlerta = await tipoAlertaRepository.findOne({ where: { ID_Tipo_Alerta: ID_Tipo_Alerta } });
    if (!tipoAlerta) {
        throw new Error('Tipo de Alerta não encontrado');
    }

    const parametroAlerta = new Parametro_Alerta();
    parametroAlerta.parametro = parametro;
    parametroAlerta.tipoAlerta = tipoAlerta;

    return await parametroAlertaRepository.save(parametroAlerta);
}

async function removerParametroAlerta(ID_Parametro_Alerta: number): Promise<{ success: boolean, error?: string }> {
    const parametroAlertaRepository = SqlDataSource.getRepository(Parametro_Alerta);

    try {
        const parametroAlertaExistente = await parametroAlertaRepository.findOne({ where: { ID_Parametro_Alerta: ID_Parametro_Alerta } });
        if (!parametroAlertaExistente) {
            throw new Error('Parametro de Alerta não encontrado');
        }

        await parametroAlertaRepository.remove(parametroAlertaExistente);

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function listarTodosParametrosAlerta(): Promise<Parametro_Alerta[]> {
    const parametroAlertaRepository = SqlDataSource.getRepository(Parametro_Alerta);

    return await parametroAlertaRepository.createQueryBuilder("parametro_alerta")
        .leftJoinAndSelect("parametro_alerta.parametro", "parametro")
        .leftJoinAndSelect("parametro.estacao", "estacao")
        .leftJoinAndSelect("parametro.tipoParametro", "tipo_parametro")
        .leftJoinAndSelect("parametro_alerta.tipoAlerta", "tipo_alerta")
        .getMany();
}

async function editarParametroAlerta(ID_Parametro_Alerta: number, dadosAtualizados: {
    ID_Parametro?: number,
    ID_TipoAlerta?: number
}): Promise<Parametro_Alerta | null> {
    const parametroAlertaRepository = SqlDataSource.getRepository(Parametro_Alerta);
    const parametroRepository = SqlDataSource.getRepository(Parametro);
    const tipoAlertaRepository = SqlDataSource.getRepository(TipoAlerta);

    const parametroAlertaExistente = await parametroAlertaRepository.findOne({ where: { ID_Parametro_Alerta: ID_Parametro_Alerta } });
    if (!parametroAlertaExistente) {
        return null;
    }

    if (dadosAtualizados.ID_Parametro !== undefined) {
        const parametro = await parametroRepository.findOne({ where: { ID_Parametro: dadosAtualizados.ID_Parametro } });
        if (!parametro) {
            throw new Error('Parâmetro não encontrado');
        }
        parametroAlertaExistente.parametro = parametro;
    }

    if (dadosAtualizados.ID_TipoAlerta !== undefined) {
        const tipoAlerta = await tipoAlertaRepository.findOne({ where: { ID_Tipo_Alerta: dadosAtualizados.ID_TipoAlerta } });
        if (!tipoAlerta) {
            throw new Error('Tipo de Alerta não encontrado');
        }
        parametroAlertaExistente.tipoAlerta = tipoAlerta;
    }

    await parametroAlertaRepository.save(parametroAlertaExistente);

    return parametroAlertaExistente;
}

export { criarParametroAlerta, removerParametroAlerta, listarTodosParametrosAlerta, editarParametroAlerta };
