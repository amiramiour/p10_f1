import { userQueries } from './user/query';
import { userMutations } from './user/mutation';
import { leagueMutations } from './league/mutation';
import { leagueQueries } from './league/query';
import { classementQueries } from './classement/query';
import { gpQueries } from './gp/query';
import { betQueries } from './bet/query';
import { betMutations } from './bet/mutation';

export const resolvers = {
  Query: {
    ...userQueries,
    ...leagueQueries,
    ...classementQueries,
    ...gpQueries,
    ...betQueries,

  },
  Mutation: {
    ...userMutations,
    ...leagueMutations,
    ...betMutations,

  },
};
