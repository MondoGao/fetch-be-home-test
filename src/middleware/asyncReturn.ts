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
    if (typeof ctx.body === 'undefined' && typeof res !== 'undefined') {
      ctx.body = res;
    }
    if (typeof ctx.body === 'undefined' && typeof res === 'undefined') {
      ctx.state = '404';
      ctx.body = '404 Not Found';
    }
  } catch (err) {
    ctx.logger.error(err);
    if (!ctx.body) {
      ctx.body = err?.message ?? String(err);
    }
    if (err.message.includes("the user doesn’t have enough points")) {
      ctx.status = 400;
    }
    // if (ctx.status === 200) {
    // }
  }
};
