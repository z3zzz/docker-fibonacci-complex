import { createClient } from 'redis';
import 'dotenv/config';

startRedis();

async function startRedis() {
  const [client, subscriber] = await createRedisConnection();

  subscriber.subscribe('insert', (message, channel) => {
    const index = parseInt(message);
    const fibResult = fibonacci(index);

    client.hSet('values', index, fibResult);
    console.log(`Values added: ${index} -> ${fibResult}`);
  });
}

async function createRedisConnection() {
  const url = process.env.REDIS_URL || 'redis://localhost/'
  const client = createClient({
    url,
    socket: {
      reconnectStrategy: () => 1000,
    },
  });

  client.on('error', (err) => console.log('Redis Client Error', err));
  client.on('connect', () =>
    console.log('Successfully connected Redis: ', url)
  );

  await client.connect();

  const subscriber = client.duplicate();
  await subscriber.connect();

  return [client, subscriber];
}

function fibonacci(index: number): number {
  if (index < 2) return 1;
  return fibonacci(index - 1) + fibonacci(index - 2);
}
