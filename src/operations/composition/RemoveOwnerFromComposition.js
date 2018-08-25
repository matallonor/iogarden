const Operation = require('../Operation');

class AddOwnerToComposition extends Operation {
  constructor({ compositionRepository, ownershipShareRepository }) {
    super();
    this.compositionRepository = compositionRepository;
    this.ownershipShareRepository = ownershipShareRepository;
  }

  async execute(user, compositionId, ownerId) {
    const {
      SUCCESS, ERROR, NOT_FOUND, FORBIDDEN,
    } = this.outputs;

    try {
      if (!user.isAdmin() && !await this.compositionRepository.hasRightHolder(compositionId, user.id)) {
        return this.emit(FORBIDDEN, new Error('ForbiddenError'));
      }

      await this.ownershipShareRepository.delete(ownerId, compositionId);

      return this.emit(SUCCESS);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

AddOwnerToComposition.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'FORBIDDEN']);

module.exports = AddOwnerToComposition;
