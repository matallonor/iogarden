const createCatalog = require('./createCatalog');
const createCatalogFromCWR = require('./createCatalogFromCWR');
const getAllCatalogs = require('./getAllCatalogs');
const getCatalog = require('./getCatalog');
const deleteCatalog = require('./deleteCatalog');
const updateCatalog = require('./updateCatalog');
const addCompositionToCatalog = require('./addCompositionToCatalog');
const removeCompositionFromCatalog = require('./removeCompositionFromCatalog');

module.exports = {
  createCatalog,
  createCatalogFromCWR,
  getAllCatalogs,
  getCatalog,
  deleteCatalog,
  updateCatalog,
  addCompositionToCatalog,
  removeCompositionFromCatalog,
};
