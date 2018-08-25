const DeleteComposition = require('./../../../src/operations/composition/DeleteComposition');

describe('Operations :: Composition :: DeleteComposition', () => {
  let deleteComposition;
  const compositionId = 'catalogId1';

  describe('when call succeed', () => {
    beforeEach(() => {
      const compositionRepository = {
        delete: () => Promise.resolve(),
      };
      deleteComposition = new DeleteComposition({ compositionRepository });
    });

    it('should emit SUCCESS', (done) => {
      expect.assertions(1);

      deleteComposition.on(deleteComposition.outputs.SUCCESS, () => {
        done();
      });

      expect(deleteComposition.execute(compositionId)).resolves.toBe(true);
    });
  });

  describe('when composition doesn\'t exist', () => {
    beforeEach(() => {
      const compositionRepository = {
        delete: () => Promise.reject(new Error('NotFoundError')),
      };
      deleteComposition = new DeleteComposition({ compositionRepository });
    });

    it('should emit NOT_FOUND and return error', (done) => {
      expect.assertions(1);

      deleteComposition.on(deleteComposition.outputs.NOT_FOUND, (error) => {
        expect(error.message).toEqual('NotFoundError');
        done();
      });
      return deleteComposition.execute(compositionId);
    });
  });

  describe('when call fails', () => {
    beforeEach(() => {
      const compositionRepository = {
        delete: () => Promise.reject(new Error('Internal error')),
      };
      deleteComposition = new DeleteComposition({ compositionRepository });
    });

    it('should emit ERROR and return error message', (done) => {
      expect.assertions(1);

      deleteComposition.on(deleteComposition.outputs.ERROR, (error) => {
        expect(error.message).toEqual('Internal error');
        done();
      });
      return deleteComposition.execute(compositionId);
    });
  });
});
