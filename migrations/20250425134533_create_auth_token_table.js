/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('tokens', function(table) {
        table.increments('id').primary();
        table.integer('user_id').unsigned().notNullable();
        table.string('access_token', 512).notNullable();
        table.string('refresh_token', 512).notNullable();
        table.timestamps(true, true);
        table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE').onUpdate('CASCADE');

      });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('tokens');
};
