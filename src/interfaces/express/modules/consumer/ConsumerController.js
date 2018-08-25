const { Router } = require('express');

const {
  getAllConsumers,
  getConsumer,
} = require('./endpoints');


const ConsumerController = {
  get router() {
    const router = Router();

    router.get('/', getAllConsumers); // Admin
    router.get('/:id/', getConsumer); // Admin

    return router;
  },
};

module.exports = ConsumerController;
