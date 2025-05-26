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

  const gp = await prisma.gP.findUnique({
    where: { id_api_races: BigInt(gpId) },
  });

  if (!gp) throw new Error("GP introuvable");

  const now = new Date();
  if (now >= gp.date) {
    throw new Error("Ce GP a déjà commencé, vous ne pouvez plus parier.");
  }

  const bet = await prisma.betSelectionResult.create({
    data: {
      id_utilisateur: userId,
      id_gp: BigInt(gpId),
      id_pilote_p10: piloteP10Id,
      id_pilote_dnf: piloteDNFId,
      points_p10: '0',
      points_dnf: '0',
    },
    include: {
      gp: { include: { track: true } },
      pilote_p10: true,
      pilote_dnf: true,
      user: true,
    },
  });

  return {
    ...bet,
    gp: {
      ...bet.gp,
      id_api_races: bet.gp.id_api_races.toString(), // <-- important ici
      date: bet.gp.date.toISOString(),
      time: bet.gp.time.toISOString(),
    },
  };
},
  async updateBetSelection(_: any, args: any, context: any) {
  const userId = context.userId;
  if (!userId) throw new AuthenticationError('Not authenticated');

  const { betId, piloteP10Id, piloteDNFId } = args;

  const bet = await prisma.betSelectionResult.findUnique({
    where: { id: betId },
    include: { gp: true },
  });

  if (!bet) {
    throw new Error("Pari introuvable.");
  }

  if (bet.id_utilisateur !== userId) {
    throw new AuthenticationError("Accès interdit à ce pari.");
  }

  const now = new Date();
  if (now >= bet.gp.date) {
    throw new Error("Le GP a déjà commencé. Modification impossible.");
  }

  const updatedBet = await prisma.betSelectionResult.update({
  where: { id: betId },
  data: {
    ...(piloteP10Id && { id_pilote_p10: piloteP10Id }),
    ...(piloteDNFId && { id_pilote_dnf: piloteDNFId }),
  },
  include: {
    gp: { include: { track: true } },
    pilote_p10: true,
    pilote_dnf: true,
    user: true,
  },
});

return {
  ...updatedBet,
  gp: {
    ...updatedBet.gp,
    id_api_races: updatedBet.gp.id_api_races.toString(),
    date: updatedBet.gp.date.toISOString(),
    time: updatedBet.gp.time.toISOString(),
  },
};

 },
 async deleteBetSelection(_: any, args: { betId: number }, context: any) {
  const userId = context.userId;
  if (!userId) throw new AuthenticationError('Not authenticated');

  const bet = await prisma.betSelectionResult.findUnique({
    where: { id: args.betId },
    include: { gp: true },
  });

  if (!bet) {
    throw new Error("Pari introuvable.");
  }

  if (bet.id_utilisateur !== userId) {
    throw new AuthenticationError("Accès interdit à ce pari.");
  }

  const now = new Date();
  if (now >= bet.gp.date) {
    throw new Error("Le GP a déjà commencé. Suppression impossible.");
  }

  await prisma.betSelectionResult.delete({
    where: { id: args.betId },
  });

  return true;
 },
 


};
