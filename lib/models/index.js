import { each } from 'lodash';

import Schedule from './schedule';
import User from './user';

const schemas = {
  Schedule,
  User
};
const models = {};

export default function(modelName) {
  return models && models[modelName];
}

export function setModels(mongooseClient, redisClient) {
  each(schemas, (schema, name) => {
    models[name] = mongooseClient.model(
      name,
      schema(mongooseClient.Schema, redisClient)
    );
  });
}
