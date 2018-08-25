const Operation = require('../Operation');

class GetComposition extends Operation {
  constructor({ compositionRepository }) {
    super();
    this.compositionRepository = compositionRepository;
  }

  async execute(user, compositionId) {
    const {
      SUCCESS, ERROR, NOT_FOUND, FORBIDDEN,
    } = this.outputs;

    try {
      const composition = await this.compositionRepository.get(compositionId);
      if (!user.isAdmin() && !await this.compositionRepository.hasRightHolder(compositionId, user.id)) {
        return this.emit(FORBIDDEN, new Error('ForbiddenError'));
      }

      return this.emit(SUCCESS, composition);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

GetComposition.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'FORBIDDEN']);

module.exports = GetComposition;
