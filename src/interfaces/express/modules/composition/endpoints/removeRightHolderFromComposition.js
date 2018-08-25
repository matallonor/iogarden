const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const removeRightHolderFromComposition = req.container.resolve('removeRightHolderFromComposition');
    const {
      SUCCESS, ERROR, FORBIDDEN, NOT_FOUND,
    } = removeRightHolderFromComposition.outputs;

    removeRightHolderFromComposition
      .on(SUCCESS, (collectionShare) => {
        res.status(Status.OK).json({ collectionShare });
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

    removeRightHolderFromComposition.execute(req.user, req.params.id, req.params.rightHolderId);
  },
];
