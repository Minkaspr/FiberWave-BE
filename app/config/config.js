import 'dotenv/config';

const config = {
  env: process.env.NODE_ENV || 'env',
  port: process.env.PORT || 3000,
  jwt: process.env.JWT_SECRET,
  refreshJwt: process.env.JWT_REFRESH_SECRET,
  dbUrl: process.env.POSTGRES_URL,
  dbName: process.env.DB_NAME,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT || 5432,
};

export { config };