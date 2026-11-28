import { Router } from 'express';
import type { ZodObject } from 'zod';
import { z } from 'zod';
import { currentUserId, requireAuth } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { AppError } from './errors.js';

/** Minimal delegate shape shared by Prisma model delegates we expose. */
type Delegate = Record<
  'findMany' | 'findFirst' | 'create' | 'update' | 'updateMany',
  (args: any) => Promise<any>
>;

const IdParams = z.object({ id: z.uuid() });

/**
 * Builds standard REST routes for a user-owned, soft-deletable resource.
 * Clients send their own UUID `id` on create, so offline-created records keep the same id.
 */
export function crudRouter(delegate: Delegate, schema: ZodObject) {
  const router = Router();
  router.use(requireAuth);

  const CreateSchema = schema.extend({ id: z.uuid() });
  const UpdateSchema = schema.partial();

  router.get('/', async (req, res) => {
    const items = await delegate.findMany({
      where: { userId: currentUserId(req), deletedAt: null },
      orderBy: { updatedAt: 'desc' },
    });
    res.json(items);
  });

  router.get('/:id', validate(IdParams, 'params'), async (req, res) => {
    const item = await delegate.findFirst({
      where: { id: res.locals.params.id, userId: currentUserId(req), deletedAt: null },
    });
    if (!item) throw AppError.notFound();
    res.json(item);
  });

  router.post('/', validate(CreateSchema), async (req, res) => {
    const item = await delegate.create({
      data: { ...res.locals.body, userId: currentUserId(req) },
    });
    res.status(201).json(item);
  });

  router.patch('/:id', validate(IdParams, 'params'), validate(UpdateSchema), async (req, res) => {
    const { count } = await delegate.updateMany({
      where: { id: res.locals.params.id, userId: currentUserId(req), deletedAt: null },
      data: res.locals.body,
    });
    if (!count) throw AppError.notFound();
    res.json(await delegate.findFirst({ where: { id: res.locals.params.id } }));
  });

  router.delete('/:id', validate(IdParams, 'params'), async (req, res) => {
    const { count } = await delegate.updateMany({
      where: { id: res.locals.params.id, userId: currentUserId(req), deletedAt: null },
      data: { deletedAt: new Date() },
    });
    if (!count) throw AppError.notFound();
    res.status(204).end();
  });

  return router;
}
