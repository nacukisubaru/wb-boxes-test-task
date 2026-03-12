/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
  return knex.schema.createTable("jobs_log", (table) => {
    table.string("job_name").primary().notNullable();
    table.timestamp("last_run").notNullable();
  });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
  return knex.schema.dropTable("jobs_log");
}