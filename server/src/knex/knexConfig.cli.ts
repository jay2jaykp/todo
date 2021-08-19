import dotenv from "dotenv";
import { Knex } from "knex";
import path from "path";
require("ts-node/register");

dotenv.config();

/**
 * @remarks Update your config settings.
 *
 * @see {@link https://medium.com/@j3y/beyond-basic-knex-js-database-migrations-22263b0fcd7c}
 */
const knexConfig: Knex.Config = {
  client: process.env.DB_CLIENT || "pg",

  connection: {
    connectionString:
      process.env.DATABASE_URL ||
      `postgresql://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
    // host: process.env.DB_HOST || process.env.DOCKER_DB_HOST || 'localhost',
    // database: process.env.DB_NAME || 'todo',
    // user: process.env.DB_USER || 'postgres',
    // password: process.env.DB_PASS || 'admin',
    // port: Number.parseInt(process.env.DB_PORT || '5432'),
  },
  acquireConnectionTimeout: 10000,
  useNullAsDefault: true,
  migrations: {
    directory: path.resolve(__dirname, "./../../build/knex/migrations"),
  },
  seeds: {
    directory: path.resolve(__dirname, "./../../build/knex/seeds"),
  },
};

module.exports = knexConfig;
