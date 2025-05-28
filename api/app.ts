import { ApolloServer } from 'apollo-server';
import { typeDefs } from './src/graphql/schemas/schema';
import { resolvers } from './src/graphql/resolvers/index';
import { createContext } from './src/graphql/context';
import { startMetricsServer } from './src/metricsServer';
import './src/cron/jobs';

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: createContext,
});

startMetricsServer(); // Démarre serveur /metrics

server.listen().then(({ url }) => {
  console.log(`GraphQL server ready at ${url}`);
});
