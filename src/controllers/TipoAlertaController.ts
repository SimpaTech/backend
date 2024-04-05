import { Request, Response } from 'express';
import { criarTipoAlerta, editarTipoAlerta } from '../services/TipoAlertaServices';
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
}

export default new TipoAlertaController();
