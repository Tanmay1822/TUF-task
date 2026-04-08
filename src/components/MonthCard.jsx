import { useState, memo } from 'react';
import { MONTH_NAMES } from '../utils/calendar';
import { MONTH_THEMES } from '../data/themes';
import CalendarGrid from './CalendarGrid';
import ParticleCanvas from './ParticleCanvas';

/**
 * MonthCard — full-width month view with redesigned layout:
 *
 * 1. HERO SECTION — full viewport width, min 45vh
 *    - Background image from /images/ + gradient overlay
 *    - Year (small, centered) + Month name (Playfair Display, large)
 *    - Decorative line + scroll hint
 *    - Particle canvas overlay
 *
 * 2. CALENDAR GRID CARD — glassmorphism, overlaps hero bottom
 *    - Full width 7-column grid
 *    - No side panel (notes moved to drawer)
 *
 * In React 19, `ref` is a regular prop — no forwardRef needed.
 */
const MonthCard = memo(function MonthCard({
  ref,
  month,
  year,
  onDateClick,
}) {
  const theme = MONTH_THEMES[month];
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div ref={ref} className="calendar-root">
      {/* ═══ HERO SECTION ═══ */}
      <section className="hero-section">
        {/* Background Image */}
        <img
          src={theme.bgImage}
          alt={MONTH_NAMES[month]}
          className="hero-bg-image"
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          style={{ opacity: imgLoaded ? 1 : 0 }}
        />

        {/* Gradient Overlay */}
        <div className="hero-gradient" />

        {/* Particle Canvas */}
        <ParticleCanvas type={theme.particle} />

        {/* Hero Content */}
        <div className="hero-content">
          <div className="hero-year">{year}</div>
          <h1 className="hero-month">{MONTH_NAMES[month]}</h1>
          <div className="hero-line" />
        </div>

        {/* Scroll Hint */}
        <div className="scroll-hint">
          <span>scroll</span>
          <span className="scroll-hint-arrow">↓</span>
        </div>
      </section>

      {/* ═══ CALENDAR GRID CARD ═══ */}
      <CalendarGrid
        year={year}
        month={month}
        theme={theme}
        onDateClick={onDateClick}
      />

      {/* ═══ SCROLL-TO-NEXT HINT ═══ */}
      <div className="scroll-next-hint">
        <span>↓ scroll to next month</span>
      </div>
    </div>
  );
});

export default MonthCard;
