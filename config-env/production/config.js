import { resolve } from 'path';
import ReadPreference from 'mongodb/lib/core/topologies/read_preference';


const { env } = process;

export default {
  port: {
    http: 7009,
    https: 7109
  },
  https: {
    pfx: '',
    passphrase: ''
  },
  mongo: {
    user: env.MONGO_USER || '',
    pwd: env.MONGO_PWD || '',
    replset: [
      {
        host: env.MONGO_PRIMARY_HOST || 'localhost',
        port: env.MONGO_PRIMARY_PORT || '27017'
      },
      {
        host: env.MONGO_SECONDARY_HOST || 'localhost',
        port: env.MONGO_SECONDARY_PORT || '27018'
      }
    ],
    db: 'smartbankserver',
    options: {
      server: {
        reconnectTries: Number.MAX_VALUE
      },
      replset: {
        replicaSet: env.MONGO_REPLSET || 'rs0',
        poolSize: 10,
        socketOptions: {
          connectTimeoutMS: 30000,
          socketTimeoutMS: 360000
        }
      },
      db: {
        readPreference: ReadPreference.SECONDARY_PREFERRED
      }
    }
  },
  redis: {
    host: env.REDIS_HOST || 'localhost',
    port: env.REDIS_PORT || '6379',
    auth: env.REDIS_AUTH || 'root1234',
    db: 0
  },
  cookie: {
    secure: false, // cookie secure 属性
    db: 1
  },
  log: {
    level: 'TRACE'
  },
  static: {
    maxAge: 365 * 24 * 60 * 60
  },
  dir: {
    root: resolve(__dirname, '../')
  }
};
