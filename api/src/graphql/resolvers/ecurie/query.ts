import { PrismaClient } from '@prisma/client';
import { GQLContext } from '../../context';

const prisma = new PrismaClient();

export const ecurieQueries = {
  ecurie: async (_: any, args: { id: string }, context: GQLContext) => {
  if (!context.userId) throw new Error("Unauthorized");

  const ecurie = await prisma.ecurie.findUnique({
    where: { id_api_ecuries: parseInt(args.id) },
    include: {
      pilotsEcuries: {
        include: {
          pilote: true,
        },
      },
    },
  });

  if (!ecurie) throw new Error("Ecurie not found");

  return {
    ...ecurie,
    pilotes: ecurie.pilotsEcuries.map((pe) => ({
      ...pe,
      year: pe.year.getFullYear().toString(), // ou juste getFullYear()
    })),
  };
}


};
