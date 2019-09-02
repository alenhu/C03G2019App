import {
  assign,
  get,
  pick,
  keys
} from 'lodash';

const strategies = {};

function PassportError(msg) {
  const _this = this;
  Error.call(_this);
  _this.stack = new Error().stack;
  _this.message = msg;
}

assign(PassportError.prototype = Object.create(Error.prototype), {
  constructor: Error,
  name: 'PassportError'
});

const passport = {
  field: 'user',
  sessionField: 'user',
  async login(type, ctx) {
    const user = await strategies[type](assign(
      {},
      get(ctx, 'request.body'),
      ctx.query,
      ctx.params
    ), ctx);
    if (!keys(user).length) {
      throw new PassportError('Can not resolve user');
    }
    if (typeof passport._serializeUser != 'function') {
      throw new PassportError('"passport.serializeUser" not valid');
    }
    const serializedUser = await passport._serializeUser(user);
    ctx.session[passport.sessionField] = serializedUser;
    ctx[passport.field] = user;
    return user;
  },
  async logout(ctx) {
    ctx.session[passport.sessionField] = ctx[passport.field] = undefined;
  },
  middleware(config) {
    assign(passport, pick(config, [
      'field',
      'sessionField'
    ]));
    return async function(ctx, next) {
      const userSession = ctx.session && ctx.session[passport.sessionField];
      if (userSession) {
        if (typeof passport._deserializeUser != 'function') {
          throw new PassportError('"passport.deserializeUser" not valid');
        }
        const user = await passport._deserializeUser(userSession);
        keys(user).length && (ctx[passport.field] = user);
      }
      await next();
    };
  },
  use(type, strategy) {
    strategies[type] = strategy;
  },
  serializeUser(serializeUserFunction) {
    passport._serializeUser = serializeUserFunction;
  },
  deserializeUser(deserializeUserFunction) {
    passport._deserializeUser = deserializeUserFunction;
  },
  PassportError
};

export default passport;
