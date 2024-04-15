import { Ocorrencias } from "../entities/Ocorrencias";
import SqlDataSource from "../data-source";
import { Medida } from "../entities/Medida";
import { Parametro_Alerta } from "../entities/ParametroAlerta";

async function criarOcorrencia(medidaID: number, parametroAlertaID: number): Promise<Ocorrencias> {
    const ocorrenciasRepository = SqlDataSource.getRepository(Ocorrencias);
    const medidaRepository = SqlDataSource.getRepository(Medida);
    const parametroAlertaRepository = SqlDataSource.getRepository(Parametro_Alerta);

    const medida = await medidaRepository.findOne({ where: { ID_Medida: medidaID } });
    if (!medida) {
        throw new Error('Medida não encontrada');
    }

    const parametroAlerta = await parametroAlertaRepository.findOne({ where: { ID_Parametro_Alerta: parametroAlertaID } });
    if (!parametroAlerta) {
        throw new Error('Parâmetro de Alerta não encontrado');
    }

    const ocorrencia = new Ocorrencias();
    ocorrencia.medida = medida;
    ocorrencia.parametro_alerta = parametroAlerta;

    return await ocorrenciasRepository.save(ocorrencia);
}

async function removerOcorrencia(ID_Ocorrencia: number): Promise<{ success: boolean, error?: string }> {
    const ocorrenciasRepository = SqlDataSource.getRepository(Ocorrencias);

    try {
        const ocorrenciaExistente = await ocorrenciasRepository.findOne({ where: { ID_Ocorrencia: ID_Ocorrencia } });
        if (!ocorrenciaExistente) {
            throw new Error('Ocorrência não encontrada');
        }

        await ocorrenciasRepository.remove(ocorrenciaExistente);

        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function listarTodasOcorrencias(): Promise<Ocorrencias[]> {
    const ocorrenciasRepository = SqlDataSource.getRepository(Ocorrencias);

    return await ocorrenciasRepository.createQueryBuilder("ocorrencia")
        .leftJoinAndSelect("ocorrencia.medida", "medida")
        .leftJoinAndSelect("ocorrencia.parametro_alerta", "parametro_alerta")
        .getMany();
}

async function editarOcorrencia(ID_Ocorrencia: number, dadosAtualizados: {
    medidaID?: number,
    parametroAlertaID?: number
}): Promise<Ocorrencias | null> {
    const ocorrenciasRepository = SqlDataSource.getRepository(Ocorrencias);
    const medidaRepository = SqlDataSource.getRepository(Medida);
    const parametroAlertaRepository = SqlDataSource.getRepository(Parametro_Alerta);

    const ocorrenciaExistente = await ocorrenciasRepository.findOne({ where: { ID_Ocorrencia: ID_Ocorrencia } });
    if (!ocorrenciaExistente) {
        return null;
    }

    if (dadosAtualizados.medidaID !== undefined) {
        const medida = await medidaRepository.findOne({ where: { ID_Medida: dadosAtualizados.medidaID } });
        if (!medida) {
            throw new Error('Medida não encontrada');
        }
        ocorrenciaExistente.medida = medida;
    }

    if (dadosAtualizados.parametroAlertaID !== undefined) {
        const parametroAlerta = await parametroAlertaRepository.findOne({ where: { ID_Parametro_Alerta: dadosAtualizados.parametroAlertaID } });
        if (!parametroAlerta) {
            throw new Error('Parâmetro de Alerta não encontrado');
        }
        ocorrenciaExistente.parametro_alerta = parametroAlerta;
    }

    await ocorrenciasRepository.save(ocorrenciaExistente);

    return ocorrenciaExistente;
}

export { criarOcorrencia, removerOcorrencia, listarTodasOcorrencias, editarOcorrencia };
