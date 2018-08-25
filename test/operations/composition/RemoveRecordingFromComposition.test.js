const RemoveRecordingFromComposition = require('./../../../src/operations/composition/RemoveRecordingFromComposition');
const User = require('./../../../src/domain/user/User');
const Composition = require('./../../../src/domain/composition/Composition');

describe('Operations :: Composition :: RemoveRecordingFromComposition', () => {
  let removeRecordingFromComposition;
  let user;
  let composition;
  const recordingId = 'recordingId1';

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
      const recordingRepository = {
        delete: () => Promise.resolve(),
      };
      removeRecordingFromComposition = new RemoveRecordingFromComposition({
        compositionRepository,
        recordingRepository,
      });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(1);

      removeRecordingFromComposition.on(removeRecordingFromComposition.outputs.SUCCESS, () => {
        done();
      });

      expect(removeRecordingFromComposition.execute(user, composition.id, recordingId)).resolves.toBe(true);
    });
  });

  describe('when composition doesn\'t exist', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.reject(new Error('NotFoundError')),
      };
      removeRecordingFromComposition = new RemoveRecordingFromComposition({ compositionRepository });
      user.role = 'client';
    });

    it('should emit NOT_FOUND and error message', (done) => {
      expect.assertions(1);

      removeRecordingFromComposition.on(removeRecordingFromComposition.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });

      return removeRecordingFromComposition.execute(user, composition.id, recordingId);
    });
  });

  describe('when user doesn\'t holds rights of composition', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.resolve(false),
      };
      removeRecordingFromComposition = new RemoveRecordingFromComposition({ compositionRepository });
      user.role = 'client';
    });

    it('should emit FORBIDDEN and error', (done) => {
      expect.assertions(1);

      removeRecordingFromComposition.on(removeRecordingFromComposition.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });

      return removeRecordingFromComposition.execute(user, composition.id, recordingId);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const recordingRepository = {
        delete: () => Promise.reject(new Error('Internal error')),
      };
      removeRecordingFromComposition = new RemoveRecordingFromComposition({ recordingRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      removeRecordingFromComposition.on(removeRecordingFromComposition.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return removeRecordingFromComposition.execute(user, composition.id, recordingId);
    });
  });
});
