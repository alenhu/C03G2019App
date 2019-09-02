import { networkInterfaces } from 'os';
import {
  map,
  flatten,
  values
} from 'lodash';
import app from '../package.json';

export default {
  dir: {
    log: 'logs',
    frontend: 'app'
  },
  cookie: {
    keys: [
      'APdtVf2BKugFEPO0gWQgaT0GmbWge10ZvUnRAMgBLU',
      'JRhNhZ5ru9wNY1BEqtmvfClL2zxyIr7To12k5bySm8'
    ],
    expire: 60000 * 60 * 24 * 30,
    prefix: 's:'
  },
  ips: map(
    flatten(values(networkInterfaces()))
      .filter(i => !i.internal && i.family == 'IPv4'),
    'address'
  ),
  app
};
