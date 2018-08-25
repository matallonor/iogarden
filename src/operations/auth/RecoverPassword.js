const Operation = require('../Operation');

class RecoverPassword extends Operation {
  constructor({ userRepository, nodemailer }) {
    super();
    this.userRepository = userRepository;
    this.nodemailer = nodemailer;
  }

  async execute(data) {
    const {
      SUCCESS, ERROR, NOT_FOUND, VALIDATION_ERROR,
    } = this.outputs;

    try {
      if (!data.email) {
        return this.emit(VALIDATION_ERROR, new Error('ValidationError'));
      }
      const oldUser = await this.userRepository.getOne({ email: data.email });
      oldUser.generateToken();
      const user = await this.userRepository.updateOne({ email: data.email }, { token: oldUser.token });
      await this.nodemailer.sendRecoverPasswordEmail(user.email, { token: user.token });

      return this.emit(SUCCESS, user);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(NOT_FOUND, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

RecoverPassword.setOutputs(['SUCCESS', 'ERROR', 'NOT_FOUND', 'VALIDATION_ERROR']);

module.exports = RecoverPassword;
