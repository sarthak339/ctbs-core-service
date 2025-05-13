/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function(knex) {
    await knex.schema.createTable('roles', function(table) {
        table.increments('id').primary();
        table.string('name').notNullable().unique();
        table.timestamps(true, true);
      });
    
      // Insert default roles
      await knex('roles').insert([
        { id: 1, name: 'admin' },
        { id: 2, name: 'user' },
      ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function(knex) {
    await knex.schema.dropTable('roles');
  };