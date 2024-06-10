import { Request, Response } from 'express';
import { createEstacao, editarEstacao, listarEstacaoPorID, listarTodasEstacoes, removerEstacao, alternarStatusEstacao, listarTodasEstacoesAtivas } from '../services/EstacaoServices';
import { Estacao } from '../entities/Estacao';

class EstacaoController {
    async criarEstacao(req: Request, res: Response): Promise<void> {
        try {
            const { Nome, Latitude, Longitude, UID } = req.body;

            // Validar os campos
            if (!Nome || !Latitude || !Longitude || !UID) {
                res.status(400).json({ message: 'Todos os campos são obrigatórios' });
                return;
            }

            const novaEstacao: Estacao = await createEstacao(Nome, Latitude, Longitude, UID);

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

    async alterarIndicativo(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
    
            if (!id) {
                res.status(400).json({ success: false, error: 'ID_Estacao não fornecido' });
                return;
            }
    
            const result = await alternarStatusEstacao(Number(id));
    
            if (result.success) {
                res.json({ success: true });
            } else {
                res.status(500).json({ success: false, error: result.error });
            }
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }

    async listarEstacaoPorID(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ error: 'ID da estação não fornecido' });
                return;
            }

            const estacao: Estacao | null = await listarEstacaoPorID(parseInt(id));

            if (!estacao) {
                res.status(404).json({ error: 'Estação não encontrada' });
                return;
            }

            res.status(200).json(estacao);
        } catch (error) {
            console.error('Erro ao listar estação por ID:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async listarTodasEstacoes(req: Request, res: Response): Promise<void> {
        try {
            const estacoes: Estacao[] = await listarTodasEstacoes();
            res.status(200).json(estacoes);
        } catch (error) {
            console.error('Erro ao listar todas as estações:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

    async listarEstacoesAtivas(req: Request, res: Response): Promise<void> {
        try {
            const estacoesAtivas = await listarTodasEstacoesAtivas();
            if (estacoesAtivas !== null) {
                res.status(200).json(estacoesAtivas);
            } else {
                res.status(500).json({ message: 'Erro ao buscar as estações ativas.' });
            }
        } catch (error) {
            res.status(500).json({ message: 'Erro interno do servidor.' });
        }
    }
}

export default new EstacaoController();
