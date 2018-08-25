const Operation = require('../Operation');
const OwnershipShare = require('../../domain/composition/OwnershipShare');

class AddOwnerToComposition extends Operation {
  constructor({ ownershipShareRepository, compositionRepository }) {
    super();
    this.compositionRepository = compositionRepository;
    this.ownershipShareRepository = ownershipShareRepository;
  }

  async execute(user, compositionId, ownerId, ownershipShareData) {
    const {
      SUCCESS, ERROR, NOT_FOUND, FORBIDDEN, VALIDATION_ERROR,
    } = this.outputs;

    try {
      if (!user.isAdmin() && !await this.compositionRepository.hasRightHolder(compositionId, user.id)) {
        return this.emit(FORBIDDEN, new Error('ForbiddenError'));
      }

      const ownershipShareModel = new OwnershipShare(Object.assign(ownershipShareData, { compositionId, ownerId }));
      const ownershipShare = await this.ownershipShareRepository.create(ownershipShareModel);

      return this.emit(SUCCESS, ownershipShare);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

AddOwnerToComposition.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'FORBIDDEN', 'VALIDATION_ERROR']);

module.exports = AddOwnerToComposition;
