const Status = require('http-status');

const { userIsAdmin, userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  userIsAdmin,
  (req, res, next) => {
    const getConsumer = req.container.resolve('getConsumer');
    const { SUCCESS, ERROR, NOT_FOUND } = getConsumer.outputs;

    getConsumer
      .on(SUCCESS, (consumer) => {
        res.status(Status.OK).json({ consumer });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          message: error.message,
        });
      })
      .on(ERROR, next);

    getConsumer.execute(req.params.id);
  },
];
