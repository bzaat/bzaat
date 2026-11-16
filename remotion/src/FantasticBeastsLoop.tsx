import { AbsoluteFill, useCurrentFrame } from "remotion";
import { CX, CY, H, TAU, W, cyc, keyed, phase, pulse, rnd } from "./loop";

/**
 * Newt Scamander's case: a brass clasp unlocks and a field journal inks in. One
 * hand-inked outline morphs Occamy -> Niffler -> Thunderbird -> Occamy, a gold coin
 * spins around it for the Niffler to chase, with compass ticks and ink callouts.
 * Leather background matches the site's Newt's Case page (#2A1A16).
 */
const BG = "#2A1A16";
const LEATHER = "#3E2723";
const PAPER = "#EFE6DD";
const TEAL = "#16697A";
const BRASS = "#D4A338";
const INK = "#3E2723";

const N = 120;
const angDiff = (a: number, b: number) => {
  const d = (((a - b) % TAU) + TAU) % TAU;
  return d > Math.PI ? TAU - d : d;
};
const bump = (th: number, at: number, w: number) => Math.exp(-(angDiff(th, at) ** 2) / w);

// Radial outlines, theta measured in SVG coordinates (pi/2 = down, 3pi/2 = up)
const SHAPES: ((th: number) => number)[] = [
  // Occamy: winged serpent, four feathered lobes with a scaly ripple
  (th) => 72 + 46 * Math.abs(Math.sin(2 * th)) ** 1.6 + 8 * Math.sin(9 * th),
  // Niffler: round body, duck-bill to the left, two small ears
  (th) => 70 + 6 * Math.cos(2 * th) + 40 * bump(th, Math.PI, 0.05) + 15 * bump(th, 4.15, 0.02) + 15 * bump(th, 5.25, 0.02) - 8 * bump(th, Math.PI / 2, 0.25),
  // Thunderbird: wide wings, tail feathers down, head up
  (th) => 42 + 100 * Math.abs(Math.cos(th)) ** 5 + 34 * bump(th, Math.PI / 2, 0.04) + 24 * bump(th, (3 * Math.PI) / 2, 0.03),
];
const NAMES = ["Occamy", "Niffler", "Thunderbird"];

/** Morph weights over the loop: hold, blend, hold, blend, hold, blend back to the start. */
function weights(p: number): [number, number, number] {
  const ab = keyed(p, [[0, 0], [0.22, 0], [0.33, 1], [1, 1]]);
  const bc = keyed(p, [[0, 0], [0.55, 0], [0.66, 1], [1, 1]]);
  const ca = keyed(p, [[0, 0], [0.88, 0], [1, 1]]);
  if (p < 0.55) return [1 - ab, ab, 0];
  if (p < 0.88) return [0, 1 - bc, bc];
  return [ca, 0, 1 - ca];
}

