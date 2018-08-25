const Status = require('http-status');
const { Router } = require('express');

const UserController = require('./modules/user/UserController');
const AuthController = require('./modules/auth/AuthController');
const CatalogController = require('./modules/catalog/CatalogController');
const CompositionController = require('./modules/composition/CompositionController');
const ConsumerController = require('./modules/consumer/ConsumerController');
const UsageController = require('./modules/usage/UsageController');

module.exports = () => {
  const apiRouter = Router();

  apiRouter.use('/status', (req, res) => res.status(Status.OK).json({ status: 'OK' }));
  apiRouter.use('/user', UserController.router);
  apiRouter.use('/auth', AuthController.router);
  apiRouter.use('/catalog', CatalogController.router);
  apiRouter.use('/composition', CompositionController.router);
  apiRouter.use('/consumer', ConsumerController.router);
  apiRouter.use('/usage', UsageController.router);

  const router = Router();
  router.use('/api', apiRouter);

  return router;
};
