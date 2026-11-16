import { random } from "remotion";

/**
 * Helpers for mathematically seamless loops: everything is a periodic function of
 * p = frame / LOOP, so frame LOOP renders exactly like frame 0.
 */
export const LOOP = 180; // 6 s at 30 fps
export const W = 1280;
export const H = 720;
export const TAU = Math.PI * 2;

/** Hero centerpiece position: matches the site's hero (74% across, vertically centred). */
export const CX = Math.round(W * 0.74);
export const CY = H / 2;

export const phase = (frame: number) => (frame % LOOP) / LOOP;

/** A value in [0,1) that advances `k` whole cycles per loop, offset by `off`. */
export const cyc = (p: number, k: number, off = 0) => (((p * k + off) % 1) + 1) % 1;

/** Smooth 0..1..0 pulse with `k` whole cycles per loop. */
export const pulse = (p: number, k = 1, off = 0) => 0.5 - 0.5 * Math.cos(TAU * (p * k + off));

/** Seeded random in [0,1), deterministic per render. */
export const rnd = (seed: string | number) => random(seed);

/** Piecewise-smooth keyframes on the loop: [t0, v0], [t1, v1], ... with t in [0,1]. */
export function keyed(p: number, keys: [number, number][]): number {
  for (let i = 0; i < keys.length - 1; i++) {
    const [t0, v0] = keys[i];
    const [t1, v1] = keys[i + 1];
    if (p >= t0 && p <= t1) {
      const u = (p - t0) / (t1 - t0 || 1);
      const e = u * u * (3 - 2 * u); // smoothstep
      return v0 + (v1 - v0) * e;
    }
  }
  return keys[keys.length - 1][1];
}
