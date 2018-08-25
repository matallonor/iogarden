const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const getAllUsagesFromRightHolder = req.container.resolve('getAllUsagesFromRightHolder');
    const { SUCCESS, ERROR } = getAllUsagesFromRightHolder.outputs;

    getAllUsagesFromRightHolder
      .on(SUCCESS, (usages, info) => {
        res.status(Status.OK).json({
          usages,
          info,
        });
      })
      .on(ERROR, next);

    getAllUsagesFromRightHolder.execute(req.user, req.query);
  },
];
