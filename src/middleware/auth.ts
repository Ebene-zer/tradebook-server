import type { RequestHandler } from 'express';
import { AppError } from '../lib/errors.js';
import { verifyToken } from '../lib/jwt.js';

declare module 'express-serve-static-core' {
  interface Request {
    userId?: string;
  }
}

export const requireAuth: RequestHandler = (req, _res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) throw AppError.unauthorized('Missing bearer token');
  try {
    req.userId = verifyToken(header.slice(7)).sub;
    next();
  } catch {
    throw AppError.unauthorized('Invalid or expired token');
  }
};

/** Use inside handlers behind `requireAuth`. */
export function currentUserId(req: { userId?: string }): string {
  if (!req.userId) throw AppError.unauthorized();
  return req.userId;
}
