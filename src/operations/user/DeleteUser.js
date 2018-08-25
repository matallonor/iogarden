const Operation = require('../Operation');

class DeleteUser extends Operation {
  constructor({ userRepository }) {
    super();
    this.userRepository = userRepository;
  }

  async execute(userId) {
    const {
      SUCCESS, ERROR, NOT_FOUND,
    } = this.outputs;

    try {
      const deleted = await this.userRepository.delete(userId);

      return this.emit(SUCCESS, deleted);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

DeleteUser.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = DeleteUser;
