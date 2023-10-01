import { Router } from 'express';
import { AsyncRoute, wrapAsyncRoute } from '../helper/async';

const router = Router();
export { router as pointRouter };

export const add: AsyncRoute = async () => {
  return 'add';
};
router.post('/add', wrapAsyncRoute(add));

export async function spend() {
  return 'spend';
}
router.post('/spend', wrapAsyncRoute(spend));
export const balance: AsyncRoute = async (req, res) => {
  res.locals.logger.info('balance');
  return 'balance';
};
router.get('/balance', wrapAsyncRoute(balance));
