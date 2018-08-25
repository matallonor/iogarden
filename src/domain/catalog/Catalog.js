class Catalog {
  constructor(catalogData) {
    if (!(catalogData.name && (catalogData.ownerId || catalogData.owner))) {
      throw new Error('ValidationError');
    }
    this.name = catalogData.name;
    this.ownerId = catalogData.ownerId;

    if (catalogData.id) {
      this.id = catalogData.id;
    }
    if (catalogData.compositions) {
      this.compositions = catalogData.compositions;
    }
    if (catalogData.owner) {
      this.owner = catalogData.owner;
    }
  }

  isOwnedBy(userId) {
    return this.ownerId === userId;
  }
}

module.exports = Catalog;
