const Operation = require('../Operation');

class GetAllRightHolders extends Operation {
  constructor({ userRepository }) {
    super();
    this.userRepository = userRepository;
  }

  async execute(query) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const offset = query.offset || 0;
      const limit = query.limit || 15;
      const filters = { role: 'client' };

      if (query.text) {
        filters.text = query.text;
      }

      const users = await this.userRepository.getAll(offset, limit, filters);
      const count = await this.userRepository.count(filters);
      const info = { count, offset, limit };

      return this.emit(SUCCESS, users, info);
    } catch (error) {
      return this.emit(ERROR, error);
    }
  }
}

GetAllRightHolders.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GetAllRightHolders;
