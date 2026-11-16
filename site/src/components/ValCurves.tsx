import { valCurves } from "../data";

// Plot geometry (SVG user units)
const W = 600;
const H = 340;
const PAD = { l: 50, r: 16, t: 18, b: 44 };
const EPOCHS = 50;

const x = (epoch: number) => PAD.l + ((epoch - 1) / (EPOCHS - 1)) * (W - PAD.l - PAD.r);
const y = (pct: number) => PAD.t + (1 - pct / 100) * (H - PAD.t - PAD.b);
const path = (vals: number[]) => vals.map((v, i) => `${i ? "L" : "M"}${x(i + 1).toFixed(1)},${y(v).toFixed(1)}`).join(" ");

export function ValCurves() {
  const s = valCurves.scratch;
  const t = valCurves.transfer;
  const sEnd = { x: x(s.length), y: y(s[s.length - 1]) };
  const tEnd = { x: x(t.length), y: y(t[t.length - 1]) };

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-labelledby="curves-title curves-desc"
      className="h-auto w-full"
    >
      <title id="curves-title">Validation accuracy by epoch, ResNet-50 on Oxford-IIIT Pet</title>
      <desc id="curves-desc">
        The ImageNet-pretrained model reaches 73.7% validation accuracy after one epoch and 94.8% after ten. The
        model trained from scratch climbs slowly to about 38% after fifty epochs. Test accuracy: 92.4% pretrained,
        32.0% from scratch.
      </desc>

      {/* grid + y axis */}
      {[0, 25, 50, 75, 100].map((v) => (
        <g key={v}>
          <line x1={PAD.l} x2={W - PAD.r} y1={y(v)} y2={y(v)} stroke="var(--color-line)" strokeWidth={1} />
          <text x={PAD.l - 8} y={y(v) + 4} textAnchor="end" className="fill-muted font-mono" fontSize={13}>
            {v}%
          </text>
        </g>
      ))}
      {/* x axis */}
      {[1, 10, 20, 30, 40, 50].map((e) => (
        <text key={e} x={x(e)} y={H - PAD.b + 22} textAnchor="middle" className="fill-muted font-mono" fontSize={13}>
          {e}
        </text>
      ))}
      <text x={W - PAD.r} y={H - 4} textAnchor="end" className="fill-muted" fontSize={13}>
        epoch
      </text>

      {/* curves */}
      <path
        d={path(s)}
        pathLength={1}
        className="curve"
        fill="none"
        stroke="var(--color-steel)"
        strokeWidth={2.25}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      <path
        d={path(t)}
        pathLength={1}
        className="curve curve-late"
        fill="none"
        stroke="var(--color-amber)"
        strokeWidth={2.75}
        strokeLinejoin="round"
        strokeLinecap="round"
      />

      {/* end labels */}
      <g className="curve-label">
        <circle cx={tEnd.x} cy={tEnd.y} r={4} fill="var(--color-amber)" />
        <text x={tEnd.x + 10} y={tEnd.y + 5} className="fill-amber" fontSize={16} fontWeight={600}>
          ImageNet-pretrained, 10 epochs
        </text>
        <text x={tEnd.x + 10} y={tEnd.y + 26} className="fill-muted font-mono" fontSize={13}>
          test {valCurves.transferTest}
        </text>

        <circle cx={sEnd.x} cy={sEnd.y} r={4} fill="var(--color-steel)" />
        <text x={sEnd.x - 8} y={sEnd.y - 38} textAnchor="end" className="fill-steel" fontSize={16} fontWeight={600}>
          From scratch, 50 epochs
        </text>
        <text x={sEnd.x - 8} y={sEnd.y - 16} textAnchor="end" className="fill-muted font-mono" fontSize={13}>
          test {valCurves.scratchTest}
        </text>
      </g>
    </svg>
  );
}
