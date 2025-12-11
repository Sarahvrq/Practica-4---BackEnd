import { getDB } from "../DB/mongo";
import { Tasks } from "../TYPES/Tasks";
import { ObjectId } from "mongodb";
import { TASK_COLLECTION } from "../utils";

export const createTask = async (
  title: string,
  ProjectId: string,
  assignedTo: string[],
  status: string = "PENDING",
  priority: string = "MEDIUM",
  dueDate: Date
) => {
  const db = getDB();
  const result = await db
    .collection(TASK_COLLECTION)
    .insertOne({
      title,
      projectId: new ObjectId(ProjectId),
      assignedTo: assignedTo.map((id) => new ObjectId(id)),
      status,
      priority,
      dueDate,
    });
  const newTask = await getTaskById(result.insertedId.toString());
  return newTask;
};

export const getTaskById = async (id: string) => {
  const db = getDB();
  return await db
    .collection(TASK_COLLECTION)
    .findOne({ _id: new ObjectId(id) });
};

export const getTasksByProject = async (projectId: string) => {
  const db = getDB();
  return await db
    .collection(TASK_COLLECTION)
    .find({ projectId: new ObjectId(projectId) })
    .toArray();
};

export const getAllTasks = async () => {
  const db = getDB();
  return await db.collection(TASK_COLLECTION).find().toArray();
};

export const updateTaskStatus = async (taskId: string, newStatus: string) => {
  const db = getDB();

  const taskExists = await getTaskById(taskId);
  if (!taskExists) throw new Error("Task does not exist");

  await db.collection(TASK_COLLECTION).updateOne({ _id: new ObjectId(taskId) }, { $set: { status: newStatus } });

  const updatedTask = await getTaskById(taskId);
  return updatedTask;
};
