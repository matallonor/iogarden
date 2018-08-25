const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Catalog = class Catalog extends Model {};
  Catalog.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    sequelize,
  });

  Catalog.associate = (models) => {
    Catalog.belongsTo(models.UserModel, { as: 'owner' });
    Catalog.belongsToMany(models.CompositionModel, { through: models.CatalogCompositionModel, foreignKey: 'catalogId', as: 'compositions' });
  };

  return Catalog;
};
