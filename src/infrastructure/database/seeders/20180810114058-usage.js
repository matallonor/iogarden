
module.exports = {
  up: async (queryInterface) => {
    const testUsages = [];
    testUsages.push({
      id: '69c0b2fa-a6ab-11e8-98d0-529269fb1459',
      type: 'radiotv',
      legacyId: 'legacyId',
      datetime: new Date(),
      country: 'Catalunya',
      duration: 123456789,
      artistName: 'Alpha Blondy',
      territoryId: '2100b2fa-a6ab-11e8-98d0-529269fb1459',
      consumerId: '69c0b2fa-a6ab-11e8-98d0-529269fb1459',
      recordingId: '621d1746-a6ab-11e8-98d0-529269fb1459',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const seeders = [];
    seeders.push(queryInterface.bulkInsert('Usages', testUsages, {}));
    return Promise.all(seeders);
  },

  down: (queryInterface) => {
    const seeders = [];
    seeders.push(queryInterface.bulkDelete('Usages', null, {}));
    return Promise.all(seeders);
  },
};
