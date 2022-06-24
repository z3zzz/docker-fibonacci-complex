const { createClient } = require('redis');

const getRedisClient = async () => {
  const client = createClient({
    url: process.env.REDIS_URL,
  });

  client.on('error', (err) => console.log('Redis Client Error', err));
  await client.connect();

  return client;
};

let redisClient;
app.get('/', async (req, res) => {
  try {
    if (!redisClient) {
      redisClient = await getRedisClient();
    }

    const visits = (await redisClient.get('visits')) || 1;

    res.send(`Number of visits: ${visits}`);

    await redisClient.set('visits', parseInt(visits) + 1);
  } catch (e) {
    res.send(`There was an error: ${e}`);
  }
});

app.listen('5000', () => {
  console.log(
    'app listening on http://ec2-52-79-62-94.ap-northeast-2.compute.amazonaws.com:5000'
  );
});
