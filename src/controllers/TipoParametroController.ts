import { TipoParametro } from "../entities/TipoParametro"
import { adicionarTipoParametro } from "../services/TipoParametroServices"

class TipoParametroController {

    async cadastrarTipoParametro(req, res) {
        try {
            const data = req.body

            if(!data.Fator){
                return res.json({ message: "Digite um fator..." }).status(500)
            }

            if(!data.Offset) {
                return res.json({ message: "Digite um offset..." }).status(500)
            }

            if(!data.Unidade) {
                return res.json({ message: "Digite uma unidade..." }).status(500)
            }

            if(!data.Nome_Tipo_Parametro) {
                return res.json({ message: "Digite um nome do tipo de parâmetro..." }).status(500)
            }

            console.log(req.body);

            const novoTipoParametro = adicionarTipoParametro(data.Fator, data.Offset, data.Unidade, data.Nome_Tipo_Parametro);
            return res.status(200).json({ message: "Cadastrado com sucesso", novoTipoParametro });
        } catch(error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new TipoParametroController();