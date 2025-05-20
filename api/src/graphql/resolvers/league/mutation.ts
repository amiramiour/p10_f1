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
  joinLeague: async (_: any, args: JoinLeagueArgs, context: GQLContext) => {
    if (!context.userId) throw new Error('Unauthorized');
  
    const { shared_link } = args;
  
    // Vérifie que la ligue existe
    const league = await prisma.league.findFirst({
        where: { shared_link },
      });
      
  
    if (!league) {
      throw new Error('Invalid link: league not found');
    }
  
    // Vérifie si l'utilisateur est déjà dedans
    const alreadyJoined = await prisma.userLeague.findFirst({
      where: {
        id_user: context.userId,
        id_league: league.id,
      },
    });
  
    if (alreadyJoined) {
      throw new Error('You already joined this league');
    }
  
    // Ajoute dans UserLeague
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
