import { userQueries } from './user/query';
import { userMutations } from './user/mutation';
import { leagueMutations } from './league/mutation';
import { leagueQueries } from './league/query';
import { classementQueries } from './classement/query';
import { gpQueries } from './gp/query';
import { betQueries } from './bet/query';
import { betMutations } from './bet/mutation';
import { leagueResolvers } from './league/resolver'; 
import { trackQueries } from './track/query';
import { piloteQueries } from './pilote/query';

export const resolvers = {
  Query: {
    ...userQueries,
    ...leagueQueries,
    ...classementQueries,
    ...gpQueries,
    ...betQueries,
    ...trackQueries,
    ...piloteQueries,


  },
  Mutation: {
    ...userMutations,
    ...leagueMutations,
    ...betMutations,

  },
  ...leagueResolvers,
};
