const jwt = require('jsonwebtoken');

const Operation = require('../Operation');

class CheckAuthToken extends Operation {
  constructor({ userRepository, config }) {
    super();
    this.userRepository = userRepository;
    this.config = config;
  }

  async execute(token) {
    const { SUCCESS, INVALID_TOKEN } = this.outputs;

    try {
      const decoded = await jwt.verify(token, this.config.express.secret);
      const user = await this.userRepository.get(decoded.userId);
      return this.emit(SUCCESS, user);
    } catch (error) {
      return this.emit(INVALID_TOKEN, error);
    }
  }
}

CheckAuthToken.setOutputs(['SUCCESS', 'INVALID_TOKEN']);

module.exports = CheckAuthToken;
