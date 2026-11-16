import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CX, CY, H, TAU, W, cyc, phase, pulse, rnd } from "./loop";

/**
 * The Auror Office: a silver-blue Patronus stag drawn as a geometric wireframe, a
 * constellation of light streaming from a wand-tip spark, celestial astrolabe rings
 * and golden dust. Parchment background matches the site (#F6EEDB).
 */
const BG = "#F6EEDB";
const PATRONUS = "#7FB3D5";
const GOLD = "#C59B27";
const INK = "#231709";

// Stag head wireframe (relative to the spark, scaled below). Nodes + edges.
const S = 1.7;
const NODES: [number, number][] = [
  [-62, 40], [-52, 18], [-16, -20], [0, -30], [26, -24], [32, 2], [6, 46], [-34, 56], // 0-7 head
  [-12, -26], [-30, -72], [-56, -100], [-72, -76], [-42, -90], [-36, -128], // 8-13 left antler
  [8, -30], [22, -76], [46, -110], [62, -82], [36, -96], [32, -136], // 14-19 right antler
  [56, 62], [28, 92], [-20, 4], // 20-21 neck, 22 eye
];
const EDGES: [number, number][] = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 0], [1, 22], [22, 2], [22, 5], [2, 5], [0, 22],
  [8, 9], [9, 10], [9, 11], [9, 12], [12, 13], [2, 8],
  [14, 15], [15, 16], [15, 17], [15, 18], [18, 19], [3, 14],
  [5, 20], [6, 21], [20, 21],
];

const Rings: React.FC<{ p: number }> = ({ p }) => {
  const rings = [
    { r: 175, ry: 0.42, tilt: -18, k: 1, dash: "2 7", w: 1.4 },
    { r: 232, ry: 0.36, tilt: 24, k: -1, dash: "", w: 1.2 },
    { r: 292, ry: 0.3, tilt: -6, k: 1, dash: "1 10", w: 1.8 },
  ];
  return (
    <g>
      {rings.map((g, i) => {
        const spin = 360 * g.k * p;
        return (
          <g key={i} transform={`translate(${CX} ${CY}) rotate(${g.tilt})`} opacity={0.75}>
            <ellipse rx={g.r} ry={g.r * g.ry} fill="none" stroke={GOLD} strokeWidth={g.w} strokeDasharray={g.dash || undefined} />
            {Array.from({ length: 24 }, (_, j) => {
              const a = (j / 24) * TAU + (spin * Math.PI) / 180;
              const x = g.r * Math.cos(a);
              const y = g.r * g.ry * Math.sin(a);
              const big = j % 6 === 0;
              return <circle key={j} cx={x} cy={y} r={big ? 3.2 : 1.4} fill={big ? GOLD : INK} opacity={big ? 0.9 : 0.35} />;
            })}
          </g>
        );
      })}
    </g>
  );
};

export const AurorLightLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const p = phase(frame);
  const breathe = 1 + 0.035 * Math.sin(TAU * p);

  // Constellation: light streams out of the wand tip along slow spirals
  const stream = Array.from({ length: 70 }, (_, i) => {
    const q = cyc(p, 1, rnd(`s${i}`));
    const a0 = rnd(`a${i}`) * TAU;
    const a = a0 + q * 2.4;
    const rad = 20 + q * (180 + rnd(`r${i}`) * 170);
    return { x: CX + Math.cos(a) * rad * 1.15, y: CY + Math.sin(a) * rad * 0.72, o: Math.sin(Math.PI * q), s: 1.2 + rnd(`z${i}`) * 2.6 };
  });

  // Golden dust: drifts up two screen-heights per loop, wrapping seamlessly
  const dust = Array.from({ length: 60 }, (_, i) => {
    const y = H + 20 - cyc(p, 1, rnd(`dy${i}`)) * (H + 40);
    const x = rnd(`dx${i}`) * W + 14 * Math.sin(TAU * (p * 2 + rnd(`dp${i}`)));
    return { x, y, r: 0.8 + rnd(`dr${i}`) * 2, o: 0.25 + 0.55 * pulse(p, 3, rnd(`do${i}`)) };
  });

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="halo" cx="50%" cy="50%" r="50%">
            <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
            <stop offset="0.35" stopColor={PATRONUS} stopOpacity="0.45" />
            <stop offset="1" stopColor={PATRONUS} stopOpacity="0" />
          </radialGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ellipse cx={CX} cy={CY} rx={330 * breathe} ry={250 * breathe} fill="url(#halo)" opacity={0.55 + 0.15 * pulse(p, 2)} />
        <Rings p={p} />

        {dust.map((d, i) => (
          <circle key={`d${i}`} cx={d.x} cy={d.y} r={d.r} fill={GOLD} opacity={d.o} />
        ))}

        <g filter="url(#glow)">
          {stream.map((s, i) => (
            <circle key={`s${i}`} cx={s.x} cy={s.y} r={s.s} fill={PATRONUS} opacity={0.85 * s.o} />
          ))}
        </g>

        {/* Patronus stag wireframe */}
        <g transform={`translate(${CX - 10} ${CY - 18}) scale(${S * breathe})`} filter="url(#glow)">
          {EDGES.map(([a, b], i) => {
            const [x1, y1] = NODES[a];
            const [x2, y2] = NODES[b];
            const len = Math.hypot(x2 - x1, y2 - y1);
            return (
              <line
                key={i}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={PATRONUS}
                strokeWidth={1.3}
                strokeLinecap="round"
                strokeDasharray={`${len * 0.7} ${len * 0.3}`}
                strokeDashoffset={-len * cyc(p, 2, i / EDGES.length)}
                opacity={0.55 + 0.45 * pulse(p, 2, i / EDGES.length)}
              />
            );
          })}
          {NODES.map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r={i === 22 ? 2.6 : 1.8} fill={i === 22 ? GOLD : "#FFFFFF"} opacity={0.6 + 0.4 * pulse(p, 3, i / NODES.length)} />
          ))}
        </g>

        {/* wand-tip spark */}
        <circle cx={CX} cy={CY + 120} r={10 + 5 * pulse(p, 4)} fill="url(#halo)" />
        <circle cx={CX} cy={CY + 120} r={2.6} fill="#FFFFFF" />
        <line x1={CX} y1={CY + 124} x2={CX + 38} y2={CY + 210} stroke={INK} strokeWidth={4} strokeLinecap="round" opacity={0.75} />
      </svg>
    </AbsoluteFill>
  );
};
