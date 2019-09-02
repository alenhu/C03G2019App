import path from 'path';
import Promise from 'bluebird';
import log4js from 'log4js';
import moment from 'moment';
import targz from 'targz';
import {
  map,
  groupBy,
  pick,
  isArray,
  isString,
  isObject
} from 'lodash';

import {
  fs,
  getLogger
} from '../utils';

const compress = Promise.promisify(targz.compress);

const ALL_LEVELS = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];

let logDir;
let appName;

function ctxParser(event) {
  let result = '';
  let ctx;
  let params;

  if (event.request) {
    ctx = event.request;
  } else if (isArray(event.data)) {
    event.data.forEach((arg, i) => {
      if (arg && isObject(arg) && isString(arg.originalUrl)) {
        ctx = event.request = arg;
        event.data.splice(i, 1);
      }
    });
  }

  if (ctx) {
    params = pick(ctx, [
      'params',
      'query',
      'body',
      'headers'
    ]);
    params.request = {
      body: ctx.request.body
    };
    if (ctx.user) {
      params.user = ctx.user;
    }

    result = ` [${ctx.ip ? `${ctx.ip.replace('::ffff:', '')} ` : ''}${ctx.method} ${ctx.originalUrl}] ${JSON.stringify(params)}`;
  }

  return result;
}

function configure(config) {
  logDir = config.dir.log;
  appName = config.app.name;

  const appenders = {
    console: {
      type: 'console',
      layout: {
        type: 'pattern',
        pattern: '%[[%d] [%p] [%c]%x{ctx}%] %m',
        tokens: {
          ctx: ctxParser
        }
      }
    }
  };

  ALL_LEVELS.slice(ALL_LEVELS.indexOf(config.log.level.toLowerCase()))
    .forEach((level) => {
      appenders[`_dateFile${level}`] = {
        type: 'dateFile',
        filename: path.join(
          logDir,
          `${appName}-${level}`
        ),
        pattern: '-yyyy-MM-dd.log',
        alwaysIncludePattern: true,
        layout: {
          type: 'pattern',
          pattern: '[%d] [%p] [%c]%x{ctx} %m',
          tokens: {
            ctx: ctxParser
          }
        }
      };
      appenders[level] = {
        type: 'logLevelFilter',
        level: level.toUpperCase(),
        maxLevel: level.toUpperCase(),
        appender: `_dateFile${level}`
      };
    });

  log4js.configure({
    pm2: true,
    categories: {
      default: {
        appenders: map(appenders, (appender, name) => name).filter(name => name[0] != '_'),
        level: config.log.level
      }
    },
    appenders
  });
}

configure.cleanLogs = () => {
  const logger = getLogger(__filename);

  function deleteLogs() {
    // 日志保留6个月
    const keepDate = moment().add(-6, 'month').format('YYYY-MM-DD');

    return fs.readdirAsync(logDir)
      .then((files) => {
        const re = /.*-(20\d\d-\d\d-\d\d)\.log.*/;

        return Promise.all(map(files, (file) => {
          const matches = re.exec(file);
          if (matches != null && matches[1] < keepDate) {
            logger.info(`Logs delete: ${file}`);

            return fs.unlinkAsync(path.join(logDir, file));
          }
          return undefined;
        }));
      })
      .then(() => logger.info(`Logs deleted before ${keepDate}`))
      .catch((err) => {
        logger.error(`Logs delete before ${keepDate} error`, err);
      });
  }

  function zipLogs() {
    // 压缩今天之前的日志
    const today = moment().format('YYYY-MM-DD');

    return fs.readdirAsync(logDir)
      .then((files) => {
        const re = /.*-(20\d\d-\d\d-\d\d)\.log$/;

        files = groupBy(files, (file) => {
          const matches = re.exec(file);
          return matches ? matches[1] : '';
        });

        return Promise.all(map(files, (file, day) => {
          if (day && day < today) {
            logger.info(`Logs compress: ${file.join(' ')}`);

            return compress({
              src: logDir,
              dest: path.join(
                logDir,
                `${appName}-${day}.log.tar.gz`
              ),
              tar: {
                entries: file.slice(0)
              },
              gz: {
                level: 9,
                memLevel: 9
              }
            })
              .then(() => file)
              .map(f => fs.unlinkAsync(path.join(logDir, f)));
          }
          return undefined;
        }));
      })
      .then(() => logger.info(`Logs compressed before ${today}`))
      .catch(err => logger.error(`Logs compress before ${today} error`, err));
  }

  return deleteLogs().then(zipLogs);
};

export default configure;
