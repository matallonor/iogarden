const GetAllCatalogs = require('./../../../src/operations/catalog/GetAllCatalogs');
const User = require('./../../../src/domain/user/User');

describe('Operations :: Catalog :: GetAllCatalogs', () => {
  let getAllCatalogs;
  let query;
  const queryInfo = { count: 0, offset: 0, limit: 15 };
  let user;

  beforeEach(() => {
    query = { name: 'catalog', owner: 'userId2' };
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
        getAll: () => Promise.resolve([]),
        count: () => Promise.resolve(0),
      };
      getAllCatalogs = new GetAllCatalogs({ catalogRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(4);

      getAllCatalogs.on(getAllCatalogs.outputs.SUCCESS, (catalogs, info) => {
        expect(catalogs).toEqual([]);
        expect(info.count).toEqual(queryInfo.count);
        expect(info.offset).toEqual(queryInfo.offset);
        expect(info.limit).toEqual(queryInfo.limit);
        done();
      });

      return getAllCatalogs.execute(user, query);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const catalogRepository = {
        getAll: () => Promise.reject(new Error('Internal error')),
      };
      getAllCatalogs = new GetAllCatalogs({ catalogRepository });
      user.role = 'client';
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      getAllCatalogs.on(getAllCatalogs.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return getAllCatalogs.execute(user, {});
    });
  });
});
