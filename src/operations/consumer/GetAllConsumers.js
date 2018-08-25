const Operation = require('../Operation');

class GetAllConsumers extends Operation {
  constructor({ consumerRepository }) {
    super();
    this.consumerRepository = consumerRepository;
  }

  async execute(query) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const offset = query.offset || 0;
      const limit = query.limit || 15;
      const filters = {};

      if (query.text) {
        filters.text = query.text;
      }

      const consumers = await this.consumerRepository.getAll({ offset, limit }, filters);
      const count = await this.consumerRepository.count(filters);
      const info = { count, offset, limit };

      return this.emit(SUCCESS, consumers, info);
    } catch (error) {
      return this.emit(ERROR, error);
    }
  }
}

GetAllConsumers.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllConsumers;
