import { useRef, useEffect, memo } from 'react';
import { initParticles, updateAndDrawParticles } from '../utils/particles';

/**
 * ParticleCanvas — lightweight canvas overlay rendering themed particles.
 * Respects prefers-reduced-motion. Auto-resizes via ResizeObserver.
 * Positioned absolutely within parent (hero section).
 */
const ParticleCanvas = memo(function ParticleCanvas({ type }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let rafId = null;
    const ctx = canvas.getContext('2d');
    
    // Resize handler
    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    
    handleResize();

    const { particles, cfg } = initParticles(canvas, type);

    const animate = () => {
      if (cfg) {
        updateAndDrawParticles(canvas, ctx, cfg, particles);
      }
      rafId = requestAnimationFrame(animate);
    };

    if (cfg) {
      rafId = requestAnimationFrame(animate);
    }

    const observer = new ResizeObserver(handleResize);
    observer.observe(canvas);

    const handleVisibility = () => {
      if (document.hidden) {
        if (rafId) cancelAnimationFrame(rafId);
      } else {
        if (cfg) rafId = requestAnimationFrame(animate);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [type]);

  return (
    <canvas
      ref={canvasRef}
      className="particle-canvas"
      style={{ width: '100%', height: '100%' }}
      aria-hidden="true"
    />
  );
});

export default ParticleCanvas;
