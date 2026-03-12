import knex from '#postgres/knex.js';

import { parseNumber } from '#utils/common.js';
import { getBoxTariffs } from '#apis/wb.js';

import { TariffRow } from './types/tarrifs.js';
import { updateTariffsInSheets } from './spreadsheets.js';

/**
 * Fetches box tariffs from Wildberries, transforms them into database rows,
 * updates the data in Google Sheets, and saves them to the database.
 */
export async function fetchAndSaveTariffs(): Promise<void> {
  const today = new Date().toISOString().slice(0, 10);

  const tariffs = await getBoxTariffs(today);

  const rows: TariffRow[] = tariffs.map((t) => ({
    created_at: today,
    geo_name: t.geoName || null,
    warehouse_name: t.warehouseName,

    box_delivery_base: parseNumber(t.boxDeliveryBase),
    box_delivery_coef_expr: parseNumber(t.boxDeliveryCoefExpr),
    box_delivery_liter: parseNumber(t.boxDeliveryLiter),

    box_delivery_marketplace_base: parseNumber(t.boxDeliveryMarketplaceBase),
    box_delivery_marketplace_coef_expr: parseNumber(t.boxDeliveryMarketplaceCoefExpr),
    box_delivery_marketplace_liter: parseNumber(t.boxDeliveryMarketplaceLiter),

    box_storage_base: parseNumber(t.boxStorageBase),
    box_storage_coef_expr: parseNumber(t.boxStorageCoefExpr),
    box_storage_liter: parseNumber(t.boxStorageLiter),
  }));

  await knex<TariffRow>('tariffs')
    .insert(rows)
    .onConflict(['created_at', 'warehouse_name', 'geo_name'])
    .merge();

  const dbRows = await knex('tariffs')
    .where('created_at', today)
    .orderByRaw('box_delivery_coef_expr ASC NULLS LAST');

  await updateTariffsInSheets(dbRows);
}