import { z } from 'zod';

export const CustomerSchema = z.object({
  name: z.string().trim().min(1),
  phone: z.string().trim().optional(),
  note: z.string().optional(),
});
