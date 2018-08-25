const winston = require('winston');


module.exports = ({ config }) => {
  const logger = winston.createLogger({
    level: config.loggingLevel,
  });

  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));

  return logger;
};
