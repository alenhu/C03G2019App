import {
  each,
  isString,
  isNumber,
  isObject
} from 'lodash';

import getLogger from './logger';

const logger = getLogger(__filename);

export default (errorLogger) => {
  errorLogger = errorLogger || logger;

  function generateHandler(level) {
    return function(...args) {
      const msgs = [];
      const errs = [];

      let ctx;
      let status = 500;

      each(args, (arg) => {
        if (isString(arg)) {
          msgs.push(arg);
        } else if (isNumber(arg)) {
          status = arg;
        } else if (arg != null && isObject(arg)) {
          if (arg.originalUrl) {
            ctx = arg;
          }
          errs.push(arg);
        }
      });

      status = status || 500;

      if (errs.length) {
        msgs.push('\n');
      }

      errorLogger[level](...msgs.concat(errs));

      if (ctx) {
        ctx.status = status;
        ctx.body = msgs[0] && { message: msgs[0] };
      }
    };
  }

  const errorHandler = generateHandler('error');
  each([
    'debug',
    'info',
    'warn'
  ], (level) => {
    errorHandler[level] = generateHandler(level);
  });
  return errorHandler;
};
