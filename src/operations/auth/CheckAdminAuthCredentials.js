const Operation = require('../Operation');

class Signin extends Operation {
  constructor({ userRepository }) {
    super();
    this.userRepository = userRepository;
  }

  async execute(email, password) {
    const {
      SUCCESS, ERROR, BAD_EMAIL, BAD_PASSWORD, FORBIDDEN,
    } = this.outputs;

    try {
      const user = await this.userRepository.getByEmail(email);
      if (!user.isAdmin()) {
        return this.emit(FORBIDDEN, new Error('ForbiddenError'));
      }

      if (!user.validatePassword(password)) {
        return this.emit(BAD_PASSWORD, new Error('BadPasswordError'));
      }

      return this.emit(SUCCESS, user);
    } catch (error) {
      if (error.message === 'NotFoundError') {
        return this.emit(BAD_EMAIL, error);
      }
      return this.emit(ERROR, error);
    }
  }
}

Signin.setOutputs(['SUCCESS', 'ERROR', 'BAD_EMAIL', 'BAD_PASSWORD', 'FORBIDDEN']);

module.exports = Signin;
