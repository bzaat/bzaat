import { useRef } from "react";
import type { Theme } from "../../theme";
import { sprite, useCanvasLoop, type Painter } from "./useCanvasLoop";

type Mote = { x: number; y: number; vx: number; vy: number; r: number; a: number; ph: number; big?: boolean };

/**
 * Page-wide ambient layer behind everything: sparse, slow, decorative.
 *  auror     golden dust motes drifting and twinkling
 *  darkarts  emerald sparks rising, with a few slow smoke swells
 *  beasts    brass dust and the odd teal Occamy-scale glint
 */
function painterFor(theme: Theme): Painter {
  const cfg = {
    auror: { rgb: [197, 155, 39] as [number, number, number], alt: [127, 179, 213] as [number, number, number], rise: -6, drift: 5, alpha: 0.55 },
    darkarts: { rgb: [46, 204, 113] as [number, number, number], alt: [26, 71, 42] as [number, number, number], rise: -18, drift: 3, alpha: 0.7 },
    beasts: { rgb: [212, 163, 56] as [number, number, number], alt: [22, 105, 122] as [number, number, number], rise: -4, drift: 7, alpha: 0.5 },
  }[theme];
  const dot = sprite(cfg.rgb, 32, 0.12);
  const alt = sprite(cfg.alt, 32, theme === "darkarts" ? 0 : 0.15);
  const smoke = sprite([26, 71, 42], 256);
  let motes: Mote[] = [];

  const spawn = (w: number, h: number, anywhere: boolean): Mote => ({
    x: Math.random() * w,
    y: anywhere ? Math.random() * h : h + 10,
    vx: (Math.random() - 0.5) * cfg.drift,
    vy: cfg.rise * (0.5 + Math.random()),
    r: theme === "darkarts" ? 1.5 + Math.random() * 2.5 : 1 + Math.random() * 2.2,
    a: 0.35 + Math.random() * 0.65,
    ph: Math.random() * Math.PI * 2,
    big: Math.random() < 0.12,
  });

  return {
    setup(w, h) {
      const n = Math.min(70, Math.round((w * h) / 26000));
      motes = Array.from({ length: n }, () => spawn(w, h, true));
    },
    frame(ctx, w, h, dt, t) {
      ctx.clearRect(0, 0, w, h);
      if (theme === "darkarts") {
        ctx.globalAlpha = 0.18;
        for (let i = 0; i < 3; i++) {
          const sx = w * (0.2 + 0.3 * i) + Math.sin(t * 0.05 + i * 2) * 80;
          const sy = h * (0.75 - 0.2 * i) + Math.cos(t * 0.04 + i) * 40;
          const s = 520 + i * 120;
          ctx.drawImage(smoke, sx - s / 2, sy - s / 2, s, s);
        }
      }
      ctx.globalCompositeOperation = theme === "auror" ? "source-over" : "lighter";
      for (const m of motes) {
        m.x += (m.vx + Math.sin(t * 0.6 + m.ph) * 2) * dt;
        m.y += m.vy * dt;
        if (m.y < -10 || m.x < -10 || m.x > w + 10) Object.assign(m, spawn(w, h, false));
        const tw = 0.55 + 0.45 * Math.sin(t * 1.7 + m.ph);
        ctx.globalAlpha = cfg.alpha * m.a * tw;
        const s = m.r * (m.big ? 7 : 5);
        ctx.drawImage(m.big ? alt : dot, m.x - s / 2, m.y - s / 2, s, s);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    },
  };
}

export function AmbientCanvas({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvasLoop(ref, () => painterFor(theme), [theme]);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
