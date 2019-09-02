import schedule from 'node-schedule';
import moment from 'moment';
import { camelCase } from 'lodash';

import config from '../config';
import Model from '../models';
import { getLogger } from '../utils';

const logger = getLogger(__filename);

const Schedule = Model('Schedule');

const appName = config.app.name;

async function run(name, job) {
  try {
    // 保证每次仅有一个进程在执行同一个任务
    const numberAffected = await Schedule.update({
      _id: name,
      executed_at: { $lte: +moment().add(-2, 'm') }
    }, {
      $set: { executed_at: +moment() }
    }, {
      multi: true
    });
    if (numberAffected && numberAffected.n) {
      logger.info(`Schedule ${name} start`);
      await job();
      logger.info(`Schedule ${name} finished`);
    } else {
      logger.debug(`Schedule ${name} already executed`);
    }
  } catch (err) {
    logger.error(`Schedule ${name} error`, err);
  }
}

export default async function scheduleJob(cronStr, name, job) {
  name = camelCase(`${appName} ${name}`);

  try {
    // 如果任务不存在则新建
    let s = await Schedule.findById(name);
    if (!s) {
      s = await new Schedule({ _id: name }).save();
    }

    schedule.scheduleJob(cronStr, () => run(name, job));
    logger.debug(`Schedule ${name} created`);
  } catch (err) {
    logger.error(`Schedule ${name} create error`, err);
  }
}
