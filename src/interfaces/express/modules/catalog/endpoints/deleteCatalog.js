const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const deleteCatalog = req.container.resolve('deleteCatalog');
    const {
      SUCCESS, ERROR, NOT_FOUND, FORBIDDEN,
    } = deleteCatalog.outputs;

    deleteCatalog
      .on(SUCCESS, () => {
        res.status(Status.OK);
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

    deleteCatalog.execute(req.user, req.params.id);
  },
];
