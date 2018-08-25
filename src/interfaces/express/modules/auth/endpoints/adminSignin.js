const Status = require('http-status');
const passport = require('passport');

module.exports = [
  passport.authenticate('local', { session: false }),
  (req, res, next) => {
    const generateAuthToken = req.container.resolve('generateAuthToken');
    const { SUCCESS, ERROR } = generateAuthToken.outputs;

    if (!req.user) {
      res.status(Status.UNAUTHORIZED).json({
        type: 'UnauthorizedError',
      });
    } else if (req.user.role !== 'admin') {
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
