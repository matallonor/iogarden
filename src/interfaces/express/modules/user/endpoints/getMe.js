const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const getUser = req.container.resolve('getUser');
    const { SUCCESS, ERROR, NOT_FOUND } = getUser.outputs;

    getUser
      .on(SUCCESS, (user) => {
        res.status(Status.OK).json({ user });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          message: error.message,
        });
      })
      .on(ERROR, next);

    getUser.execute(req.user.id);
  },
];
