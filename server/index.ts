import Fastify, {
  FastifyInstance,
  FastifyPluginOptions,
  RouteShorthandOptions,
} from 'fastify';
import { startPsql, startRedis } from './database';

const app = Fastify({
  logger: true,
});

app.register(routes);

app.listen({ port: 5000, host: '0.0.0.0' }, (err, url) => {
  if (err) {
    app.log.error(err);
    process.exit(1);
  }
});

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

  opts['va'] = {
    schema: {
      response: {
        200: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              number: { type: 'number' },
            },
          },
        },
      },
    },
  };

  app.get('/values/all', opts['va'], async (req, res) => {
    try {
      const { rows: values } = await psql.query('SELECT * from values');

      console.log({ values });
      return values;
    } catch (err: any) {
      throw err;
    }
  });

  opts['vc'] = {
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

  app.get('/values/current', opts['vc'], async (req, res) => {
    try {
      const values = await redis.hGetAll('values');

      return values;
    } catch (err: any) {
      throw err;
    }
  });

  opts['v'] = {
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

  app.post<reqType>('/values', opts['v'], async (req, res) => {
    const index = req.body.index;

    if (index > 40) {
      res.code(422);
      throw new Error('Index too high, should be lower than 40');
    }

    redis.hSet('values', index, 'Nothing yet!');
    publisher.publish('insert', `${index}`);

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