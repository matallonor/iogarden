const Status = require('http-status');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
  {
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true,
  },
  (request, email, password, done) => {
    const checkAuthCredentials = request.container.resolve('checkAuthCredentials');

    const {
      SUCCESS, ERROR, BAD_EMAIL, BAD_PASSWORD,
    } = checkAuthCredentials.outputs;

    checkAuthCredentials
      .on(SUCCESS, (user) => done(null, user))
      .on(ERROR, (error) => done(error))
      .on(BAD_EMAIL, () => done(null, false, 'Incorrect email'))
      .on(BAD_PASSWORD, () => done(null, false, 'Incorrect password'));

    checkAuthCredentials.execute(email, password);
  },
));

module.exports = [
  passport.authenticate('local', { session: false }),
  (req, res, next) => {
    const generateAuthToken = req.container.resolve('generateAuthToken');
    const { SUCCESS, ERROR } = generateAuthToken.outputs;

    if (!req.user) {
      res.status(Status.UNAUTHORIZED).json({
        type: 'UnauthorizedError',
      });
    } else if (req.user.role === 'admin') {
      res.status(Status.FORBIDDEN).json({
        type: 'ForbiddenError',
      });
    }

    generateAuthToken
      .on(SUCCESS, (token) => {
        res.status(Status.OK).json({ token, user: req.user });
      })
      .on(ERROR, next);

    generateAuthToken.execute(req.user.id);
  },
];
