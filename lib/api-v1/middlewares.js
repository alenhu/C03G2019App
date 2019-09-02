import {
  getLogger,
  getErrorHandler,
  parseJson
} from '../utils';

const logger = getLogger(__filename);
const handleError = getErrorHandler(logger);

export default {
  async parseParams(params, ctx, next) {
    if (params) {
      logger.debug(ctx.path, ctx.params = parseJson(params));
    }
    await next();
  },

  async handleError(ctx, next) {
    try {
      await next();
    } catch (e) {
      handleError('服务器错误', e, ctx);
    }
  },

  /**
   * 在当前上下文中保存路由对象
   */
  setRouteOfContext(currentRoute) {
    return async function(ctx, next) {
      ctx.route = currentRoute;
      await next();
    };
  },

  /**
   * 禁用响应缓存
   */
  async setNoCacheControl(ctx, next) {
    ctx.set({
      'Cache-Control': 'no-cache,no-store,max-age=0,must-revalidate',
      Pragma: 'no-cache',
      Expires: 0
    });
    await next();
  }
};
