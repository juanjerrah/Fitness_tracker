/** Local calendar date as YYYY-MM-DD from an ISO timestamp. */
export function toLocalDateKey(isoTimestamp: string, timeZone?: string): string {
  const date = new Date(isoTimestamp);
  return new Intl.DateTimeFormat('en-CA', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);
}

/** Returns YYYY-MM for a given year/month (1-12). */
export function toMonthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`;
}
