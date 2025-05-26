import { PrismaClient } from '@prisma/client';
import { AuthenticationError } from 'apollo-server';
import { GQLContext } from '../../context';

const prisma = new PrismaClient();

export const betQueries = {
  async getMyBets(_: any, __: any, context: any) {
    const user = context.userId;
    if (!user) throw new AuthenticationError('Not authenticated');

    return (await prisma.betSelectionResult.findMany({
    where: { id_utilisateur: user },
    include: {
        gp: { include: { track: true } },
        pilote_p10: true,
        pilote_dnf: true,
    },
    })).map(bet => ({
    ...bet,
    gp: {
        ...bet.gp,
        id_api_races: bet.gp.id_api_races.toString(),
        date: bet.gp.date.toISOString(),
        time: bet.gp.time.toISOString(),
    },
    }));


   
  },
  async getBetsByGP(_: any, args: { gpId: string }) {
  const rawBets = await prisma.betSelectionResult.findMany({
    where: {
      id_gp: BigInt(args.gpId),
    },
    include: {
      user: true,
      pilote_p10: true,
      pilote_dnf: true,
      gp: { include: { track: true } }, // ajoute si tu veux le détail du circuit
    },
  });

  return rawBets.map(bet => ({
    ...bet,
    gp: {
      ...bet.gp,
      id_api_races: bet.gp.id_api_races.toString(),
      date: bet.gp.date.toISOString(),
      time: bet.gp.time.toISOString(),
    },
  }));
},

  async betsByUser(_: any, args: { userId: string }, context: GQLContext) {
    if (!context.userId) throw new AuthenticationError('Unauthorized');

    return (await prisma.betSelectionResult.findMany({
      where: { id_utilisateur: args.userId },
      include: {
        gp: { include: { track: true } },
        pilote_p10: true,
        pilote_dnf: true,
        user: true,
      },
    })).map(bet => ({
      ...bet,
      gp: {
        ...bet.gp,
        id_api_races: bet.gp.id_api_races.toString(),
        date: bet.gp.date.toISOString(),
        time: bet.gp.time.toISOString(),
      },
    }));
  },
};
