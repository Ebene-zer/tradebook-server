import { prisma } from '../../lib/prisma.js';
import { crudRouter } from '../../lib/crud.js';
import { currentUserId } from '../../middleware/auth.js';
import { CreditEntrySchema } from './credit.schemas.js';
import { balances } from './credit.service.js';

export const creditRouter = crudRouter(prisma.creditEntry, CreditEntrySchema);

// Registered after the factory routes; `/balances` doesn't collide since `/:id` requires a UUID.
creditRouter.get('/summary/balances', async (req, res) => {
  res.json(await balances(currentUserId(req)));
});
