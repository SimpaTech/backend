import { client } from '../mongoDB';
import { Estacao } from '../entities/Estacao';
import { TipoParametro } from '../entities/TipoParametro';
import SqlDataSource from '../data-source';
import { Parametro } from '../entities/Parametro';
import { adicionarMedida } from './MedidaServices';
import { criarOcorrencia } from './OcorrenciasServices';
import { Parametro_Alerta } from '../entities/ParametroAlerta';

class TratamentoServices {
    async processarMedidas(): Promise<void> {
        try {
            await client.connect();
            console.log('Conexão bem sucedida ao MongoDB Atlas');

            const database = client.db('Simpatech');
            const collection = database.collection('Medidas');

            // Obtém todas as medidas da coleção
            const medidas = await collection.find().toArray();

            const tipoParametroRepository = SqlDataSource.getRepository(TipoParametro);
            const parametroRepository = SqlDataSource.getRepository(Parametro);
            const parametroalertaRepository = SqlDataSource.getRepository(Parametro_Alerta);


            // Processa cada medida
            for (const medida of medidas) {
                const { uid, unixtime, _id, ...medidaData } = medida;

                const estacaoRepository = SqlDataSource.getRepository(Estacao);
                const estacao = await estacaoRepository.findOne({ where: { UID: uid } });

                if (!estacao) {
                    console.log(`Estação com UID ${uid} não encontrada.`);
                    continue;
                }

                const ID_Estacao = estacao.ID_Estacao;

                console.log(`ID_Estação = ${ID_Estacao}`);

                for (const [nomeCampo, valor] of Object.entries(medidaData)) {
                    try {
                        const tipoParametro = await tipoParametroRepository.findOne({ where: { Json: nomeCampo } });

                        if (!tipoParametro) {
                            console.log(`Tipo de parâmetro com nome ${nomeCampo} não encontrado.`);
                            continue;
                        }

                        const tipoparametro = await parametroRepository.findOne({ where: { tipoParametro: tipoParametro } });

                        if (!tipoparametro) {
                            console.log(`Parâmetro não encontrado para o tipo de parâmetro ${tipoParametro.Json}.`);
                            continue;
                        }

                        console.log(`Parâmetro encontrado para o tipo de parâmetro ${tipoParametro.Json}.`);

                        console.log("id tipo parametroooo", tipoParametro.ID_Tipo_Parametro)

                        const parametrob = await parametroRepository.findOne({
                            where: { tipoParametro: { ID_Tipo_Parametro: tipoParametro.ID_Tipo_Parametro }, estacao: {ID_Estacao: estacao.ID_Estacao } }
                        });
                        // const parametro = await parametroRepository.findOne({ where: { tipoParametro: tipoParametro.ID_Tipo_Parametro } });

                        console.log("parametrooooooo", parametrob)

                        const parametrodealerta = await parametroalertaRepository.findOne({
                            where: { parametro: { ID_Parametro : parametrob.ID_Parametro } }
                        });

                        // const parametrodealerta = await parametroalertaRepository.findOne({ where: { ID_Parametro_Alerta : parametro.ID_Parametro } });

                        console.log("parametro de alertaaaa", parametrodealerta)

                        // Buscar parâmetro de alerta apenas se o parâmetro for encontrado
                        const parametroAlerta = parametrodealerta.ID_Parametro_Alerta

                        // if (!parametroAlerta) {
                        //     console.log(`Parâmetro de alerta não encontrado para o parâmetro ${parametroAlerta}.`);
                        //     continue;
                        // }

                        // console.log(`Parâmetro de alerta encontrado para o parâmetro ${parametroAlerta}.`);

                        const ID_Parametro_Alerta = parametroAlerta;

                        console.log(`ID do Parâmetro de Alerta: ${ID_Parametro_Alerta}`);

                        const { Fator, Offset } = tipoParametro;

                        let valorFinal = valor;

                        if (Fator !== 0) {
                            valorFinal *= Fator;
                        }

                        if (Offset !== 0) {
                            valorFinal += Offset;
                        }

                        console.log("BBBBB", parametrob)
                        console.log("AAAAA", parametrodealerta)

                        const medidaInserida = await adicionarMedida(parametrob, unixtime, valorFinal);
                        const medidaID = medidaInserida.ID_Medida;

                        console.log("Medida ID:", medidaID, "Parâmetro de Alerta ID:", parametrodealerta.ID_Parametro_Alerta);
                        await criarOcorrencia(medidaID, parametrodealerta.ID_Parametro_Alerta);
                    } catch (error) {
                        console.error(`Erro ao processar medida para UID ${uid}:`, error);
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