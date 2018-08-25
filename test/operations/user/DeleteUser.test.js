const DeleteUser = require('./../../../src/operations/user/DeleteUser');

describe('Operations :: User :: DeleteUser', () => {
  let deleteUser;
  const user = 'userId1';

  describe('when call succeed', () => {
    beforeEach(() => {
      const userRepository = {
        delete: () => Promise.resolve(),
      };
      deleteUser = new DeleteUser({ userRepository });
    });

    it('should emit SUCCESS', (done) => {
      expect.assertions(1);

      deleteUser.on(deleteUser.outputs.SUCCESS, () => {
        done();
      });

      expect(deleteUser.execute(user)).resolves.toBe(true);
    });
  });

  describe('when user doesn\'t exist', () => {
    beforeEach(() => {
      const userRepository = {
        delete: () => Promise.reject(new Error('NotFoundError')),
      };
      deleteUser = new DeleteUser({ userRepository });
    });

    it('should emit NOT_FOUND and return error', (done) => {
      expect.assertions(1);

      deleteUser.on(deleteUser.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });
      return deleteUser.execute(user);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const userRepository = {
        delete: () => Promise.reject(new Error('Internal error')),
      };
      deleteUser = new DeleteUser({ userRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      deleteUser.on(deleteUser.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return deleteUser.execute(user);
    });
  });
});
