const Operation = require('../Operation');

class GetConsumer extends Operation {
  constructor({ consumerRepository }) {
    super();
    this.consumerRepository = consumerRepository;
  }

  async execute(consumerId) {
    const {
      SUCCESS, ERROR, NOT_FOUND,
    } = this.outputs;

    try {
      const consumer = await this.consumerRepository.get(consumerId);

      return this.emit(SUCCESS, consumer);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

GetConsumer.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetConsumer;
