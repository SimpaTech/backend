import { Ocorrencias } from "../entities/Ocorrencias";
import SqlDataSource from "../data-source";
import { Medida } from "../entities/Medida";
import { Parametro_Alerta } from "../entities/ParametroAlerta";
import { Parametro } from "../entities/Parametro";
import { TipoAlerta } from "../entities/TipoAlerta";

async function criarOcorrencia(medidaID: number, parametroAlertaID: number): Promise<Ocorrencias | null> {
    const ocorrenciasRepository = SqlDataSource.getRepository(Ocorrencias);
    const medidaRepository = SqlDataSource.getRepository(Medida);
    const parametroAlertaRepository = SqlDataSource.getRepository(Parametro_Alerta);
    const tipoAlertaRepository = SqlDataSource.getRepository(TipoAlerta);

    // Encontrar a medida correspondente ao ID fornecido
    const medida = await medidaRepository.findOne({ where: { ID_Medida: medidaID }, relations: ["parametro", "parametro.tipoParametro"] });
    // const medida = await medidaRepository.findOne({ where: { ID_Medida: medidaID }, relations: ["parametro"] });
    if (!medida) {
        throw new Error('Medida não encontrada');
    }

    // Extrair o parâmetro associado à medida
    const parametro = medida.parametro;
    if (!parametro) {
        throw new Error('Parâmetro não encontrado para a medida');
    }

    // Encontrar o tipo de parâmetro associado ao parâmetro
    const tipoParametro = parametro.tipoParametro;
    if (!tipoParametro) {
        throw new Error('Tipo de parâmetro não encontrado para o parâmetro');
    }

    // Extrair o nome do tipo de parâmetro associado à medida
    const tipoParametroNome = tipoParametro.Nome_Tipo_Parametro;

    // Encontrar o parâmetro de alerta correspondente ao ID fornecido
    const parametroAlerta = await parametroAlertaRepository.findOne({ where: { ID_Parametro_Alerta: parametroAlertaID }, relations: ["tipoAlerta", "parametro"] });
    if (!parametroAlerta) {
        throw new Error('Parâmetro de Alerta não encontrado');
    }

    // Encontrar o tipo de alerta associado ao parâmetro de alerta
    const tipoAlerta = parametroAlerta.tipoAlerta;
    if (!tipoAlerta) {
        throw new Error('Tipo de Alerta não encontrado para o parâmetro de alerta');
    }

    // Obter o valor e o operador condicional do tipo de alerta
    const { Valor, Operador_Condicional } = tipoAlerta;

    // Comparar a medida com o valor do tipo de alerta usando o operador condicional
    switch (Operador_Condicional) {
        case "=":
            if (medida.Valor === Valor) {
                return criarESalvarOcorrencia(ocorrenciasRepository, medida, parametroAlerta);
            }
            break;
        case "<":
            if (medida.Valor < Valor) {
                return criarESalvarOcorrencia(ocorrenciasRepository, medida, parametroAlerta);
            }
            break;
        case ">":
            if (medida.Valor > Valor) {
                return criarESalvarOcorrencia(ocorrenciasRepository, medida, parametroAlerta);
            }
            break;
        case "!=":
            if (medida.Valor !== Valor) {
                return criarESalvarOcorrencia(ocorrenciasRepository, medida, parametroAlerta);
            }
            break;
        case "<=":
            if (medida.Valor <= Valor) {
                return criarESalvarOcorrencia(ocorrenciasRepository, medida, parametroAlerta);
            }
            break;
        case ">=":
            if (medida.Valor >= Valor) {
                return criarESalvarOcorrencia(ocorrenciasRepository, medida, parametroAlerta);
            }
            break;
        default:
            throw new Error('Operador condicional inválido');
    }

    // Se a medida não atender à condição, retornar null
    return null;
}

async function criarESalvarOcorrencia(ocorrenciasRepository: any, medida: Medida, parametroAlerta: Parametro_Alerta): Promise<Ocorrencias> {
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
