
module.exports = {
  up: async (queryInterface) => {
    const testConsumers = [];
    testConsumers.push({
      id: '69c0b2fa-a6ab-11e8-98d0-529269fb1459',
      name: 'Radio la cantaora',
      keyname: 'RadioCant',
      country: 'Spain',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const seeders = [];
    seeders.push(queryInterface.bulkInsert('Consumers', testConsumers, {}));
    return Promise.all(seeders);
  },

  down: (queryInterface) => {
    const seeders = [];
    seeders.push(queryInterface.bulkDelete('Consumers', null, {}));
    return Promise.all(seeders);
  },
};
