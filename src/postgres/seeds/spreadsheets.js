/**
 * @param {import("knex").Knex} knex
 * @returns {Promise<void>}
 */
export async function seed(knex) {
    const idsEnv = process.env.SPREADSHEET_IDS || "";
    const ids = idsEnv.split(",").map(id => id.trim()).filter(Boolean);

    if (ids.length === 0) return;

    const rows = ids.map(id => ({ spreadsheet_id: id }));

    await knex("spreadsheets")
        .insert(rows)
        .onConflict(["spreadsheet_id"])
        .ignore();
}