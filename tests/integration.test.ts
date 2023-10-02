import { start } from '../src/server';
import * as supertest from 'supertest';
import * as Koa from 'koa';
import * as Bluebird from 'bluebird';

let app: Koa;
let request: ReturnType<typeof supertest>;
beforeAll(async () => {
  app = await start(8001, '127.0.0.1');
  request = supertest(app.callback());
});
it('Integration tests', async () => {
  const addList = [
    { payer: 'DANNON', points: 300, timestamp: '2022-10-31T10:00:00Z' },
    { payer: 'UNILEVER', points: 200, timestamp: '2022-10-31T11:00:00Z' },
    { payer: 'DANNON', points: -200, timestamp: '2022-10-31T15:00:00Z' },
    { payer: 'MILLER COORS', points: 10000, timestamp: '2022-11-01T14:00:00Z' },
    { payer: 'DANNON', points: 1000, timestamp: '2022-11-02T14:00:00Z' },
  ];

  await Bluebird.each(addList, (addData) =>
    request.post('/add').send(addData).expect(200),
  );

  const spendData = { points: 5000 };
  await request.post('/spend').send(spendData).expect(200);
  const balance = await request.get('/balance').expect(200);
  expect(balance.body).toMatchObject({
    DANNON: 1000,
    UNILEVER: 0,
    'MILLER COORS': 5300,
  });
});
