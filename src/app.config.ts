export default (): any => {
  const {
    PORT,
    DATABASE_HOST,
    DATABASE_USER,
    DATABASE_PASSWORD,
    DATABASE_NAME,
    TOKEN_EXPIRATION_SECONDS,
    PASSWORD_SALT_ROUNDS,
    JWT_SECRET_KEY,
  } = process.env;

  return {
    port: parseInt(PORT, 10) || 3000,
    database: {
      host: DATABASE_HOST,
      user: DATABASE_USER,
      password: DATABASE_PASSWORD,
      name: DATABASE_NAME,
    },
    auth: {
      tokenExpirationSeconds: TOKEN_EXPIRATION_SECONDS,
      passwordSaltRounds: parseInt(PASSWORD_SALT_ROUNDS, 10),
      jwtSecretKey: JWT_SECRET_KEY,
    },
  };
};
