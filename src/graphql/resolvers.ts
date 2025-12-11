import { ObjectId } from "mongodb";
import { IResolvers } from "@graphql-tools/utils";
import {
  createUser,
  validateUser,
  getUserById,
  getAllUsers,
} from "../COLLECTIONS/users";
import {
  createProject,
  getProjectById,
  getProjectsByOwner,
  updateProject,
} from "../COLLECTIONS/projects";
import {
  createTask,
  getTasksByProject,
  updateTaskStatus,
} from "../COLLECTIONS/tasks";

export const resolvers: IResolvers = {
  Query: {
    me: async (_, __, { user }) => {
      if (!user) return null;
      return getUserById(user._id.toString());
    },

    users: async () => {
      return getAllUsers();
    },

    myProjects: async (_, __, { user }) => {
      if (!user) throw new Error("You must be logged in");
      return getProjectsByOwner(user._id.toString());
    },

    projectDetails: async (_, { projectId }) => {
      return getProjectById(projectId);
    },
  },

  Mutation: {
    register: async (_, { input: { email, password } }) => {
      const userId = await createUser(email, password);
      return { userId };
    },

    login: async (_, { input: { email, password } }) => {
      const user = await validateUser(email, password);
      if (!user) throw new Error("Invalid credentials");
      return { userId: (user._id as ObjectId).toString() };
    },

    createProject: async (_,{ input: { name, description, startDate, endDate, owner, members } }) => {

      return createProject(
        name,
        description,
        startDate,
        endDate,
        owner,
        members
      );
    },

    createTask: async (_, { projectId, input }) => {
      const { title, assignedTo, status, priority, dueDate } = input;
      return createTask(
        title,
        projectId,
        assignedTo,
        status,
        priority,
        dueDate
      );
    },

    updateProject: async (_, { id, input }) => {
      return updateProject(id, input);
    },

    updateTask: async (_, { id, status }) => {
      return updateTaskStatus(id, status);
    },
  },

  Project: {
    Tasks: async (parent: any) => {
      return await getTasksByProject(parent._id.toString());
    },
  },
};
