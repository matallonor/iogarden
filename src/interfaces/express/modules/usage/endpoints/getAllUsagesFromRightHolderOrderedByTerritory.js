const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const getAllUsagesFromRightHolderOrderedByTerritory = req.container
      .resolve('getAllUsagesFromRightHolderOrderedByTerritory');
    const { SUCCESS, ERROR } = getAllUsagesFromRightHolderOrderedByTerritory.outputs;

    getAllUsagesFromRightHolderOrderedByTerritory
      .on(SUCCESS, (usages, info) => {
        res.status(Status.OK).json({
          usages,
          info,
        });
      })
      .on(ERROR, next);

    getAllUsagesFromRightHolderOrderedByTerritory.execute(req.user, req.query);
  },
];
