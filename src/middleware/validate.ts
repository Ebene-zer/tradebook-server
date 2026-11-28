import type { RequestHandler } from 'express';
import type { ZodType } from 'zod';
import { AppError } from '../lib/errors.js';

type Part = 'body' | 'query' | 'params';

/** Validates a request part with a Zod schema; parsed value is stored in `res.locals[part]`. */
export const validate =
  (schema: ZodType, part: Part = 'body'): RequestHandler =>
  (req, res, next) => {
    const result = schema.safeParse(req[part]);
    if (!result.success) {
      throw AppError.badRequest('Validation failed', result.error.issues);
    }
    res.locals[part] = result.data;
    next();
  };
