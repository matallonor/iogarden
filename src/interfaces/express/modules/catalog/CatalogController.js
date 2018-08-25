const { Router } = require('express');

const {
  createCatalog,
  getCatalog,
  deleteCatalog,
  updateCatalog,
  getAllCatalogs,
  addCompositionToCatalog,
  removeCompositionFromCatalog,
  createCatalogFromCWR,
} = require('./endpoints');


const UserController = {
  get router() {
    const router = Router();

    router.get('/', getAllCatalogs); // Authenticated owner
    router.post('/', createCatalog); // Authenticated
    router.get('/:id/', getCatalog); // Authenticated owner
    router.put('/:id/', updateCatalog); // Authenticated owner
    router.delete('/:id/', deleteCatalog); // Authenticated owner

    // Owner of catalog, rightHolder of composition
    router.post('/:id/composition/:compId', addCompositionToCatalog);
    router.delete('/:id/composition/:compId', removeCompositionFromCatalog);

    router.post('/cwr/', createCatalogFromCWR); // Authenticated

    return router;
  },
};

module.exports = UserController;
