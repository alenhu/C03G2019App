import http from 'http';
import https from 'https';
import { isEmpty } from 'lodash';

import config from './lib/config';
import log4js from './lib/config/log4js';
import koa from './lib/config/koa';
// import mongoose from './lib/config/mongoose-client';
import redis from './lib/config/redis-client';

// import { setModels } from './lib/models';

import {
  getLogger,
  upperCamelCase
} from './lib/utils';

// Log4js
log4js(config);
const logger = getLogger(__filename);

// Server
const app = koa(config);

// Mongoose
// const mongooseClient = mongoose(config.mongo);

// Redis
const redisClient = redis(config.redis);

const appName = upperCamelCase(config.app.name);

// Set default node environment to production
process.env.NODE_ENV = process.env.NODE_ENV || 'production';

async function createServer() {
  try {
    await Promise.all([
      config.port.http && new Promise((resolve, reject) => {
        const server = http.createServer(app.callback());
        server.listen(config.port.http, () => {
          logger.info(`${appName} listening on port ${config.port.http}`);
          resolve();
        });
        server.on('error', (err) => {
          reject(err);
        });
      }),
      config.port.https && !isEmpty(config.https) && new Promise((resolve, reject) => {
        const server = https.createServer(config.https, app.callback());
        server.listen(config.port.https, () => {
          logger.info(`${appName} listening on https port ${config.port.https}`);
          resolve();
        });
        server.on('error', (err) => {
          reject(err);
        });
      }),
      // mongooseClient.promise,
      redisClient.promise
    ]);

    // Models
    // setModels(mongooseClient, redisClient);

    // Routes
    (await import('./lib/route')).default(app);

    // Schdules
    // (await import('./lib/schedule')).default(config);

    logger.info(`${upperCamelCase(config.app.name)} start successfully`);

    // 处理未捕获异常
    process.on('uncaughtException', (err) => {
      logger.fatal('uncaughtException', err); // may not printed with pm2
      process.nextTick(() => process.exit(1));
    });
  } catch (err) {
    logger.fatal(`${upperCamelCase(config.app.name)} start failed`, err);
  }

  return app;
}

createServer();
