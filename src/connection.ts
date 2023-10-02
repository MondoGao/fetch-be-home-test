import { DataSource } from 'typeorm';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
  IS_DEV,
} from './config/env';
import { VError } from 'verror';
import { appLogger } from './logger';
import { Transaction } from './model/transaction';

/**
 * Create connection to database.
 */
export async function createConnection() {
  try {
    const ds = new DataSource({
      type: 'mysql',
      host: DB_HOST,
      port: DB_PORT,
      username: DB_USERNAME,
      password: DB_PASSWORD,
      database: DB_DATABASE,
      synchronize: IS_DEV,
      entities: [Transaction],
    });

    const connection = await ds.initialize();
    appLogger.info('Database connection established');
    return connection;
  } catch (err) {
    throw new VError(err, 'error connecting to database');
  }
}
