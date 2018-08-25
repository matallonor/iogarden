const CreateUser = require('./../../../src/operations/user/CreateUser');

describe('Operations :: User :: CreateUser', () => {
  let createUser;
  const user = {
    email: 'jgrau@nakima.es',
    firstName: 'Joan',
    lastName: 'Grau',
    ipi: 489543282,
    role: 'admin',
    password: '123qweQWE',
  };

  describe('when call succeed', () => {
    beforeEach(() => {
      const userRepository = {
        create: (userInfo) => Promise.resolve(userInfo),
      };
      createUser = new CreateUser({ userRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(6);

      createUser.on(createUser.outputs.SUCCESS, (userInfo) => {
        expect(userInfo.email).toEqual(user.email);
        expect(userInfo.firstName).toEqual(user.firstName);
        expect(userInfo.lastName).toEqual(user.lastName);
        expect(userInfo.ipi).toEqual(user.ipi);
        expect(userInfo.role).toEqual(user.role);
        expect(userInfo.password).not.toEqual(user.password);
        done();
      });

      return createUser.execute(user);
    });
  });

  describe('when no info is sent', () => {
    beforeEach(() => {
      const userRepository = {
        create: () => Promise.reject(new Error('Internal error')),
      };
      createUser = new CreateUser({ userRepository });
    });

    it('should emit VALIDATION_ERROR and return error', (done) => {
      expect.assertions(1);

      createUser.on(createUser.outputs.VALIDATION_ERROR, (error) => {
        expect(error.message).toEqual('ValidationError');
        done();
      });
      return createUser.execute({ userName: 'joan' });
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const userRepository = {
        create: () => Promise.reject(new Error('Internal error')),
      };
      createUser = new CreateUser({ userRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      createUser.on(createUser.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return createUser.execute(user);
    });
  });

  describe('when email already exist', () => {
    beforeEach(() => {
      const userRepository = {
        create: () => Promise.reject(new Error('AlreadyExist')),
      };
      createUser = new CreateUser({ userRepository });
    });

    it('should emit CONFLICT and return error message', (done) => {
      expect.assertions(1);

      createUser.on(createUser.outputs.CONFLICT, (error) => {
        expect(error.message).toEqual('AlreadyExist');
        done();
      });
      return createUser.execute(user);
    });
  });

  describe('when output doesn\'t exist', () => {
    beforeEach(() => {
      const userRepository = {
        create: () => Promise.reject(new Error('AlreadyExist')),
      };
      createUser = new CreateUser({ userRepository });
    });

    it('should throw operation error', (done) => {
      expect.assertions(1);

      try {
        createUser.on(createUser.outputs.NOT_FOUND, () => {});
      } catch (error) {
        expect(error.message).toEqual('Invalid output "undefined" to operation CreateUser.');
        done();
      }
      return createUser.execute();
    });
  });
});
