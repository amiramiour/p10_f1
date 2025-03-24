import { ApolloServer } from 'apollo-server';
import { typeDefs } from './src/graphql/schemas/schema';
import { resolvers } from './src/graphql/resolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
