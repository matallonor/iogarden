const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const getAllUsagesFromComposition = req.container.resolve('getAllUsagesFromComposition');
    const { SUCCESS, ERROR } = getAllUsagesFromComposition.outputs;

    getAllUsagesFromComposition
      .on(SUCCESS, (usages, info) => {
        res.status(Status.OK).json({
          usages,
          info,
        });
      })
      .on(ERROR, next);

    getAllUsagesFromComposition.execute(req.params.compositionId, req.query);
  },
];
