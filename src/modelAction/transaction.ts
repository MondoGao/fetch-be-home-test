import { Transaction } from '../model/transaction';
import { DataSource, EntityManager } from 'typeorm';

/**
 * Add points to the user.
 * @param db
 * @param payer
 * @param points
 * @param timestamp
 */
export async function addPoints(
  db: DataSource | EntityManager,
  payer: string,
  points: number,
  timestamp: string,
) {
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
) {
  // do spend action
  const spendResult = await db.transaction(async (manager) => {
    const transactionInses = await manager
      .createQueryBuilder(Transaction, 't')
      .orderBy('transaction.timestamp', 'ASC')
      .where('t.points - t.spent > 0')
      .getMany();
    // record the spent points for each payer
    const spendResult: Record<string, number> = {};

    transactionInses.reduce((leftRequestPoints, transactionIns) => {
      const leftPoints = transactionIns.points - transactionIns.spent;
      const currentSpent = Math.min(leftPoints, requestPoints);
      transactionIns.spent += currentSpent;
      if (spendResult[transactionIns.payer]) {
        spendResult[transactionIns.payer] = 0;
      }
      spendResult[transactionIns.payer] += currentSpent;

      return leftRequestPoints - currentSpent;
    }, requestPoints);

    await manager.save(transactionInses);
    return spendResult;
  });
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
    .getRawMany<{ payer: string; gain: number; spent: number; balance: number }>();

  return res;
}

/**
 * Compute the total points, total spent and balance of our special user.
 * @param db
 */
export async function computeTotalBalance(db: DataSource | EntityManager) {
  const { totalPoints, totalSpent } = await db
    .createQueryBuilder(Transaction, 't')
    .select('SUM(t.points)', 'totalPoints')
    .addSelect('SUM(t.spent)', 'totalSpent')
    .getRawOne<{ totalPoints: number; totalSpent: number }>();

  const balance = totalPoints - totalSpent;

  return { totalPoints, totalSpent, balance };
}
