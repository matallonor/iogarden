const scopePerRequestMiddleware = (container) => (req, res, next) => {
  req.container = container.createScope();
  return next();
};

module.exports = scopePerRequestMiddleware;
