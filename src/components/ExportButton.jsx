import { useState } from 'react';

/**
 * ExportButton — captures the calendar card as PNG via html2canvas (lazy-loaded).
 * Temporarily hides non-exportable elements during capture.
 */
export default function ExportButton({ targetRef, monthName, year }) {
  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!targetRef?.current || exporting) return;
    setExporting(true);

    try {
      // Temporarily hide bottom nav, drawer, scroll hint
      const hideSelectors = ['.bottom-nav', '.notes-drawer', '.drawer-overlay', '.scroll-hint', '.scroll-next-hint'];
      const hidden = [];
      hideSelectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          hidden.push({ el, display: el.style.display });
          el.style.display = 'none';
        });
      });

      const { default: html2canvas } = await import('html2canvas');
      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#0a0f1a',
        logging: false,
      });

      // Restore hidden elements
      hidden.forEach(({ el, display }) => {
        el.style.display = display;
      });

      canvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `calendar-${monthName.toLowerCase()}-${year}.png`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
      }, 'image/png');
    } catch (err) {
      console.error('Export failed:', err);
    }

    setExporting(false);
  };

  return (
    <button
      className="export-btn"
      onClick={handleExport}
      disabled={exporting}
      aria-label="Export current month as PNG"
    >
      📷 <span>Export</span>
    </button>
  );
}
