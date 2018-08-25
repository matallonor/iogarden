
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Recordings', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      // defaultValue: Sequelize.fn('gen_random_uuid'),
    },
    isrc: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
    },
    compositionId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Compositions',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Recordings'),
};
