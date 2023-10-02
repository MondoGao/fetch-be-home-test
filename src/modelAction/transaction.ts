import { VError } from 'verror';
import { Transaction } from '../model/transaction';
import { DataSource, EntityManager } from 'typeorm';
import { appLogger } from '../logger';

/**
 * Add points to the user.
 * @param db
 * @param payer
 * @param points - points might be negative, in this case we check the balance first.
 * @param timestamp
 */
export async function addPoints(
  db: DataSource | EntityManager,
  payer: string,
  points: number,
  timestamp: string,
) {
  if (points < 0) {
    const { balance } = await computeTotalBalance(db, payer);
    if (balance < -points) {
      throw new VError('the user doesn’t have enough points');
    }
  }

  return await db.transaction(async (manager) => {
    const transactionIns = manager.create(Transaction, {
      payer,
      points,
      timestamp,
      spent: 0,
    });
    await manager.save(transactionIns);
    return transactionIns;
  });
}

/**
 * Deduct points from every transaction records that still have left points.
 * @param db
 * @param requestPoints
 */
export async function spendPoints(
  db: DataSource | EntityManager,
  requestPoints: number,
  targetPayer?: string,
) {
  // check balance
  const { balance } = await computeTotalBalance(db, targetPayer);
  if (balance < requestPoints) {
    throw new VError('the user doesn’t have enough points');
  }

  // do spend action
  const spendResult = await db.transaction(async (manager) => {
    const pendingTransaction = await manager
      .createQueryBuilder(Transaction, 't')
      .orderBy('t.timestamp', 'ASC')
      .where('t.points - t.spent > 0');
    if (targetPayer) {
      pendingTransaction.andWhere('t.payer = :targetPayer', { targetPayer });
    }

    const transactionInses = await pendingTransaction.getMany();
    // record the spent points for each payer
    const spendResult: Record<string, number> = {};

    transactionInses.reduce((leftRequestPoints, transactionIns) => {
      const leftPoints = transactionIns.points - transactionIns.spent;
      const currentSpent = Math.min(leftPoints, requestPoints);
      transactionIns.spent += currentSpent;
      if (!spendResult[transactionIns.payer]) {
        spendResult[transactionIns.payer] = 0;
      }
      spendResult[transactionIns.payer] += currentSpent;

      return leftRequestPoints - currentSpent;
    }, requestPoints);

    await manager.save(transactionInses);
    return spendResult;
  });
  appLogger.info(JSON.stringify(spendResult));
  return spendResult;
}

/**
 * Compute the points balance by payer.
 * @param db
 */
export async function computePayerBalance(db: DataSource | EntityManager) {
  const res = await db
    .createQueryBuilder(Transaction, 't')
    .select('t.payer', 'payer')
    .addSelect('SUM(t.points)', 'gain')
    .addSelect('SUM(t.spent)', 'spent')
    .addSelect('SUM(t.points) - SUM(t.spent)', 'balance')
    .groupBy('t.payer')
    .getRawMany<{
      payer: string;
      gain: number;
      spent: number;
      balance: number;
    }>();

  return res;
}

/**
 * Compute the total points, total spent and balance of our special user.
 * @param db
 */
export async function computeTotalBalance(
  db: DataSource | EntityManager,
  targetPayer?: string,
) {
  const pendingTransaction = db
    .createQueryBuilder(Transaction, 't')
    .select('SUM(t.points)', 'totalPoints')
    .addSelect('SUM(t.spent)', 'totalSpent');

  if (targetPayer) {
    pendingTransaction.andWhere('t.payer = :targetPayer', { targetPayer });
  }
  const { totalPoints, totalSpent } = await pendingTransaction.getRawOne<{
    totalPoints: number;
    totalSpent: number;
  }>();

  const balance = totalPoints - totalSpent;

  return { totalPoints, totalSpent, balance };
}
