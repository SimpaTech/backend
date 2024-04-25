import { Request, Response } from 'express';
import { criarParametro, editarParametro, listarTodosParametros, removerParametro } from '../services/ParametroServices';
import { Parametro } from '../entities/Parametro';

class ParametroController {
    async criarParametro(req: Request, res: Response): Promise<void> {
        try {
            const { ID_Estacao, ID_TipoParametro } = req.body;

            if (!ID_Estacao || !ID_TipoParametro) {
                res.status(400).json({ message: 'ID_Estacao e ID_TipoParametro são obrigatórios' });
                return;
            }

            const novoParametro: Parametro = await criarParametro(ID_Estacao, ID_TipoParametro);

            res.status(201).json(novoParametro);
        } catch (error) {
            console.error('Erro ao criar parâmetro:', error);
            res.status(500).json({ message: 'Erro ao criar parâmetro' });
        }
    }

    async editarParametro(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { ID_Estacao, ID_TipoParametro } = req.body;

            if (!id) {
                res.status(400).json({ message: 'ID do parâmetro não fornecido' });
                return;
            }

            const dadosAtualizados = { ID_Estacao, ID_TipoParametro };

            const parametroAtualizado: Parametro | null = await editarParametro(parseInt(id), dadosAtualizados);

            if (!parametroAtualizado) {
                res.status(404).json({ message: 'Parâmetro não encontrado' });
                return;
            }

            res.status(200).json(parametroAtualizado);
        } catch (error) {
            console.error('Erro ao editar parâmetro:', error);
            res.status(500).json({ message: 'Erro ao editar parâmetro' });
        }
    }

    async removerParametro(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ message: 'ID do parâmetro não fornecido' });
                return;
            }

            const result = await removerParametro(parseInt(id));

            if (!result.success) {
                res.status(404).json({ error: result.error });
                return;
            }

            res.status(200).json({ success: "Parâmetro removido com sucesso!" });
        } catch (error) {
            console.error('Erro ao remover parâmetro:', error);
            res.status(500).json({ error: 'Erro ao remover parâmetro' });
        }
    }

    async listarTodosParametros(req: Request, res: Response): Promise<void> {
        try {
            const parametros: Parametro[] = await listarTodosParametros();
            res.status(200).json(parametros);
        } catch (error) {
            console.error('Erro ao listar todos os parâmetros:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}

export default new ParametroController();
