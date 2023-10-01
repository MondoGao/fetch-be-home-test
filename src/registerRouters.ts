import * as Koa from 'koa';
import * as Router from '@koa/router';

import { pointRouter } from './controller/point';

export function registerRouter(app: Koa, router: Router) {
  app.use(router.routes());
  app.use(router.allowedMethods());
}

/**
 * Register all routers.
 * @param app
 */
export function registerRouters(app: Koa) {
  registerRouter(app, pointRouter);
}
