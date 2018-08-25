const GetCatalog = require('./../../../src/operations/catalog/GetCatalog');
const User = require('./../../../src/domain/user/User');
const Catalog = require('./../../../src/domain/catalog/Catalog');

describe('Operations :: Catalog :: GetCatalog', () => {
  let getCatalog;
  let catalog;
  let user;
  const catalogId = 'catalogId1';

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
        get: (id) => Promise.resolve(Object.assign({ id }, catalog)),
      };
      getCatalog = new GetCatalog({ catalogRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(3);

      getCatalog.on(getCatalog.outputs.SUCCESS, (catalogRet) => {
        expect(catalogRet.id).toEqual(catalogId);
        expect(catalogRet.name).toEqual(catalog.name);
        expect(catalogRet.ownerId).toEqual(catalog.ownerId);
        done();
      });

      return getCatalog.execute(user, catalogId);
    });
  });

  describe('when catalog doesn\'t exist', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: () => Promise.reject(new Error('NotFoundError')),
      };
      getCatalog = new GetCatalog({ catalogRepository });
    });

    it('should emit NOT_FOUND and return error', (done) => {
      expect.assertions(1);

      getCatalog.on(getCatalog.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });
      return getCatalog.execute(user, catalogId);
    });
  });

  describe('when user doesn\'t have permissions', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: (id) => Promise.resolve(new Catalog(Object.assign({ id }, catalog))),
      };
      getCatalog = new GetCatalog({ catalogRepository });
      catalog.ownerId = 'userId2';
      user.role = 'client';
    });

    it('should emit FORBIDDEN and return error', (done) => {
      expect.assertions(1);

      getCatalog.on(getCatalog.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });
      return getCatalog.execute(user, catalogId);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: () => Promise.reject(new Error('Internal error')),
      };
      getCatalog = new GetCatalog({ catalogRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      getCatalog.on(getCatalog.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return getCatalog.execute(user, catalogId);
    });
  });
});
