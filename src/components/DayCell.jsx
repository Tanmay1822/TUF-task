import { memo } from 'react';
import { toDateKey, toHolidayKey } from '../utils/calendar';
import { HOLIDAYS, HOLIDAY_TYPE_COLORS } from '../data/holidays';

/**
 * DayCell — renders a single day in the calendar grid.
 * Features:
 *   - Top-left date number positioning
 *   - Today/selected filled circle (theme.todayBg)
 *   - Range selection with half-cell tinting
 *   - Holiday dots & text
 *   - Note indicator dot
 *   - Weekend column tinting
 *   - Hover preview handled via external DOM toggle (class 'hover-preview')
 */
const DayCell = memo(function DayCell({
  dayObj,
  index,
  startDate,
  endDate,
  todayKey,
  theme,
  hasNote,
  onDayClick,
  onDayHover,
  onDayLeave,
}) {
  const key = toDateKey(dayObj.year, dayObj.month, dayObj.day);
  const holidayKey = toHolidayKey(dayObj.month, dayObj.day);
  const holiday = dayObj.isCurrentMonth ? HOLIDAYS[holidayKey] : null;

  const isToday = dayObj.isCurrentMonth && key === todayKey;
  const isStart = startDate === key;
  const isEnd = endDate === key;
  const isSelected = isStart || isEnd;

  // Range computation
  // Without hoveredDate, range visuals purely rely on committed startDate/endDate.
  const [lo, hi] =
    startDate && endDate
      ? startDate <= endDate
        ? [startDate, endDate]
        : [endDate, startDate]
      : [null, null];
  const inRange = lo && hi && key > lo && key < hi;

  const isSat = index % 7 === 5;
  const isSun = index % 7 === 6;
  const isWeekend = isSat || isSun;

  // ── Cell background ──
  let cellBg = isWeekend ? theme.weekendTint : 'transparent';
  let cellStyle = {};

  if (inRange) {
    cellBg = theme.accentLight;
  }
  if (isStart && endDate && !isEnd) {
    cellStyle.background = `linear-gradient(to right, transparent 50%, ${theme.accentLight} 50%)`;
  } else if (isEnd && startDate && !isStart) {
    cellStyle.background = `linear-gradient(to left, transparent 50%, ${theme.accentLight} 50%)`;
  } else {
    cellStyle.background = cellBg;
  }

  // ── Day number styling ──
  const showCircle = isToday || isSelected;
  let numClass = 'day-number';
  if (!dayObj.isCurrentMonth) numClass += ' adjacent';
  if (showCircle) {
    numClass += isToday && !isSelected ? ' today-circle' : ' selected-circle';
  }
  if (inRange && !isSelected) numClass += ' in-range-text';
  if (isWeekend && dayObj.isCurrentMonth && !showCircle) numClass += ' weekend-text';

  let numStyle = {};
  if (showCircle) {
    numStyle.background = theme.todayBg;
    numStyle.color = '#fff';
  } else if (inRange) {
    numStyle.color = theme.textAccent;
  } else if (isWeekend && dayObj.isCurrentMonth) {
    numStyle.color = theme.textAccent;
  }

  // ── Holiday dot color ──
  let dotColor = null;
  if (holiday) {
    const typeColor = HOLIDAY_TYPE_COLORS[holiday.type];
    dotColor = typeColor || theme.accent;
    if (isSelected || isToday) dotColor = '#fff';
  }

  // ── Build cell class ──
  let cls = 'day-cell';
  if (inRange) cls += ' in-range';
  if (isStart && endDate && !isEnd) cls += ' range-start';
  if (isEnd && startDate && !isStart) cls += ' range-end';
  if (isWeekend) cls += ' weekend-col';

  return (
    <div
      className={cls}
      style={cellStyle}
      data-datekey={key}
      onClick={() => onDayClick(key)}
      onMouseEnter={() => onDayHover(key)}
      onMouseLeave={() => onDayLeave(key)}
    >
      <div className={numClass} style={numStyle}>
        {dayObj.day}
      </div>

      {holiday && (
        <>
          <div className="holiday-dot" style={{ background: dotColor }} />
          <div className="holiday-name">{holiday.name}</div>
        </>
      )}

      {hasNote && !holiday && (
        <div className="note-indicator" />
      )}
    </div>
  );
});

export default DayCell;
