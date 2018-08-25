const signin = require('./signin');
const adminSignin = require('./adminSignin');
const recoverPassword = require('./recoverPassword');
const resetPassword = require('./resetPassword');

module.exports = {
  signin,
  recoverPassword,
  resetPassword,
  adminSignin,
};
