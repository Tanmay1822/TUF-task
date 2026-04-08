/**
 * Lightweight canvas-based particle system.
 * Supports: snow · petals · powder · leaves · sparkle · rain ·
 *           bubbles · mist · flags · rays
 * No external libraries — pure requestAnimationFrame rendering.
 */

const CONFIGS = {
  snow: {
    count: 30, // was 60
    colors: ['rgba(255,255,255,', 'rgba(200,220,255,'],
    minSize: 1.5, maxSize: 3,
    minSpeed: 0.3, maxSpeed: 1.0,
    drift: 0.4,
    opacity: [0.3, 0.6],
  },
  petals: {
    count: 15, // was 30
    // Petals for April
    colors: ['rgba(255,183,197,', 'rgba(255,200,212,'], // #FFB7C5, #FFC8D4
    minSize: 3, maxSize: 3, // Petals use fixed sizes in draw, this drives scaling
    minSpeed: 0.4, maxSpeed: 1.2,
    drift: 1.2,
    opacity: [0.75, 0.75], // Opacity 0.75
    rotate: true,
    petalShape: true,
  },
  powder: {
    count: 40, // was 80
    colors: [
      'rgba(255,100,50,', 'rgba(50,200,100,', 'rgba(255,210,0,',
      'rgba(150,50,255,', 'rgba(0,180,255,', 'rgba(255,50,150,',
    ],
    minSize: 2, maxSize: 5,
    minSpeed: 0.3, maxSpeed: 1.8,
    drift: 1.8,
    opacity: [0.4, 0.8],
    burst: true,
  },
  leaves: {
    count: 12, // was 25
    colors: ['rgba(144,238,144,', 'rgba(255,179,71,'], // #90EE90 alternating #FFB347
    minSize: 4, maxSize: 8,
    minSpeed: 0.4, maxSpeed: 1.4,
    drift: 1.6,
    opacity: [0.45, 0.85],
    rotate: true,
    leafShape: true,
  },
  sparkle: {
    count: 20, // was 40
    colors: ['rgba(255,215,0,', 'rgba(255,255,200,', 'rgba(255,200,100,'],
    minSize: 1, maxSize: 3.5,
    minSpeed: -0.15, maxSpeed: -0.05,
    drift: 0.2,
    opacity: [0.15, 0.9],
    twinkle: true,
    star: true,
  },
  rain: {
    count: 50, // was 100
    colors: ['rgba(150,180,210,'],
    minSize: 0.8, maxSize: 1.5,
    minSpeed: 7, maxSpeed: 13,
    drift: -0.8,
    opacity: [0.15, 0.4],
    streaks: true,
  },
  bubbles: {
    count: 10, // was 20
    colors: ['rgba(100,180,255,', 'rgba(150,200,255,'],
    minSize: 4, maxSize: 12,
    minSpeed: -0.5, maxSpeed: -0.15,
    drift: 0.3,
    opacity: [0.15, 0.4],
    strokeOnly: true,
  },
  mist: {
    count: 6, // was 10/8
    colors: ['rgba(200,200,220,'],
    minSize: 40, maxSize: 80,
    minSpeed: 0, maxSpeed: 0.05,
    drift: 0.3,
    opacity: [0.03, 0.08],
    blur: true,
  },
  flags: {
    count: 3, // unchanged
    colors: ['rgba(255,153,51,', 'rgba(255,255,255,', 'rgba(19,136,8,'],
    minSize: 8, maxSize: 14,
    minSpeed: 0, maxSpeed: 0,
    drift: 0,
    opacity: [0.5, 0.7],
    flag: true,
  },
  rays: {
    count: 6, // was 8
    colors: ['rgba(255,215,100,'],
    minSize: 2, maxSize: 3,
    minSpeed: 0, maxSpeed: 0,
    drift: 0,
    opacity: [0.06, 0.12],
    radial: true,
  },
};

/** Create a single particle with random initial properties */
function spawn(w, h, cfg, index) {
  const { minSize, maxSize, minSpeed, maxSpeed, drift, opacity, colors, twinkle, flag, radial } = cfg;

  if (flag) {
    return {
      x: w * 0.2 + (index * w * 0.3),
      y: 30 + index * 15,
      size: Math.random() * (maxSize - minSize) + minSize,
      speed: 0,
      drift: 0,
      opacity: Math.random() * (opacity[1] - opacity[0]) + opacity[0],
      color: colors[index % colors.length],
      rotation: 0,
      rotSpeed: 0,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.02 + Math.random() * 0.01,
      sway: 0,
      swaySpeed: 0,
    };
  }

  if (radial) {
    return {
      x: w / 2,
      y: 0,
      size: Math.random() * (maxSize - minSize) + minSize,
      speed: 0,
      drift: 0,
      opacity: Math.random() * (opacity[1] - opacity[0]) + opacity[0],
      color: colors[0],
      rotation: (index / cfg.count) * Math.PI * 2,
      rotSpeed: 0.001 + Math.random() * 0.001,
      phase: Math.random() * Math.PI * 2,
      phaseSpeed: 0.005,
      sway: 0,
      swaySpeed: 0,
    };
  }

  return {
    x: Math.random() * w,
    y: twinkle ? Math.random() * h : Math.random() * h * 2 - h,
    size: Math.random() * (maxSize - minSize) + minSize,
    speed: Math.random() * (maxSpeed - minSpeed) + minSpeed,
    drift: (Math.random() - 0.5) * drift * 2,
    opacity: Math.random() * (opacity[1] - opacity[0]) + opacity[0],
    color: colors[Math.floor(Math.random() * colors.length)],
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.04,
    phase: Math.random() * Math.PI * 2,
    phaseSpeed: Math.random() * 0.025 + 0.008,
    sway: Math.random() * Math.PI * 2,
    swaySpeed: Math.random() * 0.015 + 0.005,
    baseOpacity: Math.random() * (opacity[1] - opacity[0]) + opacity[0],
  };
}

