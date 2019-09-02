import fs from 'fs';
import Promise from 'bluebird';
import { transform } from 'lodash';

// 同时使用 co 与 bluebird 会导致 bluebird 警告
// https://github.com/tj/co/pull/256#issuecomment-168475913
Promise.config({
  warnings: false
});

export default transform({
  fs
}, (result, value, key) => {
  result[key] = Promise.promisifyAll(value);
});
