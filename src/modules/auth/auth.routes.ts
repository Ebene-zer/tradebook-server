import { Router } from 'express';
import { validate } from '../../middleware/validate.js';
import { currentUserId, requireAuth } from '../../middleware/auth.js';
import { LoginSchema, RegisterSchema } from './auth.schemas.js';
import * as auth from './auth.service.js';

export const authRouter = Router();

authRouter.post('/register', validate(RegisterSchema), async (_req, res) => {
  res.status(201).json(await auth.register(res.locals.body));
});

authRouter.post('/login', validate(LoginSchema), async (_req, res) => {
  res.json(await auth.login(res.locals.body));
});

authRouter.get('/me', requireAuth, async (req, res) => {
  res.json(await auth.me(currentUserId(req)));
});
