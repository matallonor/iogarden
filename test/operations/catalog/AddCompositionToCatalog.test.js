const AddCompositionToCatalog = require('./../../../src/operations/catalog/AddCompositionToCatalog');
const User = require('./../../../src/domain/user/User');
const Catalog = require('./../../../src/domain/catalog/Catalog');
const Composition = require('./../../../src/domain/composition/Composition');

describe('Operations :: Catalog :: AddCompositionToCatalog', () => {
  let addCompositionToCatalog;
  let catalog;
  let user;
  let composition;

  beforeEach(() => {
    user = new User({
      id: 'userId1',
      email: 'jgrau@nakima.es',
      firstName: 'joan',
      lastName: 'grau',
      ipi: 264819375,
      role: 'admin',
      password: '123qweQWE',
    });
    catalog = new Catalog({
      name: 'Pink Floyd Catalog',
      ownerId: 'userId1',
      id: 'catalogId1',
    });
    composition = new Composition({
      id: 'compositionId1',
      title: 'Any colour you like',
      language: 'english',
      iswc: 'T-034.524.680-1',
      type: 'temazo',
    });
  });

  describe('when call succeed', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: () => Promise.resolve(catalog),
        addComposition: (id, comp) => Promise.resolve(new Catalog(Object.assign(catalog, { compositions: [comp] }))),
      };
      const compositionRepository = {
        get: () => Promise.resolve(composition),
        hasRightHolder: () => Promise.resolve(true),
      };
      addCompositionToCatalog = new AddCompositionToCatalog({ catalogRepository, compositionRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(4);

      addCompositionToCatalog.on(addCompositionToCatalog.outputs.SUCCESS, (updatedCatalog) => {
        expect(updatedCatalog.compositions).toHaveLength(1);
        expect(updatedCatalog.name).toEqual(catalog.name);
        expect(updatedCatalog.ownerId).toEqual(catalog.ownerId);
        expect(updatedCatalog.id).toEqual(catalog.id);
        done();
      });

      return addCompositionToCatalog.execute(user, catalog.id, composition.id);
    });
  });

  describe('when catalog doesn\'t exist', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: () => Promise.reject(new Error('NotFoundError')),
      };
      const compositionRepository = {};
      addCompositionToCatalog = new AddCompositionToCatalog({ catalogRepository, compositionRepository });
    });

    it('should emit NOT_FOUND and error message', (done) => {
      expect.assertions(1);

      addCompositionToCatalog.on(addCompositionToCatalog.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });

      return addCompositionToCatalog.execute(user, catalog.id, composition.id);
    });
  });

  describe('when user doesn\'t own catalog', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: () => Promise.resolve(catalog),
      };
      const compositionRepository = {};
      addCompositionToCatalog = new AddCompositionToCatalog({ catalogRepository, compositionRepository });
      user.role = 'client';
      catalog.ownerId = 'userId2';
    });

    it('should emit FORBIDDEN and error message', (done) => {
      expect.assertions(1);

      addCompositionToCatalog.on(addCompositionToCatalog.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });

      return addCompositionToCatalog.execute(user, catalog.id, composition.id);
    });
  });

  describe('when user doesn\'t holds rights of composition', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: () => Promise.resolve(catalog),
      };
      const compositionRepository = {
        get: () => Promise.resolve(composition),
        hasRightHolder: () => Promise.resolve(false),
      };
      addCompositionToCatalog = new AddCompositionToCatalog({ catalogRepository, compositionRepository });
      user.role = 'client';
    });

    it('should emit FORBIDDEN and error', (done) => {
      expect.assertions(1);

      addCompositionToCatalog.on(addCompositionToCatalog.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });

      return addCompositionToCatalog.execute(user, catalog.id, composition.id);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: () => Promise.reject(new Error('Internal error')),
      };
      addCompositionToCatalog = new AddCompositionToCatalog({ catalogRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      addCompositionToCatalog.on(addCompositionToCatalog.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return addCompositionToCatalog.execute({});
    });
  });
});
