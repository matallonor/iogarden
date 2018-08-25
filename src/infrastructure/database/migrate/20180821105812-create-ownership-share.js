
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('OwnershipShares', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      // defaultValue: Sequelize.fn('gen_random_uuid'),
    },
    performanceSplit: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    mechanicalSplit: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    synchronizationSplit: {
      type: Sequelize.FLOAT,
      allowNull: false,
    },
    compositionId: {
      type: Sequelize.UUID,
      references: {
        model: 'Compositions',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    ownerId: {
      type: Sequelize.UUID,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    parentId: {
      type: Sequelize.UUID,
      references: {
        model: 'OwnershipShares',
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('OwnershipShares'),
};
