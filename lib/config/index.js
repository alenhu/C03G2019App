import { join } from 'path';
import {
  merge,
  transform
} from 'lodash';

import base from '../../config/base';
import env from '../../config/config';

export default merge(base, env, {
  dir: transform(base.dir, (result, value, key) => {
    result[key] = join(env.dir.root, value);
  })
});
