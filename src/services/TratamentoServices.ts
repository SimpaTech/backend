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
                const { uid, unixtime, ...medidaData } = medida;

                const estacaoRepository = SqlDataSource.getRepository(Estacao);
                const estacao = await estacaoRepository.findOne({ where: { UID: uid } });

                if (!estacao) {
                    console.log(`Estação com UID ${uid} não encontrada.`);
                    continue;
                }

                const ID_Estacao = estacao.ID_Estacao;

                console.log(`ID_Estação = ${ID_Estacao}`);

                for (const [nomeCampo, valor] of Object.entries(medidaData)) {
                    const tipoParametroRepository = SqlDataSource.getRepository(TipoParametro);
                    const tipoParametro = await tipoParametroRepository.findOne({ where: { Json: nomeCampo } });

                    if (!tipoParametro) {
                        console.log(`Tipo de parâmetro com nome ${nomeCampo} não encontrado.`);
                        continue;
                    }

                    const { Fator, Offset } = tipoParametro;

                    let valorFinal = valor;

                    if (Fator !== 0) {
                        valorFinal *= Fator;
                    }

                    if (Offset !== 0) {
                        valorFinal += Offset;
                    }

                    const parametroRepository = SqlDataSource.getRepository(Parametro);
                    const parametro = await parametroRepository.findOne({ where: { tipoParametro: tipoParametro } });

                    const ID_Parametro = parametro.ID_Parametro;
                    console.log(`Nome do parâmetro = ${nomeCampo}, Fator = ${Fator}, Offset = ${Offset}, Valor final = ${valorFinal}, ID_Parametro = ${ID_Parametro}`);

                    try {
                        await adicionarMedida(parametro, unixtime, valorFinal);
                    } catch (error) {
                        // Se ocorrer um erro,  exibe a mensagem e continua para a próxima medida
                        console.error(`Erro ao adicionar medida para UID ${uid}:`, error);
                        continue;
                    }
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
            console.log('Conexão com o MongoDB para o tratamento finalizada.');
        }
    }
}

export default new TratamentoServices();
