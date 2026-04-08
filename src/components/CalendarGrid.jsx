import { useMemo, useState, useCallback, useEffect, memo, useRef } from 'react';
import { buildCalendarGrid, toDateKey, DAY_NAMES } from '../utils/calendar';
import DayCell from './DayCell';

/**
 * CalendarGrid — memoized 7×6 grid with:
 * - Monday start, day headers with weekend accent
 * - Day range selection with hover preview
 * - Per-date note indicator dots (checks localStorage)
 * - Legend bar
 * - Accepts full theme object for dynamic styling
 */
const CalendarGrid = memo(function CalendarGrid({
  year,
  month,
  theme,
  onDateClick,
}) {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const hoveredDate = useRef(null);
  const [noteDates, setNoteDates] = useState(new Set());

  const today = new Date();
  const todayKey = toDateKey(today.getFullYear(), today.getMonth(), today.getDate());

  const calendarDays = useMemo(() => buildCalendarGrid(year, month), [year, month]);

  // Restore range selection from localStorage
  useEffect(() => {
    try {
      const savedStart = localStorage.getItem('rangeStart');
      const savedEnd = localStorage.getItem('rangeEnd');
      if (savedStart) setStartDate(savedStart);
      if (savedEnd) setEndDate(savedEnd);
    } catch {}
  }, []);

  // Persist range selection
  useEffect(() => {
    try {
      if (startDate) {
        localStorage.setItem('rangeStart', startDate);
      } else {
        localStorage.removeItem('rangeStart');
      }
      if (endDate) {
        localStorage.setItem('rangeEnd', endDate);
      } else {
        localStorage.removeItem('rangeEnd');
      }
    } catch {}
  }, [startDate, endDate]);

  // Check which dates in the current grid have saved notes
  useEffect(() => {
    const dates = new Set();
    try {
      for (const dayObj of calendarDays) {
        const key = toDateKey(dayObj.year, dayObj.month, dayObj.day);
        const note = localStorage.getItem(`note_${key}`);
        if (note && note.trim()) dates.add(key);
      }
    } catch {}
    setNoteDates(dates);
  }, [calendarDays]);

  const handleDayClick = useCallback(
    (key) => {
      onDateClick?.(key);

      setStartDate((prev) => {
        if (!prev || endDate) {
          setEndDate(null);
          hoveredDate.current = null;
          // Clean up any remaining hover classes
          document.querySelectorAll('.day-cell.hover-preview').forEach(el => {
            el.classList.remove('hover-preview');
          });
          return key;
        }
        if (key === prev) {
          setEndDate(null);
          return null;
        }
        if (key < prev) {
          setEndDate(prev);
          return key;
        }
        setEndDate(key);
        return prev;
      });
    },
    [endDate, onDateClick],
  );

  const handleDayHover = useCallback(
    (key) => {
      if (startDate && !endDate) {
        hoveredDate.current = key;
        document.querySelectorAll('.day-cell').forEach(el => {
          if (el.dataset.datekey === key) {
            el.classList.add('hover-preview');
          } else {
            el.classList.remove('hover-preview');
          }
        });
      }
    },
    [startDate, endDate],
  );

  const handleDayLeave = useCallback(
    (key) => {
      if (startDate && !endDate && hoveredDate.current === key) {
        hoveredDate.current = null;
        document.querySelectorAll('.day-cell.hover-preview').forEach(el => {
          el.classList.remove('hover-preview');
        });
      }
    },
    [startDate, endDate],
  );

  return (
    <div className="calendar-card" id="calendar-card">
      {/* Day headers */}
      <div className="day-headers">
        {DAY_NAMES.map((d, i) => (
          <div
            key={d}
            className={`day-header ${i >= 5 ? 'weekend' : ''}`}
            style={{ color: i >= 5 ? theme.textAccent : undefined }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="days-grid">
        {calendarDays.map((dayObj, i) => (
          <DayCell
            key={i}
            index={i}
            dayObj={dayObj}
            startDate={startDate}
            endDate={endDate}
            todayKey={todayKey}
            theme={theme}
            hasNote={noteDates.has(toDateKey(dayObj.year, dayObj.month, dayObj.day))}
            onDayClick={handleDayClick}
            onDayHover={handleDayHover}
            onDayLeave={handleDayLeave}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <div className="legend-dot" style={{ background: theme.todayBg }} />
          Today / Selected
        </div>
        <div className="legend-item">
          <div
            className="legend-dot"
            style={{ background: theme.accentLight, border: `1px solid ${theme.accent}55` }}
          />
          Range
        </div>
        <div className="legend-item">
          <div className="legend-dot" style={{ background: '#FF6B6B' }} />
          Holiday
        </div>
      </div>
    </div>
  );
});

export default CalendarGrid;
