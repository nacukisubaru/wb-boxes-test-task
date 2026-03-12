import knex from '#postgres/knex.js';

import { TariffRow } from '#services/types/tarrifs.js';
import { BOX_TARIFF_COLUMNS } from '#constants/tariffs.js';
import { sheetsApi } from '#apis/google-spreadsheets.js';

const HEADERS = BOX_TARIFF_COLUMNS.map(col => col.title);

/**
 * Maps a TariffRow object to a row array suitable for Google Sheets
 */
function mapTariffToRow(t: TariffRow): (string | number | null)[] {
  return BOX_TARIFF_COLUMNS.map(col => t[col.key as keyof TariffRow]);
}

/**
 * Maps a TariffRow object to a row array suitable for Google Sheets
 */
async function getSpreadsheetIds(): Promise<string[]> {
  const rows = await knex('spreadsheets').select('spreadsheet_id');
  return rows.map(r => r.spreadsheet_id);
}

/**
 * Retrieves a list of spreadsheet IDs from the database
 */
export async function updateTariffsInSheets(rows: TariffRow[]): Promise<void> {
  const spreadsheetIds = await getSpreadsheetIds();
  const allValues = [HEADERS, ...rows.map(mapTariffToRow)];

  for (const spreadsheetId of spreadsheetIds) {
    try {
      const spreadsheet = await sheetsApi.spreadsheets.get({ spreadsheetId });

      const sheet = spreadsheet.data.sheets?.[0];

      if (!sheet) continue;

      const sheetTitle = sheet.properties?.title;
      const sheetId = sheet.properties?.sheetId;
     
      await sheetsApi.spreadsheets.values.update({
        spreadsheetId,
        range: `${sheetTitle}!A1`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: allValues },
      });

      const requests = BOX_TARIFF_COLUMNS.map((col, index) => ({
        updateDimensionProperties: {
          range: {
            sheetId,
            dimension: 'COLUMNS',
            startIndex: index,
            endIndex: index + 1,
          },
          properties: { pixelSize: col.width || 150 },
          fields: 'pixelSize',
        },
      }));

      if (requests.length > 0) {
        await sheetsApi.spreadsheets.batchUpdate({
          spreadsheetId,
          requestBody: { requests },
        });
      }

      console.log(`Spreadsheet ${spreadsheetId} fully updated`);
    } catch (err: any) {
      if (err?.response?.status === 404) continue;

      console.error(`Failed updating ${spreadsheetId}`, err);
      
      throw err;
    }
  }
}