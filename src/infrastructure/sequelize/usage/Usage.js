const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Usage = class Usage extends Model {};
  Usage.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    legacyId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    datetime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    duration: {
      type: DataTypes.INTEGER,
    },
    artistName: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
  });

  Usage.associate = (models) => {
    Usage.belongsTo(models.TerritoryModel, { as: 'territory', foreignKey: { allowNull: false } });
    Usage.belongsTo(models.ConsumerModel, { as: 'consumer', foreignKey: { allowNull: false } });
    Usage.belongsTo(models.RecordingModel, { as: 'recording', foreignKey: { allowNull: false } });
    // Usage.belongsTo(models.CompositionModel, { as: 'composition', foreignKey: { allowNull: false } });
    // Usage.belongsTo(models.InvoiceModel, { as: 'invoice', foreignKey: { allowNull: false } });
  };

  return Usage;
};
