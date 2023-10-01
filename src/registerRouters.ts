import { Application } from 'express';
import { pointRouter } from './controller/point';

export function registerRouter(app: Application) {
  app.use('/', pointRouter);
}
