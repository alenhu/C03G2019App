import Router from 'koa-router';
import { format } from 'util';
import {
  each,
  merge,
  isArray,
  isFunction
} from 'lodash';

import { getLogger } from '../utils';

import middlewares from './middlewares';

import exampleRoutes from './example';

const logger = getLogger(__filename);

const apiV1Params = {
  params: middlewares.parseParams
};

const apiV1Routes = merge(exampleRoutes);

const apiV1Router = new Router();

function configApiRoutes(router, apiRoutes) {
  each(apiRoutes, (routes, path) => {
    const errMsg = '路由配置错误, path: %s, method: %s';
    each(routes, (ctrl, method) => {
      let routerParams;

      if (/auth|action/.test(method)) {
        return;
      }

      const currentRoute = isFunction(ctrl) || isArray(ctrl) ? {
        ctrl
      } : ctrl;

      try {
        currentRoute.method = method;

        routerParams = [
          path,
          middlewares.setRouteOfContext(currentRoute)
        ];

        // 权限
        if (routes.auth != null && currentRoute.auth == null) {
          currentRoute.auth = routes.auth;
        }

        if (isArray(currentRoute.ctrl)) {
          currentRoute.ctrl.forEach((ctrlFn) => {
            if (isFunction(ctrlFn)) {
              routerParams.push(ctrlFn);
            } else {
              throw new Error('ctrl is not a function');
            }
          });
        } else if (isFunction(currentRoute.ctrl)) { // 执行这个
          routerParams.push(currentRoute.ctrl);
        } else {
          throw new Error('ctrl is not a function');
        }
        router[method](...routerParams);
      } catch (e) {
        logger.error(format(errMsg, path, method), e);
      }
    });
  });
}

apiV1Router
  .use(
    middlewares.handleError,
    middlewares.setNoCacheControl
  );

each(apiV1Params, (middleware, param) => apiV1Router.param(param, middleware));

configApiRoutes(apiV1Router, apiV1Routes);

export default apiV1Router;
