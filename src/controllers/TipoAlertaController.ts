import { Request, Response } from 'express';
import { criarTipoAlerta, editarTipoAlerta, listarTipoAlertaPorCampo, listarTipoAlertaPorId, listarTodosTipoAlerta, removerTipoAlerta } from '../services/TipoAlertaServices';
import { TipoAlerta } from '../entities/TipoAlerta';

class TipoAlertaController {
    async criarTipoAlerta(req: Request, res: Response): Promise<void> {
        try {
            const { Nome_Tipo_Alerta, Valor, Operador_Condicional, ID_Parametro } = req.body;

            if (!Nome_Tipo_Alerta || !Valor || !Operador_Condicional || !ID_Parametro) {
                res.status(400).json({ message: 'Todos os campos são obrigatórios' });
                return;
            }

            const novoTipoAlerta: TipoAlerta = await criarTipoAlerta(Nome_Tipo_Alerta, Valor, Operador_Condicional, ID_Parametro);

            res.status(201).json(novoTipoAlerta);
        } catch (error) {
            console.error('Erro ao criar tipo de alerta:', error);
            res.status(500).json({ message: 'Erro ao criar tipo de alerta' });
        }
    }

    async editarTipoAlerta(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { Nome_Tipo_Alerta, Valor, Operador_Condicional } = req.body;

            if (!id) {
                res.status(400).json({ message: 'ID do tipo de alerta não fornecido' });
                return;
            }

            const dadosAtualizados = { Nome_Tipo_Alerta, Valor, Operador_Condicional };

            const tipoAlertaAtualizado: TipoAlerta | null = await editarTipoAlerta(parseInt(id), dadosAtualizados);

            if (!tipoAlertaAtualizado) {
                res.status(404).json({ message: 'Tipo de alerta não encontrado' });
                return;
            }

            res.status(200).json(tipoAlertaAtualizado);
        } catch (error) {
            console.error('Erro ao editar tipo de alerta:', error);
            res.status(500).json({ message: 'Erro ao editar tipo de alerta' });
        }
    }

    async removerTipoAlerta(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ error: 'ID do tipo de alerta não fornecido' });
                return;
            }

            const result = await removerTipoAlerta(parseInt(id));

            if (!result.success) {
                res.status(404).json({ error: result.error });
                return;
            }

            res.status(200).json({ success: "Tipo de alerta removido com sucesso!" });
        } catch (error) {
            console.error('Erro ao remover tipo de alerta:', error);
            res.status(500).json({ error: 'Erro ao remover tipo de alerta' });
        }
    }

    async listarTipoAlertaPorID(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ error: 'ID do Tipo Alerta não fornecido' });
                return;
            }

            const tipoAlerta: TipoAlerta | null = await listarTipoAlertaPorId(parseInt(id));

            if (!tipoAlerta) {
                res.status(404).json({ error: 'Tipo Alerta não encontrada' });
                return;
            }

            res.status(200).json(tipoAlerta);
        } catch (error) {
            console.error('Erro ao listar Tipo Alerta por ID:', error);
            res.status(500).json({ error: 'Erro ao listar Tipo de Alerta por ID' });
        }
    }

    async listarTodosTipoAlerta(req: Request, res: Response): Promise<void> {
        try {
            const tipoAlerta: TipoAlerta[] = await listarTodosTipoAlerta();
            res.status(200).json(tipoAlerta);
        } catch (error) {
            console.error('Erro ao listar todas os Tipo Alerta:', error);
            res.status(500).json({ error: 'Erro ao listar todas os Tipos de alerta' });
        }
    }

    async filtrarTipoAlerta(req, res) {
        try {
            const campo = req.body;
    
            if (Object.keys(campo).length === 0) {
                return res.status(400).json({ message: "É necessário fornecer pelo menos um parâmetro de filtro." });
            }
    
            const tipoAlerta = await listarTipoAlertaPorCampo(campo);
    
            if (tipoAlerta.length === 0) {
                return res.status(404).json({ message: "Nenhum tipo de alerta encontrado com os filtros fornecidos." });
            } else {
                return res.status(200).json(tipoAlerta);
            }
        } catch(error) {
            return res.status(500).json({ error: error.message });
        }
    }
}

export default new TipoAlertaController();
