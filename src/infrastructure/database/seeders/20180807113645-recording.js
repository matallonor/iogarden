
module.exports = {
  up: async (queryInterface) => {
    const testRecordings = [];
    testRecordings.push({
      id: '621d1746-a6ab-11e8-98d0-529269fb1459',
      isrc: '111111111',
      compositionId: '45edb24c-a6ab-11e8-98d0-529269fb1459',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const seeders = [];
    seeders.push(queryInterface.bulkInsert('Recordings', testRecordings, {}));
    return Promise.all(seeders);
  },

  down: (queryInterface) => {
    const seeders = [];
    seeders.push(queryInterface.bulkDelete('Recordings', null, {}));
    return Promise.all(seeders);
  },
};
