import { Request, Response } from 'express';
import { criarOcorrencia, editarOcorrencia, listarTodasOcorrencias, removerOcorrencia } from '../services/OcorrenciasServices';
import { Ocorrencias } from '../entities/Ocorrencias';

class OcorrenciasController {
    async criarOcorrencia(req: Request, res: Response): Promise<void> {
        try {
            const { medidaID, parametroAlertaID } = req.body;

            if (!medidaID || !parametroAlertaID) {
                res.status(400).json({ message: 'ID da Medida e ID do Parâmetro de Alerta são obrigatórios' });
                return;
            }

            const novaOcorrencia: Ocorrencias = await criarOcorrencia(medidaID, parametroAlertaID);

            res.status(201).json(novaOcorrencia);
        } catch (error) {
            console.error('Erro ao criar ocorrência:', error);
            res.status(500).json({ message: 'Erro ao criar ocorrência' });
        }
    }

    async editarOcorrencia(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;
            const { medidaID, parametroAlertaID } = req.body;

            if (!id) {
                res.status(400).json({ message: 'ID da Ocorrência não fornecido' });
                return;
            }

            const dadosAtualizados = { medidaID, parametroAlertaID };

            const ocorrenciaAtualizada: Ocorrencias | null = await editarOcorrencia(parseInt(id), dadosAtualizados);

            if (!ocorrenciaAtualizada) {
                res.status(404).json({ message: 'Ocorrência não encontrada' });
                return;
            }

            res.status(200).json(ocorrenciaAtualizada);
        } catch (error) {
            console.error('Erro ao editar ocorrência:', error);
            res.status(500).json({ message: 'Erro ao editar ocorrência' });
        }
    }

    async removerOcorrencia(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            if (!id) {
                res.status(400).json({ error: 'ID da Ocorrência não fornecido' });
                return;
            }

            const result = await removerOcorrencia(parseInt(id));

            if (!result.success) {
                res.status(404).json({ error: result.error });
                return;
            }

            res.status(200).json({ success: "Ocorrência removida com sucesso!" });
        } catch (error) {
            console.error('Erro ao remover ocorrência:', error);
            res.status(500).json({ error: 'Erro ao remover ocorrência' });
        }
    }

    async listarTodasOcorrencias(req: Request, res: Response): Promise<void> {
        try {
            const ocorrencias: Ocorrencias[] = await listarTodasOcorrencias();
            res.status(200).json(ocorrencias);
        } catch (error) {
            console.error('Erro ao listar todas as ocorrências:', error);
            res.status(500).json({ error: 'Erro ao listar todas as ocorrências' });
        }
    }
}

export default new OcorrenciasController();
