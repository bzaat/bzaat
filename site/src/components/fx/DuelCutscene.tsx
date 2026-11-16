import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion } from "motion/react";
import { registerThemeTransition, type Theme } from "../../theme";
import { spellsActive } from "../../spells";
import { Figure, SPEC, Suitcase } from "../ChibiCast";
import { Niffler, Thunderbird } from "../animals";

/**
 * Theme-switch cutscenes (~1.3 s, pointer-events: none, z-index 50). The theme is
 * committed at the scene's impact moment, under its flash or shockwave:
 *  auror    -> darkarts  The Astronomy Tower: Snape's green beam strikes Dumbledore
 *  darkarts -> auror     Priori Incantatem: Harry's gold beam overpowers Voldemort's
 *  *        -> beasts    Newt opens the case; an amber swirl and a leaping Niffler
 *  beasts   -> *         Newt summons the Thunderbird; a golden-blue mist sweeps across
 * Skipped (instant switch) when spell effects are off or motion is reduced.
 */
type Scene = "tower" | "priori" | "case" | "storm";
const DURATION = 1.3; // seconds
const IMPACT: Record<Scene, number> = { tower: 600, priori: 680, case: 600, storm: 650 };

function pickScene(from: Theme, to: Theme): Scene {
  if (to === "beasts") return "case";
  if (from === "beasts") return "storm";
  return to === "darkarts" ? "tower" : "priori";
}

type Geo = ReturnType<typeof geometry>;
function geometry(W: number, H: number) {
  const w = Math.max(104, Math.min(170, W * 0.2));
  const h = (w * 122) / 80;
  const top = H * 0.78 - h;
  const L = { x: W * 0.12, y: top };
  const R = { x: W * 0.88 - w, y: top };
  // wand tip in the figure's 80x122 viewBox is at (75.5, 49); the right figure is mirrored
  const tipL = { x: L.x + 0.944 * w, y: top + 0.402 * h };
  const tipR = { x: R.x + 0.056 * w, y: top + 0.402 * h };
  return { W, H, w, h, L, R, tipL, tipR, diag: Math.hypot(W, H) };
}

type Run = { id: number; scene: Scene; to: Theme; g: Geo };

/* ---------------------------------------------------------------- building blocks */

const t = (sec: number) => sec / DURATION; // seconds -> keyframe time

function Actor({ at, g, mirror, delay = 0, children }: { at: { x: number; y: number }; g: Geo; mirror?: boolean; delay?: number; children: ReactNode }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: at.x, top: at.y, width: g.w }}
      initial={{ opacity: 0, y: 24, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 420, damping: 24, delay }}
    >
      <div style={mirror ? { transform: "scaleX(-1)" } : undefined}>{children}</div>
    </motion.div>
  );
}

function Incantation({ x, y, color, delay, children }: { x: number; y: number; color: string; delay: number; children: ReactNode }) {
  return (
    <motion.span
      className="duel-text"
      style={{ left: x, top: y, "--glow": color } as CSSProperties}
      initial={{ opacity: 0, y: 8, scale: 0.8 }}
      animate={{ opacity: [0, 1, 1, 0], y: [8, -6, -14, -26], scale: [0.8, 1.08, 1, 1] }}
      transition={{ duration: 0.9, delay, times: [0, 0.2, 0.7, 1] }}
    >
      {children}
    </motion.span>
  );
}

function Shockwave({ x, y, color, at, g }: { x: number; y: number; color: string; at: number; g: Geo }) {
  const size = 60;
  return (
    <motion.span
      className="duel-wave"
      style={{ left: x - size / 2, top: y - size / 2, width: size, height: size, "--c": color } as CSSProperties}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: [0, (g.diag * 2.1) / size], opacity: [0.95, 0] }}
      transition={{ duration: 0.65, delay: at, ease: [0.2, 0.7, 0.3, 1] }}
    />
  );
}

