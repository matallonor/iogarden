
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Territories', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      // defaultValue: Sequelize.fn('gen_random_uuid'),
    },
    tis: {
      type: Sequelize.INTEGER,
      unique: true,
      allowNull: false,
    },
    name: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Territories'),
};
