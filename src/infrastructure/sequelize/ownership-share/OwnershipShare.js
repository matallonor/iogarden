const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const OwnershipShare = class OwnershipShare extends Model {};
  OwnershipShare.init({
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

  OwnershipShare.associate = (models) => {
    OwnershipShare.belongsTo(models.UserModel, { as: 'owner', foreignKey: 'ownerId' });
    OwnershipShare.belongsTo(models.CompositionModel, { as: 'composition', foreignKey: 'compositionId' });
    OwnershipShare.belongsTo(models.OwnershipShareModel, { as: 'parent', foreignKey: 'parentId' });
  };

  return OwnershipShare;
};
