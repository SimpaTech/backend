import { createEstacao, editarEstacao, removerEstacao, listarEstacaoPorID, listarTodasEstacoes, alternarStatusEstacao, listarTodasEstacoesAtivas } from '../services/EstacaoServices';
import { Estacao } from "../entities/Estacao";
import SqlDataSource from "../data-source";
import { DeepPartial, FindOneOptions, SaveOptions } from 'typeorm';

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

describe('Estacao Functions', () => {
  const estacaoRepository = SqlDataSource.getRepository(Estacao);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createEstacao', () => {
    it('should create a new station', async () => {
      const estacaoData = {
        Nome: 'Estação 1',
        Latitude: 10.0,
        Longitude: 20.0,
        Data_Instalacao: new Date(),
        Tipo_Estacao: 'Tipo 1',
        Indicativo_Ativa: true,
        UID: 'unique-id'
      };

      (estacaoRepository.save as jest.Mock).mockResolvedValue(estacaoData);

      const result = await createEstacao(
        estacaoData.Nome,
        estacaoData.Latitude,
        estacaoData.Longitude,
        estacaoData.Data_Instalacao,
        estacaoData.Tipo_Estacao,
        estacaoData.Indicativo_Ativa,
        estacaoData.UID
      );

      expect(estacaoRepository.save).toHaveBeenCalledWith(expect.objectContaining(estacaoData));
      expect(result).toEqual(estacaoData);
    });
  });

  describe('editarEstacao', () => {
    it('should update an existing station', async () => {
      const estacaoExistente = { ID_Estacao: 1, Nome: 'Estação 1' };
      const dadosAtualizados = { Nome: 'Estação Atualizada' };

      (estacaoRepository.findOne as jest.Mock).mockResolvedValue(estacaoExistente);
      (estacaoRepository.save as jest.Mock).mockResolvedValue({ ...estacaoExistente, ...dadosAtualizados });

      const result = await editarEstacao(1, dadosAtualizados);

      expect(estacaoRepository.findOne).toHaveBeenCalledWith({ where: { ID_Estacao: 1 } });
      expect(estacaoRepository.save).toHaveBeenCalledWith(expect.objectContaining(dadosAtualizados));
      expect(result).toEqual(expect.objectContaining(dadosAtualizados));
    });

    it('should return null if station does not exist', async () => {
      (estacaoRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await editarEstacao(1, { Nome: 'Estação Atualizada' });

      expect(result).toBeNull();
    });
  });

  describe('removerEstacao', () => {
    it('should remove an existing station', async () => {
      const estacaoExistente = { ID_Estacao: 1, Nome: 'Estação 1' };

      (estacaoRepository.findOne as jest.Mock).mockResolvedValue(estacaoExistente);

      const result = await removerEstacao(1);

      expect(estacaoRepository.findOne).toHaveBeenCalledWith({ where: { ID_Estacao: 1 } });
      expect(estacaoRepository.remove).toHaveBeenCalledWith(estacaoExistente);
      expect(result).toEqual({ success: true });
    });

    it('should return error if station does not exist', async () => {
      (estacaoRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await removerEstacao(1);

      expect(result).toEqual({ success: false, error: 'Estação não encontrada' });
    });
  });

  describe('listarTodasEstacoesAtivas', () => {
    it('should return all active stations', async () => {
      const estacoesAtivas = [{ ID_Estacao: 1, Nome: 'Estação 1', Indicativo_Ativa: true }];

      (estacaoRepository.find as jest.Mock).mockResolvedValue(estacoesAtivas);

      const result = await listarTodasEstacoesAtivas();

      expect(result).toEqual(estacoesAtivas);
    });

    it('should return null if error occurs', async () => {
      (estacaoRepository.find as jest.Mock).mockRejectedValue(new Error('Erro'));

      const result = await listarTodasEstacoesAtivas();

      expect(result).toBeNull();
    });
  });

  describe('alternarStatusEstacao', () => {
    it('should toggle the status of an existing station', async () => {
      const estacaoExistente = { ID_Estacao: 1, Nome: 'Estação 1', Indicativo_Ativa: true };

      (estacaoRepository.findOne as jest.Mock).mockResolvedValue(estacaoExistente);

      const result = await alternarStatusEstacao(1);

      expect(estacaoRepository.findOne).toHaveBeenCalledWith({ where: { ID_Estacao: 1 } });
      expect(estacaoRepository.save).toHaveBeenCalledWith(expect.objectContaining({ Indicativo_Ativa: false }));
      expect(result).toEqual({ success: true });
    });

    it('should return error if station does not exist', async () => {
      (estacaoRepository.findOne as jest.Mock).mockResolvedValue(null);

      const result = await alternarStatusEstacao(1);

      expect(result).toEqual({ success: false, error: 'Estação não encontrada' });
    });
  });
});
