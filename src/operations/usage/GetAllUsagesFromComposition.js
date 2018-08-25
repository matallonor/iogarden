const Operation = require('../Operation');

class GetAllUsagesFromComposition extends Operation {
  constructor({ usageRepository }) {
    super();
    this.usageRepository = usageRepository;
  }

  async execute(compositionId, query) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const offset = query.offset || 0;
      const limit = query.limit || 15;
      const filters = {};

      if (compositionId) {
        filters.compositionId = compositionId;
      }

      if (query.type) {
        filters.type = query.type;
      }

      if (query.datetime) {
        filters.datetime = query.datetime;
      }

      const usages = await this.usageRepository.getAllUsagesFromComposition({ offset, limit }, filters);
      const count = await this.usageRepository.count(filters);
      const info = { count, offset, limit };

      return this.emit(SUCCESS, usages, info);
    } catch (error) {
      return this.emit(ERROR, error);
    }
  }
}

GetAllUsagesFromComposition.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllUsagesFromComposition;
