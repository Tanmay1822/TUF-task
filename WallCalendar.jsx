
import { useState, useMemo, useCallback, useEffect } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

// One hero image per month (Unsplash — free to use)
const MONTH_IMAGES = [
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=900&q=80", // Jan – winter peaks
  "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=900&q=80", // Feb – misty lake
  "https://images.unsplash.com/photo-1490750967868-88df5691cc5c?w=900&q=80", // Mar – spring bloom
  "https://images.unsplash.com/photo-1462275646964-a0e3386b89fa?w=900&q=80", // Apr – forest path
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=900&q=80", // May – meadow
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80", // Jun – beach
  "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80", // Jul – aerial green
  "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&q=80", // Aug – mountain hike
  "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=900&q=80", // Sep – autumn road
  "https://images.unsplash.com/photo-1444080748397-f442aa95c3e5?w=900&q=80", // Oct – fall forest
  "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=80", // Nov – foggy peaks
  "https://images.unsplash.com/photo-1516912481808-3406841bd33c?w=900&q=80", // Dec – winter snow
];

// Holidays: "month-day" → label  (extend as needed)
const HOLIDAYS = {
  "1-1":  "New Year's Day",
  "1-14": "Makar Sankranti",
  "1-26": "Republic Day",
  "2-14": "Valentine's Day",
  "3-8":  "Women's Day",
  "4-14": "Dr. Ambedkar Jayanti",
  "5-1":  "Labour Day",
  "8-15": "Independence Day",
  "10-2": "Gandhi Jayanti",
  "10-24":"Diwali",
  "12-25":"Christmas",
  "12-31":"New Year's Eve",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** "YYYY-MM-DD" key */
const toDateKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

/** "month-day" key for HOLIDAYS lookup (month is 0-indexed) */
const toHolidayKey = (month, day) => `${month + 1}-${day}`;

/** Format a date key for display */
const formatKey = (key) => {
  if (!key) return "";
  const [y, m, d] = key.split("-");
  return `${MONTH_NAMES[parseInt(m) - 1].slice(0, 3)} ${parseInt(d)}, ${y}`;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function DayCell({ dayObj, index, startDate, endDate, hoveredDate, onDayClick, onDayHover }) {
  const today = new Date();
  const key = toDateKey(dayObj.year, dayObj.month, dayObj.day);
  const holidayKey = toHolidayKey(dayObj.month, dayObj.day);
  const holiday = dayObj.isCurrentMonth ? HOLIDAYS[holidayKey] : null;

  const isToday =
    dayObj.isCurrentMonth &&
    dayObj.day === today.getDate() &&
    dayObj.month === today.getMonth() &&
    dayObj.year === today.getFullYear();

  const isStart = startDate === key;
  const isEnd = endDate === key;

  const end2 = endDate || hoveredDate;
  const [s, e] = startDate && end2
    ? startDate <= end2 ? [startDate, end2] : [end2, startDate]
    : [null, null];
  const inRange = s && e && key > s && key < e;

  const isSat = index % 7 === 5;
  const isSun = index % 7 === 6;
  const isWeekend = isSat || isSun;

  // Derive number color
  let numColor = dayObj.isCurrentMonth ? (isWeekend ? "#1B8FE8" : "#2d3748") : (isWeekend ? "#a8cdf0" : "#ccd0d8");
  let numBg = "transparent";
  let numFontWeight = dayObj.isCurrentMonth ? 500 : 300;

  if (isToday || isStart || isEnd) {
    numBg = "#1B8FE8";
    numColor = "#fff";
    numFontWeight = 600;
  }

  // Range background stripe
  let cellBg = "transparent";
  if (inRange) cellBg = "#EBF4FD";
  if (isStart && (endDate || hoveredDate)) cellBg = "linear-gradient(to right, transparent 50%, #EBF4FD 50%)";
  if (isEnd && startDate) cellBg = "linear-gradient(to left, transparent 50%, #EBF4FD 50%)";
  if (isStart && isEnd) cellBg = "transparent";

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        aspectRatio: "1",
        cursor: "pointer",
        background: cellBg,
        borderRadius: "8px",
        transition: "background 0.1s",
      }}
      onClick={() => onDayClick(key)}
      onMouseEnter={() => onDayHover(key)}
      onMouseLeave={() => onDayHover(null)}
    >
      <div
        style={{
          width: 32,
          height: 32,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          fontSize: 13,
          fontWeight: numFontWeight,
          color: numColor,
          background: numBg,
          transition: "all 0.15s",
          position: "relative",
          zIndex: 2,
        }}
      >
        {dayObj.day}
      </div>

      {holiday && (
        <>
          <div
            style={{
              width: 4, height: 4,
              borderRadius: "50%",
              background: (isStart || isEnd || isToday) ? "#fff" : "#E8534A",
              position: "absolute",
              bottom: 4,
            }}
          />
          {/* Tooltip — pure CSS via group hover would need Tailwind; using title attr as fallback */}
          <span
            style={{
              position: "absolute",
              bottom: "calc(100% + 6px)",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#2d3748",
              color: "#fff",
              fontSize: 10,
              padding: "3px 8px",
              borderRadius: 4,
              whiteSpace: "nowrap",
              pointerEvents: "none",
              zIndex: 20,
              fontFamily: "'DM Sans', sans-serif",
              display: "none", // toggled via JS — or use :hover via inline event
            }}
            className="holiday-tip"
          >
            {holiday}
          </span>
        </>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function WallCalendar() {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear]   = useState(today.getFullYear());
  const [startDate, setStartDate]       = useState(null);
  const [endDate, setEndDate]           = useState(null);
  const [hoveredDate, setHoveredDate]   = useState(null);
  const [notes, setNotes]               = useState({}); // { "YYYY-M": string }
  const [noteInput, setNoteInput]       = useState("");
  const [savedFlash, setSavedFlash]     = useState(false);
  const [imgLoaded, setImgLoaded]       = useState(false);

  const monthKey = `${currentYear}-${currentMonth}`;

  // Sync note input when month changes
  useEffect(() => {
    setNoteInput(notes[monthKey] || "");
    setImgLoaded(false);
  }, [monthKey]); // eslint-disable-line

  // ── Calendar grid ──────────────────────────────────────────────────────────

  const calendarDays = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    let offset = firstDay.getDay(); // 0 = Sun … 6 = Sat
    offset = offset === 0 ? 6 : offset - 1; // shift so Mon = 0

    const daysInMonth    = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const days = [];

    // Days from previous month
    for (let i = offset - 1; i >= 0; i--) {
      const m = currentMonth - 1;
      days.push({
        day: daysInPrevMonth - i,
        month: m < 0 ? 11 : m,
        year: m < 0 ? currentYear - 1 : currentYear,
        isCurrentMonth: false,
      });
    }
    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      days.push({ day: d, month: currentMonth, year: currentYear, isCurrentMonth: true });
    }
    // Days from next month
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const m = currentMonth + 1;
      days.push({
        day: d,
        month: m > 11 ? 0 : m,
        year: m > 11 ? currentYear + 1 : currentYear,
        isCurrentMonth: false,
      });
    }

    return days;
  }, [currentMonth, currentYear]);

  // ── Navigation ─────────────────────────────────────────────────────────────

  const prevMonth = useCallback(() => {
    setCurrentMonth((m) => {
      if (m === 0) { setCurrentYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }, []);

  const nextMonth = useCallback(() => {
    setCurrentMonth((m) => {
      if (m === 11) { setCurrentYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }, []);

  // ── Day selection ──────────────────────────────────────────────────────────

  const handleDayClick = useCallback((key) => {
    setStartDate((prev) => {
      if (!prev || (prev && endDate)) {
        setEndDate(null);
        return key;
      }
      if (key === prev) { setEndDate(null); return null; }
      if (key < prev)   { setEndDate(prev); return key; }
      setEndDate(key);
      return prev;
    });
  }, [endDate]);

  const handleDayHover = useCallback((key) => {
    if (startDate && !endDate) setHoveredDate(key);
  }, [startDate, endDate]);

  // ── Notes ──────────────────────────────────────────────────────────────────

  const saveNote = () => {
    setNotes((prev) => ({ ...prev, [monthKey]: noteInput }));
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  // ── Range label ────────────────────────────────────────────────────────────

  const rangeLabel = (() => {
    if (!startDate) return "Click a date to begin selecting";
    if (!endDate)   return `From: ${formatKey(startDate)}`;
    return `${formatKey(startDate)}  →  ${formatKey(endDate)}`;
  })();

  // ─────────────────────────────────────────────────────────────────── Render

  return (
    <div
      style={{
        fontFamily: "'DM Sans', sans-serif",
        maxWidth: 900,
        margin: "0 auto",
        padding: 16,
      }}
    >
      {/* ── Card ── */}
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0,0,0,0.14)",
          border: "1px solid #e8edf2",
        }}
      >
        {/* ── Hero ── */}
        <div style={{ position: "relative", height: 280, overflow: "hidden", background: "#c8d8e4" }}>
          <img
            key={currentMonth}
            src={MONTH_IMAGES[currentMonth]}
            alt={MONTH_NAMES[currentMonth]}
            onLoad={() => setImgLoaded(true)}
            style={{
              width: "100%", height: "100%",
              objectFit: "cover",
              opacity: imgLoaded ? 1 : 0,
              transition: "opacity 0.5s ease",
            }}
          />

          {/* Dark overlay */}
          <div
            style={{
              position: "absolute", inset: 0,
              background: "linear-gradient(135deg,rgba(0,0,0,0.28) 0%,transparent 55%)",
            }}
          />

          {/* Prev / Next */}
          {[
            { label: "‹", action: prevMonth, side: 16 },
            { label: "›", action: nextMonth, side: undefined },
          ].map(({ label, action, side }, i) => (
            <button
              key={i}
              onClick={action}
              style={{
                position: "absolute",
                top: "50%", transform: "translateY(-50%)",
                ...(side !== undefined ? { left: side } : { right: 16 }),
                background: "rgba(255,255,255,0.18)",
                border: "1px solid rgba(255,255,255,0.4)",
                color: "#fff",
                width: 38, height: 38,
                borderRadius: "50%",
                cursor: "pointer",
                fontSize: 20,
                display: "flex", alignItems: "center", justifyContent: "center",
                backdropFilter: "blur(4px)",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.35)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.18)"}
            >
              {label}
            </button>
          ))}

          {/* Blue month banner */}
          <div
            style={{
              position: "absolute", bottom: 0, right: 0,
              background: "#1B8FE8",
              clipPath: "polygon(36px 0, 100% 0, 100% 100%, 0 100%)",
              padding: "20px 32px 20px 56px",
              minWidth: 260,
            }}
          >
            <div style={{ color: "rgba(255,255,255,0.75)", fontSize: 20, fontWeight: 300, letterSpacing: 3, lineHeight: 1 }}>
              {currentYear}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", color: "#fff", fontSize: 44, fontWeight: 700, lineHeight: 1.1, letterSpacing: 1 }}>
              {MONTH_NAMES[currentMonth]}
            </div>
          </div>

          {/* White tab bottom-left */}
          <div
            style={{
              position: "absolute", bottom: 0, left: 0,
              background: "#fff",
              clipPath: "polygon(0 0, 200px 100%, 0 100%)",
              width: 180, height: 60,
            }}
          />
        </div>

        {/* ── Body ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "clamp(160px, 25%, 220px) 1fr",
          }}
        >
          {/* Notes column */}
          <div
            style={{
              padding: "24px 20px",
              borderRight: "1px solid #eef1f5",
              background: "#fafbfc",
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "1.5px", color: "#999", textTransform: "uppercase", marginBottom: 8 }}>
              Notes
            </div>
            <div style={{ fontSize: 12, color: "#1B8FE8", fontWeight: 500, marginBottom: 12, minHeight: 16, lineHeight: 1.4 }}>
              {rangeLabel}
            </div>

            {/* Lined textarea */}
            <div style={{ position: "relative" }}>
              <div
                style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  backgroundImage: "repeating-linear-gradient(transparent, transparent 27px, #e4e8ed 27px, #e4e8ed 28px)",
                  top: 28,
                }}
              />
              <textarea
                value={noteInput}
                onChange={(e) => setNoteInput(e.target.value)}
                placeholder="Jot down your plans…"
                style={{
                  width: "100%", height: 200,
                  resize: "none",
                  border: "none",
                  background: "transparent",
                  fontFamily: "'DM Sans', sans-serif",
                  fontSize: 13,
                  color: "#334155",
                  lineHeight: "28px",
                  outline: "none",
                  position: "relative",
                  zIndex: 1,
                }}
              />
            </div>

            <button
              onClick={saveNote}
              style={{
                marginTop: 8,
                fontSize: 11, fontWeight: 600,
                letterSpacing: "1px",
                color: savedFlash ? "#27ae60" : "#1B8FE8",
                background: "none", border: "none",
                cursor: "pointer",
                textTransform: "uppercase",
                padding: "4px 0",
                transition: "color 0.3s",
              }}
            >
              {savedFlash ? "✓ Saved!" : "Save note"}
            </button>
          </div>

          {/* Calendar grid */}
          <div style={{ padding: "20px 24px 24px" }}>
            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", marginBottom: 6 }}>
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d, i) => (
                <div
                  key={d}
                  style={{
                    textAlign: "center",
                    fontSize: 11, fontWeight: 600,
                    letterSpacing: "1.2px",
                    color: i >= 5 ? "#1B8FE8" : "#aab2bd",
                    textTransform: "uppercase",
                    padding: "4px 0",
                  }}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Days */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
              {calendarDays.map((dayObj, i) => (
                <DayCell
                  key={i}
                  index={i}
                  dayObj={dayObj}
                  startDate={startDate}
                  endDate={endDate}
                  hoveredDate={hoveredDate}
                  onDayClick={handleDayClick}
                  onDayHover={handleDayHover}
                />
              ))}
            </div>

            {/* Legend */}
            <div
              style={{
                display: "flex", gap: 16,
                marginTop: 14, paddingTop: 12,
                borderTop: "1px solid #eef1f5",
                flexWrap: "wrap",
              }}
            >
              {[
                { color: "#1B8FE8", label: "Today / Selected" },
                { color: "#EBF4FD", border: "#c2daf5", label: "Range" },
                { color: "#E8534A", label: "Holiday" },
              ].map(({ color, border, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#8896a5" }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: color, border: border ? `1px solid ${border}` : "none" }} />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Responsive overrides via style tag ── */}
      <style>{`
        @media (max-width: 600px) {
          div[style*="clamp(160px, 25%, 220px) 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
