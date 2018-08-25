const container = require('./src/container');

const app = container.resolve('server');

app.start()
  .catch(() => {
    process.exit();
  });
