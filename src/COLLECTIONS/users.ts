import { getDB } from "../DB/mongo";
import { Users } from "../TYPES/Users";
import bcrypt from "bcryptjs";
import { ObjectId } from "mongodb";
import { USER_COLLECTION } from "../utils";

export const createUser = async (email: string, password: string) => {
  const db = getDB(); //llamamos a nuestra DB
  const passEncrypt = await bcrypt.hash(password, 10); //encriptamos
  const result = await db
    .collection(USER_COLLECTION)
    .insertOne({ email, password: passEncrypt }); //añadimos user a DB

  return await result.insertedId.toString();
};

export const validateUser = async (email: string, password: string) => {
  const db = getDB();

  const user = await db.collection(USER_COLLECTION).findOne({ email });
  if (!user) return null;

  const passComparacion = await bcrypt.compare(password, user.password);
  if (!passComparacion) return null;

  return await user;
};

export const getUserByEmail = async (email: string)=> {
  const db = getDB();
  return await db.collection(USER_COLLECTION).findOne({ email }) as any;
};

export const getUserById = async (id: string) => {
  const db = getDB();
  return await db.collection(USER_COLLECTION).findOne({ _id: new ObjectId(id) });
};

export const getAllUsers = async ()=> {
  const db = getDB();
  return await db.collection(USER_COLLECTION).find().toArray();
};

export const deleteUser = async (id: string) => {
  const db = getDB();
  const result = await db.collection(USER_COLLECTION).deleteOne({ _id: new ObjectId(id) });

  return result.deletedCount > 0;
};
