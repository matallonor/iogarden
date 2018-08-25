const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const updateCatalog = req.container.resolve('updateCatalog');
    const {
      SUCCESS, ERROR, NOT_FOUND, FORBIDDEN,
    } = updateCatalog.outputs;

    updateCatalog
      .on(SUCCESS, (catalog) => {
        res.status(Status.OK).json({ catalog });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          message: error.message,
        });
      })
      .on(FORBIDDEN, (error) => {
        res.status(Status.FORBIDDEN).json({
          type: 'ForbiddenError',
          message: error.message,
        });
      })
      .on(ERROR, next);

    updateCatalog.execute(req.user, req.params.id, req.body);
  },
];
