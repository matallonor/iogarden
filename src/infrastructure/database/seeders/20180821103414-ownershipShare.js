
module.exports = {
  up: async (queryInterface) => {
    const testOwnershipShares = [];
    testOwnershipShares.push({
      id: 'f5bfa63e-a6ac-11e8-98d0-529269fb1459',
      compositionId: '45edb24c-a6ab-11e8-98d0-529269fb1459',
      parentId: null,
      ownerId: '2a52c716-a6ab-11e8-98d0-529269fb1459',
      performanceSplit: 33.3,
      mechanicalSplit: 33.3,
      synchronizationSplit: 11.1,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const seeders = [];
    seeders.push(queryInterface.bulkInsert('OwnershipShares', testOwnershipShares, {}));
    return Promise.all(seeders);
  },

  down: (queryInterface) => {
    const seeders = [];
    seeders.push(queryInterface.bulkDelete('OwnershipShares', null, {}));
    return Promise.all(seeders);
  },
};