export function initParticles(canvas, type) {
  const cfg = CONFIGS[type];
  if (!cfg) return { particles: [], cfg: null };
  const particles = [];
  for (let i = 0; i < cfg.count; i++) {
    particles.push(spawn(canvas.width, canvas.height, cfg, i));
  }
  return { particles, cfg };
}

export function updateAndDrawParticles(canvas, ctx, cfg, particles) {
  const w = canvas.width;
  const h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  for (const p of particles) {
    if (cfg.flag) {
      p.phase += p.phaseSpeed;
      p.rotation = Math.sin(p.phase) * 0.15;
    } else if (cfg.radial) {
      p.rotation += p.rotSpeed;
      p.phase += p.phaseSpeed;
      p.opacity = cfg.opacity[0] + Math.abs(Math.sin(p.phase)) * (cfg.opacity[1] - cfg.opacity[0]);
    } else if (cfg.twinkle) {
      p.sway += p.swaySpeed;
      p.x += Math.sin(p.sway) * 0.4 + p.drift * 0.05;
      p.y += p.speed;
      p.phase += p.phaseSpeed;
      p.opacity = Math.abs(Math.sin(p.phase)) * 0.65 + 0.15;
    } else if (cfg.petalShape) {
      p.sway += p.swaySpeed;
      p.x += p.drift + Math.sin(p.sway) * 1.5; // sin wave on X
      p.y += p.speed;
      p.rotation += 0.02; // changes slowly per frame
    } else {
      p.sway += p.swaySpeed;
      p.x += p.drift + Math.sin(p.sway) * 0.5;
      p.y += p.speed;
    }

    if (cfg.rotate && !cfg.petalShape) {
      p.rotation += p.rotSpeed;
    }

    // wrap
    if (!cfg.flag && !cfg.radial) {
      if (p.speed > 0 && p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
      if (p.speed < 0 && p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
      if (p.x > w + 20) p.x = -20;
      if (p.x < -20) p.x = w + 20;
    }

    ctx.save();
    ctx.globalAlpha = p.opacity;

    if (cfg.radial) {
      const len = Math.max(w, h) * 1.5;
      ctx.translate(w / 2, 0);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color + `${p.opacity})`;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-p.size, len);
      ctx.lineTo(p.size, len);
      ctx.closePath();
      ctx.fill();
    } else if (cfg.flag) {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color + `${p.opacity})`;
      ctx.fillRect(-p.size, -p.size * 0.6, p.size * 2, p.size * 1.2);
    } else if (cfg.strokeOnly) {
      ctx.strokeStyle = p.color + `${p.opacity})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.stroke();
    } else if (cfg.blur) {
      ctx.filter = `blur(${p.size * 0.4}px)`;
      ctx.fillStyle = p.color + `${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.filter = 'none';
    } else if (cfg.star) {
      ctx.fillStyle = p.color + `${p.opacity})`;
      ctx.translate(p.x, p.y);
      ctx.beginPath();
      const s = p.size * 2;
      const inner = s * 0.3;
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2;
        ctx.lineTo(Math.cos(angle) * s, Math.sin(angle) * s);
        const midAngle = angle + Math.PI / 4;
        ctx.lineTo(Math.cos(midAngle) * inner, Math.sin(midAngle) * inner);
      }
      ctx.closePath();
      ctx.fill();
    } else if (cfg.streaks) {
      ctx.strokeStyle = p.color + `${p.opacity})`;
      ctx.lineWidth = p.size;
      ctx.beginPath();
      ctx.moveTo(p.x, p.y);
      ctx.lineTo(p.x + p.drift * 0.3, p.y + p.speed * 2.5);
      ctx.stroke();
    } else if (cfg.petalShape) {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color + `${p.opacity})`;
      ctx.beginPath();
      // ellipse, width: 6px, height: 3px
      ctx.ellipse(0, 0, 3, 1.5, 0, 0, Math.PI * 2);
      ctx.fill();
    } else if (cfg.leafShape) {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color + `${p.opacity})`;
      ctx.beginPath();
      // rounded triangle approximated with arc
      ctx.arc(0, 0, p.size, 0, Math.PI * 1.5);
      ctx.lineTo(p.size * 1.2, p.size * 1.2);
      ctx.closePath();
      ctx.fill();
    } else if (cfg.rotate) {
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.fillStyle = p.color + `${p.opacity})`;
      ctx.beginPath();
      ctx.ellipse(0, 0, p.size, p.size * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = p.color + `${p.opacity})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}
