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
    host: 'localhost',
    port: '27017',
    user: 'root',
    pwd: 'root1234',
    db: 'smartbankserver',
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
    host: 'localhost',
    port: '6379',
    auth: 'root1234',
    db: 1
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
