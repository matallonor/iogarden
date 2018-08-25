const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const removeCompositionFromCatalog = req.container.resolve('removeCompositionFromCatalog');
    const {
      SUCCESS, ERROR, FORBIDDEN, NOT_FOUND,
    } = removeCompositionFromCatalog.outputs;

    removeCompositionFromCatalog
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

    removeCompositionFromCatalog.execute(req.user, req.params.id, req.params.compId);
  },
];
