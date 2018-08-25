const GetAllUsers = require('./../../../src/operations/user/GetAllUsers');

describe('Operations :: User :: GetAllUsers', () => {
  let getAllUsers;
  const query = { text: 'joan' };
  const queryInfo = { count: 10, offset: 0, limit: 15 };

  describe('when call succeed', () => {
    beforeEach(() => {
      const userRepository = {
        getAll: () => Promise.resolve([]),
        count: () => Promise.resolve(10),
      };
      getAllUsers = new GetAllUsers({ userRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(2);

      getAllUsers.on(getAllUsers.outputs.SUCCESS, (users, info) => {
        expect(users).toEqual([]);
        expect(info).toEqual(queryInfo);
        done();
      });

      return getAllUsers.execute(query);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const userRepository = {
        getAll: () => Promise.reject(new Error('Internal error')),
      };
      getAllUsers = new GetAllUsers({ userRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      getAllUsers.on(getAllUsers.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return getAllUsers.execute({});
    });
  });
});
