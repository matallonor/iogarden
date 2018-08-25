const GetCompositionRecordings = require('./../../../src/operations/composition/GetCompositionRecordings');
const User = require('./../../../src/domain/user/User');
const Composition = require('./../../../src/domain/composition/Composition');

describe('Operations :: Composition :: GetCompositionRecordings', () => {
  let getCompositionRecordings;
  let user;
  let composition;
  const query = { composition: 'compositionId1' };
  const queryInfo = { count: 0, offset: 0, limit: 15 };

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
        getAll: () => Promise.resolve([]),
        count: () => Promise.resolve(0),
      };
      getCompositionRecordings = new GetCompositionRecordings({ compositionRepository, recordingRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(4);

      getCompositionRecordings.on(getCompositionRecordings.outputs.SUCCESS, (recordings, info) => {
        expect(recordings).toHaveLength(0);
        expect(info.count).toEqual(queryInfo.count);
        expect(info.limit).toEqual(queryInfo.limit);
        expect(info.offset).toEqual(queryInfo.offset);
        done();
      });

      return getCompositionRecordings.execute(user, composition.id, query);
    });
  });

  describe('when composition doesn\'t exist', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.reject(new Error('NotFoundError')),
      };
      getCompositionRecordings = new GetCompositionRecordings({ compositionRepository });
      user.role = 'client';
    });

    it('should emit NOT_FOUND and error message', (done) => {
      expect.assertions(1);

      getCompositionRecordings.on(getCompositionRecordings.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });

      return getCompositionRecordings.execute(user, composition.id, query);
    });
  });

  describe('when user doesn\'t holds rights of composition', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.resolve(false),
      };
      getCompositionRecordings = new GetCompositionRecordings({ compositionRepository });
      user.role = 'client';
    });

    it('should emit FORBIDDEN and error', (done) => {
      expect.assertions(1);

      getCompositionRecordings.on(getCompositionRecordings.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });

      return getCompositionRecordings.execute(user, composition.id, query);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const compositionRepository = {
        hasRightHolder: () => Promise.reject(new Error('Internal error')),
      };
      getCompositionRecordings = new GetCompositionRecordings({ compositionRepository });
      user.role = 'client';
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      getCompositionRecordings.on(getCompositionRecordings.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return getCompositionRecordings.execute(user, composition.id, query);
    });
  });
});
