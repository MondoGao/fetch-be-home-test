/**
 * Point Controller.
 *
 * I ignore the service layer to simply the code, it's not recommended to call
 * model layer directly in controller's code.
 */
import { Middleware } from 'koa';
import * as Router from '@koa/router';
import { Transaction } from '../model/transaction';
import { Wallet } from '../model/wallet';

const router = new Router();
export { router as pointRouter };

export interface AddRequest {
  payer: string;
  points: number;
  timestamp: string;
}
export const add: Middleware = async (ctx) => {
  const { db, request } = ctx;
  const body = request.body as AddRequest;

  const { payer, points, timestamp } = body;
  await db.transaction(async (manager) => {
    let wallet: Wallet = await manager.findOne(Wallet, {
      where: { payer },
    });
    if (!wallet) {
      wallet = manager.create(Wallet, { payer });
      await manager.save(wallet);
    }
    const ins_transaction = manager.create(Transaction, {
      points,
      timestamp,
    });
    wallet.transactions.push(ins_transaction);
    wallet.points += points;
    await manager.save(wallet);
    return wallet;
  });

  return '';
};
router.post('/add', add);

export const spend: Middleware = async () => {
  // const { db, request } = ctx;
  // const body = request.body as AddRequest;

  // return 'spend';
};
router.post('/spend', spend);
export const balance: Middleware = async (ctx) => {
  ctx.logger.info('balance');
  return 'balance';
};
router.get('/balance', balance);
