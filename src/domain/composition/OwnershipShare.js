class OwnershipShare {
  constructor(ownershipShareData) {
    if (!(ownershipShareData.ownerId && ownershipShareData.compositionId
      && typeof ownershipShareData.performanceSplit === 'number'
      && typeof ownershipShareData.mechanicalSplit === 'number'
      && typeof ownershipShareData.synchronizationSplit === 'number')) {
      throw new Error('ValidationError');
    }
    this.ownerId = ownershipShareData.ownerId;
    this.compositionId = ownershipShareData.compositionId;
    this.parentId = ownershipShareData.parentId;
    this.performanceSplit = ownershipShareData.performanceSplit;
    this.mechanicalSplit = ownershipShareData.mechanicalSplit;
    this.synchronizationSplit = ownershipShareData.synchronizationSplit;
    if (ownershipShareData.id) {
      this._id = ownershipShareData.id;
    }
  }

  get id() {
    return this._id;
  }
}

module.exports = OwnershipShare;
