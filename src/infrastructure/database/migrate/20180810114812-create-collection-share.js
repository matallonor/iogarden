
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('CollectionShares', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
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
      allowNull: false,
      references: {
        model: 'Compositions',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    rightHolderId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    territoryId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Territories',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    parentId: {
      type: Sequelize.UUID,
      references: {
        model: 'CollectionShares',
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('CollectionShares'),
};
