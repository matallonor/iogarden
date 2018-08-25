const database = require('./database');

class Config {
  constructor() {
    this._loggingLevel = process.env.LOGGING_LEVEL || 'debug';
    this._serverPort = process.env.SERVER_PORT || '3000';
    this._database = database.development;
    this._express = {
      secret: 'This is really secret',
    };
  }

  get loggingLevel() {
    return this._loggingLevel;
  }

  get serverPort() {
    return this._serverPort;
  }

  get database() {
    return this._database;
  }

  get express() {
    return this._express;
  }
}

module.exports = Config;
