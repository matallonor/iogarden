class Recording {
  constructor(recordingData) {
    if (!(recordingData.isrc && recordingData.compositionId)) {
      throw new Error('ValidationError');
    }
    this.isrc = recordingData.isrc;
    this.compositionId = recordingData.compositionId;
    if (recordingData.id) {
      this._id = recordingData.id;
    }
  }

  get id() {
    return this._id;
  }
}

module.exports = Recording;
