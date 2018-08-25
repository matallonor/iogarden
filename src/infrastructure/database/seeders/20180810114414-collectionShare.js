

module.exports = {
  up: async (queryInterface) => {
    const testCollectionShares = [];
    testCollectionShares.push({
      id: 'ea410708-a6ac-11e8-98d0-529269fb1459',
      compositionId: '45edb24c-a6ab-11e8-98d0-529269fb1459',
      parentId: null,
      rightHolderId: '1d6494f8-a6ab-11e8-98d0-529269fb1459',
      territoryId: '2129b2fa-a6ab-11e8-98d0-529269fb1459',
      performanceSplit: 33.3,
      mechanicalSplit: 33.3,
      synchronizationSplit: 11.1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const seeders = [];
    seeders.push(queryInterface.bulkInsert('CollectionShares', testCollectionShares, {}));
    return Promise.all(seeders);
  },

  down: (queryInterface) => {
    const seeders = [];
    seeders.push(queryInterface.bulkDelete('CollectionShares', null, {}));
    return Promise.all(seeders);
  },
};
