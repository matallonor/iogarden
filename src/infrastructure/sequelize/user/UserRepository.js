const { Op } = require('sequelize');

const UserMapper = require('./UserMapper');

function parseWhereQuery(whereQ) {
  const userWhere = {};
  const otherWhere = {};

  if (!whereQ) {
    return {};
  }

  if ('text' in whereQ) {
    userWhere.email = {
      [Op.like]: `%${whereQ.text}%`,
    };
  }

  return { userWhere, otherWhere };
}

class UserRepository {
  constructor({ UserModel }) {
    this.UserModel = UserModel;
  }

  async getAll({ offset = 0, limit = 20 }, whereQ) {
    const { userWhere } = parseWhereQuery(whereQ);

    const options = {
      offset,
      limit,
      where: userWhere,
    };

    try {
      const users = await this.UserModel.findAll(options);
      return users.map(UserMapper.toEntity);
    } catch (error) {
      throw error;
    }
  }

  async get(id) {
    try {
      const users = await this.UserModel.findAll({ where: { id } });
      const user = users.map(UserMapper.toEntity)[0];
      return user;
    } catch (error) {
      throw error;
    }
  }

  async getByEmail(email) {
    try {
      const users = await this.UserModel.findAll({ where: { email } });
      const user = users.map(UserMapper.toEntity)[0];
      return user;
    } catch (error) {
      throw error;
    }
  }

  async create(userData) {
    try {
      const user = await this.UserModel.create(userData);
      return user;
    } catch (error) {
      throw error;
    }
  }

  async update(id, userData) {
    try {
      const user = await this.UserModel.update(userData, { where: { id } });
      return user;
    } catch (error) {
      throw error;
    }
  }

  async delete(id) {
    try {
      const isDeleted = await this.UserModel.destroy({ where: { id } });
      return isDeleted;
    } catch (error) {
      throw error;
    }
  }

  async count() {
    try {
      return await this.UserModel.count();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserRepository;
