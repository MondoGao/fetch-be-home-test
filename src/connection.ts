import { DataSource } from 'typeorm';
import {
  DB_DATABASE,
  DB_HOST,
  DB_PASSWORD,
  DB_PORT,
  DB_USERNAME,
} from './config/env';
import { VError } from 'verror';
import { appLogger } from './logger';
import { Transaction, User } from './model/transaction';

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
      // synchronize: IS_DEV,
      synchronize: true,
      bigNumberStrings: false,
      entities: [Transaction, User],
    });

    const connection = await ds.initialize();
    appLogger.info('Database connection established');
    return connection;
  } catch (err) {
    throw new VError(err, 'error connecting to database');
  }
}
