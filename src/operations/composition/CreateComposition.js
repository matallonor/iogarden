const Operation = require('../Operation');
const Composition = require('../../domain/composition/Composition');

class CreateComposition extends Operation {
  constructor({ compositionRepository }) {
    super();
    this.compositionRepository = compositionRepository;
  }

  async execute(compositionData) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR,
    } = this.outputs;

    try {
      const compositionModel = new Composition(compositionData);
      const composition = await this.compositionRepository.create(compositionModel);

      return this.emit(SUCCESS, composition);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

CreateComposition.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = CreateComposition;
