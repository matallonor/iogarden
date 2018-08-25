const Status = require('http-status');

const { userAuthenticated } = require('../../../middlewares');

module.exports = [
  userAuthenticated,
  (req, res, next) => {
    const getAllCatalogs = req.container.resolve('getAllCatalogs');
    const { SUCCESS, ERROR } = getAllCatalogs.outputs;

    getAllCatalogs
      .on(SUCCESS, (catalogs, info) => {
        res.status(Status.OK).json({
          catalogs,
          info,
        });
      })
      .on(ERROR, next);

    getAllCatalogs.execute(req.user, req.query);
  },
];
