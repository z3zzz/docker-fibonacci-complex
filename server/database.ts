import { createClient } from 'redis';
import { Pool } from 'pg';
import 'dotenv/config';

async function startRedis() {
  const [client, publisher] = await createRedisConnection();

  publisher.subscribe('insert', (message, channel) => {
    const index = parseInt(message);
    const fibResult = fibonacci(index);

    client.hSet('values', index, fibResult);
    console.log(`Values added: ${index} -> ${fibResult}`);
  });

  return [client, publisher];
}

async function createRedisConnection() {
  const url = process.env.REDIS_URL || 'redis://localhost/';

  const client = createClient({
    url,
    socket: {
      reconnectStrategy: () => 1000,
    },
  });

  client.on('error', (err) =>
    console.log('Error on connection Redis: ', err.stack)
  );
  client.on('connect', () =>
    console.log('Successfully connected Redis: ', url)
  );

  await client.connect();

  const duplicateClient = client.duplicate();
  await duplicateClient.connect();

  // duplicateClient can be either subscriber or publisher
  return [client, duplicateClient];
}

async function startPsql() {
  const pool = await createPsqlConnection();
  const query = 'CREATE TABLE IF NOT EXISTS values (number INT)';

  try {
    pool.query(query);
  } catch (err: any) {
    console.log('There was an error for the query: ', query);
    console.log(err.stack);
  }

  return pool;
}

async function createPsqlConnection() {
  const url =
    process.env.PSQL_URL ||
    'postgresql://postgres:1234@localhost:5432/postgres';

  const pool = new Pool({
    connectionString: url,
  });

  pool.connect((err: Error) => {
    if (err) {
      console.log('Error on connecting PSQL: ', err.stack);
    } else {
      console.log('Successfully connected on PSQL: ', url);
    }
  });

  return pool;
}

function fibonacci(index: number): number {
  if (index < 2) return 1;
  return fibonacci(index - 1) + fibonacci(index - 2);
}

export { startPsql, startRedis };
