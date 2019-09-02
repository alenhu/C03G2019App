import Router from 'koa-router';

import html from './services/html';

import apiV1Router from './api-v1';

export default (app) => {
  const base = new Router();

  base
    .use('/api/v1', apiV1Router.routes(), apiV1Router.allowedMethods());

  base.all('*', html);

  app
    .use(base.routes())
    .use(base.allowedMethods());
};
