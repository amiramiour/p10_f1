import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { GQLContext } from '../../context';

import { CreateUserArgs, LoginUserArgs } from './types';
import { UpdateUserArgs, DeleteUserArgs } from './types';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET as string;

export const userMutations = {
  createUser: async (_: any, args: CreateUserArgs) => {
    const { email, firstname, lastname, password } = args;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await argon2.hash(password);

    const newUser = await prisma.user.create({
      data: {
        id: crypto.randomUUID(),
        email,
        firstname,
        lastname,
        password: hashedPassword,
        role: 'user',
      },
    });

    return newUser;
  },

  loginUser: async (_: any, args: LoginUserArgs) => {
    const { email, password } = args;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid email or password');

    const isValid = await argon2.verify(user.password, password);
    if (!isValid) throw new Error('Invalid email or password');

    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return { token, user };
  },

  updateUser: async (_: any, args: UpdateUserArgs, context: GQLContext) => {
  if (!context.userId) throw new Error('Unauthorized');

  const dataToUpdate: any = {};
  if (args.firstname) dataToUpdate.firstname = args.firstname;
  if (args.lastname) dataToUpdate.lastname = args.lastname;
  if (args.password) {
    dataToUpdate.password = await argon2.hash(args.password);
  }

  const updatedUser = await prisma.user.update({
    where: { id: context.userId },
    data: dataToUpdate,
  });

  return updatedUser;
  },

  deleteUser: async (_: any, __: any, context: GQLContext) => {
    if (!context.userId) throw new Error('Unauthorized');

    await prisma.user.delete({
      where: { id: context.userId },
    });

    return true;
  },
};
