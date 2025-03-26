import { userQueries } from './user/query';
import { userMutations } from './user/mutation';
import { leagueMutations } from './league/mutation';
import { leagueQueries } from './league/query';

export const resolvers = {
  Query: {
    ...userQueries,
    ...leagueQueries,
  },
  Mutation: {
    ...userMutations,
    ...leagueMutations,
  },
};
