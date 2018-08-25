
class Consumer {
  constructor(consumerData) {
    if (!(consumerData.name && consumerData.keyname)) {
      throw new Error('ValidationError');
    }
    this.name = consumerData.name;
    this.keyname = consumerData.keyname;
    this.country = consumerData.country || null;
    if (consumerData.id) {
      this._id = consumerData.id;
    }
  }

  get id() {
    return this._id;
  }
}

module.exports = Consumer;
