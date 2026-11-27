import { Router } from 'express';
import { healthRouter } from './modules/health/health.routes.js';
import { authRouter } from './modules/auth/auth.routes.js';
import { productsRouter } from './modules/products/products.routes.js';
import { customersRouter } from './modules/customers/customers.routes.js';
import { creditRouter } from './modules/credit/credit.routes.js';
import { syncRouter } from './modules/sync/sync.routes.js';

export const apiRouter = Router();

apiRouter.use('/health', healthRouter);
apiRouter.use('/auth', authRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/customers', customersRouter);
apiRouter.use('/credit', creditRouter);
apiRouter.use('/sync', syncRouter);
