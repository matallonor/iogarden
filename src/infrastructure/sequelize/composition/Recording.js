const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Recording = class Recording extends Model {};
  Recording.init({
    isrc: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
  });

  Recording.associate = (models) => {
    Recording.belongsTo(models.CompositionModel, { as: 'composition', foreignKey: 'compositionId' });
  };

  return Recording;
};
