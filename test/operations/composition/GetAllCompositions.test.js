const GetAllCompositions = require('./../../../src/operations/composition/GetAllCompositions');
const User = require('./../../../src/domain/user/User');

describe('Operations :: Composition :: GetAllCompositions', () => {
  let getAllCompositions;
  let query;
  const queryInfo = { count: 0, offset: 0, limit: 15 };
  let user;

  beforeEach(() => {
    query = { catalog: 'floyd', title: 'dark' };
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
      const compositionRepository = {
        getAll: () => Promise.resolve([]),
        count: () => Promise.resolve(0),
      };
      getAllCompositions = new GetAllCompositions({ compositionRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(5);

      getAllCompositions.on(getAllCompositions.outputs.SUCCESS, (catalogs, info) => {
        expect(catalogs).toHaveLength(0);
        expect(catalogs).toEqual([]);
        expect(info.count).toEqual(queryInfo.count);
        expect(info.offset).toEqual(queryInfo.offset);
        expect(info.limit).toEqual(queryInfo.limit);
        done();
      });

      return getAllCompositions.execute(user, query);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const collectionShareRepository = {
        getCompositionsFromRH: () => Promise.resolve(),
        countCompositionsFromRH: () => Promise.reject(new Error('Internal error')),
      };
      getAllCompositions = new GetAllCompositions({ collectionShareRepository });
      user.role = 'client';
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      getAllCompositions.on(getAllCompositions.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return getAllCompositions.execute(user, {});
    });
  });
});
