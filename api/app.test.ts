import { app } from './app';
import { closeRedisConnection } from './database';

describe('api server test', () => {
  afterAll(async () => {
    await closeRedisConnection();
  });

  it('Get / - sends greeting message in json', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/',
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(200);
    expect(body.greeting).toMatch(/Hi! It works!/i);
  });

  it('POST /values - sends {working: true} in json', async () => {
    const res = await app.inject({
      method: 'POST',
      url: '/values',
      payload: { index: 5 },
    });

    const body = JSON.parse(res.body);

    expect(res.statusCode).toBe(201);
    expect(body.working).toBe(true);
  });

  it('GET /values - sends [{index: "5", value: 8}] in json array', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/values',
    });

    const body = JSON.parse(res.body);
    const expectedObj = expect.objectContaining({ index: '5', value: 8 });
    const expectedArray = expect.arrayContaining([expectedObj]);

    expect(res.statusCode).toBe(200);
    expect(body).toEqual(expectedArray);
  });

  it('GET /indexes - sends [5] in json array', async () => {
    const res = await app.inject({
      method: 'GET',
      url: '/indexes',
    });

    const body = JSON.parse(res.body);
    const expectedArray = expect.arrayContaining([5]);

    expect(res.statusCode).toBe(200);
    expect(body).toEqual(expectedArray);
  });
});
