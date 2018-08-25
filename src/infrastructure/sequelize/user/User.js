const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = class User extends Model {};
  User.init({
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ipi: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        len: {
          args: 9,
          msg: 'ipi must be at least 9 characters long',
        },
      },
    },
    role: {
      type: DataTypes.STRING,
      values: ['right_holder', 'admin'],
      allowNull: false,
      defaultValue: 'right_holder',
    },
    nif: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    postalCode: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    disabled: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: false,
    },
  }, {
    sequelize,
  });

  User.associate = (models) => {
    User.hasMany(models.CollectionShareModel, { as: 'collectionShares', foreignKey: 'rightHolderId' });
    User.hasMany(models.OwnershipShareModel, { as: 'ownershipShares', foreignKey: 'ownerId' });
  };

  return User;
};
