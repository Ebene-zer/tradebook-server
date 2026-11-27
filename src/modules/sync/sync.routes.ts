import { Router } from 'express';
import { currentUserId, requireAuth } from '../../middleware/auth.js';
import { validate } from '../../middleware/validate.js';
import { PullQuerySchema, PushBodySchema } from './sync.schemas.js';
import * as sync from './sync.service.js';

export const syncRouter = Router();
syncRouter.use(requireAuth);

syncRouter.get('/pull', validate(PullQuerySchema, 'query'), async (req, res) => {
  res.json(await sync.pull(currentUserId(req), res.locals.query.since));
});

syncRouter.post('/push', validate(PushBodySchema), async (req, res) => {
  res.json(await sync.push(currentUserId(req), res.locals.body));
});
