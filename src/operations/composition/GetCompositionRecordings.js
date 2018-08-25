const Operation = require('../Operation');

class GetCompositionRecordings extends Operation {
  constructor({ recordingRepository, compositionRepository }) {
    super();
    this.recordingRepository = recordingRepository;
    this.compositionRepository = compositionRepository;
  }

  async execute(user, compositionId, query) {
    const {
      SUCCESS, ERROR, FORBIDDEN, NOT_FOUND,
    } = this.outputs;

    try {
      if (!user.isAdmin() && !await this.compositionRepository.hasRightHolder(compositionId, user.id)) {
        return this.emit(FORBIDDEN, new Error('ForbiddenError'));
      }

      const offset = query.offset || 0;
      const limit = query.limit || 15;
      const filters = { compositionId };

      const recordings = await this.recordingRepository.getAll({ offset, limit }, filters);
      const count = await this.recordingRepository.count(filters);
      const info = { count, offset, limit };

      return this.emit(SUCCESS, recordings, info);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

GetCompositionRecordings.setOutputs(['SUCCESS', 'ERROR', 'FORBIDDEN', 'NOT_FOUND']);

module.exports = GetCompositionRecordings;