export const FantasticBeastsLoop: React.FC = () => {
  const frame = useCurrentFrame();
  const p = phase(frame);
  const w = weights(p);
  const open = keyed(p, [[0, 0], [0.08, 1], [0.9, 1], [0.98, 0], [1, 0]]); // clasp unlocks, then relocks
  const ink = 0.3 + 0.7 * open;

  const sx = CX - 10;
  const sy = CY + 24;
  const outline = Array.from({ length: N + 1 }, (_, i) => {
    const th = (i / N) * TAU;
    const r = SHAPES.reduce((acc, f, k) => acc + w[k] * f(th), 0);
    return `${(sx + r * Math.cos(th) * 1.05).toFixed(1)},${(sy + r * Math.sin(th) * 0.82).toFixed(1)}`;
  });
  const path = `M${outline.join(" L")}Z`;
  const perim = 820;

  // Coin orbits twice per loop and spins six times
  const ca = TAU * 2 * p;
  const coin = { x: sx + 190 * Math.cos(ca), y: sy + 120 * Math.sin(ca), spin: Math.abs(Math.cos(TAU * 6 * p)) };

  const dust = Array.from({ length: 40 }, (_, i) => ({
    x: rnd(`fx${i}`) * W + 12 * Math.sin(TAU * (p * 2 + rnd(`fp${i}`))),
    y: H + 10 - cyc(p, 1, rnd(`fy${i}`)) * (H + 30),
    r: 1 + rnd(`fr${i}`) * 1.8,
    o: 0.15 + 0.75 * Math.max(0, Math.sin(TAU * (p * 3 + rnd(`fo${i}`)))) ** 3,
  }));

  return (
    <AbsoluteFill style={{ backgroundColor: BG }}>
      <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fontFamily="Georgia, 'Times New Roman', serif">
        <defs>
          <pattern id="grid" width="22" height="22" patternUnits="userSpaceOnUse">
            <path d="M22 0 H0 V22" fill="none" stroke={TEAL} strokeOpacity="0.12" strokeWidth="1" />
          </pattern>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {dust.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={BRASS} opacity={d.o} filter="url(#glow)" />
        ))}

        {/* field journal page */}
        <g transform={`rotate(-2 ${CX} ${CY})`}>
          <rect x={CX - 262} y={CY - 212} width={524} height={424} rx={8} fill={PAPER} stroke={LEATHER} strokeWidth={4} />
          <rect x={CX - 262} y={CY - 212} width={524} height={424} rx={8} fill="url(#grid)" />
          <line x1={CX - 222} y1={CY - 212} x2={CX - 222} y2={CY + 212} stroke="#B5523B" strokeOpacity="0.35" />

          {/* construction lines */}
          <g opacity={0.35 * ink} stroke={TEAL} strokeWidth={1} fill="none">
            <circle cx={sx} cy={sy} r={150} strokeDasharray="3 6" />
            <line x1={sx - 190} y1={sy} x2={sx + 190} y2={sy} strokeDasharray="2 5" />
            <line x1={sx} y1={sy - 165} x2={sx} y2={sy + 165} strokeDasharray="2 5" />
          </g>

          {/* morphing creature outline, inked with a moving pen stroke */}
          <path d={path} fill={TEAL} fillOpacity={0.06 * ink} stroke={TEAL} strokeWidth={2.4} strokeLinejoin="round" opacity={ink} />
          <path
            d={path}
            fill="none"
            stroke={INK}
            strokeWidth={1.1}
            strokeDasharray={`${perim * 0.12} ${perim * 0.88}`}
            strokeDashoffset={-perim * cyc(p, 2)}
            opacity={0.8 * ink}
          />

          {/* ink callout + creature name, cross-fading with the morph */}
          <g opacity={ink}>
            <polyline points={`${sx + 92},${sy - 70} ${sx + 150},${sy - 128} ${sx + 210},${sy - 128}`} fill="none" stroke={TEAL} strokeWidth={1.2} strokeDasharray="4 3" />
            <circle cx={sx + 92} cy={sy - 70} r={3.5} fill={TEAL} />
            {NAMES.map((n, k) => (
              <text key={n} x={sx + 152} y={sy - 136} fontSize={24} fontStyle="italic" fill={INK} opacity={w[k]}>
                {n}
              </text>
            ))}
            <text x={CX - 238} y={CY - 172} fontSize={20} fill={INK} opacity={0.85}>
              Magizoology field notes
            </text>
          </g>

          {/* compass ticks */}
          <g transform={`translate(${CX + 205} ${CY + 150})`} opacity={0.4 + 0.6 * ink}>
            <circle r={32} fill="none" stroke={BRASS} strokeWidth={1.4} />
            {Array.from({ length: 36 }, (_, i) => {
              const a = (i / 36) * TAU + TAU * p;
              const l = i % 9 === 0 ? 10 : 5;
              return <line key={i} x1={Math.cos(a) * 32} y1={Math.sin(a) * 32} x2={Math.cos(a) * (32 - l)} y2={Math.sin(a) * (32 - l)} stroke={BRASS} strokeWidth={1.2} />;
            })}
            <g transform={`rotate(${-90 + 22 * Math.sin(TAU * 2 * p)})`}>
              <polygon points="0,-4 26,0 0,4" fill={TEAL} />
              <polygon points="0,-4 -18,0 0,4" fill={INK} />
            </g>
            <circle r={3} fill={BRASS} />
          </g>
        </g>

        {/* gold coin the Niffler chases */}
        <g transform={`translate(${coin.x.toFixed(1)} ${coin.y.toFixed(1)})`} filter="url(#glow)">
          <ellipse rx={Math.max(1.5, 13 * coin.spin)} ry={13} fill={BRASS} stroke="#8C6D12" strokeWidth={1.4} />
          <ellipse rx={Math.max(0.8, 8 * coin.spin)} ry={8} fill="none" stroke="#F1D27A" strokeWidth={1.2} />
        </g>

        {/* leather strap + brass clasp on the page edge */}
        <g transform={`translate(${-34 * open} 0)`}>
          <rect x={CX - 340} y={CY - 26} width={130} height={52} rx={6} fill={LEATHER} stroke="#1E120F" strokeWidth={2} />
          <line x1={CX - 330} y1={CY - 17} x2={CX - 220} y2={CY - 17} stroke={BRASS} strokeOpacity="0.4" strokeDasharray="5 5" />
          <line x1={CX - 330} y1={CY + 17} x2={CX - 220} y2={CY + 17} stroke={BRASS} strokeOpacity="0.4" strokeDasharray="5 5" />
        </g>
        <g transform={`translate(${CX - 232} ${CY})`}>
          <rect x={-22} y={-30} width={44} height={60} rx={8} fill="none" stroke={BRASS} strokeWidth={6} />
          <g transform={`rotate(${-75 * open})`}>
            <line x1={0} y1={-26} x2={0} y2={26} stroke={BRASS} strokeWidth={5} strokeLinecap="round" />
          </g>
          <circle r={5 + 2 * pulse(p, 2)} fill="#F1D27A" opacity={0.5 * open} filter="url(#glow)" />
        </g>
      </svg>
    </AbsoluteFill>
  );
};
