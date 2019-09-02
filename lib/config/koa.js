import Koa from 'koa';
import conditional from 'koa-conditional-get';
import etag from 'koa-etag';
import staticCache from 'koa-static-cache';
import compress from 'koa-compress';
import errorHandler from 'koa-error';
import bodyParser from 'koa-bodyparser';
import log4js from 'koa-log4';
import {
  assign,
  pick,
  isString
} from 'lodash';

import { getLogger } from '../utils';

import session from './session';
import passport from './passport';

const logger = getLogger(__filename);

function tryParseJson(str) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return str;
  }
}

export default (config) => {
  const app = new Koa();

  app.keys = config.cookie.keys;

  app
    .use(errorHandler())
    .use(log4js.koaLogger(logger, {
      format(ctx, cb) {
        // eslint-disable-next-line no-useless-concat
        const base = cb('[:remote-addr :method :status :url :response-time' + 'ms]')
          .replace('::ffff:', '');
        return `${base} ${JSON.stringify(assign({
          body: isString(ctx.body) ? tryParseJson(ctx.body) : undefined
        }, pick(ctx, [
          'params',
          'query',
          'header',
          'user'
        ]), {
          'request.body': ctx.request.body
        }))}`;
      },
      level: getLogger.levels.TRACE
    }))
    .use(compress({ level: 6 }))
    .use(conditional())
    .use(etag())
    .use(bodyParser())
    .use(session(config, app))
    .use(passport.middleware())
    .use(staticCache(config.dir.frontend, config.static));

  return app;
};
