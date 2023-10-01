import { Middleware } from 'koa';

/**
 * Automatically set request body and status for controllers. This should
 * always be the last middleware before router middlewares to capture return
 * value from controllers.
 * @param ctx
 * @param next
 */
export const asyncReturnMiddleware: Middleware = async (ctx, next) => {
  try {
    const res = await next();
    if (!ctx.body && res) {
      ctx.body = res;
    }
    if (!ctx.body && !res) {
      ctx.state = '404';
      ctx.body = '404 Not Found';
    }
  } catch (err) {
    ctx.logger.error(err);
    if (!ctx.body) {
      ctx.status = 500;
      ctx.body = String(err);
    }
  }
};
