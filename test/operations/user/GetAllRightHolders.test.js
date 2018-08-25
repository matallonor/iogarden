const GetAllRightHolders = require('./../../../src/operations/user/GetAllRightHolders');

describe('Operations :: User :: GetAllRightHolders', () => {
  let getAllRightHolders;
  const query = { text: 'joan', offset: 15, limit: 5 };
  const queryInfo = { count: 0, offset: 0, limit: 15 };

  describe('when call succeed', () => {
    beforeEach(() => {
      const userRepository = {
        getAll: () => Promise.resolve([]),
        count: () => Promise.resolve(0),
      };
      getAllRightHolders = new GetAllRightHolders({ userRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(2);

      getAllRightHolders.on(getAllRightHolders.outputs.SUCCESS, (users, info) => {
        expect(users).toEqual([]);
        expect(info).toEqual(queryInfo);
        done();
      });

      return getAllRightHolders.execute({});
    });


    it('should emit SUCCESS and return info with our params', (done) => {
      expect.assertions(4);

      getAllRightHolders.on(getAllRightHolders.outputs.SUCCESS, (users, info) => {
        expect(users).toEqual([]);
        expect(info.count).toEqual(queryInfo.count);
        expect(info.offset).toEqual(query.offset);
        expect(info.limit).toEqual(query.limit);
        done();
      });

      return getAllRightHolders.execute(query);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const userRepository = {
        getAll: () => Promise.reject(new Error('Internal error')),
      };
      getAllRightHolders = new GetAllRightHolders({ userRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      getAllRightHolders.on(getAllRightHolders.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return getAllRightHolders.execute(query);
    });
  });
});
