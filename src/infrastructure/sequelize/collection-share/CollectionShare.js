const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const CollectionShare = class CollectionShare extends Model {};
  CollectionShare.init({
    performanceSplit: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    mechanicalSplit: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    synchronizationSplit: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  }, {
    sequelize,
  });

  CollectionShare.associate = (models) => {
    CollectionShare.belongsTo(models.UserModel, { as: 'rightHolder', foreignKey: 'rightHolderId' });
    CollectionShare.belongsTo(models.CompositionModel, { as: 'composition', foreignKey: 'compositionId' });
    CollectionShare.belongsTo(models.TerritoryModel, { as: 'territory', foreignKey: 'territoryId' });
    CollectionShare.belongsTo(models.CollectionShareModel, { as: 'parent', foreignKey: 'parentId' });
  };

  return CollectionShare;
};
