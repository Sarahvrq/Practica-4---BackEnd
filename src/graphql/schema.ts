import { gql } from "apollo-server";

export const typeDefs = gql`

  type User {
    _id: ID!
    username: String!
    email: String!
    password: String!
    createAt: String!
  }

  type Project {
    _id: ID!
    name: String!
    description: String
    startDate: String!
    endDate: String!
    owner: ID!
    members: [ID!]!
    Tasks: [Task!]!
  }

    enum TASK_status {
      PENDING
      IN_PROGRESS
      COMPLETED
    }

    enum TASK_priority {
      LOW
      MEDIUM
      HIGH
    }

  type Task {
    _id: ID!
    title: String!
    projectId: ID!
    assignedTo: [ID!]!
    status: TASK_status!
    priority: TASK_priority!
    dueDate: String!

    }

  type AuthPayload  {
      userId: String
  }

    input RegisterInput {
      email: String!
      password: String!
    }

    input LoginInput {
      email: String!
      password: String!
    }

    input CreateProjectInput {
      name: String!
      description: String
      startDate: String!
      endDate: String!
      owner: ID!
      members: [ID!]!
    }

        input UpdateProjectInput {
          name: String
          description: String
          startDate: String
          endDate: String
          owner: ID!
          members: [ID!]
        }

    input CreateTaskInput {
      title: String!
      assignedTo: [ID!]!
      status: TASK_status!
      priority: TASK_priority!
      dueDate: String!
    }

        input UpdateTaskInput {
          title: String!
          assignedTo: [ID!]!
          status: TASK_status!
          priority: TASK_priority!
          dueDate: String!
        }


  type Query {
    me: User
    users: [User!]!

    myProjects: [Project]!
    projectDetails(projectId: ID!): Project
    
  }

  type Mutation {
    register(input: RegisterInput!): AuthPayload!
    login(input: LoginInput!): AuthPayload!

    createProject(input: CreateProjectInput!): Project!
    updateProject(id: ID!, input: UpdateProjectInput!): Project!
    deleteProject(id: ID!): Boolean!
    addMember(projectId: ID!, userId: ID!): Project!

    createTask(projectId: ID!, input: CreateTaskInput): Task!
    updateTask(taskId: ID!, status: TASK_status): Task!

  }
`;