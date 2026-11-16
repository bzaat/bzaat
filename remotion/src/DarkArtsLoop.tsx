import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CX, CY, H, LOOP, TAU, W, cyc, phase, pulse, rnd } from "./loop";

/**
 * The Dark Arts: emerald cursed smoke spiralling inward, a serpent-energy ring with a
 * travelling surge, a turning geometric sigil, orbiting runes and short silver
 * lightning arcs. Abstract and arcane rather than a literal emblem. Obsidian
 * background matches the site (#090A0F).
 */
const BG = "#090A0F";
const DEEP = "#1A472A";
const EMERALD = "#2ECC71";
const SILVER = "#D0D3D4";

function runePath(seed: number, s = 16): string {
  const parts = [`M0 ${-s / 2} L0 ${s / 2}`];
  const n = 2 + Math.floor(rnd(`rn${seed}`) * 2);
  for (let i = 0; i < n; i++) {
    const y1 = [-s / 2, -s / 4, 0, s / 4][Math.floor(rnd(`ry${seed}-${i}`) * 4)];
    const x2 = rnd(`rx${seed}-${i}`) < 0.5 ? -s / 2.2 : s / 2.2;
    const y2 = y1 + [-s / 4, s / 4, s / 3][Math.floor(rnd(`rz${seed}-${i}`) * 3)];
    parts.push(`M0 ${y1.toFixed(1)} L${x2.toFixed(1)} ${y2.toFixed(1)}`);
  }
  return parts.join(" ");
}

/** Serpent ring: a circle with a travelling sinuous ripple (6 waves, 2 cycles per loop). */
function serpentPath(p: number, r: number): string {
  const pts: string[] = [];
  for (let i = 0; i <= 240; i++) {
    const a = (i / 240) * TAU;
    const rr = r + 16 * Math.sin(6 * a - TAU * 2 * p) + 5 * Math.sin(13 * a + TAU * p);
    pts.push(`${(CX + rr * Math.cos(a)).toFixed(1)},${(CY + rr * Math.sin(a) * 0.78).toFixed(1)}`);
  }
  return `M${pts.join(" L")}Z`;
}

function bolt(seed: number, x1: number, y1: number, x2: number, y2: number): string {
  const n = 7;
  const pts = [`${x1},${y1}`];
  for (let i = 1; i < n; i++) {
    const t = i / n;
    const jx = (rnd(`bx${seed}-${i}`) - 0.5) * 34;
    const jy = (rnd(`by${seed}-${i}`) - 0.5) * 34;
    pts.push(`${(x1 + (x2 - x1) * t + jx).toFixed(1)},${(y1 + (y2 - y1) * t + jy).toFixed(1)}`);
  }
  pts.push(`${x2},${y2}`);
  return pts.join(" ");
}

/** Flash envelope for a bolt: on for a few frames, at a fixed frame within the loop. */
const flash = (frame: number, at: number) => {
  const d = (frame - at + LOOP) % LOOP;
  return d < 2 ? 1 : d < 4 ? 0.25 : d < 6 ? 0.8 : 0;
};

