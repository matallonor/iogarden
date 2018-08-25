const Operation = require('../Operation');

class GetAllUsagesFromRightHolderOrderedByTerritory extends Operation {
  constructor({ usageRepository }) {
    super();
    this.usageRepository = usageRepository;
  }

  async execute(user, query) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const offset = query.offset || 0;
      const limit = query.limit || 15;
      const filters = {};

      if (user) {
        filters.rightHolderId = user.id;
      }

      if (query.type) {
        filters.type = query.type;
      }

      if (query.datetime) {
        filters.datetime = query.datetime;
      }

      const orderByTerritory = true;

      const usages = await this.usageRepository
        .getAll({ offset, limit }, filters, orderByTerritory);
      const count = await this.usageRepository.count(filters);
      const info = { count, offset, limit };

      return this.emit(SUCCESS, usages, info);
    } catch (error) {
      return this.emit(ERROR, error);
    }
  }
}

GetAllUsagesFromRightHolderOrderedByTerritory.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllUsagesFromRightHolderOrderedByTerritory;
