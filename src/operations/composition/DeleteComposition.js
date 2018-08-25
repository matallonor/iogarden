const Operation = require('../Operation');

class DeleteComposition extends Operation {
  constructor({ compositionRepository }) {
    super();
    this.compositionRepository = compositionRepository;
  }

  async execute(compositionId) {
    const {
      SUCCESS, ERROR, NOT_FOUND,
    } = this.outputs;

    try {
      const composition = await this.compositionRepository.delete(compositionId);
      return this.emit(SUCCESS, composition);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

DeleteComposition.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = DeleteComposition;
