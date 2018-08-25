// const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const Config = require('../../config/Config');

const config = new Config();

if (config.database.database) {
  // http://docs.sequelizejs.com/manual/tutorial/querying.html#operators-security
  const sequelizeParams = config.database;

  const sequelize = new Sequelize(sequelizeParams);

  const database = {};

  const userModel = sequelize.import(path.join(__dirname, './user/User.js'));
  database.UserModel = userModel;

  const compositionModel = sequelize
    .import(path.join(__dirname, './composition/Composition.js'));
  database.CompositionModel = compositionModel;

  const recordingModel = sequelize
    .import(path.join(__dirname, './composition/Recording.js'));
  database.RecordingModel = recordingModel;

  const ownershipShareModel = sequelize
    .import(path.join(__dirname, './ownership-share/OwnershipShare.js'));
  database.OwnershipShareModel = ownershipShareModel;

  const collectionShareModel = sequelize
    .import(path.join(__dirname, './collection-share/CollectionShare.js'));
  database.CollectionShareModel = collectionShareModel;

  const catalogModel = sequelize
    .import(path.join(__dirname, './catalog/Catalog.js'));
  database.CatalogModel = catalogModel;

  const catalogCompositionModel = sequelize
    .import(path.join(__dirname, './catalog/CatalogComposition.js'));
  database.CatalogCompositionModel = catalogCompositionModel;

  const consumerModel = sequelize
    .import(path.join(__dirname, './consumer/Consumer.js'));
  database.ConsumerModel = consumerModel;

  const territoryModel = sequelize
    .import(path.join(__dirname, './territory/Territory.js'));
  database.TerritoryModel = territoryModel;

  const usageModel = sequelize
    .import(path.join(__dirname, './usage/Usage.js'));
  database.UsageModel = usageModel;

  const keys = Object.keys(database);
  for (let i = 0; i < keys.length; i += 1) {
    database[keys[i]].associate(database);
  }

  database.sequelize = sequelize;
  database.Sequelize = Sequelize;


  module.exports = database;
} else {
  throw new Error('Database config file log not found, disabling database.');
}
