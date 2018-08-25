const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const createComposition = req.container.resolve('createComposition');
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createComposition.outputs;

    createComposition
      .on(SUCCESS, (composition) => {
        res.status(Status.OK).json({ composition });
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          message: error.message,
        });
      })
      .on(ERROR, next);

    createComposition.execute(req.body);
  },
];
