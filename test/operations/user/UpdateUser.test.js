const UpdateUser = require('./../../../src/operations/user/UpdateUser');

describe('Operations :: User :: UpdateUser', () => {
  let updateUser;
  const updateInfo = {
    email: 'jgrau@nakima.es', password: '123qweQWE', role: 'admin', firstName: 'joan'
  };
  const userId = 'userId1';

  describe('when call succeed', () => {
    beforeEach(() => {
      const userRepository = {
        update: (id, data) => Promise.resolve(Object.assign({ id }, data)),
      };
      updateUser = new UpdateUser({ userRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(2);

      updateUser.on(updateUser.outputs.SUCCESS, (user) => {
        expect(user.id).toEqual(userId);
        expect(user.firstName).toEqual(updateInfo.firstName);
        done();
      });

      return updateUser.execute(userId, updateInfo);
    });
  });

  describe('when user doesn\'t exist', () => {
    beforeEach(() => {
      const userRepository = {
        update: () => Promise.reject(new Error('NotFoundError')),
      };
      updateUser = new UpdateUser({ userRepository });
    });

    it('should emit NOT_FOUND and return error', (done) => {
      expect.assertions(1);

      updateUser.on(updateUser.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });
      return updateUser.execute(userId, updateInfo);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const userRepository = {
        update: () => Promise.reject(new Error('Internal error')),
      };
      updateUser = new UpdateUser({ userRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      updateUser.on(updateUser.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return updateUser.execute(userId);
    });
  });
});
