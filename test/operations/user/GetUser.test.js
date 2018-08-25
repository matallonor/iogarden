const GetUser = require('./../../../src/operations/user/GetUser');

describe('Operations :: User :: GetUser', () => {
  let getUser;
  const userId = 'userId1';

  describe('when call succeed', () => {
    beforeEach(() => {
      const userRepository = {
        get: (id) => Promise.resolve({ id }),
      };
      getUser = new GetUser({ userRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(1);

      getUser.on(getUser.outputs.SUCCESS, (user) => {
        expect(user.id).toEqual(userId);
        done();
      });

      return getUser.execute(userId);
    });
  });

  describe('when user doesn\'t exist', () => {
    beforeEach(() => {
      const userRepository = {
        get: () => Promise.reject(new Error('NotFoundError')),
      };
      getUser = new GetUser({ userRepository });
    });

    it('should emit NOT_FOUND and return error', (done) => {
      expect.assertions(1);

      getUser.on(getUser.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });
      return getUser.execute(userId);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const userRepository = {
        get: () => Promise.reject(new Error('Internal error')),
      };
      getUser = new GetUser({ userRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      getUser.on(getUser.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return getUser.execute(userId);
    });
  });
});
