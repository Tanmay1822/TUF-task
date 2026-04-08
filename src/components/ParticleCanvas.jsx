import { useRef, useEffect, memo } from 'react';
import { createParticleSystem } from '../utils/particles';

/**
 * ParticleCanvas — lightweight canvas overlay rendering themed particles.
 * Respects prefers-reduced-motion. Auto-resizes via ResizeObserver.
 * Positioned absolutely within parent (hero section).
 */
const ParticleCanvas = memo(function ParticleCanvas({ type }) {
  const canvasRef = useRef(null);
  const systemRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Respect reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      if (systemRef.current) {
        systemRef.current.resize(rect.width, rect.height);
      }
    };

    handleResize();

    const system = createParticleSystem(canvas, type);
    systemRef.current = system;
    if (system) system.start();

    const observer = new ResizeObserver(handleResize);
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      if (system) system.destroy();
      systemRef.current = null;
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
