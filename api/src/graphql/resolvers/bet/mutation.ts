import { PrismaClient } from '@prisma/client';
import { AuthenticationError } from 'apollo-server';

const prisma = new PrismaClient();

export const betMutations = {
  async createBetSelection(_: any, args: any, context: any) {
    const userId = context.userId;
    if (!userId) throw new AuthenticationError('Not authenticated');

    const { gpId, piloteP10Id, piloteDNFId } = args;

    const existing = await prisma.betSelectionResult.findFirst({
      where: {
        id_utilisateur: userId,
        id_gp: BigInt(gpId),
      },
    });

    if (existing) throw new Error("Vous avez déjà parié sur ce GP");

    const bet = await prisma.betSelectionResult.create({
      data: {
        id_utilisateur: userId,
        id_gp: BigInt(gpId),
        id_pilote_p10: piloteP10Id,
        id_pilote_dnf: piloteDNFId,
        points_p10: '0',
        points_dnf: '0',
      },
    });

    return bet;
  },
};
