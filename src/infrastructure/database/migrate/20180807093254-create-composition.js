
module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.createTable('Compositions', {
    id: {
      type: Sequelize.UUID,
      primaryKey: true,
      allowNull: false,
      // defaultValue: Sequelize.fn('gen_random_uuid'),
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    language: {
      type: Sequelize.STRING,
    },
    iswc: {
      allowNull: false,
      unique: true,
      type: Sequelize.STRING,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    alternateTitle: {
      type: Sequelize.STRING,
    },
    versionType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    musicArrangement: {
      type: Sequelize.STRING,
    },
    lyricAdaptation: {
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
  down: (queryInterface, Sequelize) => queryInterface.dropTable('Compositions'),
};
