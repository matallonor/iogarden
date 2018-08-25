const Status = require('http-status');

module.exports = [
  (req, res, next) => {
    const resetPassword = req.container.resolve('resetPassword');
    const {
      SUCCESS, ERROR, NOT_FOUND, VALIDATION_ERROR,
    } = resetPassword.outputs;

    resetPassword
      .on(SUCCESS, (user) => {
        res.status(Status.OK).json({ user });
      })
      .on(VALIDATION_ERROR, () => {
        res.status(Status.BAD_REQUEST).json({
          type: 'ValidationError',
          message: 'missing required psw parameter',
        });
      })
      .on(NOT_FOUND, (error) => {
        res.status(Status.NOT_FOUND).json({
          type: 'NotFoundError',
          message: error.message,
        });
      })
      .on(ERROR, next);

    resetPassword.execute(req.body.token, req.body);
  },
];
