import { ApolloServer } from "apollo-server";
import { connectToMongoDB } from "./DB/mongo"
import { typeDefs } from "./GRAPHQL/schema";
import { resolvers } from "./GRAPHQL/resolvers";
import { getUserFromToken } from "./auth";

const start = async () => {
  await connectToMongoDB();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
      const token = req.headers.authorization || "";
      const user = token ? await getUserFromToken(token as string) : null;
      return { user };
    },
  });

  await server.listen({ port: 4000 });
  console.log("GQL sirviendo y de to");
};



start().catch(err=>console.error(err));