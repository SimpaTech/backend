import { Request, Response } from 'express';
import { criarParametroAlerta, editarParametroAlerta, listarTodosParametrosAlerta, removerParametroAlerta} from '../services/ParametroAlertaServices';
import { Parametro_Alerta } from '../entities/ParametroAlerta';

class ParametroAlertaController {
    async criarParametroAlerta(req: Request, res: Response): Promise<void> {
        try {
            const { ID_Parametro, ID_TipoAlerta } = req.body;

            if (!ID_Parametro || !ID_TipoAlerta) {
                res.status(400).json({ message: 'ID_Parametro e ID_TipoAlerta são obrigatórios' });
                return;
            }

            const novoParametroAlerta: Parametro_Alerta = await criarParametroAlerta(ID_Parametro, ID_TipoAlerta);

            res.status(201).json(novoParametroAlerta);
        } catch (error) {
            console.error('Erro ao criar Parâmetro de Alerta:', error);
            res.status(500).json({ message: 'Erro ao atrelar um Alerta a um Parâmetro' });
        }
    }

    async editarParametroAlerta(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { ID_Parametro, ID_TipoAlerta } = req.body;

            if (!id) {
                res.status(400).json({ message: 'ID do Parâmetro de Alerta não fornecido' });
                return;
            }

            const dadosAtualizados = { ID_Parametro, ID_TipoAlerta };

            const parametroAlertaAtualizado: Parametro_Alerta | null = await editarParametroAlerta(parseInt(id), dadosAtualizados);

            if (!parametroAlertaAtualizado) {
                res.status(404).json({ message: 'Parâmetro de Alerta não encontrado' });
                return;
            }

            res.status(200).json(parametroAlertaAtualizado);
        } catch (error) {
            console.error('Erro ao editar Parâmetro de Alerta:', error);
            res.status(500).json({ message: 'Erro ao editar Parâmetro de Alerta' });
        }
    }

    async removerParametroAlerta(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ error: 'ID do Parâmetro de Alerta não fornecido' });
                return;
            }

            const result = await removerParametroAlerta(parseInt(id));

            if (!result.success) {
                res.status(404).json({ error: result.error });
                return;
            }

            res.status(200).json({ success: "Parâmetro de Alerta removido com sucesso!" });
        } catch (error) {
            console.error('Erro ao remover Parâmetro de Alerta:', error);
            res.status(500).json({ error: 'Erro ao remover Parâmetro de Alerta' });
        }
    }

    async listarTodosParametrosAlerta(req: Request, res: Response): Promise<void> {
        try {
            const parametrosAlerta: Parametro_Alerta[] = await listarTodosParametrosAlerta();
            res.status(200).json(parametrosAlerta);
        } catch (error) {
            console.error('Erro ao listar todos os Parâmetros de Alerta:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default new ParametroAlertaController();
