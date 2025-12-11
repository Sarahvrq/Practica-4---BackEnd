import { Db, MongoClient } from "mongodb";
import dotenv from "dotenv";
import { dbName } from "../utils";
dotenv.config();

let client: MongoClient;
let dB: Db;

export const connectToMongoDB = async () => {
    try{
        const mongoUrl = process.env.MONGO_URL;
        client = new MongoClient(mongoUrl!);
        await client.connect();
        dB = client.db(dbName);
        console.log("EXITO conectando a MongoDB");
    }
    catch(err){
        console.log("ERROR MongoDB: ", err)
    }
};

export const getDB = ():Db => dB;


export const closeMongoDB = async () => {
    try{
        client && await client.close();
    } catch(err){
        console.log("ERROR cerrando MongoDB: ", err)
    }
}