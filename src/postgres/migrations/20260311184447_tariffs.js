/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function up(knex) {
    return knex.schema.createTable("tariffs", (table) => {
        table.increments("id").primary();
        table.date("created_at").notNullable();
        table.string("box_delivery_base").nullable();
        table.string("box_delivery_coef_expr").nullable();
        table.string("box_delivery_liter").nullable();
        table.string("box_delivery_marketplace_base").nullable();
        table.string("box_delivery_marketplace_coef_expr").nullable();
        table.string("box_delivery_marketplace_liter").nullable();
        table.string("box_storage_base").nullable();
        table.string("box_storage_coef_expr").nullable();
        table.string("box_storage_liter").nullable();
        table.string("geo_name").nullable();
        table.string("warehouse_name").nullable();

        table.unique(['created_at', 'warehouse_name', 'geo_name']);
    });
}

/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function down(knex) {
    return knex.schema.dropTable("tariffs");
}