const passport = require('passport');
const BearerStrategy = require('passport-http-bearer').Strategy;

passport.use(new BearerStrategy(
  { passReqToCallback: true },
  (request, token, done) => {
    const checkAuthToken = request.container.resolve('checkAuthToken');
    const {
      SUCCESS, INVALID_TOKEN,
    } = checkAuthToken.outputs;

    checkAuthToken
      .on(SUCCESS, (user) => done(null, user, { scope: 'read' }))
      .on(INVALID_TOKEN, () => done(null, false));
    checkAuthToken.execute(token);
  },
));

module.exports = [
  passport.authenticate('bearer', { session: false }),
];
