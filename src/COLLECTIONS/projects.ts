import { getDB } from "../DB/mongo";
import { ObjectId } from "mongodb";
import { PROJECT_COLLECTION } from "../utils";

export const createProject = async (
  name: string,
  description: string,
  startDate: Date,
  endDate: Date,
  owner: string,
  members: string[] = []
) => {
  const db = getDB();
  const result = await db
    .collection(PROJECT_COLLECTION)
    .insertOne({ name, description, startDate, endDate, owner, members });
  const newProject = await getProjectById(result.insertedId.toString());
  return newProject;
};

export const getProjectById = async (id: string) => {
  const db = getDB();
  return await db
    .collection(PROJECT_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
};

export const getProjectsByOwner = async (ownerId: string) => {
  const db = getDB();
  return await db
    .collection(PROJECT_COLLECTION)
    .find({ owner: new ObjectId(ownerId) })
    .toArray();
};

export const getAllProjects = async (page?: number, size?: number) => {
  const db = getDB();
  page = page || 1; //es lo mismo que decir const new page = page || 1, pero evitamos declarar nuevas variables
  size = size || 10;
  return await db
    .collection(PROJECT_COLLECTION)
    .find()
    .skip((page - 1) * size)
    .limit(size)
    .toArray();
};

export const addMemberToProject = async (
  projectId: string,
  userId: string,
  requestingUserId: string
): Promise<any> => {
  const db = getDB();

  // Verify that the requesting user is the project owner
  const project = await getProjectById(projectId);
  if (!project) throw new Error("Project not found");

  const projectOwner = project.owner.toString();
  if (projectOwner !== requestingUserId) {
    throw new Error("Only the project owner can add members");
  }

  // Add the user to members array
  const result = await db
    .collection(PROJECT_COLLECTION)
    .findOneAndUpdate(
      { _id: new ObjectId(projectId) },
      { $addToSet: { members: new ObjectId(userId) } },
      { returnDocument: "after" }
    );

  return result?.value;
};

export const updateProject = async (projectId: string, updates: { name?: string; description?: string; startDate?: Date; endDate?: Date }) => {
  const db = getDB();

  const projectExists = await getProjectById(projectId);
  if (!projectExists) throw new Error("Project does not exist");

  await db.collection(PROJECT_COLLECTION).updateOne({ _id: new ObjectId(projectId) }, { $set: updates });
  
  const updatedProject = await getProjectById(projectId);
  return updatedProject;
  
};
