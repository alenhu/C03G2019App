import session from 'koa-session';
import redisStore from 'koa-redis';

// import MongoStore from 'koa-generic-session-mongo';

export default (config, app) => session({
  key: config.app.name,
  prefix: config.cookie.prefix,
  maxAge: config.cookie.expire,
  secure: config.cookie.secure,
  store: redisStore({
    host: config.redis.host,
    port: config.redis.port,
    auth_pass: config.redis.auth,
    db: config.cookie.db
  })
  // store: new MongoStore({
  //   host: config.mongo.host,
  //   port: config.mongo.port,
  //   user: config.mongo.user,
  //   password: config.mongo.pwd,
  //   db: config.cookie.db
  // })
}, app);
