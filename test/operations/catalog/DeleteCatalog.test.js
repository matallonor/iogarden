const DeleteCatalog = require('./../../../src/operations/catalog/DeleteCatalog');
const User = require('./../../../src/domain/user/User');
const Catalog = require('./../../../src/domain/catalog/Catalog');

describe('Operations :: Catalog :: DeleteCatalog', () => {
  let deleteCatalog;
  let catalog;
  let user;
  const id = 'catalogId1';

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
    });
  });

  describe('when call succeed', () => {
    beforeEach(() => {
      const catalogRepository = {
        remove: () => Promise.resolve(),
        get: () => Promise.resolve(catalog),
      };
      deleteCatalog = new DeleteCatalog({ catalogRepository });
    });

    it('should emit SUCCESS', (done) => {
      expect.assertions(1);

      deleteCatalog.on(deleteCatalog.outputs.SUCCESS, () => {
        done();
      });

      expect(deleteCatalog.execute(user, id)).resolves.toBe(true);
    });
  });

  describe('when catalog doesn\'t exist', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: () => Promise.reject(new Error('NotFoundError')),
      };
      deleteCatalog = new DeleteCatalog({ catalogRepository });
    });

    it('should emit NOT_FOUND and return error', (done) => {
      expect.assertions(1);

      deleteCatalog.on(deleteCatalog.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });
      return deleteCatalog.execute(user, id);
    });
  });

  describe('when user doesn\'t have permissions', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: () => Promise.resolve(catalog),
      };
      deleteCatalog = new DeleteCatalog({ catalogRepository });
      user.role = 'client';
      catalog.ownerId = 'userId2';
    });

    it('should emit FORBIDDEN and return error', (done) => {
      expect.assertions(1);

      deleteCatalog.on(deleteCatalog.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });
      return deleteCatalog.execute(user, id);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const catalogRepository = {
        remove: () => Promise.reject(new Error('Internal error')),
        get: () => Promise.resolve(catalog),
      };
      deleteCatalog = new DeleteCatalog({ catalogRepository });
      user.role = 'client';
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      deleteCatalog.on(deleteCatalog.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return deleteCatalog.execute(user, id);
    });
  });
});
