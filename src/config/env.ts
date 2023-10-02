import 'dotenv/config';

export const PORT = process.env.PORT || '8000';
export const DB_HOST = process.env.DB_HOST || 'localhost';
export const DB_PORT = parseInt(process.env.DB_PORT || '3306', 10);
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;
export const DB_DATABASE = process.env.DB_DATABASE || 'fetch';

export const IS_DEV = process.env.NODE_ENV === 'development';
