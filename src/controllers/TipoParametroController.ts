import { TipoParametro } from "../entities/TipoParametro"
import { adicionarTipoParametro, listarTodosTipoParametro, procurarTipoParametroId, procurarTipoParametro, atualizarTipoParametro, deletarTipoParametro, alternarStatusTipoAlerta, listarTodosTiposParametroAtivos } from "../services/TipoParametroServices"

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
            if(!data.Json) {
                return res.json({ message: "Digite o Json para identificar o parâmetro" }).status(500)
            }

            console.log(req.body);

            const novoTipoParametro = adicionarTipoParametro(data.Fator, data.Offset, data.Unidade, data.Nome_Tipo_Parametro, data.Json);
            return res.status(200).json({ message: "Cadastrado com sucesso", novoTipoParametro });
        } catch(error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async listarTipoParametro(req, res) {
        try {
            const tipoparametro = await listarTodosTipoParametro();
            return res.json(tipoparametro).status(200);
        } catch(error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async buscarTipoParametro(req, res) {
        try {
            const id = req.params.id;
            const tipoparametro = await procurarTipoParametroId(id);
            if (!tipoparametro) {
                return res.json({ message: "Tipo de parâmetro não encontrado!" }).status(404);
            } else {
                return res.json(tipoparametro).status(200);
            }
        } catch(error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async filtrarTipoParametro(req, res) {
        try {
            const filtro = req.body;
    
            if (Object.keys(filtro).length === 0) {
                return res.status(400).json({ message: "É necessário fornecer pelo menos um parâmetro de filtro." });
            }
    
            const tipoparametro = await procurarTipoParametro(filtro);
    
            if (tipoparametro.length === 0) {
                return res.status(404).json({ message: "Nenhum tipo de parâmetro encontrado com os filtros fornecidos." });
            } else {
                return res.status(200).json(tipoparametro);
            }
        } catch(error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async editarTipoParametro(req, res) {
        try {
            const id = req.params.id
            const data = req.body

            const tipoparametroAtualizado = await atualizarTipoParametro(id, data);
            return res.status(200).json({ message: "Tipo de Parametro atualizado com sucesso!", tipoparametro: tipoparametroAtualizado });
        } catch(error) {
            return res.status(500).json({ error: error.message });
        }
    }

    async removerTipoParametro(req, res) {
        try {
            const id =req.params.id

            const remocaoTipoParametro = await deletarTipoParametro(id);
            return res.status(200).json({ message: "Tipo de Parametro excluído com sucesso!", tipoparametro: remocaoTipoParametro});
        } catch (error) {
            if (error.message === "Tipo de Parametro não encontrado!") {
                return res.status(404).json({ error: error.message });
            } else {
                return res.status(500).json({ error: error.message });
            }
        }

    }

    async alterarIndicativo(req, res) {
        try {
            const { id } = req.params;
    
            if (!id) {
                res.status(400).json({ success: false, error: 'ID não fornecido' });
                return;
            }
    
            const result = await alternarStatusTipoAlerta(Number(id));
    
            if (result.success) {
                res.json({ success: true });
            } else {
                res.status(500).json({ success: false, error: result.error });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async listarTiposParametroAtivos(req, res){
        try {
            const tipoParametroAtivos = await listarTodosTiposParametroAtivos();
            if (tipoParametroAtivos !== null) {
                res.status(200).json(tipoParametroAtivos);
            } else {
                res.status(500).json({ message: 'Erro ao buscar as estações ativas.' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}

export default new TipoParametroController();