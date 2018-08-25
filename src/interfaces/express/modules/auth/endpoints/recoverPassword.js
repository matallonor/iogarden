const Status = require('http-status');

module.exports = [
  (req, res, next) => {
    const recoverPassword = req.container.resolve('recoverPassword');
    const {
      SUCCESS,
      ERROR,
      VALIDATION_ERROR,
      NOT_FOUND,
    } = recoverPassword.outputs;

    recoverPassword
      .on(SUCCESS, (user) => {
        res.status(Status.OK).json({ user });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          message: error.message,
        });
      })
      .on(VALIDATION_ERROR, () => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          message: 'missing required email parameter',
        });
      })
      .on(ERROR, next);

    recoverPassword.execute(req.body);
  },
];
