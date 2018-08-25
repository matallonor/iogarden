
module.exports = {
  up: async (queryInterface) => {
    const testCatalogs = [];
    testCatalogs.push({
      id: '69c0b2fa-a6ab-11e8-98d0-529269fb1459',
      name: 'First Catalog',
      ownerId: '1d6494f8-a6ab-11e8-98d0-529269fb1459',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const seeders = [];
    seeders.push(queryInterface.bulkInsert('Catalogs', testCatalogs, {}));
    return Promise.all(seeders);
  },

  down: (queryInterface) => {
    const seeders = [];
    seeders.push(queryInterface.bulkDelete('Catalogs', null, {}));
    return Promise.all(seeders);
  },
};
