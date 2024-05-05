import { client } from '../mongoDB';

class MongoServices {
    async saveData(data: Record<string, any>): Promise<void> {
        try {
            // Verifica se o cliente está conectado ao MongoDB

            await client.connect();
            console.log('Conexão bem sucedida ao MongoDB Atlas');

            const database = client.db('Simpatech');
            const collection = database.collection('Medidas');

            // Insere o JSON na coleção
            await collection.insertOne(data);

            console.log('Dados salvos com sucesso na coleção "Medidas"');
        } catch (error) {
            console.error('Erro ao salvar dados no MongoDB:', error);
        }
    }
}

export default new MongoServices();
