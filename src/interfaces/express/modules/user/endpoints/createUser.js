const Status = require('http-status');

const { userIsAdmin, userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  userIsAdmin,
  (req, res, next) => {
    const createUser = req.container.resolve('createUser');
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, CONFLICT,
    } = createUser.outputs;

    createUser
      .on(SUCCESS, (user) => {
        res.status(Status.OK).json({ user });
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          message: error.message,
        });
      })
      .on(CONFLICT, (error) => {
        res.status(Status.CONFLICT).json({
          type: 'AlreadyExist',
          message: error.message,
        });
      })
      .on(ERROR, next);

    createUser.execute(req.body);
  },
];
