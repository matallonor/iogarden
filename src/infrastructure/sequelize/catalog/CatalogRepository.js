const { Op } = require('sequelize');

const CatalogMapper = require('./CatalogMapper');

function parseWhereQuery(whereQ) {
  const catalogWhere = {};
  const otherWhere = {};

  if (!whereQ) {
    return {};
  }

  if ('name' in whereQ) {
    catalogWhere.name = {
      [Op.like]: `%${whereQ.name}%`,
    };
  }

  if ('ownerId' in whereQ) {
    catalogWhere.ownerId = {
      [Op.eq]: whereQ.ownerId,
    };
  }

  return { catalogWhere, otherWhere };
}

class CatalogRepository {
  constructor({ CatalogModel, UserModel, CompositionModel }) {
    this.CatalogModel = CatalogModel;
    this.UserModel = UserModel;
    this.CompositionModel = CompositionModel;
  }

  async getAll({ offset = 0, limit = 20 }, whereQ) {
    const { catalogWhere } = parseWhereQuery(whereQ);

    const options = {
      include: [
        { model: this.UserModel, as: 'owner' },
        { model: this.CompositionModel, as: 'compositions' },
      ],
      offset,
      limit,
      where: catalogWhere,
    };

    try {
      const catalogs = await this.CatalogModel.findAll(options);
      return catalogs.map(CatalogMapper.toEntity);
    } catch (error) {
      throw error;
    }
  }

  async count(whereQ) {
    const { catalogWhere } = parseWhereQuery(whereQ);

    const options = {
      where: catalogWhere,
    };

    try {
      const result = await this.CatalogModel.findAndCountAll(options);
      return result.count;
    } catch (error) {
      throw error;
    }
  }

  async get(catalogId) {
    try {
      const options = {
        include: [
          { model: this.UserModel, as: 'owner' },
          { model: this.CompositionModel, as: 'compositions' },
        ]
      };
      const catalog = await this.CatalogModel.findById(catalogId, options);
      return CatalogMapper.toEntity(catalog);
    } catch (error) {
      throw error;
    }
  }

  async create(catalogData) {
    try {
      const catalog = await this.CatalogModel.create(catalogData);
      return catalog;
    } catch (error) {
      throw error;
    }
  }

  async update(catalogId, catalogData) {
    try {
      const catalog = await this.CatalogModel
        .update(catalogData, { where: { id: catalogId } });
      return catalog;
    } catch (error) {
      throw error;
    }
  }

  async delete(catalogId) {
    try {
      const isDeleted = await this.CatalogModel
        .destroy({ where: { id: catalogId } });
      return isDeleted;
    } catch (error) {
      throw error;
    }
  }

  async addComposition(catalogId, composition) {
    try {
      const catalog = await this.CatalogModel.findById(catalogId);
      return catalog.addComposition(composition);
    } catch (error) {
      throw error;
    }
  }

  async removeComposition(catalogId, composition) {
    try {
      const catalog = await this.CatalogModel.findById(catalogId);
      return catalog.removeComposition(composition);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CatalogRepository;
