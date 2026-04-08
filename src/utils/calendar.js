/**
 * Calendar math helpers
 */

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

export const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/** Generate "YYYY-MM-DD" key from year, 0-indexed month, day */
export const toDateKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;

/** Generate "M-D" key for holidays lookup (month is 0-indexed internally) */
export const toHolidayKey = (month, day) => `${month + 1}-${day}`;

/** Format a "YYYY-MM-DD" key for human display → "Apr 9, 2026" */
export const formatDateKey = (key) => {
  if (!key) return '';
  const [y, m, d] = key.split('-');
  return `${MONTH_NAMES[parseInt(m, 10) - 1].slice(0, 3)} ${parseInt(d, 10)}, ${y}`;
};

/** Extract "YYYY-MM" month key from a "YYYY-MM-DD" date key */
export const toMonthKey = (dateKey) => {
  if (!dateKey) return '';
  return dateKey.slice(0, 7); // "YYYY-MM"
};

/**
 * Build a 6-row × 7-column calendar grid for a given month.
 * Weeks start on Monday.
 * Returns array of 42 day objects.
 */
export const buildCalendarGrid = (year, month) => {
  const firstDay = new Date(year, month, 1);
  let offset = firstDay.getDay(); // 0=Sun … 6=Sat
  offset = offset === 0 ? 6 : offset - 1; // shift → Mon=0

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const days = [];

  // Previous month's trailing days
  for (let i = offset - 1; i >= 0; i--) {
    const m = month - 1;
    days.push({
      day: daysInPrevMonth - i,
      month: m < 0 ? 11 : m,
      year: m < 0 ? year - 1 : year,
      isCurrentMonth: false,
    });
  }

  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    days.push({ day: d, month, year, isCurrentMonth: true });
  }

  // Next month's leading days
  const remaining = 42 - days.length;
  for (let d = 1; d <= remaining; d++) {
    const m = month + 1;
    days.push({
      day: d,
      month: m > 11 ? 0 : m,
      year: m > 11 ? year + 1 : year,
      isCurrentMonth: false,
    });
  }

  return days;
};
