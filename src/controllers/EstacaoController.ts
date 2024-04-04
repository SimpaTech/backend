import { Request, Response } from 'express';
import { createEstacao, editarEstacao, removerEstacao } from '../services/EstacaoServices';
import { Estacao } from '../entities/Estacao';

class EstacaoController {
    async criarEstacao(req: Request, res: Response): Promise<void> {
        try {
            const { Nome, Latitude, Longitude, Data_Instalacao, Tipo_Estacao, Indicativo_Ativa } = req.body;

            // Validar os campos
            if (!Nome || !Latitude || !Longitude || !Data_Instalacao || !Tipo_Estacao || Indicativo_Ativa === undefined) {
                res.status(400).json({ message: 'Todos os campos são obrigatórios' });
                return;
            }

            const novaEstacao: Estacao = await createEstacao(Nome, Latitude, Longitude, Data_Instalacao, Tipo_Estacao, Indicativo_Ativa);

            res.status(201).json(novaEstacao);
        } catch (error) {
            console.error('Erro ao criar estação:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async editarEstacao(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { Nome, Latitude, Longitude, Data_Instalacao, Tipo_Estacao, Indicativo_Ativa } = req.body;

            if (!id) {
                res.status(400).json({ message: 'ID da estação não fornecido' });
                return;
            }

            const dadosAtualizados = { Nome, Latitude, Longitude, Data_Instalacao, Tipo_Estacao, Indicativo_Ativa };

            const estacaoAtualizada: Estacao | null = await editarEstacao(parseInt(id), dadosAtualizados);

            if (!estacaoAtualizada) {
                res.status(404).json({ message: 'Estação não encontrada' });
                return;
            }

            res.status(200).json(estacaoAtualizada);
        } catch (error) {
            console.error('Erro ao editar estação:', error);
            res.status(500).json({ message: 'Erro interno do servidor' });
        }
    }

    async removerEstacao(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ error: 'ID da estação não fornecido' });
                return;
            }

            const result = await removerEstacao(parseInt(id));

            if (!result.success) {
                res.status(404).json({ error: result.error });
                return;
            }

            res.status(200).json({ success: "Estação Removida com sucesso!" });
        } catch (error) {
            console.error('Erro ao remover estação:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }
}
export default new EstacaoController();
