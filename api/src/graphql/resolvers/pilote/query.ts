import { PrismaClient } from '@prisma/client';
import { GQLContext } from '../../context';

const prisma = new PrismaClient();

export const piloteQueries = {
  pilote: async (_: any, args: { id: string }, context: GQLContext) => {
    if (!context.userId) throw new Error("Unauthorized");

    const pilote = await prisma.pilote.findUnique({
      where: {
        id_api_pilotes: parseInt(args.id),
      },
      include: {
        pilotsEcuries: {
          include: {
            ecurie: true,
          },
        },
      },
    });

    if (!pilote) throw new Error("Pilote not found");
    return {
    ...pilote,
    ecuries: pilote.pilotsEcuries.map((pe) => ({
        ...pe,
        year: pe.year.getFullYear().toString(), 
    })),
    };


  },
};
