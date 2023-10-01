import * as winston from 'winston';
import { ExpressRoute } from './helper/async';
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
export const loggerMiddleware: ExpressRoute = async (req, res, next) => {
  const msg = `${req.method} ${req.originalUrl}`;
  const reqLogger = appLogger.child({
    label: msg,
  });
  res.locals.logger = reqLogger;
  next();
};
