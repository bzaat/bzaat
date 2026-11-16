import { useRef } from "react";
import type { Theme } from "../../theme";
import { sprite, useCanvasLoop, type Painter } from "./useCanvasLoop";

/**
 * The hero centerpiece, one scene per skin:
 *  auror     a Patronus: silver-blue light streaming along a slow figure-of-eight
 *  darkarts  an emerald smoke vortex turning in on itself
 *  beasts    a field sketch: contour lines and a compass drawing themselves in
 * Centred right of the headline on wide screens; a CSS mask keeps the text side clear.
 */
const center = (w: number, h: number) => ({ cx: w >= 1024 ? w * 0.74 : w * 0.5, cy: w >= 1024 ? h * 0.5 : h * 0.72 });

function patronus(): Painter {
  const light = sprite([168, 218, 240], 48, 0.18);
  const halo = sprite([127, 179, 213], 256);
  type P = { th: number; sp: number; off: number; lane: number; size: number };
  let ps: P[] = [];
  let R = 200;
  return {
    setup(w, h) {
      R = Math.min(w, h) * (w >= 1024 ? 0.34 : 0.3);
      ps = Array.from({ length: 150 }, () => ({
        th: Math.random() * Math.PI * 2,
        sp: 0.35 + Math.random() * 0.35,
        off: (Math.random() - 0.5) * 0.35,
        lane: Math.random(),
        size: 2 + Math.random() * 5,
      }));
    },
    frame(ctx, w, h, dt, t) {
      const { cx, cy } = center(w, h);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.09)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 0.16 + 0.06 * Math.sin(t * 0.8);
      const hs = R * 2.6;
      ctx.drawImage(halo, cx - hs / 2, cy - hs / 2, hs, hs);
      ctx.globalCompositeOperation = "lighter";
      for (const p of ps) {
        p.th += p.sp * dt;
        const rr = R * (1 + p.off + 0.06 * Math.sin(t * 1.3 + p.lane * 9));
        const x = cx + rr * Math.sin(p.th) * 1.15;
        const y = cy + rr * Math.sin(p.th) * Math.cos(p.th) * 0.95;
        ctx.globalAlpha = 0.35 + 0.35 * Math.sin(p.th * 3 + p.lane * 6) ** 2;
        ctx.drawImage(light, x - p.size, y - p.size, p.size * 2, p.size * 2);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    },
  };
}

function vortex(): Painter {
  const smoke = sprite([46, 204, 113], 96);
  const deep = sprite([26, 71, 42], 160);
  type P = { r: number; th: number; size: number; a: number };
  let ps: P[] = [];
  let R = 220;
  const spawn = (outer: boolean): P => ({
    r: outer ? R * (0.9 + Math.random() * 0.25) : R * (0.15 + Math.random() * 0.95),
    th: Math.random() * Math.PI * 2,
    size: 18 + Math.random() * 46,
    a: 0.25 + Math.random() * 0.5,
  });
  return {
    setup(w, h) {
      R = Math.min(w, h) * (w >= 1024 ? 0.42 : 0.36);
      ps = Array.from({ length: 120 }, () => spawn(false));
    },
    frame(ctx, w, h, dt, t) {
      const { cx, cy } = center(w, h);
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.07)";
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      ctx.globalAlpha = 0.1;
      ctx.drawImage(deep, cx - R * 1.4, cy - R * 1.4, R * 2.8, R * 2.8);
      for (const p of ps) {
        p.th += (0.25 + (R / Math.max(p.r, 20)) * 0.25) * dt;
        p.r -= R * 0.035 * dt;
        if (p.r < R * 0.08) Object.assign(p, spawn(true));
        const wob = 1 + 0.08 * Math.sin(t * 0.7 + p.th * 2);
        const x = cx + p.r * Math.cos(p.th) * wob;
        const y = cy + p.r * Math.sin(p.th) * 0.62 * wob;
        const fade = Math.min(1, (p.r / R) * 3) * Math.min(1, ((R * 1.15 - p.r) / R) * 4);
        ctx.globalAlpha = 0.07 * p.a * fade;
        ctx.drawImage(smoke, x - p.size / 2, y - p.size / 2, p.size, p.size);
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    },
  };
}

