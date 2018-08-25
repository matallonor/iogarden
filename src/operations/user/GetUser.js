const Operation = require('../Operation');

class GetUser extends Operation {
  constructor({ userRepository }) {
    super();
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const {
      SUCCESS, ERROR, NOT_FOUND,
    } = this.outputs;

    try {
      const user = await this.userRepository.get(userId);

      return this.emit(SUCCESS, user);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

GetUser.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = GetUser;