function Flash({ color, at }: { color: string; at: number }) {
  return (
    <motion.span
      className="absolute inset-0"
      style={{ background: color }}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.55, 0] }}
      transition={{ duration: 0.32, delay: at, times: [0, 0.25, 1] }}
    />
  );
}

function Beam({ x1, y1, x2, y2, color, delay, dur }: { x1: number; y1: number; x2: number; y2: number; color: string; delay: number; dur: number }) {
  return (
    <g>
      <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={10} strokeLinecap="round" filter="url(#duel-glow)"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }} transition={{ duration: dur + 0.35, delay, times: [0, dur / (dur + 0.35), 1] }} />
      <motion.line x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }} transition={{ duration: dur + 0.35, delay, times: [0, dur / (dur + 0.35), 1] }} />
    </g>
  );
}

function Svg({ g, children }: { g: Geo; children: ReactNode }) {
  return (
    <svg className="absolute inset-0" width={g.W} height={g.H} viewBox={`0 0 ${g.W} ${g.H}`}>
      <defs>
        <filter id="duel-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      {children}
    </svg>
  );
}

/* ------------------------------------------------------------------------ scenes */

function Tower({ g }: { g: Geo }) {
  const green = "#2ECC71";
  return (
    <>
      <Actor at={g.L} g={g}><Figure s={SPEC.snape} /></Actor>
      <motion.div className="absolute" style={{ left: g.R.x, top: g.R.y, width: g.w }}
        initial={{ opacity: 0, y: 24, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], y: [24, 0, 0, 10], scale: [0.8, 1, 1, 0.9], rotate: [0, 0, 0, -10] }}
        transition={{ duration: 1.05, times: [0, 0.18, t(0.6) / (1.05 / DURATION), 1] }}>
        <div style={{ transform: "scaleX(-1)" }}><Figure s={SPEC.dumbledore} /></div>
      </motion.div>
      <Svg g={g}><Beam x1={g.tipL.x} y1={g.tipL.y} x2={g.tipR.x} y2={g.tipR.y} color={green} delay={0.28} dur={0.3} /></Svg>
      <Incantation x={g.L.x + g.w * 0.5} y={g.L.y - 10} color={green} delay={0.18}>Avada Kedavra!</Incantation>
      <Flash color="rgb(46 204 113 / 0.9)" at={0.56} />
      <Shockwave x={g.tipR.x} y={g.tipR.y} color="#1A472A" at={0.58} g={g} />
    </>
  );
}

