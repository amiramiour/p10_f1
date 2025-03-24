import { PrismaClient } from '@prisma/client';
import { GQLContext } from '../../context';

const prisma = new PrismaClient();

export const leagueQueries = {
  getMyLeagues: async (_: any, __: any, context: GQLContext) => {
    if (!context.userId) {
      throw new Error('Unauthorized');
    }

    // On récupère les relations UserLeague avec les infos de la ligue
    const userLeagues = await prisma.userLeague.findMany({
      where: { id_user: context.userId },
      include: { league: true },
    });

    // On extrait uniquement les ligues
    return userLeagues.map((ul) => ul.league);
  },
};
