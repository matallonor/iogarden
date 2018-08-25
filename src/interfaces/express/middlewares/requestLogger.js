const morgan = require('morgan');


class StreamAdapter {
  constructor(logger) {
    this.logger = logger;
  }

  write(message) {
    return this.logger.info(message); // message.slice(0, -1)
  }
}

module.exports = ({ logger }) => {
  const morganFormat = 'dev';
  return morgan(morganFormat, { stream: new StreamAdapter(logger) });
};
