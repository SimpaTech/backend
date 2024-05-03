import { Medida } from "../entities/Medida";
import SqlDataSource from "../data-source";
import { Parametro } from "../entities/Parametro";

async function adicionarMedida(parametro: Parametro, UnixTime: number, Valor: number): Promise<Medida | null> {
    const medidaRepository = SqlDataSource.getRepository(Medida);

    const medida = new Medida();
    medida.parametro = parametro;
    medida.UnixTime = UnixTime;
    medida.Valor = Valor;

    try {
        return await medidaRepository.save(medida);
    } catch (error) {
        console.error('Erro ao adicionar medida:', error);
        return null;
    }
}

async function listarTodasMedidas(): Promise<Medida[]> {
    const medidaRepository = SqlDataSource.getRepository(Medida);
    return await medidaRepository.find();
}

async function procurarMedidaPorId(id: number): Promise<Medida | undefined> {
    const medidaRepository = SqlDataSource.getRepository(Medida);
    return await medidaRepository.findOne({ where: { ID_Medida: id } });
}

async function procurarMedidasPorParametro(parametro: Parametro): Promise<Medida[]> {
    const medidaRepository = SqlDataSource.getRepository(Medida);
    return await medidaRepository.find({ where: { parametro: parametro } });
}

async function atualizarMedida(id: number, data: Partial<Medida>): Promise<Medida> {
    const medidaRepository = SqlDataSource.getRepository(Medida);
    const medida = await medidaRepository.findOne({ where: { ID_Medida: id } });

    if (!medida) {
        throw new Error("Medida não encontrada!");
    }

    if (data.UnixTime !== undefined) {
        medida.UnixTime = data.UnixTime;
    }

    if (data.Valor !== undefined) {
        medida.Valor = data.Valor;
    }

    await medidaRepository.save(medida);

    return medida;
}

async function deletarMedida(id: number): Promise<void> {
    const medidaRepository = SqlDataSource.getRepository(Medida);
    const medida = await medidaRepository.findOne({ where: { ID_Medida: id } });

    if (!medida) {
        throw new Error("Medida não encontrada!");
    }

    await medidaRepository.delete(id);
}

export { adicionarMedida, listarTodasMedidas, procurarMedidaPorId, procurarMedidasPorParametro, atualizarMedida, deletarMedida };
