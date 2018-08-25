
const UpdateComposition = require('./../../../src/operations/composition/UpdateComposition');
const Composition = require('./../../../src/domain/composition/Composition');
const User = require('./../../../src/domain/user/User');

describe('Operations :: Composition :: UpdateComposition', () => {
  let updateComposition;
  let updateInfo;
  const oldComposition = new Composition({
    title: 'Any colour you like',
    language: 'english',
    iswc: 'T-034.524.680-1',
    type: 'temazo',
  });
  let user;

  beforeEach(() => {
    updateInfo = { title: 'Eclipse' };
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
        update: (id, data) => Promise.resolve(new Composition(Object.assign(oldComposition, data))),
        hasRightHolder: () => Promise.resolve(false),
      };
      updateComposition = new UpdateComposition({ compositionRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(4);

      updateComposition.on(updateComposition.outputs.SUCCESS, (composition) => {
        expect(composition.title).toEqual(updateInfo.title);
        expect(composition.language).toEqual(oldComposition.language);
        expect(composition.iswc).toEqual(oldComposition.iswc);
        expect(composition.type).toEqual(oldComposition.type);
        done();
      });

      return updateComposition.execute(user, oldComposition.id, updateInfo);
    });
  });

  describe('when composition doesn\'t exist', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.reject(new Error('NotFoundError')),
      };
      updateComposition = new UpdateComposition({ compositionRepository });
    });

    it('should emit NOT_FOUND and return error', (done) => {
      expect.assertions(1);

      updateComposition.on(updateComposition.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });
      return updateComposition.execute(user, oldComposition.id, updateInfo);
    });
  });

  describe('when user doesn\'t have permissions', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.resolve(false),
      };
      updateComposition = new UpdateComposition({ compositionRepository });
      user.role = 'client';
    });

    it('should emit FORBIDDEN and return error', (done) => {
      expect.assertions(1);

      updateComposition.on(updateComposition.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });
      return updateComposition.execute(user, oldComposition.id, updateInfo);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const compositionRepository = {
        update: () => Promise.reject(new Error('Internal error')),
        hasRightHolder: () => Promise.resolve(false),
      };
      updateComposition = new UpdateComposition({ compositionRepository });
      updateInfo.owner = 'userId2';
      updateInfo.rightHolders = [];
      updateInfo.collectionShares = [];
      updateInfo.owners = [];
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      updateComposition.on(updateComposition.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return updateComposition.execute(user, oldComposition.id, updateInfo);
    });
  });
});
