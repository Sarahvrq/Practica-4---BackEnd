import { ObjectId } from "mongodb"

export type VideoGame = {
    _id?: string;
    name: string;
    platform: string;
    date: Date;
}