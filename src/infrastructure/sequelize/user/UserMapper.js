const User = require('../../../domain/user/User');

const UserMapper = {
  toEntity({ dataValues }) {
    const {
      id, email, firstName, lastName, ipi, role, nif,
      address, city, postalCode, country, password, disabled,
    } = dataValues;

    return new User(
      {
        id,
        email,
        firstName,
        lastName,
        ipi,
        role,
        password,
        disabled,
        nif,
        address,
        city,
        postalCode,
        country,
      },
    );
  },
};

module.exports = UserMapper;
