import { Request, Response } from 'express';
import { listarTodasMedidas } from '../services/MedidaServices'
import { Medida } from '../entities/Medida';

class MedidaController {

    async listarTodasMedidas(req: Request, res: Response): Promise<void> {
        try {
            const medidas: Medida[] = await listarTodasMedidas();
            res.status(200).json(medidas);
        } catch (error) {
            console.error('Erro ao listar todas as medidas:', error);
            res.status(500).json({ error: 'Erro interno do servidor' });
        }
    }

}

export default new MedidaController();
