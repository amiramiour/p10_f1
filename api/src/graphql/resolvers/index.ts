import { userQueries } from './user/query';
import { userMutations } from './user/mutation';

export const resolvers = {
  Query: {
    ...userQueries,
  },
  Mutation: {
    ...userMutations,
  },
};
