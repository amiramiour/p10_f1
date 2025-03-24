import { PrismaClient } from '@prisma/client';
import { GQLContext } from '../../context';

const prisma = new PrismaClient();

export const userQueries = {
  hello: () => 'Hello from Apollo Server 🚀',

  getMe: async (_: any, __: any, context: GQLContext) => {
    if (!context.userId) {
      throw new Error('Unauthorized');
    }

    const user = await prisma.user.findUnique({
      where: { id: context.userId },
    });

    return user;
  },
};
