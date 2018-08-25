const { Op } = require('sequelize');

const CollectionShareMapper = require('./CollectionShareMapper');

class CollectionShareRepository {
  constructor({ CollectionShareModel, sequelize }) {
    this.CollectionShareModel = CollectionShareModel;
    this.sequelize = sequelize;
  }

  async getAll({ offset = 0, limit = 20 }) {
    const options = {
      offset,
      limit,
    };

    try {
      const collectionShare = await this.CollectionShareModel.findAll(options);
      return collectionShare.map(CollectionShareMapper.toEntity);
    } catch (error) {
      throw error;
    }
  }

  async get(id) {
    try {
      const collectionShares = await this.CollectionShareModel.findAll({ where: { id } });
      const collectionShare = collectionShares.map(CollectionShareMapper.toEntity)[0];
      return collectionShare;
    } catch (error) {
      throw error;
    }
  }

  async create(collectionShareData) {
    try {
      const collectionShare = await this.CollectionShareModel.create(collectionShareData);
      return collectionShare;
    } catch (error) {
      throw error;
    }
  }

  async update(id, collectionShareData) {
    try {
      const collectionShare = await this.CollectionShareModel.update(collectionShareData, { where: { id } });
      return collectionShare;
    } catch (error) {
      throw error;
    }
  }

  async delete(rightHolderId, compositionId) {
    try {
      const isDeleted = await this.CollectionShareModel.destroy({ where: { compositionId, rightHolderId } });
      return isDeleted;
    } catch (error) {
      throw error;
    }
  }

  async count() {
    try {
      return await this.CollectionShareModel.count();
    } catch (error) {
      throw error;
    }
  }

  async getCompositionsFromRH({ offset = 0, limit = 20 }, userId) {
    const options = {
      offset,
      limit,
      where: { rightHolderId: { [Op.eq]: `${userId}` } },
    };

    try {
      const compositions = await this.CollectionShareModel.getCompositions(options);
      return compositions;
    } catch (error) {
      throw error;
    }
  }

  async countCompositionsFromRH(userId) {
    const options = {
      where: { rightHolderId: { [Op.eq]: `${userId}` } },
    };

    try {
      const compositions = await this.CollectionShareModel.getCompositions(options);
      return compositions.length;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = CollectionShareRepository;
