
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Users', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      // defaultValue: Sequelize.fn('gen_random_uuid'),
    },
    email: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
    },
    firstName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    lastName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    ipi: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
    },
    role: {
      type: Sequelize.STRING,
    },
    nif: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    postalCode: {
      type: Sequelize.STRING,
    },
    country: {
      type: Sequelize.STRING,
    },
    password: {
      type: Sequelize.STRING,
    },
    disabled: {
      type: Sequelize.BOOLEAN,
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Users'),
};
