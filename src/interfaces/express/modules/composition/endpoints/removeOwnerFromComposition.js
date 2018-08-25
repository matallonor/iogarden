const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const removeOwnerFromComposition = req.container.resolve('removeOwnerFromComposition');
    const {
      SUCCESS, ERROR, FORBIDDEN, NOT_FOUND,
    } = removeOwnerFromComposition.outputs;

    removeOwnerFromComposition
      .on(SUCCESS, () => {
        res.status(Status.OK).json();
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

    removeOwnerFromComposition.execute(req.user, req.params.id, req.params.ownerId);
  },
];
