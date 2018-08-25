const Operation = require('../Operation');

class RemoveRightHolderFromComposition extends Operation {
  constructor({ compositionRepository, collectionShareRepository }) {
    super();
    this.compositionRepository = compositionRepository;
    this.collectionShareRepository = collectionShareRepository;
  }

  async execute(user, compositionId, rightHolderId) {
    const {
      SUCCESS, ERROR, NOT_FOUND, FORBIDDEN,
    } = this.outputs;

    try {
      if (!user.isAdmin() && !await this.compositionRepository.hasRightHolder(compositionId, rightHolderId)) {
        return this.emit(FORBIDDEN, new Error('ForbiddenError'));
      }

      const deleted = await this.collectionShareRepository.delete(rightHolderId, compositionId);

      return this.emit(SUCCESS, deleted);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

RemoveRightHolderFromComposition.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'FORBIDDEN']);

module.exports = RemoveRightHolderFromComposition;
