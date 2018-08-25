const Operation = require('../Operation');

class UpdateCatalog extends Operation {
  constructor({ catalogRepository }) {
    super();
    this.catalogRepository = catalogRepository;
  }

  async execute(user, catalogId, catalogInfo) {
    const {
      SUCCESS, ERROR, NOT_FOUND, FORBIDDEN,
    } = this.outputs;

    try {
      const oldCatalog = await this.catalogRepository.get(catalogId);
      if (!user.isAdmin() && !oldCatalog.isOwnedBy(user.id)) {
        return this.emit(FORBIDDEN, new Error('ForbiddenError'));
      }

      const catalogData = Object.assign({}, catalogInfo);
      if (catalogData.ownerId) {
        delete catalogData.ownerId;
      }
      if (catalogData.compositions) {
        delete catalogData.compositions;
      }
      const catalog = await this.catalogRepository.update(catalogId, catalogData);

      return this.emit(SUCCESS, catalog);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

UpdateCatalog.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'FORBIDDEN']);

module.exports = UpdateCatalog;
