const OwnershipShare = require('../../../domain/composition/OwnershipShare');

const OwnershipShareMapper = {
  toEntity({ dataValues }) {
    const {
      id, performanceSplit, mechanicalSplit, synchronizationSplit,
    } = dataValues;

    return new OwnershipShare(
      {
        id, performanceSplit, mechanicalSplit, synchronizationSplit,
      },
    );
  },
};

module.exports = OwnershipShareMapper;
