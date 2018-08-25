const Operation = require('../Operation');

class RemoveRecordingFromComposition extends Operation {
  constructor({ recordingRepository, compositionRepository }) {
    super();
    this.recordingRepository = recordingRepository;
    this.compositionRepository = compositionRepository;
  }

  async execute(user, compositionId, recordingId) {
    const {
      SUCCESS, ERROR, NOT_FOUND, FORBIDDEN,
    } = this.outputs;

    try {
      if (!user.isAdmin() && !await this.compositionRepository.hasRightHolder(compositionId, user.id)) {
        return this.emit(FORBIDDEN, new Error('ForbiddenError'));
      }

      const deleted = await this.recordingRepository.delete(recordingId);

      return this.emit(SUCCESS, deleted);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

RemoveRecordingFromComposition.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'FORBIDDEN']);

module.exports = RemoveRecordingFromComposition;
