const { createServer } = require('http');
const express = require('express');

const methodOverride = require('method-override');
const compression = require('compression');
const bodyParser = require('body-parser');
const cors = require('cors');

const requestLogger = require('./middlewares/requestLogger');
const errorHandler = require('./middlewares/errorHandler');
const router = require('./router');


class Server {
  constructor({ config, logger, containerMiddleware }) {
    this.config = config;
    this.logger = logger;

    this.server = null;
    this.express = express();

    // =====================================================================
    // Middlewares
    // =====================================================================

    // Removes x-powered-by header, to obfuscate that Express is being used
    this.express.disable('x-powered-by');
    // To support clients that only support GET and POST
    this.express.use(methodOverride('X-HTTP-Method-Override'));
    // Compresses requests
    this.express.use(compression());
    // Access control
    this.express.use(cors());
    // Supports application/json post data
    this.express.use(bodyParser.json());
    // Request logger
    this.express.use(requestLogger({ logger: this.logger }));
    // Container middleware
    this.express.use(containerMiddleware);

    // =====================================================================
    // Routes
    // =====================================================================

    this.express.use(router());

    // =====================================================================
    // Error Handler
    // =====================================================================

    this.express.use(errorHandler());
  }

  start() {
    return new Promise((resolve, reject) => {
      if (this.server === null) {
        const port = parseInt(this.config.serverPort, 10);
        this.server = createServer(this.express);

        this.server.on('error', (error) => {
          this.logger.error(`HTTP Server Error: ${error}`);
          reject(new Error('HTTP Server Error'));
        });
        this.server.on('listening', () => {
          const addr = this.server.address();
          const bind = typeof addr === 'string'
            ? `pipe ${addr}`
            : `port ${addr.port}`;
          this.logger.info(`Listening on ${bind}`);
          resolve(this.server);
        });
        this.server.listen(port, () => {
          this.logger.info(`[p ${process.pid}] HTTP Server process created`);
        });
      } else {
        reject(new Error('Server already start'));
      }
    });
  }

  stop() {
    if (this.server !== null) {
      this.logger.info('Closing Server programmatically');
      this.server.close();
      this.server = null;
    } else {
      this.logger.info('Server not started yet');
    }
  }
}

module.exports = Server;
