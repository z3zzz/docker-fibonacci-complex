import Fastify, {
  FastifyInstance,
  FastifyPluginOptions,
  RouteShorthandOptions,
} from 'fastify';
import cors from '@fastify/cors';
import { startPsql, startRedis } from './database';

export const app = Fastify({
  logger: true,
});

app.register(cors, {
  origin: ['http://localhost:3000', /ec2-52-79-62-94\.ap-northeast-2/],
});
app.register(routes);

async function routes(app: FastifyInstance, options: FastifyPluginOptions) {
  const psql = await startPsql();
  const [redis, publisher] = await startRedis();
  const opts: { [keys: string]: RouteShorthandOptions } = {};

  opts['/'] = {
    schema: {
      response: {
        200: {
          type: 'object',
          properties: {
            greeting: { type: 'string' },
          },
        },
      },
    },
  };

  app.get('/', opts['/'], async (req, res) => {
    return { greeting: 'Hi! It works!' };
  });

  opts['i'] = {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'integer',
          },
        },
      },
    },
  };

  app.get('/indexes', opts['i'], async (req, res) => {
    try {
      const { rows } = await psql.query('SELECT * from values');

      const values = rows.map(({ number }) => number);

      return values;
    } catch (err: any) {
      throw err;
    }
  });

  opts['gv'] = {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              index: { type: 'string' },
              value: { type: 'number' },
            },
          },
        },
      },
    },
  };

  app.get('/values', opts['gv'], async (req, res) => {
    try {
      const keyValueMap = await redis.hGetAll('values');

      const values = [];

      for (const [key, value] of Object.entries(keyValueMap)) {
        const valueNumber = parseInt(value);
        const isNan = Number.isNaN(valueNumber);

        if (!isNan) {
          values.push({ index: key, value: valueNumber });
        }
      }

      return values;
    } catch (err: any) {
      throw err;
    }
  });

  opts['pv'] = {
    schema: {
      body: {
        type: 'object',
        properties: {
          index: { type: 'integer' },
        },
      },
      response: {
        201: {
          type: 'object',
          properties: {
            working: { type: 'boolean' },
          },
        },
      },
    },
  };

  interface reqType {
    Body: {
      index: number;
    };
  }

  app.post<reqType>('/values', opts['pv'], async (req, res) => {
    const index = req.body.index;

    if (index > 40) {
      res.code(422);
      throw new Error('Index too high, should be lower than 40');
    }

    await redis.hSet('values', index, 'Nothing yet!');

    await publisher.sendCommand(['publish', 'insert', `${index}`]);

    await psql.query(`INSERT INTO values (number) VALUES (${index})`);

    res.code(201);
    return { working: true };
  });

  opts['t'] = {
    schema: {
      response: {
        200: {
          type: 'object',
          patternProperties: {
            '[0-9]+': { type: 'string' },
          },
        },
      },
    },
  };

  app.get('/temp', opts['t'], async (req, res) => {
    res.code(422);
    throw new Error('Index too high, should be lower than 40');
  });
}
