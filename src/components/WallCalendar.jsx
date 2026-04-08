import { useState, useCallback, useRef, useEffect } from 'react';
import { MONTH_NAMES } from '../utils/calendar';
import { MONTH_THEMES } from '../data/themes';
import MonthCard from './MonthCard';
import NotesDrawer from './NotesDrawer';
import ExportButton from './ExportButton';

/**
 * WallCalendar — main orchestrator component.
 *
 * Manages:
 * - Current month/year state + localStorage persistence
 * - Scroll fold animation (scroll + touch)
 * - Notes drawer open/close
 * - Bottom navigation pill bar
 * - Reminder re-scheduling on mount
 */
export default function WallCalendar() {
  const today = new Date();

  // ── Restore last visited month from localStorage ────────
  const [month, setMonth] = useState(() => {
    try {
      const saved = localStorage.getItem('lastVisitedMonth');
      if (saved) {
        const [y, m] = saved.split('-').map(Number);
        return m;
      }
    } catch {}
    return today.getMonth();
  });

  const [year, setYear] = useState(() => {
    try {
      const saved = localStorage.getItem('lastVisitedMonth');
      if (saved) {
        const [y] = saved.split('-').map(Number);
        return y;
      }
    } catch {}
    return today.getFullYear();
  });

  const [selectedDate, setSelectedDate] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFolding, setIsFolding] = useState(false);

  const cardRef = useRef(null);
  const containerRef = useRef(null);
  const foldProgress = useRef(0);
  const foldDirection = useRef(0); // 1 = next, -1 = prev
  const accDelta = useRef(0);
  const decayTimer = useRef(null);

  const theme = MONTH_THEMES[month];

  // ── Persist current month ───────────────────────────────
  useEffect(() => {
    try {
      localStorage.setItem('lastVisitedMonth', `${year}-${month}`);
    } catch {}
  }, [year, month]);

  // ── Month navigation ────────────────────────────────────
  const prevMonth = useCallback(() => {
    if (isFolding) return;
    setMonth((m) => {
      if (m === 0) { setYear((y) => y - 1); return 11; }
      return m - 1;
    });
  }, [isFolding]);

  const nextMonth = useCallback(() => {
    if (isFolding) return;
    setMonth((m) => {
      if (m === 11) { setYear((y) => y + 1); return 0; }
      return m + 1;
    });
  }, [isFolding]);

  const goToToday = useCallback(() => {
    if (isFolding) return;
    setMonth(today.getMonth());
    setYear(today.getFullYear());
  }, [isFolding, today]);

  // ── Scroll fold animation ──────────────────────────────
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let raf = null;
    const threshold = 300; // accumulated delta to trigger fold
    const foldDuration = 900; // ms
    let foldStartTime = 0;
    let folding = false;

    const applyFold = (progress, dir) => {
      const card = cardRef.current;
      if (!card) return;

      const deg = -175 * progress * dir;
      const shadow = 20 * progress;
      const blur = 60 * progress;
      const opacity = 1 - progress * 0.3;

      card.style.transform = `perspective(1400px) rotateX(${deg}deg)`;
      card.style.boxShadow = `0 ${shadow}px ${blur}px rgba(0,0,0,${0.5 * progress})`;
      card.style.opacity = opacity;
      card.style.transformOrigin = 'top center';
    };

    const resetFold = () => {
      const card = cardRef.current;
      if (card) {
        card.style.transform = '';
        card.style.boxShadow = '';
        card.style.opacity = '';
        card.style.transformOrigin = '';
      }
    };

    const animateFold = (dir) => {
      if (folding) return;
      folding = true;
      setIsFolding(true);
      foldStartTime = performance.now();

      const animate = (now) => {
        const elapsed = now - foldStartTime;
        const progress = Math.min(elapsed / foldDuration, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic

        applyFold(eased, dir > 0 ? 1 : -1);

        if (progress < 1) {
          raf = requestAnimationFrame(animate);
        } else {
          // Fold complete — advance month
          if (dir > 0) {
            setMonth((m) => {
              if (m === 11) { setYear((y) => y + 1); return 0; }
              return m + 1;
            });
          } else {
            setMonth((m) => {
              if (m === 0) { setYear((y) => y - 1); return 11; }
              return m - 1;
            });
          }

          // Reset after a brief pause
          setTimeout(() => {
            resetFold();
            folding = false;
            accDelta.current = 0;
            setIsFolding(false);
          }, 100);
        }
      };

      raf = requestAnimationFrame(animate);
    };

    let ticking = false;
    const handleScroll = (e) => {
      e.preventDefault(); // Stop native page scrolling from conflicting with the fold
      if (folding) return;

      accDelta.current += e.deltaY;
      clearTimeout(decayTimer.current);
      decayTimer.current = setTimeout(() => {
        accDelta.current = 0;
      }, 200);

      if (!ticking) {
        requestAnimationFrame(() => {
          if (accDelta.current > threshold) {
            animateFold(1); // next
          } else if (accDelta.current < -threshold) {
            animateFold(-1); // prev
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    let touchY = 0;
    const onTouchStart = (e) => {
      touchY = e.touches[0].clientY;
    };
    const onTouchEnd = (e) => {
      if (folding) return;
      const dy = touchY - e.changedTouches[0].clientY;
      if (Math.abs(dy) > 80) {
        if (!ticking) {
          requestAnimationFrame(() => {
            animateFold(dy > 0 ? 1 : -1);
            ticking = false;
          });
          ticking = true;
        }
      }
    };

    window.addEventListener('wheel', handleScroll, { passive: false });
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('wheel', handleScroll);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
      clearTimeout(decayTimer.current);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // ── Re-schedule saved reminders on app load ─────────────
  useEffect(() => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    try {
      // Scan all reminder_ keys in localStorage
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (!key.startsWith('reminder_')) continue;

        const dateKey = key.replace('reminder_', '');
        const reminders = JSON.parse(localStorage.getItem(key) || '[]');
        const now = Date.now();

        for (const r of reminders) {
          const targetTime = new Date(`${dateKey}T${r.time}`).getTime();
          if (targetTime > now) {
            setTimeout(() => {
              new Notification('📅 Calendar Reminder', { body: r.message });
            }, targetTime - now);
          }
        }
      }
    } catch {}
  }, []);

  // ── Date click → open drawer ────────────────────────────
  const handleDateClick = useCallback((dateKey) => {
    setSelectedDate(dateKey);
    setDrawerOpen(true);
  }, []);

  const closeDrawer = useCallback(() => setDrawerOpen(false), []);

  return (
    <div ref={containerRef} style={{ position: 'relative', minHeight: '100vh' }}>
      {/* ── Main Calendar View ── */}
      <MonthCard
        ref={cardRef}
        month={month}
        year={year}
        onDateClick={handleDateClick}
      />

      {/* ── Bottom Navigation Pill ── */}
      <div className="bottom-nav">
        <button
          className="nav-btn"
          onClick={prevMonth}
          disabled={isFolding}
          aria-label="Previous month"
        >
          ‹
        </button>

        <div className="nav-divider" />

        <button
          className="today-btn"
          onClick={goToToday}
          disabled={isFolding}
        >
          Today
        </button>

        <div className="nav-divider" />

        <span className="nav-month-label" style={{ color: theme.textAccent }}>
          {MONTH_NAMES[month]} {year}
        </span>

        <div className="nav-divider" />

        <ExportButton
          targetRef={cardRef}
          monthName={MONTH_NAMES[month]}
          year={year}
        />

        <div className="nav-divider" />

        <button
          className="nav-btn"
          onClick={nextMonth}
          disabled={isFolding}
          aria-label="Next month"
        >
          ›
        </button>
      </div>

      {/* ── Notes Drawer ── */}
      <NotesDrawer
        dateKey={selectedDate}
        isOpen={drawerOpen}
        onClose={closeDrawer}
        theme={theme}
      />
    </div>
  );
}
