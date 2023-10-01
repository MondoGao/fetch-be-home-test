import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';

import { PORT } from './config/env';
import { registerRouters } from './registerRouters';
import { appLogger, loggerMiddleware } from './logger';
import { asyncReturnMiddleware } from './middleware/asyncReturn';

async function start(port: number, hostname = '0.0.0.0'): Promise<Koa> {
  return new Promise((resolve, reject) => {
    const app = new Koa();
    app.on('error', reject);

    app.use(loggerMiddleware);
    app.use(bodyParser());
    app.use(asyncReturnMiddleware);

    registerRouters(app);

    app.listen(port, hostname, () => {
      appLogger.info(`Server started on http://${hostname}:${port}`);
      if (hostname === '0.0.0.0') {
        appLogger.info(`Local entrypoint: http://127.0.0.1:${port}`);
      }
      resolve(app);
    });
  });
}

if (require.main === module) {
  start(parseInt(PORT, 10));
}
