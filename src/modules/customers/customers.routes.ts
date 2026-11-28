import { prisma } from '../../lib/prisma.js';
import { crudRouter } from '../../lib/crud.js';
import { CustomerSchema } from './customers.schemas.js';

export const customersRouter = crudRouter(prisma.customer, CustomerSchema);
