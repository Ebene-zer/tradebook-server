import { z } from 'zod';

export const CreditEntrySchema = z.object({
  customerId: z.uuid(),
  type: z.enum(['CREDIT', 'PAYMENT']),
  amount: z.coerce.number().positive(),
  note: z.string().optional(),
  dueDate: z.coerce.date().optional(),
  occurredAt: z.coerce.date(),
});
