const Status = require('http-status');

const { userAuthenticated, userIsAdmin } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  userIsAdmin,
  (req, res, next) => {
    const deleteComposition = req.container.resolve('deleteComposition');
    const { SUCCESS, ERROR, NOT_FOUND } = deleteComposition.outputs;

    deleteComposition
      .on(SUCCESS, (composition) => {
        console.log('algo');
        res.status(Status.OK).json({ composition });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          message: error.message,
        });
      })
      .on(ERROR, next);

    deleteComposition.execute(req.params.id);
  },
];
