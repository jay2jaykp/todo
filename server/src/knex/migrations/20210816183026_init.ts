import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('todo', (t: Knex.CreateTableBuilder) => {
    t.increments('id').unsigned().primary();
    t.string('task_title').notNullable();
    t.boolean('done').notNullable().defaultTo(false);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('todo');
}
