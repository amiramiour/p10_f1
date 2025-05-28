import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { graphqlRequestCounter } from '../metrics'; // ⬅️ ajoute l'import

const JWT_SECRET = process.env.JWT_SECRET as string;

export interface GQLContext {
  userId?: string;
  email?: string;
  role?: string;
}

export function createContext({ req }: { req: Request }): GQLContext {
  // ✅ Incrémenter les requêtes GraphQL par operationName (si présent)
  const operationName = req.body?.operationName || 'unknown';
  graphqlRequestCounter.inc({ operation: operationName });

  const authHeader = req.headers.authorization || '';
  const token = authHeader.replace('Bearer ', '');

  if (!token) return {};

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as GQLContext;
    return {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };
  } catch (err) {
    console.warn('Invalid token');
    return {};
  }
}
