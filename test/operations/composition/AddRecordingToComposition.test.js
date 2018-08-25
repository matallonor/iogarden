const AddRecordingToComposition = require('./../../../src/operations/composition/AddRecordingToComposition');
const User = require('./../../../src/domain/user/User');
const Composition = require('./../../../src/domain/composition/Composition');

describe('Operations :: Composition :: AddRecordingToComposition', () => {
  let addRecordingToComposition;
  let user;
  let composition;
  const recordingData = { isrc: 'US-Z03-08-32476' };

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
        get: () => Promise.resolve(composition),
      };
      const recordingRepository = {
        create: (recording) => Promise.resolve(recording),
      };
      addRecordingToComposition = new AddRecordingToComposition({ compositionRepository, recordingRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(2);

      addRecordingToComposition.on(addRecordingToComposition.outputs.SUCCESS, (recording) => {
        expect(recording.compositionId).toEqual(composition.id);
        expect(recording.isrc).toEqual(recordingData.isrc);
        done();
      });

      return addRecordingToComposition.execute(user, composition.id, recordingData);
    });
  });

  describe('when composition doesn\'t exist', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.reject(new Error('NotFoundError')),
      };
      addRecordingToComposition = new AddRecordingToComposition({ compositionRepository });
      user.role = 'client';
    });

    it('should emit NOT_FOUND and error message', (done) => {
      expect.assertions(1);

      addRecordingToComposition.on(addRecordingToComposition.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });

      return addRecordingToComposition.execute(user, composition.id, recordingData);
    });
  });

  describe('when you send no recording data', () => {
    beforeEach(() => {
      const compositionRepository = {};
      addRecordingToComposition = new AddRecordingToComposition({ compositionRepository });
    });

    it('should emit VALIDATION_ERROR and error message', (done) => {
      expect.assertions(1);

      addRecordingToComposition.on(addRecordingToComposition.outputs.VALIDATION_ERROR, (error) => {
        expect(error.message).toEqual('ValidationError');
        done();
      });

      return addRecordingToComposition.execute(user, composition.id, {});
    });
  });

  describe('when user doesn\'t holds rights of composition', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.resolve(false),
      };
      addRecordingToComposition = new AddRecordingToComposition({ compositionRepository });
      user.role = 'client';
    });

    it('should emit FORBIDDEN and error', (done) => {
      expect.assertions(1);

      addRecordingToComposition.on(addRecordingToComposition.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });

      return addRecordingToComposition.execute(user, composition.id, recordingData);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const recordingRepository = {
        create: () => Promise.reject(new Error('Internal error')),
      };
      addRecordingToComposition = new AddRecordingToComposition({ recordingRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      addRecordingToComposition.on(addRecordingToComposition.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return addRecordingToComposition.execute(user, composition.id, recordingData);
    });
  });
});
