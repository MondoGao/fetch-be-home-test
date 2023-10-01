import * as winston from 'winston';
import { Middleware } from 'koa';
const { combine, printf, timestamp } = winston.format;

const reqFormat = printf(({ level, message, label = 'server', timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

export const appLogger = winston.createLogger({
  level: 'info',
  format: combine(timestamp(), reqFormat),
  transports: [
    new winston.transports.File({ filename: 'logs/log.log', level: 'info' }),
    new winston.transports.Console(),
  ],
});
export const loggerMiddleware: Middleware = async (ctx, next) => {
  const { req } = ctx;

  const start = Date.now();
  const msg = `${req.method} ${req.url}`;
  const reqLogger = appLogger.child({
    label: msg,
  });
  ctx.logger = reqLogger;
  await next();
  const ms = Date.now() - start;
  appLogger.info(`${msg} - ${ms}ms`);
};

declare module 'koa' {
  interface DefaultContext {
    logger: winston.Logger;
  }
}
