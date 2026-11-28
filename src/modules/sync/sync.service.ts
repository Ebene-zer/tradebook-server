import { prisma } from '../../lib/prisma.js';
import type { PushBody, SyncEntity } from './sync.schemas.js';

const delegates: Record<SyncEntity, any> = {
  products: prisma.product,
  customers: prisma.customer,
  stockMovements: prisma.stockMovement,
  creditEntries: prisma.creditEntry,
};

/**
 * Pull: return every record (including soft-deleted tombstones) changed since `since`.
 * The client stores `serverTime` and sends it back as `since` next time.
 */
export async function pull(userId: string, since?: Date) {
  const serverTime = new Date();
  const where = { userId, ...(since && { updatedAt: { gt: since } }) };

  const entries = await Promise.all(
    Object.entries(delegates).map(async ([name, d]) => [name, await d.findMany({ where })]),
  );
  return { serverTime: serverTime.toISOString(), changes: Object.fromEntries(entries) };
}

/**
 * Push: upsert client changes. Conflict strategy (skeleton): last-write-wins on `updatedAt`.
 * TODO: per-field merge / conflict reporting, and recompute product quantity from stock movements.
 */
export async function push(userId: string, body: PushBody) {
  const result: Record<string, { applied: number; skipped: number }> = {};

  await prisma.$transaction(async (tx) => {
    const txDelegates: Record<SyncEntity, any> = {
      products: tx.product,
      customers: tx.customer,
      stockMovements: tx.stockMovement,
      creditEntries: tx.creditEntry,
    };

    for (const [entity, records] of Object.entries(body.changes) as [
      SyncEntity,
      PushBody['changes'][SyncEntity],
    ][]) {
      const d = txDelegates[entity];
      const stats = { applied: 0, skipped: 0 };

      for (const rec of records ?? []) {
        // Never trust client-sent ownership or server timestamps.
        const {
          id,
          updatedAt,
          createdAt: _c,
          userId: _u,
          ...data
        } = rec as typeof rec & {
          createdAt?: unknown;
          userId?: unknown;
        };
        const existing = await d.findUnique({ where: { id } });

        if (existing && existing.userId !== userId) {
          stats.skipped++;
          continue;
        }
        if (existing && existing.updatedAt >= updatedAt) {
          stats.skipped++; // server copy is newer
          continue;
        }

        await d.upsert({
          where: { id },
          create: { ...data, id, userId },
          update: data,
        });
        stats.applied++;
      }
      result[entity] = stats;
    }
  });

  return { serverTime: new Date().toISOString(), result };
}
