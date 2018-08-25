const Status = require('http-status');

module.exports = [
  (req, res, next) => {
    if (!req.user.isAdmin()) {
      res.status(Status.FORBIDDEN).json({ type: 'Forbidden' });
    }
    next();
  },
];
