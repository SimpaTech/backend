import { Request, Response } from 'express';
import { createEstacao } from '../services/estacao';
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
}

export default new EstacaoController();
