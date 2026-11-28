import { prisma } from '../../lib/prisma.js';
import { crudRouter } from '../../lib/crud.js';
import { ProductSchema } from './products.schemas.js';

// TODO: stock movement endpoints (record sale/purchase and adjust product quantity atomically)
export const productsRouter = crudRouter(prisma.product, ProductSchema);
