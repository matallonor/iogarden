const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const createCatalog = req.container.resolve('createCatalog');
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createCatalog.outputs;

    createCatalog
      .on(SUCCESS, (catalog) => {
        res.status(Status.OK).json({ catalog });
      })
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          message: error.message,
        });
      })
      .on(ERROR, next);

    createCatalog.execute(req.user, req.body);
  },
];
