const AddOwnerToComposition = require('./../../../src/operations/composition/AddOwnerToComposition');
const User = require('./../../../src/domain/user/User');
const Composition = require('./../../../src/domain/composition/Composition');

describe('Operations :: Composition :: AddOwnerToComposition', () => {
  let addOwnerToComposition;
  let user;
  let composition;
  let owner;
  const ownershipShareData = {
    performanceSplit: 75,
    mechanicalSplit: 50,
    synchronizationSplit: 0,
  };

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
      owners: ['userId1'],
    });
  });

  describe('when call succeed', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.resolve(false),
      };
      const ownershipShareRepository = {
        create: (ownershipShare) => Promise.resolve(ownershipShare),
      };
      addOwnerToComposition = new AddOwnerToComposition({ compositionRepository, ownershipShareRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(5);

      addOwnerToComposition.on(addOwnerToComposition.outputs.SUCCESS, (ownershipShare) => {
        expect(ownershipShare.ownerId).toEqual(owner.id);
        expect(ownershipShare.compositionId).toEqual(composition.id);
        expect(ownershipShare.performanceSplit).toEqual(ownershipShareData.performanceSplit);
        expect(ownershipShare.mechanicalSplit).toEqual(ownershipShareData.mechanicalSplit);
        expect(ownershipShare.synchronizationSplit).toEqual(ownershipShareData.synchronizationSplit);
        done();
      });

      return addOwnerToComposition.execute(user, composition.id, owner.id, ownershipShareData);
    });
  });

  describe('when you send no data', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.resolve(false),
      };
      addOwnerToComposition = new AddOwnerToComposition({ compositionRepository });
    });

    it('should emit VALIDATION_ERROR and error message', (done) => {
      expect.assertions(1);

      addOwnerToComposition.on(addOwnerToComposition.outputs.VALIDATION_ERROR, (error) => {
        expect(error.message).toEqual('ValidationError');
        done();
      });

      return addOwnerToComposition.execute(user, composition.id, owner.id, {});
    });
  });

  describe('when composition doesn\'t exist', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.reject(new Error('NotFoundError')),
      };
      addOwnerToComposition = new AddOwnerToComposition({ compositionRepository });
      user.role = 'client';
    });

    it('should emit NOT_FOUND and error message', (done) => {
      expect.assertions(1);

      addOwnerToComposition.on(addOwnerToComposition.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });

      return addOwnerToComposition.execute(user, composition.id, owner.id, ownershipShareData);
    });
  });

  describe('when user doesn\'t holds rights of composition', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.resolve(false),
      };
      addOwnerToComposition = new AddOwnerToComposition({ compositionRepository });
      user.role = 'client';
    });

    it('should emit FORBIDDEN and error', (done) => {
      expect.assertions(1);

      addOwnerToComposition.on(addOwnerToComposition.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });

      return addOwnerToComposition.execute(user, composition.id, owner.id, ownershipShareData);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.reject(new Error('Internal error')),
      };
      addOwnerToComposition = new AddOwnerToComposition({ compositionRepository });
      user.role = 'client';
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      addOwnerToComposition.on(addOwnerToComposition.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return addOwnerToComposition.execute(user, composition.id, owner.id, ownershipShareData);
    });
  });
});
