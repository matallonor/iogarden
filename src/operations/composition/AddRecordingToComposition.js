const Operation = require('../Operation');
const Recording = require('../../domain/composition/Recording');

class AddRecordingToComposition extends Operation {
  constructor({ compositionRepository, recordingRepository }) {
    super();
    this.compositionRepository = compositionRepository;
    this.recordingRepository = recordingRepository;
  }

  async execute(user, compositionId, recordingData) {
    const {
      SUCCESS, ERROR, NOT_FOUND, VALIDATION_ERROR, FORBIDDEN,
    } = this.outputs;

    try {
      if (!user.isAdmin() && !await this.compositionRepository.hasRightHolder(compositionId, user.id)) {
        return this.emit(FORBIDDEN, new Error('ForbiddenError'));
      }

      const recordingModel = new Recording(Object.assign(recordingData, { compositionId }));
      const recording = await this.recordingRepository.create(recordingModel);

      return this.emit(SUCCESS, recording);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

AddRecordingToComposition.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'VALIDATION_ERROR', 'FORBIDDEN']);

module.exports = AddRecordingToComposition;
