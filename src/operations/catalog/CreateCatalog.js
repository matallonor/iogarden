const Operation = require('../Operation');
const Catalog = require('../../domain/catalog/Catalog');

class CreateCatalog extends Operation {
  constructor({ catalogRepository }) {
    super();
    this.catalogRepository = catalogRepository;
  }

  async execute(user, catalogInfo) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR,
    } = this.outputs;

    try {
      const catalogData = Object.assign({}, catalogInfo);
      if ((user.isAdmin() && !catalogInfo.ownerId) || !user.isAdmin()) {
        catalogData.ownerId = user.id;
      }
      const catalogModel = new Catalog(catalogData);
      const catalog = await this.catalogRepository.create(catalogModel);

      return this.emit(SUCCESS, catalog);
    } catch (error) {
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

CreateCatalog.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR']);

module.exports = CreateCatalog;
