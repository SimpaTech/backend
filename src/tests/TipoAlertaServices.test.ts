import { criarTipoAlerta, editarTipoAlerta, removerTipoAlerta, listarTodosTipoAlerta, listarTipoAlertaPorId, listarTipoAlertaPorCampo, alternarStatusTipoAlerta, listarTodosTiposAlertaAtivos } from '../services/TipoAlertaServices';
import { TipoAlerta } from "../entities/TipoAlerta";
import SqlDataSource from "../data-source";

// Mocking SqlDataSource
jest.mock('../data-source', () => {
  const save = jest.fn();
  const findOne = jest.fn();
  const remove = jest.fn();
  const find = jest.fn();
  const createQueryBuilder = jest.fn(() => ({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
    getMany: jest.fn()
  }));

  return {
    getRepository: jest.fn(() => ({
      save,
      findOne,
      remove,
      find,
      createQueryBuilder
    }))
  };
});

describe('TipoAlertaServices', () => {
  const tipoAlertaRepository = SqlDataSource.getRepository(TipoAlerta);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('criarTipoAlerta', () => {
    it('should create a new alert type', async () => {
      const tipoAlertaData = {
        Nome_Tipo_Alerta: 'Tipo Alerta 1',
        Valor: 50.0,
        Operador_Condicional: '>=',
      };

      (tipoAlertaRepository.save as jest.Mock).mockResolvedValue(tipoAlertaData);

      const result = await criarTipoAlerta(
        tipoAlertaData.Nome_Tipo_Alerta,
        tipoAlertaData.Valor,
        tipoAlertaData.Operador_Condicional
      );

      expect(tipoAlertaRepository.save).toHaveBeenCalledWith(expect.objectContaining(tipoAlertaData));
      expect(result).toEqual(tipoAlertaData);
    });
  });

  describe('editarTipoAlerta', () => {
    it('should update an existing alert type', async () => {
      const tipoAlertaExistente = { ID_Tipo_Alerta: 1, Nome_Tipo_Alerta: 'Tipo Alerta 1', Valor: 50.0, Operador_Condicional: '>=' };
      const dadosAtualizados = { Valor: 60.0 };

      (tipoAlertaRepository.findOne as jest.Mock).mockResolvedValue(tipoAlertaExistente);
      (tipoAlertaRepository.save as jest.Mock).mockResolvedValue({ ...tipoAlertaExistente, ...dadosAtualizados });

      const result = await editarTipoAlerta(1, dadosAtualizados);

      expect(tipoAlertaRepository.findOne).toHaveBeenCalledWith({ where: { ID_Tipo_Alerta: 1 } });
      expect(tipoAlertaRepository.save).toHaveBeenCalledWith(expect.objectContaining({ Valor: 60.0 }));
      expect(result).toEqual(expect.objectContaining({ Valor: 60.0 }));
    });

    it('should return null if alert type does not exist', async () => {
      (tipoAlertaRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await editarTipoAlerta(1, { Valor: 60.0 });

      expect(result).toBeNull();
    });
  });

  describe('removerTipoAlerta', () => {
    it('should remove an existing alert type', async () => {
      const tipoAlertaExistente = { ID_Tipo_Alerta: 1, Nome_Tipo_Alerta: 'Tipo Alerta 1' };

      (tipoAlertaRepository.findOne as jest.Mock).mockResolvedValue(tipoAlertaExistente);

      const result = await removerTipoAlerta(1);

      expect(tipoAlertaRepository.findOne).toHaveBeenCalledWith({ where: { ID_Tipo_Alerta: 1 } });
      expect(tipoAlertaRepository.remove).toHaveBeenCalledWith(tipoAlertaExistente);
      expect(result).toEqual({ success: true });
    });

    it('should return error if alert type does not exist', async () => {
      (tipoAlertaRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await removerTipoAlerta(1);

      expect(result).toEqual({ success: false, error: 'Tipo de Alerta não encontrado' });
    });
  });

  describe('listarTipoAlertaPorId', () => {
    it('should return an alert type by ID', async () => {
      const tipoAlertaExistente = { ID_Tipo_Alerta: 1, Nome_Tipo_Alerta: 'Tipo Alerta 1' };

      (tipoAlertaRepository.findOne as jest.Mock).mockResolvedValue(tipoAlertaExistente);

      const result = await listarTipoAlertaPorId(1);

      expect(tipoAlertaRepository.findOne).toHaveBeenCalledWith({ where: { ID_Tipo_Alerta: 1 } });
      expect(result).toEqual(tipoAlertaExistente);
    });

    it('should return null if alert type does not exist', async () => {
      (tipoAlertaRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await listarTipoAlertaPorId(1);

      expect(result).toBeNull();
    });
  });

  describe('listarTipoAlertaPorCampo', () => {
    it('should return alert types by given field', async () => {
      const tipoAlertaExistente = { ID_Tipo_Alerta: 1, Nome_Tipo_Alerta: 'Tipo Alerta 1' };
      const campo = { Nome_Tipo_Alerta: 'Tipo Alerta 1' };

      (tipoAlertaRepository.find as jest.Mock).mockResolvedValue([tipoAlertaExistente]);

      const result = await listarTipoAlertaPorCampo(campo);

      expect(tipoAlertaRepository.find).toHaveBeenCalledWith({ where: campo });
      expect(result).toEqual([tipoAlertaExistente]);
    });
  });

  describe('alternarStatusTipoAlerta', () => {
    it('should toggle the status of an existing alert type', async () => {
      const tipoAlertaExistente = { ID_Tipo_Alerta: 1, Nome_Tipo_Alerta: 'Tipo Alerta 1', Indicativo_Ativa: true };

      (tipoAlertaRepository.findOne as jest.Mock).mockResolvedValue(tipoAlertaExistente);

      const result = await alternarStatusTipoAlerta(1);

      expect(tipoAlertaRepository.findOne).toHaveBeenCalledWith({ where: { ID_Tipo_Alerta: 1 } });
      expect(tipoAlertaRepository.save).toHaveBeenCalledWith(expect.objectContaining({ Indicativo_Ativa: false }));
      expect(result).toEqual({ success: true });
    });

    it('should return error if alert type does not exist', async () => {
      (tipoAlertaRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await alternarStatusTipoAlerta(1);

      expect(result).toEqual({ success: false, error: 'Tipo de alerta não encontrado' });
    });
  });

  describe('listarTodosTipoAlerta', () => {
    it('should return all alert types', async () => {
      const tiposAlerta = [
        { ID_Tipo_Alerta: 1, Nome_Tipo_Alerta: 'Tipo Alerta 1' },
        { ID_Tipo_Alerta: 2, Nome_Tipo_Alerta: 'Tipo Alerta 2' }
      ];

      (tipoAlertaRepository.find as jest.Mock).mockResolvedValue(tiposAlerta);

      const result = await listarTodosTipoAlerta();

      expect(result).toEqual(tiposAlerta);
    });
  });

  describe('listarTodosTiposAlertaAtivos', () => {
    it('should return all active alert types', async () => {
      const tiposAlertaAtivos = [
        { ID_Tipo_Alerta: 1, Nome_Tipo_Alerta: 'Tipo Alerta 1', Indicativo_Ativa: true },
        { ID_Tipo_Alerta: 2, Nome_Tipo_Alerta: 'Tipo Alerta 2', Indicativo_Ativa: true }
      ];

      (tipoAlertaRepository.find as jest.Mock).mockResolvedValue(tiposAlertaAtivos);

      const result = await listarTodosTiposAlertaAtivos();

      expect(result).toEqual(tiposAlertaAtivos);
    });

    it('should return null if error occurs', async () => {
      (tipoAlertaRepository.find as jest.Mock).mockRejectedValue(new Error('Erro'));

      const result = await listarTodosTiposAlertaAtivos();

      expect(result).toBeNull();
    });
  });
});
