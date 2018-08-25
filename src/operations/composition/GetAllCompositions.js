const Operation = require('../Operation');

class GetAllCompositions extends Operation {
  constructor({ compositionRepository }) {
    super();
    this.compositionRepository = compositionRepository;
  }

  async execute(user, query) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const offset = query.offset || 0;
      const limit = query.limit || 15;
      const filters = {};

      if (query.catalog) {
        filters.catalog = query.catalog;
      }
      if (query.title) {
        filters.title = query.title;
      }
      let compositions;
      let count;
      if (!user.isAdmin()) {
        compositions = await this.compositionRepository.getAllCompositionsFromRightHolder({ offset, limit }, user.id);
        count = await this.compositionRepository.countAllCompositionsFromRightHolder(user.id);
      } else {
        compositions = await this.compositionRepository.getAll({ offset, limit }, filters);
        count = await this.compositionRepository.count(filters);
      }

      const info = { count, offset, limit };

      return this.emit(SUCCESS, compositions, info);
    } catch (error) {
      return this.emit(ERROR, error);
    }
  }
}

GetAllCompositions.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllCompositions;
