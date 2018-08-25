const CreateComposition = require('./../../../src/operations/composition/CreateComposition');

describe('Operations :: Composition :: CreateComposition', () => {
  let createComposition;
  let compositionData;

  beforeEach(() => {
    compositionData = {
      title: 'Any colour you like',
      language: 'english',
      iswc: 'T-034.524.680-1',
      type: 'temazo',
    };
  });

  describe('when call succeed', () => {
    beforeEach(() => {
      const compositionRepository = {
        create: (compositionInfo) => Promise.resolve(compositionInfo),
      };
      createComposition = new CreateComposition({ compositionRepository });
    });

    it('should emit SUCCESS and return info', (done) => {
      expect.assertions(4);

      createComposition.on(createComposition.outputs.SUCCESS, (composition) => {
        expect(composition.title).toEqual(compositionData.title);
        expect(composition.language).toEqual(compositionData.language);
        expect(composition.iswc).toEqual(compositionData.iswc);
        expect(composition.type).toEqual(compositionData.type);
        done();
      });

      return createComposition.execute(compositionData);
    });
  });

  describe('when no info is sent', () => {
    beforeEach(() => {
      const compositionRepository = {};
      createComposition = new CreateComposition({ compositionRepository });
    });

    it('should emit VALIDATION_ERROR and return error', (done) => {
      expect.assertions(1);

      createComposition.on(createComposition.outputs.VALIDATION_ERROR, (error) => {
        expect(error.message).toEqual('ValidationError');
        done();
      });
      return createComposition.execute({});
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const compositionRepository = {
        create: () => Promise.reject(new Error('Internal error')),
      };
      createComposition = new CreateComposition({ compositionRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      createComposition.on(createComposition.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return createComposition.execute(compositionData);
    });
  });
});
