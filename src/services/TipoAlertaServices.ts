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

export { criarTipoAlerta };
