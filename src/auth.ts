import dotenv from 'dotenv';
import jwt from "jsonwebtoken";
import { getDB } from './db/mongo';
import { ObjectId } from 'mongodb';


dotenv.config()


const SUPER_SECRETO = process.env.SECRET;

export const signToken = (userId: string) => jwt.sign({ userId }, SUPER_SECRETO!, {expiresIn: "1h" });


export const verifyToken = (token: string): AuthPayload | null => {
    try{
        return jwt.verify(token, SUPER_SECRETO!) as AuthPayload;
    }catch (err){
        return null;
    }
};

export const getUserFromToken = async (token: string) => {
    const payload = verifyToken(token);
    if(!payload) return null;
    const db = getDB();
    return await db.collection("usersVideoGames").findOne({
        _id: new ObjectId(payload.userId)
    })
}
