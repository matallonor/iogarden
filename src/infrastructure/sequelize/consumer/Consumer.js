const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Consumer = class Consumer extends Model {};
  Consumer.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keyname: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
  });

  Consumer.associate = () => {
    // Consumer.hasMany(models.UsageModel, { as: 'usage' });
    // Consumer.hasMany(models.InvoiceModel, { as: 'invoice' });
  };

  return Consumer;
};
