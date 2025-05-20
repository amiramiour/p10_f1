import { PrismaClient } from '@prisma/client';
import { GQLContext } from '../../context';

const prisma = new PrismaClient();

export const trackQueries = {
  track: async (_: any, args: { id: string }, context: GQLContext) => {
    if (!context.userId) throw new Error("Unauthorized");

    const track = await prisma.track.findUnique({
      where: {
        id_api_tracks: parseInt(args.id),
      },
    });

    if (!track) throw new Error("Track not found");
    return track;
  },
};
