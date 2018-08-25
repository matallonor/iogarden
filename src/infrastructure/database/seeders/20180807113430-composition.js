
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const testCompositions = [];
    testCompositions.push({
      id: '45edb24c-a6ab-11e8-98d0-529269fb1459',
      iswc: '111111111',
      title: 'Despacito',
      language: 'Castellano',
      type: 'Audio',
      versionType: 'ORI',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const seeders = [];
    seeders.push(queryInterface.bulkInsert('Compositions', testCompositions, {}));

    return Promise.all(seeders);

    /* return queryInterface.addColumn(
      'Recordings', // name of Target model
      'CompositionId', // name of the key we're adding
      {
        type: Sequelize.STRING,
        references: {
          model: 'Compositions', // name of Source model
          key: 'iswc',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
    ).then(() => Promise.all(seeders)); */
  },

  down: (queryInterface) => {
    const seeders = [];
    seeders.push(queryInterface.bulkDelete('Compositions', null, {}));
    return Promise.all(seeders);
  },
};
