import { PrismaClient } from '@prisma/client';
import { AuthenticationError, ForbiddenError } from 'apollo-server';

const prisma = new PrismaClient();

export async function assertIsAdmin(userId: string, leagueId: number) {
  if (!userId) throw new AuthenticationError("Utilisateur non authentifié.");

  const userLeague = await prisma.userLeague.findFirst({
    where: {
      id_user: userId,
      id_league: leagueId,
    },
  });

  if (!userLeague || userLeague.role !== 'admin') {
    throw new ForbiddenError("Vous n'êtes pas admin de cette ligue.");
  }
}
