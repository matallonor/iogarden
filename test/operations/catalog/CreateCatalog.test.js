const CreateCatalog = require('./../../../src/operations/catalog/CreateCatalog');
const User = require('./../../../src/domain/user/User');

describe('Operations :: Catalog :: CreateCatalog', () => {
  let createCatalog;
  let catalog;
  let user;

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
    catalog = {
      name: 'Pink Floyd Catalog',
    };
  });

  describe('when call succeed', () => {
    beforeEach(() => {
      const catalogRepository = {
        create: (catalogInfo) => Promise.resolve(catalogInfo),
      };
      createCatalog = new CreateCatalog({ catalogRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(2);

      createCatalog.on(createCatalog.outputs.SUCCESS, (catalogInfo) => {
        expect(catalogInfo.name).toEqual(catalog.name);
        expect(catalogInfo.ownerId).toEqual(user.id);
        done();
      });

      return createCatalog.execute(user, catalog);
    });
  });

  describe('when no info is sent', () => {
    beforeEach(() => {
      const catalogRepository = {
        create: () => Promise.reject(new Error('Internal error')),
      };
      createCatalog = new CreateCatalog({ catalogRepository });
      user.role = 'client';
    });

    it('should emit VALIDATION_ERROR and return error', (done) => {
      expect.assertions(1);

      createCatalog.on(createCatalog.outputs.VALIDATION_ERROR, (error) => {
        expect(error.message).toEqual('ValidationError');
        done();
      });
      return createCatalog.execute(user, {});
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const catalogRepository = {
        create: () => Promise.reject(new Error('Internal error')),
      };
      createCatalog = new CreateCatalog({ catalogRepository });
      catalog.ownerId = 'userId2';
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      createCatalog.on(createCatalog.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return createCatalog.execute(user, catalog);
    });
  });
});
