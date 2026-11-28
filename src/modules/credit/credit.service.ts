import { prisma } from '../../lib/prisma.js';

/** Outstanding balance per customer: sum(CREDIT) - sum(PAYMENT). */
export async function balances(userId: string) {
  const rows = await prisma.creditEntry.groupBy({
    by: ['customerId', 'type'],
    where: { userId, deletedAt: null },
    _sum: { amount: true },
  });

  const map = new Map<string, number>();
  for (const r of rows) {
    const amount = Number(r._sum.amount ?? 0);
    const sign = r.type === 'CREDIT' ? 1 : -1;
    map.set(r.customerId, (map.get(r.customerId) ?? 0) + sign * amount);
  }
  return [...map].map(([customerId, balance]) => ({ customerId, balance }));
}
