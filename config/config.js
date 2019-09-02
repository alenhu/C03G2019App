import { resolve } from 'path';

export default {
  port: {
    http: 7009,
    https: 7109
  },
  https: {
    pfx: undefined,
    passphrase: undefined
  },
  mongo: {
    host: '192.168.66.20',
    port: '27017',
    user: 'root',
    pwd: 'root1234',
    db: 'smartClass',
    options: {
      server: {
        poolSize: 1,
        socketOptions: {
          connectTimeoutMS: 30000,
          socketTimeoutMS: 360000
        }
      }
    }
  },
  redis: {
    host: '192.168.1.180',
    port: '6379',
    auth: 'root1234',
    db: 10
  },
  cookie: {
    secure: false, // cookie secure 属性
    db: 10
  },
  log: {
    level: 'TRACE'
  },
  static: {
    maxAge: 0
  },
  dir: {
    root: resolve(__dirname, '../')
  }
};
