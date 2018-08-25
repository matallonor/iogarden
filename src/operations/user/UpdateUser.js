const Operation = require('../Operation');

class UpdateUser extends Operation {
  constructor({ userRepository }) {
    super();
    this.userRepository = userRepository;
  }

  async execute(userId, userInfo) {
    const {
      SUCCESS, ERROR, NOT_FOUND,
    } = this.outputs;

    try {
      const userData = Object.assign({}, userInfo);
      if (userData.email) {
        delete userData.email;
      }
      if (userData.password) {
        delete userData.password;
      }
      if (userData.role) {
        delete userData.role;
      }
      const user = await this.userRepository.update(userId, userData);

      return this.emit(SUCCESS, user);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

UpdateUser.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND']);

module.exports = UpdateUser;
