import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();

const uri = process.env.MONGODB_URI;

if (!uri) {
    throw new Error("A variável de ambiente MONGODB_URI não está definida.");
}

// const client = new MongoClient(uri);
const client = new MongoClient(uri, { ssl: true });

async function connectMongo() {
    try {
        await client.connect();
        console.log('Conexão bem sucedida ao MongoDB Atlas');
    } catch (error) {
        console.error('Erro ao conectar ao MongoDB Atlas:', error);
    }
}

export { connectMongo, client };