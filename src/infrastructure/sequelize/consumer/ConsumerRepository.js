const { Op } = require('sequelize');

const ConsumerMapper = require('./ConsumerMapper');

function parseWhereQuery(whereQ) {
  const consumerWhere = {};
  const otherWhere = {};

  if (!whereQ) {
    return {};
  }

  if ('text' in whereQ) {
    consumerWhere.name = {
      [Op.like]: `%${whereQ.text}%`,
    };
  }

  return { consumerWhere, otherWhere };
}

class ConsumerRepository {
  constructor({ ConsumerModel }) {
    this.ConsumerModel = ConsumerModel;
  }

  async getAll({ offset = 0, limit = 20 }, whereQ) {
    const { consumerWhere } = parseWhereQuery(whereQ);

    const options = {
      offset,
      limit,
      where: consumerWhere,
    };

    try {
      const consumers = await this.ConsumerModel.findAll(options);
      return consumers.map(ConsumerMapper.toEntity);
    } catch (error) {
      throw error;
    }
  }

  async get(id) {
    try {
      const consumers = await this.ConsumerModel.findAll({ where: { id } });
      const consumer = consumers.map(ConsumerMapper.toEntity)[0];
      return consumer;
    } catch (error) {
      throw error;
    }
  }

  async count() {
    try {
      return await this.ConsumerModel.count();
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ConsumerRepository;
