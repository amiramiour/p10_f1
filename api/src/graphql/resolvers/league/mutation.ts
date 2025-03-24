import { PrismaClient } from '@prisma/client';
import { GQLContext } from '../../context';
import { CreateLeagueArgs } from './types';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const leagueMutations = {
  createLeague: async (_: any, args: CreateLeagueArgs, context: GQLContext) => {
    if (!context.userId) {
      throw new Error("Unauthorized");
    }

    const { name, private: isPrivate } = args;

    const sharedLink = isPrivate ? crypto.randomUUID() : null;

    const league = await prisma.league.create({
      data: {
        name,
        private: isPrivate,
        shared_link: sharedLink,
        active: true,
      },
    });

    // Crée une entrée UserLeague pour faire du créateur l'admin
    await prisma.userLeague.create({
      data: {
        id_league: league.id,
        id_user: context.userId,
        role: 'admin',
      },
    });

    return league;
  },
};
