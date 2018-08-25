
class Territory {
  constructor(territoryData) {
    if (!(territoryData.tis && territoryData.name)) {
      throw new Error('ValidationError');
    }
    this.tis = territoryData.tis;
    this.name = territoryData.name;
    if (territoryData.id) {
      this._id = territoryData.id;
    }
  }

  get id() {
    return this._id;
  }
}

module.exports = Territory;
