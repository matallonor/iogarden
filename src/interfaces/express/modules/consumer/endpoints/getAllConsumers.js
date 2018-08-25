const Status = require('http-status');

const { userIsAdmin, userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  userIsAdmin,
  (req, res, next) => {
    const getAllConsumers = req.container.resolve('getAllConsumers');
    const { SUCCESS, ERROR } = getAllConsumers.outputs;

    getAllConsumers
      .on(SUCCESS, (consumers, info) => {
        res.status(Status.OK).json({
          consumers,
          info,
        });
      })
      .on(ERROR, next);

    getAllConsumers.execute(req.query);
  },
];
