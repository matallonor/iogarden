const Consumer = require('../../../domain/consumer/Consumer');

const ConsumerMapper = {
  toEntity({ dataValues }) {
    const {
      id, name, keyname, country,
    } = dataValues;

    return new Consumer({
      id, name, keyname, country,
    });
  },
};

module.exports = ConsumerMapper;