function Priori({ g }: { g: Geo }) {
  const gold = "#FFC94A";
  const green = "#2ECC71";
  const midX = (g.tipL.x + g.tipR.x) / 2;
  const y = g.tipL.y;
  const meet = [midX, midX, midX + 18, midX - 14, midX + 8, g.tipR.x];
  const times = [0, t(0.32), t(0.4), t(0.47), t(0.54), t(0.66)];
  return (
    <>
      <Actor at={g.L} g={g}><Figure s={SPEC.harry} /></Actor>
      <motion.div className="absolute" style={{ left: g.R.x, top: g.R.y, width: g.w }}
        initial={{ opacity: 0, y: 24, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0.2, 0], y: [24, 0, 0, 6, 10], x: [0, 0, 0, 14, 20] }}
        transition={{ duration: DURATION, times: [0, 0.14, t(0.64), t(0.8), 1] }}>
        <div style={{ transform: "scaleX(-1)" }}><Figure s={SPEC.voldemort} /></div>
      </motion.div>
      <Svg g={g}>
        <motion.line x1={g.tipL.x} y1={y} stroke={gold} strokeWidth={10} strokeLinecap="round" filter="url(#duel-glow)"
          initial={{ x2: g.tipL.x, y2: y, opacity: 0 }}
          animate={{ x2: [g.tipL.x, ...meet.slice(1)], y2: y, opacity: [0, 1, 1, 0] }}
          transition={{ duration: DURATION, times: [0, 0.04, 0.6, 0.72], x2: { duration: DURATION, times } }} />
        <motion.line x1={g.tipL.x} y1={y} stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round"
          initial={{ x2: g.tipL.x, y2: y }} animate={{ x2: [g.tipL.x, ...meet.slice(1)], y2: y, opacity: [1, 1, 0] }}
          transition={{ duration: DURATION, times: [0, 0.6, 0.95], x2: { duration: DURATION, times } }} />
        <motion.line x1={g.tipR.x} y1={y} stroke={green} strokeWidth={10} strokeLinecap="round" filter="url(#duel-glow)"
          initial={{ x2: g.tipR.x, y2: y }} animate={{ x2: [g.tipR.x, ...meet.slice(1)], y2: y, opacity: [1, 1, 0] }}
          transition={{ duration: DURATION, times: [0, t(0.6), t(0.7)], x2: { duration: DURATION, times } }} />
        <motion.circle cy={y} fill="#FFF6D8" filter="url(#duel-glow)"
          initial={{ cx: midX, r: 0 }} animate={{ cx: meet, r: [0, 16, 22, 18, 26, 40], opacity: [0, 1, 1, 1, 1, 0] }}
          transition={{ duration: DURATION, times }} />
      </Svg>
      <Incantation x={g.L.x + g.w * 0.5} y={g.L.y - 10} color={gold} delay={0.1}>Expelliarmus!</Incantation>
      <Incantation x={g.R.x + g.w * 0.5} y={g.R.y - 10} color={green} delay={0.16}>Avada Kedavra!</Incantation>
      <Flash color="rgb(255 214 120 / 0.85)" at={0.62} />
      <Shockwave x={g.tipR.x} y={y} color="#F6EEDB" at={0.64} g={g} />
    </>
  );
}

function CaseScene({ g }: { g: Geo }) {
  const cx = g.W / 2;
  const caseW = g.w * 1.25;
  const caseTop = g.H * 0.78 - caseW * 0.78;
  const lipY = caseTop + caseW * 0.38;
  const sparks = Array.from({ length: 14 }, (_, i) => {
    const a = (i / 14) * Math.PI * 2;
    const d = 90 + (i % 3) * 45;
    return { dx: Math.cos(a) * d, dy: Math.sin(a) * d * 0.7 - 60, delay: 0.32 + (i % 5) * 0.03 };
  });
  return (
    <>
      <Actor at={{ x: cx - caseW / 2 - g.w * 0.95, y: g.L.y }} g={g}><Figure s={SPEC.newt} /></Actor>
      <motion.span className="duel-swirl" style={{ left: cx - 70, top: lipY - 70 }}
        initial={{ scale: 0, opacity: 0, rotate: 0 }} animate={{ scale: [0, 1.6, 2.4], opacity: [0, 0.95, 0], rotate: [0, 160, 300] }}
        transition={{ duration: 0.8, delay: 0.28, times: [0, 0.45, 1] }} />
      {sparks.map((s, i) => (
        <motion.span key={i} className="duel-coin" style={{ left: cx - 6, top: lipY - 6 }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }} animate={{ x: s.dx, y: s.dy, opacity: [0, 1, 0], scale: [0.4, 1, 0.6] }}
          transition={{ duration: 0.75, delay: s.delay, ease: "easeOut" }} />
      ))}
      <motion.div className="absolute" style={{ left: cx - caseW / 2, top: caseTop, width: caseW }}
        initial={{ opacity: 0, scale: 0.6, y: 20 }} animate={{ opacity: 1, scale: [0.6, 1.08, 1], y: 0 }} transition={{ duration: 0.35 }}>
        <Suitcase />
      </motion.div>
      <motion.div className="absolute" style={{ left: cx - g.w * 0.3, top: lipY - g.w * 0.3, width: g.w * 0.6 }}
        initial={{ opacity: 0, y: 0, rotate: 0 }} animate={{ opacity: [0, 1, 1, 0], y: [0, -g.H * 0.26, -g.H * 0.2, -g.H * 0.16], rotate: [0, -12, 8, 0] }}
        transition={{ duration: 0.85, delay: 0.32, times: [0, 0.45, 0.75, 1] }}>
        <svg viewBox="0 0 80 80" className="block h-auto w-full overflow-visible" aria-hidden="true"><Niffler /></svg>
      </motion.div>
      <Incantation x={cx - caseW / 2 - g.w * 0.45} y={g.L.y - 10} color="#D4A338" delay={0.12}>Into the Case!</Incantation>
      <Shockwave x={cx} y={lipY} color="#3E2723" at={0.58} g={g} />
    </>
  );
}

