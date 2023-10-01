import { Middleware } from 'koa';
import * as Router from '@koa/router';

const router = new Router();
export { router as pointRouter };

export const add: Middleware = async () => {
  return 'add';
};
router.post('/add', add);

export const spend: Middleware = async () => {
  return 'spend';
};
router.post('/spend', spend);
export const balance: Middleware = async (ctx) => {
  ctx.logger.info('balance');
  return 'balance';
};
router.get('/balance', balance);
