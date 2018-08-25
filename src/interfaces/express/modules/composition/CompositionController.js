const { Router } = require('express');

const {
  createComposition,
  getAllCompositions,
  getComposition,
  deleteComposition,
  updateComposition,
  addOwnerToComposition,
  removeOwnerFromComposition,
  addRecordingToComposition,
  removeRecordingFromComposition,
  getCompositionRecordings,
  addRightHolderToComposition,
  removeRightHolderFromComposition,
} = require('./endpoints');


const CompositionController = {
  get router() {
    const router = Router();

    router.get('/', getAllCompositions); // Authenticated rightHolder
    router.post('/', createComposition); // Authenticated
    router.get('/:id/', getComposition); // Authenticated rightHolder
    router.put('/:id/', updateComposition); // Authenticated rightHolder
    router.delete('/:id/', deleteComposition); // Admin

    // Authenticated rightHolder
    router.post('/:id/owners/:ownerId/', addOwnerToComposition);
    router.delete('/:id/owners/:ownerId/', removeOwnerFromComposition);
    router.post('/:id/right-holders/:rightHolderId/', addRightHolderToComposition);
    router.delete('/:id/right-holders/:rightHolderId/', removeRightHolderFromComposition);
    router.post('/:id/recordings/', addRecordingToComposition);
    router.delete('/:id/recordings/:recordingId/', removeRecordingFromComposition);
    router.get('/:id/recordings/', getCompositionRecordings);

    return router;
  },
};

module.exports = CompositionController;
