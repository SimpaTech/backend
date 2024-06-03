import { Medida } from "../entities/Medida";
import { Parametro } from "../entities/Parametro";
import SqlDataSource from "../data-source";
import { adicionarMedida, listarTodasMedidas, procurarMedidaPorId, procurarMedidasPorParametro, atualizarMedida, deletarMedida } from "../services/MedidaServices";

// Mocking SqlDataSource
jest.mock('../data-source', () => {
  const save = jest.fn();
  const findOne = jest.fn();
  const find = jest.fn();
  const deleteFn = jest.fn();

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
      find,
      delete: deleteFn,
      createQueryBuilder
    }))
  };
});

describe('MedidasServices', () => {
  const medidaRepository = SqlDataSource.getRepository(Medida);

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('adicionarMedida', () => {
    it('should add a new measure', async () => {
      const parametro = new Parametro();
      parametro.ID_Parametro = 1;
      const unixTime = 1622707200; // Example UnixTime
      const valor = 25.5; // Example value

      const medidaData = {
        ID_Medida: 1,
        parametro,
        UnixTime: unixTime,
        Valor: valor
      };

      (medidaRepository.save as jest.Mock).mockResolvedValue(medidaData);

      const result = await adicionarMedida(parametro, unixTime, valor);

      expect(medidaRepository.save).toHaveBeenCalledWith(expect.objectContaining({
        parametro,
        UnixTime: unixTime,
        Valor: valor
      }));
      expect(result).toEqual(medidaData);
    });

    it('should return null if error occurs', async () => {
      const parametro = new Parametro();
      parametro.ID_Parametro = 1;
      const unixTime = 1622707200; // Example UnixTime
      const valor = 25.5; // Example value

      (medidaRepository.save as jest.Mock).mockRejectedValue(new Error('Erro ao salvar medida'));

      const result = await adicionarMedida(parametro, unixTime, valor);

      expect(result).toBeNull();
    });
  });

  describe('listarTodasMedidas', () => {
    it('should return all measures with their associated parameters and stations', async () => {
      const medidas = [
        { ID_Medida: 1, parametro: new Parametro(), UnixTime: 1622707200, Valor: 25.5 },
        { ID_Medida: 2, parametro: new Parametro(), UnixTime: 1622708200, Valor: 30.0 }
      ];

      // Mockando createQueryBuilder
      (medidaRepository.createQueryBuilder as jest.Mock).mockReturnValue({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(medidas)
      });

      const result = await listarTodasMedidas();

      expect(medidaRepository.createQueryBuilder().leftJoinAndSelect).toHaveBeenCalled();
      expect(medidaRepository.createQueryBuilder().getMany).toHaveBeenCalled();
      expect(result).toEqual(medidas);
    });
  });

  describe('procurarMedidaPorId', () => {
    it('should return a measure by its ID', async () => {
      const medida = { ID_Medida: 1, parametro: new Parametro(), UnixTime: 1622707200, Valor: 25.5 };

      (medidaRepository.findOne as jest.Mock).mockResolvedValue(medida);

      const result = await procurarMedidaPorId(1);

      expect(medidaRepository.findOne).toHaveBeenCalledWith({ where: { ID_Medida: 1 } });
      expect(result).toEqual(medida);
    });

    it('should return undefined if measure does not exist', async () => {
      (medidaRepository.findOne as jest.Mock).mockResolvedValue(undefined);

      const result = await procurarMedidaPorId(1);

      expect(result).toBeUndefined();
    });
  });

  describe('procurarMedidasPorParametro', () => {
    it('should return measures by their parameter', async () => {
      const parametro = new Parametro();
      parametro.ID_Parametro = 1;

      const medidas = [
        { ID_Medida: 1, parametro, UnixTime: 1622707200, Valor: 25.5 },
        { ID_Medida: 2, parametro, UnixTime: 1622708200, Valor: 30.0 }
      ];

      (medidaRepository.find as jest.Mock).mockResolvedValue(medidas);

      const result = await procurarMedidasPorParametro(parametro);

      expect(medidaRepository.find).toHaveBeenCalledWith({ where: { parametro: parametro } });
      expect(result).toEqual(medidas);
    });

    it('should return an empty array if no measures are found', async () => {
      const parametro = new Parametro();
      parametro.ID_Parametro = 1;

      (medidaRepository.find as jest.Mock).mockResolvedValue([]);

      const result = await procurarMedidasPorParametro(parametro);

      expect(result).toEqual([]);
    });
  });

  describe('atualizarMedida', () => {
    it('should update a measure', async () => {
      const medidaExistente = { ID_Medida: 1, parametro: new Parametro(), UnixTime: 1622707200, Valor: 25.5 };
      const dadosAtualizados = { UnixTime: 1622708200 };

      (medidaRepository.findOne as jest.Mock).mockResolvedValue(medidaExistente);
      (medidaRepository.save as jest.Mock).mockResolvedValue({ ...medidaExistente, ...dadosAtualizados });

      const result = await atualizarMedida(1, dadosAtualizados);

      expect(medidaRepository.findOne).toHaveBeenCalledWith({ where: { ID_Medida: 1 } });
      expect(medidaRepository.save).toHaveBeenCalledWith(expect.objectContaining({ ...medidaExistente, ...dadosAtualizados }));
      expect(result).toEqual(expect.objectContaining({ ...medidaExistente, ...dadosAtualizados }));
    });

    it('should throw an error if measure does not exist', async () => {
      (medidaRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(atualizarMedida(1, { UnixTime: 1622708200 })).rejects.toThrowError('Medida não encontrada!');
    });
  });

  describe('deletarMedida', () => {
    it('should delete a measure', async () => {
      const medidaExistente = { ID_Medida: 1, parametro: new Parametro(), UnixTime: 1622707200, Valor: 25.5 };

      (medidaRepository.findOne as jest.Mock).mockResolvedValue(medidaExistente);

      await deletarMedida(1);

      expect(medidaRepository.findOne).toHaveBeenCalledWith({ where: { ID_Medida: 1 } });
      expect(medidaRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw an error if measure does not exist', async () => {
      (medidaRepository.findOne as jest.Mock).mockResolvedValue(null);

      await expect(deletarMedida(1)).rejects.toThrowError('Medida não encontrada!');
    });
  });
});
