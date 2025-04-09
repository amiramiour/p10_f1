import { userQueries } from './user/query';
import { userMutations } from './user/mutation';
import { leagueMutations } from './league/mutation';
import { leagueQueries } from './league/query';
import { classementQueries } from './classement/query';
import { gpQueries } from './gp/query';
export const resolvers = {
  Query: {
    ...userQueries,
    ...leagueQueries,
    ...classementQueries,
    ...gpQueries,
  },
  Mutation: {
    ...userMutations,
    ...leagueMutations,
  },
};
