const Status = require('http-status');

const { userIsAdmin, userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  userIsAdmin,
  (req, res, next) => {
    const getAllUsers = req.container.resolve('getAllUsers');
    const { SUCCESS, ERROR } = getAllUsers.outputs;

    getAllUsers
      .on(SUCCESS, (users, info) => {
        res.status(Status.OK).json({
          users,
          info,
        });
      })
      .on(ERROR, next);

    getAllUsers.execute(req.query);
  },
];
