class CollectionShare {
  constructor(collectionShareData) {
    if (!(collectionShareData.rightHolderId && collectionShareData.compositionId
      && collectionShareData.territoryId && typeof collectionShareData.performanceSplit === 'number'
      && typeof collectionShareData.mechanicalSplit === 'number'
      && typeof collectionShareData.synchronizationSplit === 'number')) {
      throw new Error('ValidationError');
    }
    this.rightHolderId = collectionShareData.rightHolderId;
    this.compositionId = collectionShareData.compositionId;
    this.territoryId = collectionShareData.territoryId;
    this.parentId = collectionShareData.parentId;
    this.performanceSplit = collectionShareData.performanceSplit;
    this.mechanicalSplit = collectionShareData.mechanicalSplit;
    this.synchronizationSplit = collectionShareData.synchronizationSplit;
    if (collectionShareData.id) {
      this._id = collectionShareData.id;
    }
  }

  get id() {
    return this._id;
  }
}

module.exports = CollectionShare;
