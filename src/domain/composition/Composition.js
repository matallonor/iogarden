class Composition {
  constructor(compositionData) {
    if (!(compositionData.title && compositionData.iswc && compositionData.type)) {
      throw new Error('ValidationError');
    }
    this.title = compositionData.title;
    this.language = compositionData.language;
    this.iswc = compositionData.iswc;
    this.type = compositionData.type;
    this.alternateTitle = compositionData.alternateTitle || null;
    this.versionType = compositionData.versionType || null;
    this.musicArrangement = compositionData.musicArrangement || null;
    this.lyricAdaptation = compositionData.lyricAdaptation || null;
    if (compositionData.id) {
      this._id = compositionData.id;
    }
  }

  get id() {
    return this._id;
  }
}

module.exports = Composition;
