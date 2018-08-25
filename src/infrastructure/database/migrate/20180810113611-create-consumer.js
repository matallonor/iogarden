
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Consumers', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      // defaultValue: Sequelize.fn('gen_random_uuid'),
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    keyname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Consumers'),
};
