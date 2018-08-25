
class Usage {
  constructor(usageData) {
    if (!(usageData.legacyId && usageData.datetime && usageData.country)) {
      throw new Error('ValidationError');
    }
    this.type = usageData.type || null;
    this.legacyId = usageData.legacyId;
    this.datetime = usageData.datetime;
    this.country = usageData.country;
    this.duration = usageData.duration || 0;
    this.artistName = usageData.artistName || null;
    if (usageData.id) {
      this._id = usageData.id;
    }
  }

  get id() {
    return this._id;
  }
}

module.exports = Usage;
