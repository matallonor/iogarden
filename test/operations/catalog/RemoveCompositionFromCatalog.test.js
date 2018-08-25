const RemoveCompositionFromCatalog = require('./../../../src/operations/catalog/RemoveCompositionFromCatalog');
const User = require('./../../../src/domain/user/User');
const Catalog = require('./../../../src/domain/catalog/Catalog');
const Composition = require('./../../../src/domain/composition/Composition');

describe('Operations :: Catalog :: RemoveCompositionFromCatalog', () => {
  let removeCompositionFromCatalog;
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
      compositions: ['compositionId1', 'compositionId2'],
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
        removeComposition: (id, comp) => {
          catalog.compositions.splice(catalog.compositions.indexOf(comp.id), 1);
          return Promise.resolve(catalog);
        },
      };
      const compositionRepository = {
        get: () => Promise.resolve(composition),
        hasRightHolder: () => Promise.resolve(true),
      };
      removeCompositionFromCatalog = new RemoveCompositionFromCatalog({
        catalogRepository,
        compositionRepository,
      });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(2);

      removeCompositionFromCatalog.on(removeCompositionFromCatalog.outputs.SUCCESS, (updatedCatalog) => {
        expect(updatedCatalog.compositions).toHaveLength(1);
        expect(updatedCatalog.compositions).not.toContain(composition.id);
        done();
      });

      return removeCompositionFromCatalog.execute(user, catalog.id, composition.id);
    });
  });

  describe('when catalog doesn\'t exist', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: () => Promise.reject(new Error('NotFoundError')),
      };
      const compositionRepository = {};
      removeCompositionFromCatalog = new RemoveCompositionFromCatalog({
        catalogRepository,
        compositionRepository,
      });
    });

    it('should emit NOT_FOUND and error message', (done) => {
      expect.assertions(1);

      removeCompositionFromCatalog.on(removeCompositionFromCatalog.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });

      return removeCompositionFromCatalog.execute(user, catalog.id, composition.id);
    });
  });

  describe('when user doesn\'t own catalog', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: () => Promise.resolve(catalog),
      };
      const compositionRepository = {};
      removeCompositionFromCatalog = new RemoveCompositionFromCatalog({
        catalogRepository,
        compositionRepository,
      });
      user.role = 'client';
      catalog.ownerId = 'userId2';
    });

    it('should emit FORBIDDEN and error message', (done) => {
      expect.assertions(1);

      removeCompositionFromCatalog.on(removeCompositionFromCatalog.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });

      return removeCompositionFromCatalog.execute(user, catalog.id, composition.id);
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
      removeCompositionFromCatalog = new RemoveCompositionFromCatalog({
        catalogRepository,
        compositionRepository,
      });
      user.role = 'client';
    });

    it('should emit FORBIDDEN and error', (done) => {
      expect.assertions(1);

      removeCompositionFromCatalog.on(removeCompositionFromCatalog.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });

      return removeCompositionFromCatalog.execute(user, catalog.id, composition.id);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: () => Promise.reject(new Error('Internal error')),
      };
      removeCompositionFromCatalog = new RemoveCompositionFromCatalog({ catalogRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      removeCompositionFromCatalog.on(removeCompositionFromCatalog.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return removeCompositionFromCatalog.execute({});
    });
  });
});
