const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const getCatalog = req.container.resolve('getCatalog');
    const {
      SUCCESS, ERROR, NOT_FOUND, FORBIDDEN,
    } = getCatalog.outputs;

    getCatalog
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

    getCatalog.execute(req.user, req.params.id);
  },
];
