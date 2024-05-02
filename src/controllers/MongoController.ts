import { Request, Response } from 'express';
import MongoServices from '../services/MongoServices';

class MongoController {
    async salvarMedida(req: Request, res: Response): Promise<void> {
        try {
            const data = req.body;

            
            if (!data) {
                res.status(400).json({ message: 'Nenhum dado fornecido' });
                return;
            }

            await MongoServices.saveData(data);

            res.status(201).json({ message: 'Dados salvos com sucesso' });
        } catch (error) {
            console.error('Erro ao salvar medida:', error);
            res.status(500).json({ message: 'Erro ao salvar medida' });
        }
    }
}

export default new MongoController();
