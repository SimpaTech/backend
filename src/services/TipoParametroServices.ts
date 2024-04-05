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

export {adicionarTipoParametro}