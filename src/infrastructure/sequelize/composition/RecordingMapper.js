const Recording = require('../../../domain/composition/Recording');

const RecordingMapper = {
  toEntity({ dataValues }) {
    const { isrc } = dataValues;
    return new Recording({ isrc });
  },
};

module.exports = RecordingMapper;
