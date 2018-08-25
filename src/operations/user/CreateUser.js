const Operation = require('../Operation');
const User = require('../../domain/user/User');

class CreateUser extends Operation {
  constructor({ userRepository }) {
    super();
    this.userRepository = userRepository;
  }

  async execute(userData) {
    const {
      SUCCESS, ERROR, VALIDATION_ERROR, CONFLICT,
    } = this.outputs;

    try {
      const userModel = new User(userData);
      userModel.setPassword(userData.password);
      const user = await this.userRepository.create(userModel);

      return this.emit(SUCCESS, user);
    } catch (error) {
      if (error.message === 'AlreadyExist') {
        return this.emit(CONFLICT, error);
      }
      if (error.message === 'ValidationError') {
        return this.emit(VALIDATION_ERROR, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

CreateUser.setOutputs(['SUCCESS', 'ERROR', 'VALIDATION_ERROR', 'CONFLICT']);

module.exports = CreateUser;
