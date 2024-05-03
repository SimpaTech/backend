import { client } from '../mongoDB';
import { Estacao } from '../entities/Estacao';
import { TipoParametro } from '../entities/TipoParametro';
import SqlDataSource from '../data-source';
import { Parametro } from '../entities/Parametro';
import { adicionarMedida } from './MedidaServices';

class TratamentoServices {
    async processarMedidas(): Promise<void> {
        try {
            await client.connect();
            console.log('Conexão bem sucedida ao MongoDB Atlas');

            const database = client.db('Simpatech');
            const collection = database.collection('Medidas');

            // Obtém todas as medidas da coleção
            const medidas = await collection.find().toArray();

            // Processa cada medida
            for (const medida of medidas) {
                const { uid, medidas: medidasArray } = medida;

                const estacaoRepository = SqlDataSource.getRepository(Estacao);
                const estacao = await estacaoRepository.findOne({ where: { UID: uid } });

                if (!estacao) {
                    console.log(`Estação com UID ${uid} não encontrada.`);
                    continue;
                }

                const ID_Estacao = estacao.ID_Estacao;

                console.log(`ID_Estação = ${ID_Estacao}`);

                for (const medidaItem of medidasArray) {
                    const tipoParametroRepository = SqlDataSource.getRepository(TipoParametro);
                    const tipoParametro = await tipoParametroRepository.findOne({ where: { ID_Tipo_Parametro: medidaItem.IdTipoParametro } });

                    if (!tipoParametro) {
                        console.log(`Tipo de parâmetro com ID ${medidaItem.IdTipoParametro} não encontrado.`);
                        continue;
                    }

                    const { Fator, Offset } = tipoParametro;

                    let valorFinal = medidaItem.valor;

                    if (Fator > 0) {
                        valorFinal *= Fator;
                    } else if (Fator < 0) {
                        valorFinal /= Math.abs(Fator);
                    }

                    if (Offset > 0) {
                        valorFinal += Offset;
                    } else if (Offset < 0) {
                        valorFinal -= Math.abs(Offset);
                    }

                    const parametroRepository = SqlDataSource.getRepository(Parametro);
                    const parametro = await parametroRepository.findOne({ where: { tipoParametro: tipoParametro } });

                    const ID_Parametro = parametro.ID_Parametro;
                    console.log(`IDTipoParametro = ${medidaItem.IdTipoParametro}, Fator = ${Fator}, Offset = ${Offset}, Valor final = ${valorFinal}, ID_Parametro = ${ID_Parametro}`);

                    await adicionarMedida(parametro, medidaItem.unixtime, valorFinal);
                }

                // Deleta o documento após processar todas as medidas
                await collection.deleteOne({ _id: medida._id });
                console.log(`Documento com UID ${uid} deletado.`);
            }

            console.log('Processamento de medidas concluído.');
        } catch (error) {
            console.error('Erro ao processar medidas:', error);
        } finally {
            await client.close();
            console.log('Conexão com o MongoDB fechada.');
        }
    }
}

export default new TratamentoServices();
