const RemoveOwnerFromComposition = require('./../../../src/operations/composition/RemoveOwnerFromComposition');
const User = require('./../../../src/domain/user/User');
const Composition = require('./../../../src/domain/composition/Composition');

describe('Operations :: Composition :: RemoveOwnerFromComposition', () => {
  let removeOwnerFromComposition;
  let user;
  let composition;
  let owner;

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
    owner = new User({
      id: 'userId2',
      email: 'mtallon@nakima.es',
      firstName: 'marc',
      lastName: 'tallon',
      ipi: 264219875,
      role: 'client',
      password: '123qweQWE',
    });
    composition = new Composition({
      id: 'compositionId1',
      title: 'Any colour you like',
      language: 'english',
      iswc: 'T-034.524.680-1',
      type: 'temazo',
      owners: ['userId1', 'userId2'],
    });
  });

  describe('when call succeed', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.resolve(false),
      };
      const ownershipShareRepository = {
        delete: () => Promise.resolve(),
      };
      removeOwnerFromComposition = new RemoveOwnerFromComposition({ compositionRepository, ownershipShareRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(1);

      removeOwnerFromComposition.on(removeOwnerFromComposition.outputs.SUCCESS, () => {
        done();
      });

      expect(removeOwnerFromComposition.execute(user, composition.id, owner.id)).resolves.toBe(true);
    });
  });

  describe('when catalog doesn\'t exist', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.reject(new Error('NotFoundError')),
      };
      removeOwnerFromComposition = new RemoveOwnerFromComposition({ compositionRepository });
      user.role = 'client';
    });

    it('should emit NOT_FOUND and error message', (done) => {
      expect.assertions(1);

      removeOwnerFromComposition.on(removeOwnerFromComposition.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });

      return removeOwnerFromComposition.execute(user, composition.id, owner.id);
    });
  });

  describe('when user doesn\'t holds rights of composition', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.resolve(false),
      };
      removeOwnerFromComposition = new RemoveOwnerFromComposition({ compositionRepository });
      user.role = 'client';
    });

    it('should emit FORBIDDEN and error', (done) => {
      expect.assertions(1);

      removeOwnerFromComposition.on(removeOwnerFromComposition.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });

      return removeOwnerFromComposition.execute(user, composition.id, owner.id);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const ownershipShareRepository = {
        delete: () => Promise.reject(new Error('Internal error')),
      };
      removeOwnerFromComposition = new RemoveOwnerFromComposition({ ownershipShareRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      removeOwnerFromComposition.on(removeOwnerFromComposition.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return removeOwnerFromComposition.execute(user, composition.id, owner.id);
    });
  });
});
