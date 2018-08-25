const { Router } = require('express');

const {
  signin,
  adminSignin,
  recoverPassword,
  resetPassword,
} = require('./endpoints');


const AuthController = {
  get router() {
    const router = Router();

    router.post('/admin/signin', adminSignin); // Public
    router.post('/signin', signin); // Public
    router.post('/recover-password', recoverPassword); // Public
    router.post('/reset-password', resetPassword); // Public

    return router;
  },
};

module.exports = AuthController;
