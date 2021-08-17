import dotenv from 'dotenv';
import * as knexConfig from './knexConfig';

// env variables
dotenv.config();

/**
 * @remarks Update your config settings.
 *
 * @see {@link knexfile.ts}
 */

export const knex = require('knex')(knexConfig);

/**
 *
 * Automated Knex Migration when the Server Starts
 *
 */
export const ResetMigration = async () => {
  try {
    console.log('Migration Rollback Started...');
    await knex.migrate.rollback(knexConfig, true);
    console.log('Migration Started...');
    await knex.migrate.latest(knexConfig);
    console.log('Seeding Started...');
    await knex.seed.run(knexConfig);
  } catch (error) {
    console.log('error');
  } finally {
    console.log('Migration Reset Successful');
  }
};
