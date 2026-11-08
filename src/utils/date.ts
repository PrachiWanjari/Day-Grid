/**
 * Robust local-calendar date utilities for DayGrid.
 * 
 * CRITICAL: Never use `date.toISOString().slice(0, 10)` for local calendar dates!
 * In positive timezones (UTC+01:00 to UTC+14:00 such as India, Asia, Europe, Australia),
 * midnight 00:00 in local time is the previous calendar day in UTC.
 * Calling `toISOString()` will prematurely subtract a day, breaking next/previous date steppers.
 */

/**
 * Formats a JavaScript Date object into a 'YYYY-MM-DD' string using local calendar values.
 */
export const formatDateToKey = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * Parses a 'YYYY-MM-DD' string into a local Date object anchored at noon (12:00:00).
 * Anchoring at noon prevents Daylight Saving Time (DST) shifts from crossing day boundaries.
 */
export const parseDateKey = (dateStr: string): Date => {
  if (!dateStr || !dateStr.includes('-')) {
    return new Date();
  }
  const [y, m, d] = dateStr.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 12, 0, 0);
};

/**
 * Shifts a 'YYYY-MM-DD' date string forward or backward by `deltaDays` days.
 * Guaranteed to shift by exactly `deltaDays` in all timezones worldwide.
 */
export const shiftDateString = (dateStr: string, deltaDays: number): string => {
  const date = parseDateKey(dateStr);
  date.setDate(date.getDate() + deltaDays);
  return formatDateToKey(date);
};

/**
 * Returns today's local date string formatted as 'YYYY-MM-DD', optionally offset by `offsetDays`.
 */
export const getTodayDateString = (offsetDays: number = 0): string => {
  const d = new Date();
  if (offsetDays !== 0) {
    d.setDate(d.getDate() + offsetDays);
  }
  return formatDateToKey(d);
};

/**
 * Formats a 'YYYY-MM-DD' date string into a user-friendly display string.
 */
export const formatDisplayDate = (
  dateStr: string,
  options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }
): string => {
  const date = parseDateKey(dateStr);
  return new Intl.DateTimeFormat('en-US', options).format(date);
};
