import { useEffect, type RefObject } from "react";
import { prefersReducedMotion } from "../../theme";

export type Painter = {
  /** called on start and on every resize, with CSS-pixel size */
  setup: (w: number, h: number) => void;
  /** one animation step; dt in seconds (clamped) */
  frame: (ctx: CanvasRenderingContext2D, w: number, h: number, dt: number, t: number) => void;
};

/**
 * Runs a painter on a canvas at up to 60 fps, with the canvas sized to its box.
 * Pauses when the canvas is off-screen or the tab is hidden. Under
 * prefers-reduced-motion (or `still`) it advances the scene briefly and paints one still frame.
 */
export function useCanvasLoop(
  ref: RefObject<HTMLCanvasElement | null>,
  makePainter: () => Painter,
  deps: unknown[],
  opts: { still?: boolean } = {},
) {
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const painter = makePainter();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let w = 0;
    let h = 0;
    let raf = 0;
    let last = 0;
    let t = 0;
    let visible = true;
    const still = !!opts.still || prefersReducedMotion();

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      w = Math.max(1, Math.round(r.width));
      h = Math.max(1, Math.round(r.height));
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      painter.setup(w, h);
      if (still) paintStill();
    };

    const paintStill = () => {
      ctx.clearRect(0, 0, w, h);
      for (let i = 0; i < 90; i++) painter.frame(ctx, w, h, 1 / 30, (t += 1 / 30));
    };

    const loop = (now: number) => {
      const dt = last ? Math.min((now - last) / 1000, 1 / 20) : 1 / 60;
      last = now;
      t += dt;
      painter.frame(ctx, w, h, dt, t);
      raf = requestAnimationFrame(loop);
    };
    const start = () => {
      if (still || raf || !visible || document.hidden) return;
      last = 0;
      raf = requestAnimationFrame(loop);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(canvas);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);

    resize();
    start();
    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, !!opts.still]);
}

/** A soft round sprite (radial gradient) pre-rendered once, cheaper than shadowBlur. */
export function sprite(rgb: [number, number, number], size: number, core = 0): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  const [r, gg, b] = rgb;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, core ? "rgb(255,255,255)" : `rgb(${r},${gg},${b})`);
  grad.addColorStop(Math.max(core, 0.01), `rgba(${r},${gg},${b},0.9)`);
  grad.addColorStop(1, `rgba(${r},${gg},${b},0)`);
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);
  return c;
}
