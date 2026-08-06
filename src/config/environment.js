require('dotenv').config();

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 4000,
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'helpdesk_db',
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_this',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:4000',
  },
};