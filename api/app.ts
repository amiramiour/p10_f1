import { ApolloServer } from 'apollo-server';
import { typeDefs } from './src/graphql/schemas/schema';
import { resolvers } from './src/graphql/resolvers/index';
import { createContext } from './src/graphql/context'; 
import './src/cron/jobs'; 

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext, 
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
