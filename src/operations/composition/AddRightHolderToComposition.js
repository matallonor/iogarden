const Operation = require('../Operation');
const CollectionShare = require('../../domain/composition/CollectionShare');

class AddRightHolderToComposition extends Operation {
  constructor({ compositionRepository, collectionShareRepository, userRepository }) {
    super();
    this.userRepository = userRepository;
    this.compositionRepository = compositionRepository;
    this.collectionShareRepository = collectionShareRepository;
  }

  async execute(user, compositionId, rightHolderId, collectionShareData) {
    const {
      SUCCESS, ERROR, NOT_FOUND, VALIDATION_ERROR, FORBIDDEN,
    } = this.outputs;

    try {
      await this.userRepository.get(rightHolderId);
      if (!user.isAdmin() && !await this.compositionRepository.hasRightHolder(compositionId, user.id)) {
        return this.emit(FORBIDDEN, new Error('ForbiddenError'));
      }

      const collectionShareModel = new CollectionShare(
        Object.assign(collectionShareData, { compositionId, rightHolderId }),
      );

      const collectionShare = await this.collectionShareRepository.create(collectionShareModel);

      return this.emit(SUCCESS, collectionShare);
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

AddRightHolderToComposition.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'VALIDATION_ERROR', 'FORBIDDEN']);

module.exports = AddRightHolderToComposition;
