import { useEffect, useRef } from "react";
import type { Theme } from "../../theme";
import { sprite, useCanvasLoop, type Painter } from "./useCanvasLoop";

/** Pointer state shared with the painter; written by event listeners, read each frame. */
type Input = {
  x: number;
  y: number;
  moved: number; // pixels travelled since the last frame (fine pointers only)
  flare: { x: number; y: number; w: number; h: number; at: number; fresh: boolean } | null;
};

type P = { x: number; y: number; vx: number; vy: number; r: number; a: number; ph: number; life: number; age: number; kind: number };

const now = () => performance.now() / 1000;

/**
 * Page-wide spell particles, behind everything (pointer-events: none):
 *  auror     warm golden dust; a trail of dust and Lumos sparks follows the cursor
 *  darkarts  slow emerald wisps that flare and gather around a hovered button or link
 *  beasts    amber fireflies drifting upward, as if escaping an open suitcase
 */
function painterFor(theme: Theme, input: Input): Painter {
  const gold = sprite([197, 155, 39], 32, 0.15);
  const lumos = sprite([255, 236, 170], 32, 0.35);
  const wisp = sprite([46, 204, 113], 64);
  const wispCore = sprite([169, 245, 198], 32, 0.2);
  const firefly = sprite([255, 190, 80], 32, 0.3);
  let ambient: P[] = [];
  let trail: P[] = [];

  const spawn = (w: number, h: number, anywhere: boolean): P => {
    const base = { x: Math.random() * w, y: anywhere ? Math.random() * h : h + 20, ph: Math.random() * 6.28, life: Infinity, age: 0, kind: 0 };
    if (theme === "darkarts") return { ...base, vx: (Math.random() - 0.5) * 6, vy: -4 - Math.random() * 6, r: 10 + Math.random() * 16, a: 0.25 + Math.random() * 0.35 };
    if (theme === "beasts") return { ...base, vx: (Math.random() - 0.5) * 4, vy: -8 - Math.random() * 10, r: 2 + Math.random() * 2.2, a: 0.6 + Math.random() * 0.4 };
    return { ...base, vx: (Math.random() - 0.5) * 5, vy: -3 - Math.random() * 5, r: 1 + Math.random() * 2, a: 0.35 + Math.random() * 0.6 };
  };

  return {
    setup(w, h) {
      const density = theme === "darkarts" ? 52000 : theme === "beasts" ? 30000 : 26000;
      const n = Math.min(theme === "darkarts" ? 28 : 60, Math.round((w * h) / density));
      ambient = Array.from({ length: n }, () => spawn(w, h, true));
      trail = [];
    },
    frame(ctx, w, h, dt, t) {
      ctx.clearRect(0, 0, w, h);
      const T = now();

      // Cursor trail (Auror): golden dust, with the odd brighter Lumos spark
      if (theme === "auror" && input.moved > 0) {
        const n = Math.min(4, Math.ceil(input.moved / 14));
        for (let i = 0; i < n; i++) {
          const spark = Math.random() < 0.25;
          trail.push({
            x: input.x + (Math.random() - 0.5) * 6,
            y: input.y + (Math.random() - 0.5) * 6,
            vx: (Math.random() - 0.5) * (spark ? 60 : 14),
            vy: spark ? -20 - Math.random() * 40 : 8 + Math.random() * 14,
            r: spark ? 2.6 + Math.random() * 1.6 : 1.1 + Math.random() * 1.4,
            a: 1,
            ph: 0,
            life: spark ? 0.45 : 0.9 + Math.random() * 0.4,
            age: 0,
            kind: spark ? 1 : 0,
          });
        }
        input.moved = 0;
        if (trail.length > 140) trail.splice(0, trail.length - 140);
      }

      // Hover flare (Dark Arts): a few wisps gather at the element, nearby ones brighten
      const f = input.flare;
      const flareK = f ? Math.max(0, 1 - (T - f.at) / 1.4) : 0;
      if (theme === "darkarts" && f?.fresh) {
        f.fresh = false;
        for (let i = 0; i < 4; i++) {
          trail.push({
            x: f.x + (Math.random() - 0.5) * f.w,
            y: f.y + (Math.random() - 0.5) * f.h,
            vx: (Math.random() - 0.5) * 18,
            vy: -10 - Math.random() * 16,
            r: 8 + Math.random() * 8,
            a: 0.8,
            ph: 0,
            life: 1.3,
            age: 0,
            kind: 2,
          });
        }
      }

      ctx.globalCompositeOperation = theme === "auror" ? "source-over" : "lighter";
      for (const p of ambient) {
        p.x += (p.vx + Math.sin(t * 0.5 + p.ph) * (theme === "beasts" ? 10 : 4)) * dt;
        p.y += p.vy * dt;
        if (p.y < -30 || p.x < -30 || p.x > w + 30) Object.assign(p, spawn(w, h, false));
        let alpha: number;
        let img: HTMLCanvasElement;
        let size: number;
        if (theme === "beasts") {
          const blink = Math.max(0, Math.sin(t * 1.1 + p.ph));
          alpha = p.a * (0.15 + 0.85 * blink ** 3);
          img = firefly;
          size = p.r * 7;
        } else if (theme === "darkarts") {
          const near = f ? Math.max(0, 1 - Math.hypot(p.x - f.x, p.y - f.y) / 260) : 0;
          alpha = p.a * (0.55 + 0.45 * Math.sin(t * 0.6 + p.ph)) * (1 + 2.2 * near * flareK) * 0.35;
          img = wisp;
          size = p.r * 4;
        } else {
          alpha = 0.55 * p.a * (0.55 + 0.45 * Math.sin(t * 1.7 + p.ph));
          img = gold;
          size = p.r * 5;
        }
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.drawImage(img, p.x - size / 2, p.y - size / 2, size, size);
      }

      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.age += dt;
        if (p.age >= p.life) {
          trail.splice(i, 1);
          continue;
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.vx *= 0.96;
        const k = 1 - p.age / p.life;
        if (p.kind === 2) {
          ctx.globalAlpha = 0.45 * k;
          const s = p.r * 4 * (1 + 0.6 * (1 - k));
          ctx.drawImage(wisp, p.x - s / 2, p.y - s / 2, s, s);
          ctx.globalAlpha = 0.6 * k;
          ctx.drawImage(wispCore, p.x - p.r / 2, p.y - p.r / 2, p.r, p.r);
        } else {
          ctx.globalAlpha = (p.kind === 1 ? 1 : 0.85) * k;
          const s = p.r * (p.kind === 1 ? 6 : 5);
          ctx.drawImage(p.kind === 1 ? lumos : gold, p.x - s / 2, p.y - s / 2, s, s);
        }
      }
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    },
  };
}

export function AmbientCanvas({ theme }: { theme: Theme }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const input = useRef<Input>({ x: 0, y: 0, moved: 0, flare: null });

  useEffect(() => {
    const st = input.current;
    let lx = 0;
    let ly = 0;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      st.moved += Math.hypot(e.clientX - lx, e.clientY - ly);
      lx = st.x = e.clientX;
      ly = st.y = e.clientY;
    };
    const onOver = (e: PointerEvent) => {
      const el = (e.target as Element | null)?.closest?.("a, button, summary, [role='radio']");
      if (!el) return;
      const r = el.getBoundingClientRect();
      st.flare = { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height, at: now(), fresh: true };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
    };
  }, []);

  useCanvasLoop(ref, () => painterFor(theme, input.current), [theme]);
  return <canvas ref={ref} aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
