const Status = require('http-status');

const { userIsAdmin, userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  userIsAdmin,
  (req, res, next) => {
    const deleteUser = req.container.resolve('deleteUser');
    const { SUCCESS, ERROR, NOT_FOUND } = deleteUser.outputs;

    deleteUser
      .on(SUCCESS, (deleted) => {
        res.status(Status.OK, deleted);
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          message: error.message,
        });
      })
      .on(ERROR, next);

    deleteUser.execute(req.params.id);
  },
];
