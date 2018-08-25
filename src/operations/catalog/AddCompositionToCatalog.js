const Operation = require('../Operation');

class AddCompositionToCatalog extends Operation {
  constructor({ catalogRepository, compositionRepository }) {
    super();
    this.catalogRepository = catalogRepository;
    this.compositionRepository = compositionRepository;
  }

  async execute(user, catalogId, compositionId) {
    const {
      SUCCESS, ERROR, NOT_FOUND, FORBIDDEN,
    } = this.outputs;

    try {
      const oldCatalog = await this.catalogRepository.get(catalogId);
      if (!oldCatalog.isOwnedBy(user.id) && !user.isAdmin()) {
        return this.emit(FORBIDDEN, new Error('ForbiddenError'));
      }

      const composition = await this.compositionRepository.get(compositionId);
      const hasRightHolder = await this.compositionRepository.hasRightHolder(compositionId, user.id);
      if (!hasRightHolder && !user.isAdmin()) {
        return this.emit(FORBIDDEN, new Error('ForbiddenError'));
      }

      const catalog = await this.catalogRepository.addComposition(catalogId, composition);

      return this.emit(SUCCESS, catalog);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

AddCompositionToCatalog.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'FORBIDDEN']);

module.exports = AddCompositionToCatalog;
