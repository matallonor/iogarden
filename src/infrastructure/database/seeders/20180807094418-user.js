const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface) => {
    const testUsers = [];
    testUsers.push({
      id: '18ce044c-a6ab-11e8-98d0-529269fb1459',
      email: 'dev@nakima.es',
      firstName: 'Big',
      lastName: 'Papa',
      ipi: '123456789',
      password: bcrypt.hashSync('123qweQWE', 10),
      role: 'admin',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    testUsers.push({
      id: '1d6494f8-a6ab-11e8-98d0-529269fb1459',
      email: 'jgrau@nakima.es',
      firstName: 'Joan',
      lastName: 'Grau',
      ipi: '111111111',
      password: bcrypt.hashSync('123qweQWE', 10),
      role: 'client',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    testUsers.push({
      id: '2a52c716-a6ab-11e8-98d0-529269fb1459',
      email: 'mtallon@nakima.es',
      firstName: 'Marc',
      lastName: 'Tallón',
      ipi: '222222222',
      password: bcrypt.hashSync('123qweQWE', 10),
      role: 'client',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const seeders = [];
    seeders.push(queryInterface.bulkInsert('Users', testUsers, {}));
    return Promise.all(seeders);
  },

  down: (queryInterface) => {
    const seeders = [];
    seeders.push(queryInterface.bulkDelete('Users', null, {}));
    return Promise.all(seeders);
  },
};
