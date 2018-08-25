module.exports = {
  development: { // db: 'postgres://some_user:some_pass@postgres:5432/unison_dev',
    /*
    database: 'unison_dev',
    username: 'some_user',
    password: 'some_pass',
    host: 'localhost',
    port: '5432',
    dialect: 'postgres',
    */
    database: process.env.DB_NAME || 'unison_dev',
    username: process.env.DB_USERNAME || 'some_user',
    password: process.env.DB_PASSWORD || 'some_pass',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    dialect: process.env.DB_DIALECT || 'postgres',
  },
  production: process.env.DATABASE_URL,
};
