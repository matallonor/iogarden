const jwt = require('jsonwebtoken');

const Operation = require('../Operation');

class GenerateAuthToken extends Operation {
  constructor({ config }) {
    super();
    this.config = config;
  }

  async execute(userId) {
    const { SUCCESS, ERROR } = this.outputs;

    try {
      const token = jwt.sign({ userId }, this.config.express.secret, { expiresIn: '7d' });

      return this.emit(SUCCESS, token);
    } catch (error) {
      return this.emit(ERROR, error);
    }
  }
}

GenerateAuthToken.setOutputs(['SUCCESS', 'ERROR']);

module.exports = GenerateAuthToken;
