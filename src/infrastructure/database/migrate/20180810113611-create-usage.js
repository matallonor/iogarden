
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Usages', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      // defaultValue: Sequelize.fn('gen_random_uuid'),
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    legacyId: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    datetime: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    duration: {
      type: Sequelize.INTEGER,
    },
    artistName: {
      type: Sequelize.STRING,
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
    consumerId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Consumers',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    recordingId: {
      type: Sequelize.UUID,
      allowNull: false,
      references: {
        model: 'Recordings',
        key: 'id',
      },
      onUpdate: 'cascade',
      onDelete: 'cascade',
    },
    // compositionId
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }),
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Usages'),
};
