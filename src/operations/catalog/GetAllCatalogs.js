const Operation = require('../Operation');

class GetAllCatalogs extends Operation {
  constructor({ catalogRepository }) {
    super();
    this.catalogRepository = catalogRepository;
  }

  async execute(user, query) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const offset = query.offset || 0;
      const limit = query.limit || 15;
      const filters = {};

      if (query.name) {
        filters.name = query.name;
      }
      if (query.owner) {
        filters.ownerId = query.owner;
      }
      if (!user.isAdmin()) {
        filters.ownerId = user.id;
      }

      const catalogs = await this.catalogRepository.getAll({ offset, limit }, filters);
      const count = await this.catalogRepository.count(filters);
      const info = { count, offset, limit };

      return this.emit(SUCCESS, catalogs, info);
    } catch (error) {
      return this.emit(ERROR, error);
    }
  }
}

GetAllCatalogs.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllCatalogs;
