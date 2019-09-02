import Model from '../models';

import { passport } from '../utils';

const { PassportError } = passport;

passport.serializeUser(user => Promise.resolve(user ? user.id : undefined));

passport.deserializeUser(sess => sess && Model('User').findById(sess));

// add local strategies for more authentication flexibility
passport.use('local', async(params) => {
  params;
  throw new PassportError('Passport config didn\'t exists');
});

export default passport;
