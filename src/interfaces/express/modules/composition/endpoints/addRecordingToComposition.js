const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const addRecordingToComposition = req.container.resolve('addRecordingToComposition');
    const {
      SUCCESS, ERROR, FORBIDDEN, NOT_FOUND, VALIDATION_ERROR,
    } = addRecordingToComposition.outputs;

    addRecordingToComposition
      .on(SUCCESS, (composition) => {
        res.status(Status.OK).json({ composition });
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
      .on(VALIDATION_ERROR, (error) => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          message: error.message,
        });
      })
      .on(ERROR, next);

    addRecordingToComposition.execute(req.user, req.params.id, req.body);
  },
];
