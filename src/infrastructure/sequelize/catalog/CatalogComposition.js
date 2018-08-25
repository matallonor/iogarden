const { Model } = require('sequelize');

module.exports = (sequelize) => {
  const CatalogComposition = class CatalogComposition extends Model {};
  CatalogComposition.init({}, { sequelize });

  CatalogComposition.associate = () => {};

  return CatalogComposition;
};
