import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const resolvers = {
  Query: {
    hello: () => 'Hello from Apollo Server 🚀',
  },

  Mutation: {
    createUser: async (_: any, args: any) => {
      const { email, firstname, lastname, password } = args;

      // Vérifie si un user avec le même email existe
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        throw new Error('User already exists');
      }

      // Hash du mot de passe avec Argon2
      const hashedPassword = await argon2.hash(password);

      // Crée un nouvel utilisateur
      const newUser = await prisma.user.create({
        data: {
          id: crypto.randomUUID(), // Prisma attend une string pour le champ `id`
          email,
          firstname,
          lastname,
          password: hashedPassword,
          role: 'user',
        },
      });

      return newUser;
    },
  },
};
