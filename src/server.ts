import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';

import { PORT } from './config/env';
import { registerRouters } from './registerRouters';
import { appLogger, loggerMiddleware } from './logger';
import { asyncReturnMiddleware } from './middleware/asyncReturn';
import { createConnection } from './connection';

async function start(port: number, hostname = '0.0.0.0'): Promise<Koa> {
  try {
    const app = new Koa();
    const db = await createConnection();
    app.context.db = db;

    app.use(loggerMiddleware);
    app.use(bodyParser());
    app.use(asyncReturnMiddleware);

    registerRouters(app);

    app.listen(port, hostname, () => {
      appLogger.info(`Server started on http://${hostname}:${port}`);
      if (hostname === '0.0.0.0') {
        appLogger.info(`Local entrypoint: http://127.0.0.1:${port}`);
      }
    });

    return app;
  } catch (err) {
    appLogger.error(err);
    process.exit(1);
  }
}

if (require.main === module) {
  start(parseInt(PORT, 10));
}

declare module 'koa' {
  interface DefaultContext {
    db: Awaited<ReturnType<typeof createConnection>>;
  }
}