export const DarkArtsLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const p = phase(frame);
  const R = 205;

  const smoke = Array.from({ length: 34 }, (_, i) => {
    const q = cyc(p, 1, rnd(`q${i}`)); // inward drift, one pass per loop
    const rr = R * (1.5 - 1.25 * q);
    const a = rnd(`a${i}`) * TAU + TAU * (p * (1 + Math.floor(rnd(`k${i}`) * 2))) + q * 1.6;
    const o = Math.sin(Math.PI * q);
    return { x: CX + rr * Math.cos(a), y: CY + rr * Math.sin(a) * 0.7, r: 40 + rnd(`s${i}`) * 70, o, c: i % 3 === 0 ? EMERALD : DEEP };
  });

  const embers = Array.from({ length: 50 }, (_, i) => {
    const y = H + 10 - cyc(p, 1, rnd(`ey${i}`)) * (H + 30);
    return { x: rnd(`ex${i}`) * W + 10 * Math.sin(TAU * (p * 3 + rnd(`ep${i}`))), y, r: 0.8 + rnd(`er${i}`) * 1.8, o: 0.3 + 0.6 * pulse(p, 4, rnd(`eo${i}`)) };
  });

  const ringLen = TAU * R * 0.9;
  const bolts = [
    { at: 38, a: 0.4 },
    { at: 96, a: 2.6 },
    { at: 151, a: 4.4 },
  ];

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <filter id="smoke" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="26" />
          </filter>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor={EMERALD} stopOpacity="0.85" />
            <stop offset="0.4" stopColor={EMERALD} stopOpacity="0.2" />
            <stop offset="1" stopColor={EMERALD} stopOpacity="0" />
          </radialGradient>
        </defs>

        <g filter="url(#smoke)">
          {smoke.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill={s.c} opacity={0.32 * s.o} />
          ))}
        </g>
        {embers.map((e, i) => (
          <circle key={`e${i}`} cx={e.x} cy={e.y} r={e.r} fill={EMERALD} opacity={e.o} />
        ))}

        <ellipse cx={CX} cy={CY} rx={120 + 14 * pulse(p, 2)} ry={95 + 10 * pulse(p, 2)} fill="url(#core)" />

        {/* turning sigil: two triangles, counter-rotating */}
        <g transform={`translate(${CX} ${CY}) scale(1 0.78)`} filter="url(#glow)">
          {[1, -1].map((dir) => (
            <polygon
              key={dir}
              points={[0, 1, 2]
                .map((k) => {
                  const a = (k / 3) * TAU - Math.PI / 2 + dir * TAU * p;
                  return `${(118 * Math.cos(a)).toFixed(1)},${(118 * Math.sin(a)).toFixed(1)}`;
                })
                .join(" ")}
              fill="none"
              stroke={EMERALD}
              strokeWidth={1.4}
              opacity={0.65}
            />
          ))}
          <circle r={118} fill="none" stroke={DEEP} strokeWidth={1.2} />
        </g>

        {/* serpent energy ring with a travelling surge */}
        <path d={serpentPath(p, R)} fill="none" stroke={DEEP} strokeWidth={6} opacity={0.9} />
        <path
          d={serpentPath(p, R)}
          fill="none"
          stroke={EMERALD}
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeDasharray={`${ringLen * 0.22} ${ringLen * 0.78}`}
          strokeDashoffset={-ringLen * p}
          filter="url(#glow)"
        />

        {/* runes orbiting once per loop */}
        <g filter="url(#glow)">
          {Array.from({ length: 18 }, (_, i) => {
            const a = (i / 18) * TAU + TAU * p;
            const x = CX + 285 * Math.cos(a);
            const y = CY + 285 * Math.sin(a) * 0.78;
            return (
              <path
                key={i}
                d={runePath(i)}
                transform={`translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${((a * 180) / Math.PI + 90).toFixed(1)})`}
                fill="none"
                stroke={EMERALD}
                strokeWidth={1.8}
                strokeLinecap="round"
                opacity={0.35 + 0.65 * pulse(p, 3, i / 18)}
              />
            );
          })}
        </g>

        {/* silver lightning arcs */}
        <g filter="url(#glow)">
          {bolts.map((b, i) => {
            const o = flash(frame, b.at);
            if (!o) return null;
            const x1 = CX + R * Math.cos(b.a);
            const y1 = CY + R * Math.sin(b.a) * 0.78;
            const x2 = CX + 300 * Math.cos(b.a + 0.5);
            const y2 = CY + 300 * Math.sin(b.a + 0.5) * 0.78;
            return <polyline key={i} points={bolt(i, x1, y1, x2, y2)} fill="none" stroke={SILVER} strokeWidth={1.8} opacity={o} />;
          })}
        </g>
      </svg>
    </AbsoluteFill>
  );
};
