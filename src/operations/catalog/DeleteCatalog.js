const Operation = require('../Operation');

class DeleteCatalog extends Operation {
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

      await this.catalogRepository.remove(catalogId);

      return this.emit(SUCCESS);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

DeleteCatalog.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'FORBIDDEN']);

module.exports = DeleteCatalog;
