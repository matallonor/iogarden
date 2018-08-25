const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const removeRecordingFromComposition = req.container.resolve('removeRecordingFromComposition');
    const {
      SUCCESS, ERROR, FORBIDDEN, NOT_FOUND,
    } = removeRecordingFromComposition.outputs;

    removeRecordingFromComposition
      .on(SUCCESS, (deleted) => {
        res.status(Status.OK).json({ deleted });
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

    removeRecordingFromComposition.execute(req.user, req.params.id, req.params.recordingId);
  },
];
