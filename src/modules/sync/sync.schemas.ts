import { z } from 'zod';

export const SYNC_ENTITIES = ['products', 'customers', 'stockMovements', 'creditEntries'] as const;
export type SyncEntity = (typeof SYNC_ENTITIES)[number];

export const PullQuerySchema = z.object({
  /** ISO timestamp of the client's last successful pull. Omit for a full sync. */
  since: z.coerce.date().optional(),
});

const Record = z.looseObject({
  id: z.uuid(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable().optional(),
});

export const PushBodySchema = z.object({
  changes: z.partialRecord(z.enum(SYNC_ENTITIES), z.array(Record)),
});

export type PushBody = z.infer<typeof PushBodySchema>;
