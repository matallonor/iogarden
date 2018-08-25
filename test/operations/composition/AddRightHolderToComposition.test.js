const AddRightHolderToComposition = require('./../../../src/operations/composition/AddRightHolderToComposition');
const User = require('./../../../src/domain/user/User');
const Composition = require('./../../../src/domain/composition/Composition');

describe('Operations :: Composition :: AddRightHolderToComposition', () => {
  let addRecordingToComposition;
  let user;
  let composition;
  let cShareData;
  const rightHolder = 'rightHolderId1';

  beforeEach(() => {
    cShareData = {
      territoryId: 'territoryIdUS',
      performanceSplit: 75,
      mechanicalSplit: 50,
      synchronizationSplit: 0,
    };
    user = new User({
      id: 'userId1',
      email: 'jgrau@nakima.es',
      firstName: 'joan',
      lastName: 'grau',
      ipi: 264819375,
      role: 'admin',
      password: '123qweQWE',
    });
    composition = new Composition({
      id: 'compositionId1',
      title: 'Any colour you like',
      language: 'english',
      iswc: 'T-034.524.680-1',
      type: 'temazo',
      ownershipShares: ['userId1'],
      rightHolders: ['userId1'],
    });
  });

  describe('when call succeed', () => {
    beforeEach(() => {
      const collectionShareRepository = {
        create: (collectionShare) => Promise.resolve(collectionShare),
      };
      const userRepository = {
        get: () => Promise.resolve(),
      };
      addRecordingToComposition = new AddRightHolderToComposition({
        collectionShareRepository,
        userRepository,
      });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(6);

      addRecordingToComposition.on(addRecordingToComposition.outputs.SUCCESS, (collectionShare) => {
        expect(collectionShare.compositionId).toEqual(composition.id);
        expect(collectionShare.territoryId).toEqual(cShareData.territoryId);
        expect(collectionShare.performanceSplit).toEqual(cShareData.performanceSplit);
        expect(collectionShare.mechanicalSplit).toEqual(cShareData.mechanicalSplit);
        expect(collectionShare.synchronizationSplit).toEqual(cShareData.synchronizationSplit);
        expect(collectionShare.rightHolderId).toEqual(rightHolder);
        done();
      });

      return addRecordingToComposition.execute(user, composition.id, rightHolder, cShareData);
    });
  });

  describe('when rightHolder doesn\'t exist', () => {
    beforeEach(() => {
      const userRepository = {
        get: () => Promise.reject(new Error('NotFoundError')),
      };
      addRecordingToComposition = new AddRightHolderToComposition({ userRepository });
    });

    it('should emit NOT_FOUND and error message', (done) => {
      expect.assertions(1);

      addRecordingToComposition.on(addRecordingToComposition.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });

      return addRecordingToComposition.execute(user, composition.id, rightHolder, cShareData);
    });
  });

  describe('when you send no recording data', () => {
    beforeEach(() => {
      const userRepository = {
        get: () => Promise.resolve(),
      };
      addRecordingToComposition = new AddRightHolderToComposition({ userRepository });
    });

    it('should emit VALIDATION_ERROR and error message', (done) => {
      expect.assertions(1);

      addRecordingToComposition.on(addRecordingToComposition.outputs.VALIDATION_ERROR, (error) => {
        expect(error.message).toEqual('ValidationError');
        done();
      });

      return addRecordingToComposition.execute(user, composition.id, rightHolder, {});
    });
  });

  describe('when user doesn\'t holds rights of composition', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.resolve(false),
      };
      const userRepository = {
        get: () => Promise.resolve(),
      };
      addRecordingToComposition = new AddRightHolderToComposition({
        compositionRepository,
        userRepository,
      });
      user.role = 'client';
    });

    it('should emit FORBIDDEN and error', (done) => {
      expect.assertions(1);

      addRecordingToComposition.on(addRecordingToComposition.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });

      return addRecordingToComposition.execute(user, composition.id, rightHolder, cShareData);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const userRepository = {
        get: () => Promise.reject(new Error('Internal error')),
      };
      addRecordingToComposition = new AddRightHolderToComposition({ userRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      addRecordingToComposition.on(addRecordingToComposition.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return addRecordingToComposition.execute(user, composition.id, rightHolder, cShareData);
    });
  });
});
