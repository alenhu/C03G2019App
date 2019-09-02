import _ from 'lodash';
import promisified from './promisified';
import getErrorHandler from './errorhandler';
import getLogger from './logger';
import passport from './passport';

const logger = getLogger(__filename);
const {
  fs
} = promisified;

export {
  fs,
  getErrorHandler,
  getLogger,
  passport
};

export function parseJson(json) {
  let obj;
  try {
    obj = JSON.parse(json);
  } catch (e) {
    logger.error('JSON parse error', e);
  }
  return obj || {};
}

export function pickNotNull(...args) {
  return _.transform(_.pick(...args), (result, value, key) => {
    value != null && (result[key] = value);
  });
}

export function upperCamelCase(string) {
  const firstLetter = string.substr(0, 1).toUpperCase();
  return firstLetter + _.camelCase(string.substr(1));
}

export function toRegExp(str, flags) {
  return new RegExp(_.trim(str).replace(
    /([\\/*.+&^[\](){}|?=!])/g,
    '\\$1'
  ), flags);
}

export function getClientIp(ctx) {
  let ip = ctx.headers['x-forwarded-for'] ||// 是否有反向代理IP(头信息：x-forwarded-for
      (ctx.connection && ctx.connection.remoteAddress) ||// 判断connection的远程IP
      (ctx.socket && ctx.socket.remoteAddress) ||// 判断socketIP
      (ctx.connection && ctx.connection.socket &&
        ctx.connection.socket.remoteAddress);
  if (_.isArray(ip)) {
    ip = _.last(ip);
  }
  return ip || '';
}
