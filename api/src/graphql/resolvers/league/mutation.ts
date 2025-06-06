import { PrismaClient } from '@prisma/client';
import { GQLContext } from '../../context';
import { CreateLeagueArgs } from './types';
import { JoinLeagueArgs } from './types';
import { assertIsAdmin } from '../../guards/isAdmin';

import crypto from 'crypto';

const prisma = new PrismaClient();

export const leagueMutations = 
{
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

  joinLeague: async (_: any, args: { leagueId?: number; shared_link?: string }, context: GQLContext) => {
    // afficher args 
    console.log('joinLeague args:', args);
  if (!context.userId) throw new Error('Unauthorized');

  let league;

  if (args.leagueId) {
    // Recherche par ID de la ligue (pour ligues publiques)
    league = await prisma.league.findUnique({
      where: { id: args.leagueId },
    });
  } else if (args.shared_link) {
    // Recherche par shared_link (pour ligues privées)
    league = await prisma.league.findFirst({
      where: { shared_link: args.shared_link },
    });
  } else {
    throw new Error('Missing leagueId or shared_link');
  }

  if (!league) {
    throw new Error('League not found');
  }

  // Vérifie si l'utilisateur est déjà dans la ligue
  const alreadyJoined = await prisma.userLeague.findFirst({
    where: {
      id_user: context.userId,
      id_league: league.id,
    },
  });

  if (alreadyJoined) {
    throw new Error('You already joined this league');
  }

  // Ajoute l'utilisateur à la ligue
  await prisma.userLeague.create({
    data: {
      id_league: league.id,
      id_user: context.userId,
      role: 'user',
    },
  });

  return league;
},

  deleteLeague: async (_: any, args: { leagueId: number }, context: GQLContext) => {
    if (!context.userId) throw new Error("Unauthorized");

    const { leagueId } = args;

    // Vérifie si l'utilisateur est bien admin de la ligue
    await assertIsAdmin(context.userId, leagueId);

    // Supprimer les UserLeague liés à la ligue
    await prisma.userLeague.deleteMany({
      where: { id_league: leagueId },
    });

    // Supprimer la ligue
    await prisma.league.delete({
      where: { id: leagueId },
    });

    return true;
  }
};
