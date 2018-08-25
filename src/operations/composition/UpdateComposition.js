const Operation = require('../Operation');

class UpdateComposition extends Operation {
  constructor({ compositionRepository }) {
    super();
    this.compositionRepository = compositionRepository;
  }

  async execute(user, compositionId, compositionInfo) {
    const {
      SUCCESS, ERROR, NOT_FOUND, FORBIDDEN,
    } = this.outputs;

    try {
      const hasRightHolder = await this.compositionRepository.hasRightHolder(compositionId, user.id);
      if (!user.isAdmin() && !hasRightHolder) {
        return this.emit(FORBIDDEN, new Error('ForbiddenError'));
      }


      const compositionData = Object.assign({}, compositionInfo);
      if (compositionData.rightHolders) {
        delete compositionData.rightHolders;
      }
      if (compositionData.collectionShares) {
        delete compositionData.collectionShares;
      }
      if (compositionData.owners) {
        delete compositionData.owners;
      }

      const composition = await this.compositionRepository.update(compositionId, compositionData);

      return this.emit(SUCCESS, composition);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

UpdateComposition.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'FORBIDDEN']);

module.exports = UpdateComposition;
