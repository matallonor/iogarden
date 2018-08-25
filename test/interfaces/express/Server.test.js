const request = require('supertest');
const Server = require('./../../../src/interfaces/express/Server');

describe('Interfaces :: Express :: Server', () => {
  let server;
  const loggerInfoRegistry = [];
  const loggerErrorRegistry = [];

  beforeEach(() => {
    const config = { serverPort: 3003 };
    const logger = {
      info: (msg) => loggerInfoRegistry.push(msg),
      error: (msg) => loggerErrorRegistry.push(msg),
    };
    const containerMiddleware = (err, req, res, next) => next();

    server = new Server({
      config, logger, containerMiddleware,
    });
  });

  describe('#start', () => {
    it('should start server', async () => {
      try {
        await server.start();
        server.stop();
      } catch (error) {
        expect(true).toBeFalsy();
      }
    });

    it('should throw error', async (done) => {
      try {
        expect.assertions(1);
        await server.start();
        await server.start();
      } catch (error) {
        expect(error.message).toEqual('Server already start');
        server.stop();
        done();
      }
    });
  });

  describe('#request', () => {
    let httpServer;

    beforeEach(async () => {
      httpServer = await server.start();
    });

    afterEach(() => {
      server.stop();
    });

    it('should respond 200 to /api/status', () => request(httpServer)
      .get('/api/status').expect(200));

    it('should respond 404 to /foo/bar', () => request(httpServer)
      .get('/foo/bar').expect(404));
  });
});
