const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const createCatalogFromCWR = req.container.resolve('createCatalogFromCWR');
    const { SUCCESS, ERROR, VALIDATION_ERROR } = createCatalogFromCWR.outputs;

    createCatalogFromCWR
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

    createCatalogFromCWR.execute(req.user, req.body);
  },
];
