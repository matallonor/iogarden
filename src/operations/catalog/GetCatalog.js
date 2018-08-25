const Operation = require('../Operation');

class GetCatalog extends Operation {
  constructor({ catalogRepository }) {
    super();
    this.catalogRepository = catalogRepository;
  }

  async execute(user, catalogId) {
    const {
      SUCCESS, ERROR, NOT_FOUND, FORBIDDEN,
    } = this.outputs;

    try {
      const catalog = await this.catalogRepository.get(catalogId);
      if (!user.isAdmin() && !catalog.isOwnedBy(user.id)) {
        return this.emit(FORBIDDEN, new Error('ForbiddenError'));
      }


      return this.emit(SUCCESS, catalog);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

GetCatalog.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'FORBIDDEN']);

module.exports = GetCatalog;
