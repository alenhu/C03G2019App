import redis from 'redis';
import coRedis from 'co-redis';

import { getLogger } from '../utils';

const logger = getLogger(__filename);

export default (config) => {
  const client = coRedis(redis.createClient(config.port, config.host));

  client.promise = new Promise((resolve, reject) => {
    config.auth && client.auth(config.auth, (err) => {
      err && reject(err);
    });

    client.on('ready', () => {
      logger.info(`Redis ready on ${config.host}:${config.port}`);
      resolve(client);
    });

    client.on('connect', () => {
      const db = config.db || 0;
      logger.info(`Redis connected db${db}`);
      if (db) {
        client.send_anyways = true;
        client.select(db);
        client.send_anyways = false;
      }
    });

    client.on('reconnecting', () => logger.warn('Redis reconnecting'));

    client.on('error', err => logger.fatal('Redis error', err));
  });

  return client;
};
