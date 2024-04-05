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

export {adicionarTipoParametro, listarTodosTipoParametro, procurarTipoParametroId, procurarTipoParametro}