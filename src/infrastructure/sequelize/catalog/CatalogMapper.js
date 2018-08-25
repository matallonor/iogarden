const Catalog = require('../../../domain/catalog/Catalog');

const CatalogMapper = {
  toEntity({ dataValues }) {
    const {
      id, name, owner, ownerId, compositions,
    } = dataValues;
    return new Catalog({
      id, name, owner, ownerId, compositions,
    });
  },
};

module.exports = CatalogMapper;
