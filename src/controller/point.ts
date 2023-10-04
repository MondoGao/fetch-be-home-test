import { Middleware } from 'koa';
import * as Router from '@koa/router';
import {
  addPoints,
  computePayerBalance,
  spendPoints,
} from '../modelAction/transaction';

const router = new Router();
export { router as pointRouter };

export interface AddRequest {
  payer: string;
  points: number;
  timestamp: string;

}
export const add: Middleware = async (ctx) => {
  const { db, request } = ctx;
  const { payer, points, timestamp } = request.body as AddRequest;

  await addPoints(db, payer, points, timestamp);

  return '';
};
router.post('/add', add);

export interface SpendRequest {
  points: number;
}
export const spend: Middleware = async (ctx) => {
  const { db, request } = ctx;
  const { points: requestPoints } = request.body as SpendRequest;

  const spendResult = await spendPoints(db, requestPoints);

  const resp = Object.keys(spendResult).map((payer) => ({
    payer,
    points: -spendResult[payer],
  }));

  return resp;
};
router.post('/spend', spend);

export const balance: Middleware = async (ctx) => {
  const { db } = ctx;

  const balanceByPayer = await computePayerBalance(db);

  const formated: Record<string, number> = balanceByPayer.reduce(
    (res, { payer, balance }) => ({
      ...res,
      [payer]: balance,
    }),
    {},
  );

  return formated;
};
router.get('/balance', balance);
