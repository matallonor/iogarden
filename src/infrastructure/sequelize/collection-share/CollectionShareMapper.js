const CollectionShare = require('../../../domain/composition/CollectionShare');

const CollectionShareMapper = {
  toEntity({ dataValues }) {
    const {
      id,
      rightHolder,
      composition,
      territory,
      parent,
      performanceSplit,
      mechanicalSplit,
      synchronizationSplit,
    } = dataValues;

    return new CollectionShare(
      {
        id,
        rightHolder,
        composition,
        territory,
        parent,
        performanceSplit,
        mechanicalSplit,
        synchronizationSplit,
      },
    );
  },
};

module.exports = CollectionShareMapper;
