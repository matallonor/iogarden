const bcrypt = require('bcrypt');

class User {
  constructor(userData) {
    if (!(userData.email && userData.firstName && userData.lastName
      && userData.ipi && userData.role && userData.password)) {
      throw new Error('ValidationError');
    }
    this.email = userData.email;
    this.firstName = userData.firstName;
    this.lastName = userData.lastName;
    this.role = userData.role;
    this.ipi = userData.ipi;
    this.nif = userData.nif || null;
    this.address = userData.address || null;
    this.city = userData.city || null;
    this.postalCode = userData.postalCode || null;
    this.country = userData.country || null;
    this.password = userData.password;
    if (userData.id) {
      this._id = userData.id;
    }
  }

  setPassword(password) {
    const regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).*$/;
    if (password.length < 8 || !regex.test(password)) {
      throw new Error('BadPasswordError');
    }
    this.password = bcrypt.hashSync(password, 10);
  }

  getPassword() {
    return this.password;
  }

  get id() {
    return this._id;
  }

  validatePassword(password) {
    return bcrypt.compareSync(password, this.password);
  }

  generateToken() {
    let text = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < 30; i += 1) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    this.token = text;
  }

  isAdmin() {
    return this.role === 'admin';
  }
}

module.exports = User;
