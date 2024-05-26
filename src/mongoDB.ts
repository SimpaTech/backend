import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

config();

const uri = "mongodb+srv://simpatech2024:JAhW7JjqSfqh1uo0@cluster0.i8dz5y3.mongodb.net/?retryWrites=true&w=majority";

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