function fieldSketch(): Painter {
  type Contour = { pts: [number, number][]; color: string };
  let contours: Contour[] = [];
  let R = 200;
  const CYCLE = 11;
  return {
    setup(w, h) {
      R = Math.min(w, h) * (w >= 1024 ? 0.4 : 0.34);
      const seed = [Math.random() * 6, Math.random() * 6, Math.random() * 6];
      contours = Array.from({ length: 7 }, (_, i) => {
        const k = 0.25 + i * 0.13;
        const pts: [number, number][] = [];
        for (let s = 0; s <= 120; s++) {
          const a = (s / 120) * Math.PI * 2;
          const n =
            1 + 0.14 * Math.sin(3 * a + seed[0] + i * 0.4) + 0.08 * Math.sin(5 * a + seed[1]) + 0.05 * Math.sin(7 * a + seed[2] - i * 0.3);
          pts.push([Math.cos(a) * R * k * n * 1.25, Math.sin(a) * R * k * n * 0.8]);
        }
        return { pts, color: i % 3 === 2 ? "108,195,208" : "212,163,56" };
      });
    },
    frame(ctx, w, h, _dt, t) {
      const { cx, cy } = center(w, h);
      ctx.clearRect(0, 0, w, h);
      const phase = (t % CYCLE) / CYCLE;
      const drawn = phase < 0.75 ? Math.min(1, phase / 0.55) : 1;
      const fadeOut = phase < 0.85 ? 1 : 1 - (phase - 0.85) / 0.15;
      ctx.lineWidth = 1.4;
      ctx.lineCap = "round";
      contours.forEach((c, i) => {
        const local = Math.max(0, Math.min(1, drawn * 1.6 - i * 0.09));
        const n = Math.floor(local * (c.pts.length - 1));
        if (n < 2) return;
        ctx.strokeStyle = `rgba(${c.color},${0.55 * fadeOut})`;
        ctx.setLineDash(i % 2 ? [6, 5] : []);
        ctx.beginPath();
        ctx.moveTo(cx + c.pts[0][0], cy + c.pts[0][1]);
        for (let s = 1; s <= n; s++) ctx.lineTo(cx + c.pts[s][0], cy + c.pts[s][1]);
        ctx.stroke();
      });
      ctx.setLineDash([]);

      // Expedition route with a marching dash, from the edge of the map to the summit
      ctx.strokeStyle = `rgba(239,230,221,${0.4 * fadeOut})`;
      ctx.setLineDash([3, 9]);
      ctx.lineDashOffset = -t * 18;
      ctx.beginPath();
      ctx.moveTo(cx - R * 1.3, cy + R * 0.75);
      ctx.bezierCurveTo(cx - R * 0.7, cy + R * 0.2, cx - R * 0.2, cy + R * 0.6, cx, cy);
      ctx.stroke();
      ctx.setLineDash([]);

      // Compass rose, needle settling with a slight wobble
      const kx = cx + R * 0.95;
      const ky = cy - R * 0.6;
      const kr = Math.max(24, R * 0.16);
      ctx.strokeStyle = "rgba(212,163,56,0.7)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(kx, ky, kr, 0, Math.PI * 2);
      ctx.stroke();
      for (let q = 0; q < 8; q++) {
        const a = (q * Math.PI) / 4;
        const len = q % 2 ? kr * 0.55 : kr * 1.25;
        ctx.beginPath();
        ctx.moveTo(kx, ky);
        ctx.lineTo(kx + Math.cos(a) * len, ky + Math.sin(a) * len);
        ctx.stroke();
      }
      const needle = -Math.PI / 2 + 0.35 * Math.sin(t * 1.1) * Math.exp(-((t % CYCLE) / 4));
      ctx.strokeStyle = "rgba(108,195,208,0.95)";
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(kx - Math.cos(needle) * kr * 0.7, ky - Math.sin(needle) * kr * 0.7);
      ctx.lineTo(kx + Math.cos(needle) * kr * 0.9, ky + Math.sin(needle) * kr * 0.9);
      ctx.stroke();
      ctx.fillStyle = "rgba(212,163,56,0.9)";
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    },
  };
}

export function HeroCanvas({ theme, still = false }: { theme: Theme; still?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useCanvasLoop(ref, () => (theme === "auror" ? patronus() : theme === "darkarts" ? vortex() : fieldSketch()), [theme], { still });
  return <canvas ref={ref} aria-hidden="true" className="hero-canvas pointer-events-none absolute inset-0 -z-10 h-full w-full" />;
}
