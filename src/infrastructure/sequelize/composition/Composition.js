const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Composition = class Composition extends Model {};
  Composition.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING,
    },
    iswc: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    alternateTitle: {
      type: DataTypes.STRING,
    },
    versionType: {
      type: DataTypes.STRING,
      values: ['ORI', 'MOD'],
      allowNull: false,
      defaultValue: 'ORI',
    },
    musicArrangement: {
      type: DataTypes.STRING,
    },
    lyricAdaptation: {
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
  });

  Composition.associate = (models) => {
    // One to many
    Composition.hasMany(models.RecordingModel, {
      foreignKey: 'compositionId',
      onDelete: 'CASCADE',
      as: 'recordings',
    });
    Composition.hasMany(models.OwnershipShareModel, {
      onDelete: 'CASCADE',
      as: 'ownershipShares',
      foreignKey: 'compositionId',
    });
    Composition.hasMany(models.CollectionShareModel, {
      onDelete: 'CASCADE',
      as: 'collectionShares',
      foreignKey: 'compositionId',
    });
    Composition.hasMany(models.CollectionShareModel, {
      as: 'collectionShares',
    });

    Composition.belongsToMany(models.CatalogModel, {
      through: models.CatalogCompositionModel,
      foreignKey: 'compositionId',
      as: 'catalogs',
    });
  };

  return Composition;
};
