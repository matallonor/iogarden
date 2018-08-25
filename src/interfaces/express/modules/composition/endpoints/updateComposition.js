const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const updateComposition = req.container.resolve('updateComposition');
    const {
      SUCCESS, ERROR, NOT_FOUND, FORBIDDEN,
    } = updateComposition.outputs;

    updateComposition
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
      .on(ERROR, next);

    updateComposition.execute(req.user, req.params.id, req.body);
  },
];
