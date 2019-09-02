import path from 'path';
import log4js from 'log4js';

function logger(filename) {
  let extIndex;
  if (filename) {
    extIndex = filename.lastIndexOf('.');
    if (extIndex > -1) {
      filename = filename.substr(0, extIndex);
    }
  }
  return log4js.getLogger(filename && path.relative('./', filename).replace(path.sep == '/' ? /\//g : /\\/g, '/'));
}

logger.levels = log4js.levels;

export default logger;
