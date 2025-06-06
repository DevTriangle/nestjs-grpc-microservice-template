export default () => ({
  service_token: process.env.SERVICE_TOKEN,

  grpc_host: process.env.GRPC_HOST,
  disable_logger: process.env.DISABLE_LOGGER,

  db_host: process.env.DB_HOST,
  db_port: process.env.DB_PORT,
  db_username: process.env.DB_USERNAME,
  db_password: process.env.DB_PASSWORD,
  db_name: process.env.DB_NAME,
})
