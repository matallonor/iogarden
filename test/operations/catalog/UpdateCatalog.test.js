const UpdateCatalog = require('./../../../src/operations/catalog/UpdateCatalog');
const Catalog = require('./../../../src/domain/catalog/Catalog');
const User = require('./../../../src/domain/user/User');

describe('Operations :: Catalog :: UpdateCatalog', () => {
  let updateCatalog;
  let updateInfo;
  const oldCatalog = new Catalog({ name: 'Catalog', ownerId: 'userId1', id: 'catalogId1' });
  let user;

  beforeEach(() => {
    updateInfo = { name: 'NewCatalog' };
    user = new User({
      id: 'userId1',
      email: 'jgrau@nakima.es',
      firstName: 'joan',
      lastName: 'grau',
      ipi: 264819375,
      role: 'admin',
      password: '123qweQWE',
    });
  });

  describe('when call succeed', () => {
    beforeEach(() => {
      const catalogRepository = {
        update: (id, data) => Promise.resolve(Object.assign(oldCatalog, data)),
        get: () => Promise.resolve(oldCatalog),
      };
      updateCatalog = new UpdateCatalog({ catalogRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(3);

      updateCatalog.on(updateCatalog.outputs.SUCCESS, (catalog) => {
        expect(catalog.id).toEqual(oldCatalog.id);
        expect(catalog.ownerId).toEqual(oldCatalog.ownerId);
        expect(catalog.name).toEqual(updateInfo.name);
        done();
      });

      return updateCatalog.execute(user, oldCatalog.id, updateInfo);
    });
  });

  describe('when catalog doesn\'t exist', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: () => Promise.reject(new Error('NotFoundError')),
      };
      updateCatalog = new UpdateCatalog({ catalogRepository });
    });

    it('should emit NOT_FOUND and return error', (done) => {
      expect.assertions(1);

      updateCatalog.on(updateCatalog.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });
      return updateCatalog.execute(user, oldCatalog.id, updateInfo);
    });
  });

  describe('when user doesn\'t have permissions', () => {
    beforeEach(() => {
      const catalogRepository = {
        get: () => Promise.resolve(oldCatalog),
      };
      updateCatalog = new UpdateCatalog({ catalogRepository });
      user.role = 'client';
      oldCatalog.ownerId = 'userId2';
    });

    it('should emit FORBIDDEN and return error', (done) => {
      expect.assertions(1);

      updateCatalog.on(updateCatalog.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });
      return updateCatalog.execute(user, oldCatalog.id, updateInfo);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const catalogRepository = {
        update: () => Promise.reject(new Error('Internal error')),
        get: () => Promise.resolve(oldCatalog),
      };
      updateCatalog = new UpdateCatalog({ catalogRepository });
      updateInfo.ownerId = 'userId2';
      updateInfo.compositions = [];
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      updateCatalog.on(updateCatalog.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return updateCatalog.execute(user, oldCatalog.id, updateInfo);
    });
  });
});
