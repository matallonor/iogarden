const GetComposition = require('./../../../src/operations/composition/GetComposition');
const User = require('./../../../src/domain/user/User');
const Composition = require('./../../../src/domain/composition/Composition');

describe('Operations :: Composition :: GetComposition', () => {
  let getComposition;
  let composition;
  let user;

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
      id: 'composition.id',
      title: 'Brain Damage',
      language: 'english',
      iswc: 'T-034.524.680-1',
      type: 'temazo',
    });
  });

  describe('when call succeed', () => {
    beforeEach(() => {
      const compositionRepository = {
        get: () => Promise.resolve(composition),
      };
      getComposition = new GetComposition({ compositionRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(5);

      getComposition.on(getComposition.outputs.SUCCESS, (catalogRet) => {
        expect(catalogRet.id).toEqual(composition.id);
        expect(catalogRet.title).toEqual(composition.title);
        expect(catalogRet.language).toEqual(composition.language);
        expect(catalogRet.iswc).toEqual(composition.iswc);
        expect(catalogRet.type).toEqual(composition.type);
        done();
      });

      return getComposition.execute(user, composition.id);
    });
  });

  describe('when composition doesn\'t exist', () => {
    beforeEach(() => {
      const compositionRepository = {
        get: () => Promise.reject(new Error('NotFoundError')),
      };
      getComposition = new GetComposition({ compositionRepository });
    });

    it('should emit NOT_FOUND and return error', (done) => {
      expect.assertions(1);

      getComposition.on(getComposition.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });
      return getComposition.execute(user, composition.id);
    });
  });

  describe('when user doesn\'t have permissions', () => {
    beforeEach(() => {
      const compositionRepository = {
        get: (id) => Promise.resolve(new Composition(Object.assign({ id }, composition))),
        hasRightHolder: () => Promise.resolve(false),
      };
      getComposition = new GetComposition({ compositionRepository });
      user.role = 'client';
    });

    it('should emit FORBIDDEN and return error', (done) => {
      expect.assertions(1);

      getComposition.on(getComposition.outputs.FORBIDDEN, (error) => {
        expect(error.message).toEqual('ForbiddenError');
        done();
      });
      return getComposition.execute(user, composition.id);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const compositionRepository = {
        get: () => Promise.reject(new Error('Internal error')),
      };
      getComposition = new GetComposition({ compositionRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      getComposition.on(getComposition.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return getComposition.execute(user, composition.id);
    });
  });
});
