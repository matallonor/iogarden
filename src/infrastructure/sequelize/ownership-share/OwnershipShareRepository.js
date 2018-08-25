const OwnershipShareMapper = require('./OwnershipShareMapper');

class OwnershipShareRepository {
  constructor({ OwnershipShareModel, sequelize }) {
    this.OwnershipShareModel = OwnershipShareModel;
    this.sequelize = sequelize;
  }

  async getAll({ offset = 0, limit = 20 }) {
    const options = {
      offset,
      limit,
    };

    try {
      const ownershipShare = await this.OwnershipShareModel.findAll(options);
      return ownershipShare.map(OwnershipShareMapper.toEntity);
    } catch (error) {
      throw error;
    }
  }

  async get(id) {
    try {
      const ownershipShares = await this.OwnershipShareModel.findAll({ where: { id } });
      const ownershipShare = ownershipShares.map(OwnershipShareMapper.toEntity)[0];
      return ownershipShare;
    } catch (error) {
      throw error;
    }
  }

  async create(ownershipShareData) {
    try {
      const ownershipShare = await this.OwnershipShareModel.create(ownershipShareData);
      return ownershipShare;
    } catch (error) {
      throw error;
    }
  }

  async update(id, ownershipShareData) {
    try {
      const ownershipShare = await this.OwnershipShareModel.update(ownershipShareData, { where: { id } });
      return ownershipShare;
    } catch (error) {
      throw error;
    }
  }

  async delete(ownerId, compositionId) {
    try {
      const isDeleted = await this.OwnershipShareModel.destroy({ where: { compositionId, ownerId } });
      return isDeleted;
    } catch (error) {
      throw error;
    }
  }

  async count() {
    try {
      return await this.OwnershipShareModel.count();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = OwnershipShareRepository;
