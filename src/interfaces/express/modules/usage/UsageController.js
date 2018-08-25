const { Router } = require('express');

const {
  getAllUsagesFromComposition,
  getAllUsagesFromRightHolder,
  getAllUsagesFromRightHolderOrderedByTerritory,
} = require('./endpoints');


const UsageController = {
  get router() {
    const router = Router();

    // router.get('/:compositionId', getAllUsagesFromComposition);
    router.get('/', getAllUsagesFromRightHolder);
    router.get('/grouped', getAllUsagesFromRightHolderOrderedByTerritory);

    return router;
  },
};

module.exports = UsageController;
