import * as express from 'express';
import * as bodyParser from 'body-parser';
import { PORT } from './config/env';
import { registerRouter } from './registerRouters';
import { appLogger, loggerMiddleware } from './logger';

async function start(port: number, hostname = '0.0.0.0') {
  return new Promise((resolve, reject) => {
    const app = express();
    app.on('error', reject);

    app.use(bodyParser.json());
    app.use(loggerMiddleware)

    registerRouter(app);

    app.listen(port, hostname, null, () => {
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
