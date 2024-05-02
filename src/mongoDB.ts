import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri);

async function connectMongo() {
    try {
        await client.connect();
        console.log('Conexão bem sucedida ao MongoDB Atlas');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB Atlas:', error);
    }
}

export { connectMongo, client };