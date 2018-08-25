const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Territory = class Territory extends Model {};
  Territory.init({
    tis: {
      unique: true,
      allowNull: false,
      type: DataTypes.STRING,
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING,
    },
  }, {
    sequelize,
  });

  Territory.associate = () => {};

  return Territory;
};
