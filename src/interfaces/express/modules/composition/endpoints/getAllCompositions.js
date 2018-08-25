const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const getAllCompositions = req.container.resolve('getAllCompositions');
    const { SUCCESS, ERROR } = getAllCompositions.outputs;

    getAllCompositions
      .on(SUCCESS, (compositions, info) => {
        res.status(Status.OK).json({
          compositions,
          info,
        });
      })
      .on(ERROR, next);

    getAllCompositions.execute(req.user, req.query);
  },
];
