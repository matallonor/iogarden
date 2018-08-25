const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const getCompositionRecordings = req.container.resolve('getCompositionRecordings');
    const {
      SUCCESS, ERROR, FORBIDDEN, NOT_FOUND,
    } = getCompositionRecordings.outputs;

    getCompositionRecordings
      .on(SUCCESS, (recordings) => {
        res.status(Status.OK).json({ recordings });
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

    getCompositionRecordings.execute(req.user, req.params.id, req.query);
  },
];
