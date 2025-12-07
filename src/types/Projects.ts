import { ObjectId } from "mongodb"

export type Projects = {
    _id: ObjectId
    name: String,
    description: String,
    startDate: Date,
    endDate: Date, 
    owner: ObjectId,
    members: [ObjectId]
}