function Storm({ g }: { g: Geo }) {
  const bw = g.w * 0.95;
  return (
    <>
      <Actor at={g.L} g={g}><Figure s={SPEC.newt} /></Actor>
      <motion.div className="absolute" style={{ left: g.tipL.x - bw / 2, top: g.tipL.y - bw / 2, width: bw }}
        initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
        animate={{ x: [0, g.W * 0.18, g.W * 0.36], y: [0, -g.H * 0.22, -g.H * 0.3], opacity: [0, 1, 1, 0], scale: [0.4, 1, 1.15] }}
        transition={{ duration: 1.1, delay: 0.12, times: [0, 0.45, 1] }}>
        <svg viewBox="0 0 80 80" className="tb-flap block h-auto w-full overflow-visible" aria-hidden="true"><Thunderbird /></svg>
      </motion.div>
      <motion.span className="duel-mist" initial={{ x: "-100%" }} animate={{ x: "100%" }} transition={{ duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.6, 1] }} />
      <Incantation x={g.L.x + g.w * 0.5} y={g.L.y - 10} color="#5EC8F2" delay={0.1}>Up, Frank!</Incantation>
      <Flash color="rgb(140 210 245 / 0.5)" at={0.6} />
    </>
  );
}

/* ------------------------------------------------------------------------- host */

export function DuelCutscene() {
  const [run, setRun] = useState<Run | null>(null);
  const pending = useRef<{ commit: () => void; impact: number; end: number } | null>(null);
  const nextId = useRef(1);

  useEffect(() => {
    const finish = () => {
      const p = pending.current;
      if (!p) return;
      window.clearTimeout(p.impact);
      window.clearTimeout(p.end);
      p.commit();
      pending.current = null;
    };
    registerThemeTransition({
      play(from, to, commit) {
        if (!spellsActive()) return false;
        finish(); // a switch during a running scene completes the previous one first
        const scene = pickScene(from, to);
        let done = false;
        const once = () => {
          if (!done) {
            done = true;
            commit();
          }
        };
        const impact = window.setTimeout(() => {
          once();
          if (pending.current) pending.current.commit = () => {};
        }, IMPACT[scene]);
        const end = window.setTimeout(() => {
          pending.current = null;
          setRun(null);
        }, DURATION * 1000 + 60);
        pending.current = { commit: once, impact, end };
        setRun({ id: nextId.current++, scene, to, g: geometry(window.innerWidth, window.innerHeight) });
        return true;
      },
      cancel() {
        finish();
        setRun(null);
      },
    });
    return () => {
      finish();
      registerThemeTransition(undefined);
    };
  }, []);

  if (!run) return null;
  const { scene, g } = run;
  return (
    <motion.div
      key={run.id}
      aria-hidden="true"
      className="duel-stage pointer-events-none fixed inset-0 z-50 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 1, 1, 0] }}
      transition={{ duration: DURATION, times: [0, 0.06, 0.82, 1] }}
    >
      <span className="duel-vignette" />
      {scene === "tower" && <Tower g={g} />}
      {scene === "priori" && <Priori g={g} />}
      {scene === "case" && <CaseScene g={g} />}
      {scene === "storm" && <Storm g={g} />}
    </motion.div>
  );
}
