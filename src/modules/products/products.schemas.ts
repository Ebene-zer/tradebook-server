import { z } from 'zod';

export const ProductSchema = z.object({
  name: z.string().trim().min(1),
  sku: z.string().trim().optional(),
  unit: z.string().trim().default('pcs'),
  costPrice: z.coerce.number().nonnegative().default(0),
  sellPrice: z.coerce.number().nonnegative().default(0),
  quantity: z.coerce.number().default(0),
  lowStockAt: z.coerce.number().nonnegative().optional(),
});
