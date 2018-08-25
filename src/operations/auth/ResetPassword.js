const Operation = require('../Operation');

class RecoverPassword extends Operation {
  constructor({ userRepository }) {
    super();
    this.userRepository = userRepository;
  }

  async execute(token, data) {
    const {
      SUCCESS, ERROR, NOT_FOUND, VALIDATION_ERROR,
    } = this.outputs;

    try {
      if (!(data.password)) {
        return this.emit(VALIDATION_ERROR, new Error('ValidationError'));
      }

      const oldUser = await this.userRepository.getOne({ token });
      await oldUser.setPassword(data.password);
      const user = await this.userRepository.update(oldUser.id, { password: oldUser.password });

      return this.emit(SUCCESS, user);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      if (error.message === 'BadPasswordError') {
        return this.emit(VALIDATION_ERROR, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

RecoverPassword.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'VALIDATION_ERROR']);

module.exports = RecoverPassword;
