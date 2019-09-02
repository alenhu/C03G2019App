import mongoose from 'mongoose';
import { isString } from 'lodash';

import { getLogger } from '../utils';

// const { ObjectId } = mongoose.Types;

const logger = getLogger(__filename);

mongoose.Promise = Promise;

function virtualIdSetter(schema) {
  schema
    .virtual('id')
    .set(function(id) {
      if (!this._id) {
        this._id = id;
      }
    });
  return schema;
}

export default (config) => {
  let connStr = 'mongodb://';
  let hostInfo;
  if (config.user) {
    connStr += config.user;
    if (config.pwd) {
      connStr += `:${config.pwd}`;
    }
    connStr += '@';
  }
  if (config.replset) {
    hostInfo = config.replset.map(host => `${host.host}:${host.port}`).join(',');
  } else {
    hostInfo = `${config.host}:${config.port}`;
  }
  connStr += `${hostInfo}/${config.db}`;
  logger.info('mongo connetc ', connStr);
  const client = mongoose.createConnection(connStr, config.options);
  // 包装原始 Schema 类
  client.Schema = function(...args) {
    // const schema = args[0];
    // schema._id = schema._id || { type: String, default: () => ObjectId() };
    client.base.Schema.apply(this, args);
  };
  client.Schema.prototype = new client.base.Schema();
  client.Schema.Types = client.base.Schema.Types;

  // 包装原始 model 方法
  client.__model = client.model;
  client.model = function(collectionName, schema) {
    collectionName += 's';
    if (!schema) {
      return client.__model.call(this, isString(collectionName) ? collectionName : virtualIdSetter(collectionName));
    }

    schema.options = schema.options || {};
    schema.options.collection = collectionName.toLowerCase();

    return client.__model.call(this, collectionName, virtualIdSetter(schema));
  };
  client.promise = new Promise((resolve, reject) => {
    client.once('open', () => {
      logger.info(`MongoDB open on ${hostInfo}`);
      resolve(client);
    });

    client.on('error', (err) => {
      logger.fatal('MongoDB error', err);
      reject(err);
    });

    client.on('connected', () => logger.info('MongoDB connected'));

    client.on('reconnected', () => logger.warn('MongoDB reconnected'));

    client.on('disconnected', () => logger.fatal('MongoDB disconnected'));
  });

  return client;
};
