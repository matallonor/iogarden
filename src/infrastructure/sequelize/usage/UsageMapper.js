const Usage = require('../../../domain/usage/Usage');

const UsageMapper = {
  toEntity({ dataValues }) {
    console.log(dataValues);
    const {
      id, type, legacyId, datetime, country, duration, artistName
    } = dataValues;

    return new Usage({
      id, type, legacyId, datetime, country, duration, artistName
    });
  },
};

module.exports = UsageMapper;
