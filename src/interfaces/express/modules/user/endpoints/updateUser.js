const Status = require('http-status');

const { userIsAdmin, userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  userIsAdmin,
  (req, res, next) => {
    const updateUser = req.container.resolve('updateUser');
    const {
      SUCCESS, ERROR, NOT_FOUND,
    } = updateUser.outputs;

    updateUser
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

    updateUser.execute(req.params.id, req.body);
  },
];
