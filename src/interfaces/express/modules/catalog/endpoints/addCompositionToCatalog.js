const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const addCompositionToCatalog = req.container.resolve('addCompositionToCatalog');
    const {
      SUCCESS, ERROR, FORBIDDEN, NOT_FOUND,
    } = addCompositionToCatalog.outputs;

    addCompositionToCatalog
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

    addCompositionToCatalog.execute(req.user, req.params.id, req.params.compId);
  },
];
