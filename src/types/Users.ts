import { ObjectId } from "mongodb"

export type Users= {
  _id: ObjectId;
  email: string;
  videoGameLibrary: string[];
};