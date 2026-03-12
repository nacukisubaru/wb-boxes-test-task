
export function parseNumber(value: string | null | undefined) {
  if (value === '-' || value === null || value === undefined) return null;

  return Number(String(value).replace(',', '.'));
}