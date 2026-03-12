import axios from 'axios';
import { BoxTariff } from './types.js';

const WB_URL = process.env.WB_API_URL || 'https://common-api.wildberries.ru/api/v1/tariffs/box';

/**
 * Fetches box tariffs from Wildberries
 * @param date Optional date in YYYY-MM-DD format
 * @returns An array of box tariffs
 */
export async function getBoxTariffs(date?: string): Promise<BoxTariff[]> {
  const params: Record<string, string> = {};

  if (date) params.date = date;
  
  let res;

  try {
    res = await axios.get(WB_URL, {
      headers: { Authorization: `Bearer ${process.env.WB_TOKEN}` },
      params,
    });
  } catch (err) {
    console.error('Error fetching box tariffs from WB', err);

    throw err;
  }

  return res.data.response.data.warehouseList;
}