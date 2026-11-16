import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion } from "motion/react";
import { registerThemeTransition, type Theme } from "../../theme";
import { spellsActive } from "../../spells";
import { Figure, SPEC, Suitcase } from "../ChibiCast";
import { Niffler, Thunderbird } from "../animals";

/**
 * Theme-switch cutscenes with a full-screen environmental wipe (1.5 s,
 * pointer-events: none, z-index 50). Each wipe finishes covering the viewport in the
 * TARGET theme's background colour at PEAK (55% of the timeline); the theme is
 * committed there, unseen, and the wipe then dissolves to reveal the new theme.
 *  auror    -> darkarts  Nightfall: Dumbledore dissolves into phoenix sparks, an
 *                        obsidian curtain with an emerald-smoke edge crashes down
 *  darkarts -> auror     Dawn Shatter: a Lumos Maxima sunburst from the clash point
 *                        shatters the night outward
 *  *        -> beasts    Suitcase Vortex: an amber portal swirls out of the case
 *  beasts   -> *         Storm Sweep: a gold-and-cerulean mist wave sweeps diagonally
 * Skipped (instant switch) when spell effects are off or motion is reduced.
 */
type Scene = "tower" | "priori" | "case" | "storm";
const DURATION = 1.5; // seconds
const PEAK = 0.55 * DURATION; // wipe fully covers the screen; theme commits here
const BG: Record<Theme, string> = { auror: "#F6EEDB", darkarts: "#090A0F", beasts: "#2A1A16" };

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

const k = (sec: number) => sec / DURATION; // seconds -> keyframe time (0..1)
/** Fade a full-cover layer out only after the theme has switched underneath it.
    (An explicit delay; hold-then-fade keyframes with custom times started early.) */
const REVEAL_FADE = { delay: PEAK + 0.06, duration: DURATION - PEAK - 0.12, ease: "easeOut" as const };

/* -------------------------------------------------------------- building blocks */

function Actor({ at, g, children }: { at: { x: number; y: number }; g: Geo; children: ReactNode }) {
  return (
    <motion.div
      className="absolute"
      style={{ left: at.x, top: at.y, width: g.w }}
      initial={{ opacity: 0, y: 24, scale: 0.8 }}
      animate={{ opacity: [0, 1, 1, 0], y: [24, 0, 0, 0], scale: [0.8, 1, 1, 1] }}
      transition={{ duration: PEAK, times: [0, 0.22, 0.85, 1] }}
    >
      {children}
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
      transition={{ duration: 0.85, delay, times: [0, 0.2, 0.7, 1] }}
    >
      {children}
    </motion.span>
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

function Particles({ n, x, y, spread, rise, colors, delay, size = 6, seed = 1 }: {
  n: number; x: number; y: number; spread: number; rise: number; colors: string[]; delay: number; size?: number; seed?: number;
}) {
  return (
    <>
      {Array.from({ length: n }, (_, i) => {
        const r = (j: number) => {
          const v = Math.sin((i + 1) * 12.9898 * (j + seed)) * 43758.5453;
          return v - Math.floor(v);
        };
        const s = size * (0.5 + r(1));
        return (
          <motion.span
            key={i}
            className="duel-spark"
            style={{ left: x + (r(2) - 0.5) * spread * 0.4 - s / 2, top: y - s / 2, width: s, height: s, "--c": colors[i % colors.length] } as CSSProperties}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], x: (r(3) - 0.5) * spread, y: -rise * (0.5 + r(4)) }}
            transition={{ duration: 0.75 + r(5) * 0.35, delay: delay + r(6) * 0.15, ease: "easeOut" }}
          />
        );
      })}
    </>
  );
}

/* ------------------------------------------------------------------------ scenes */

/** Auror -> Dark Arts: Avada Kedavra, Dumbledore turns to phoenix sparks, night falls. */
function Nightfall({ g }: { g: Geo }) {
  const green = "#2ECC71";
  const hit = 0.5;
  return (
    <>
      <Actor at={g.L} g={g}><Figure s={SPEC.snape} /></Actor>
      <motion.div className="absolute" style={{ left: g.R.x, top: g.R.y, width: g.w }}
        initial={{ opacity: 0, y: 24, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], y: [24, 0, 0, -18], scale: [0.8, 1, 1, 0.92], filter: ["blur(0px)", "blur(0px)", "blur(0px)", "blur(6px)"] }}
        transition={{ duration: 0.85, times: [0, 0.2, hit / 0.85, 1] }}>
        <div style={{ transform: "scaleX(-1)" }}><Figure s={SPEC.dumbledore} /></div>
      </motion.div>
      <Svg g={g}>
        {[{ c: green, w: 10, f: true }, { c: "#FFFFFF", w: 2.5, f: false }].map((b) => (
          <motion.line key={b.w} x1={g.tipL.x} y1={g.tipL.y} x2={g.tipR.x} y2={g.tipR.y} stroke={b.c} strokeWidth={b.w} strokeLinecap="round"
            filter={b.f ? "url(#duel-glow)" : undefined}
            initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: [0, 1, 1], opacity: [1, 1, 0] }}
            transition={{ duration: 0.5, delay: 0.24, times: [0, 0.52, 1] }} />
        ))}
      </Svg>
      <Incantation x={g.L.x + g.w * 0.5} y={g.L.y - 10} color={green} delay={0.16}>Avada Kedavra!</Incantation>
      {/* phoenix sparks rising from where Dumbledore stood */}
      <Particles n={26} x={g.R.x + g.w / 2} y={g.R.y + g.h * 0.5} spread={g.w * 1.4} rise={g.h * 1.3} colors={["#F1D27A", "#E8E8EE", "#FFB347"]} delay={hit} size={7} seed={2} />
      {/* the curtain of night, solid obsidian with an emerald smoke edge */}
      <motion.div className="absolute inset-x-0" style={{ top: "-3%", height: "121%" }}
        initial={{ y: "-118%", opacity: 1 }} animate={{ y: ["-118%", "-118%", "0%"], opacity: 0 }}
        transition={{ y: { duration: PEAK, times: [0, k(0.52) / k(PEAK), 1], ease: [0.55, 0, 0.9, 0.6] }, opacity: REVEAL_FADE }}>
        <span className="absolute inset-x-0 top-0" style={{ bottom: "14%", background: BG.darkarts }} />
        <span className="duel-curtain-edge" />
      </motion.div>
    </>
  );
}

/** Dark Arts -> Auror: Expelliarmus wins the clash; a Lumos Maxima sunburst shatters the night. */
function DawnShatter({ g }: { g: Geo }) {
  const gold = "#FFC94A";
  const green = "#2ECC71";
  const midX = (g.tipL.x + g.tipR.x) / 2;
  const y = g.tipL.y;
  const meet = [g.tipL.x, midX, midX + 18, midX - 14, midX + 10, midX + (g.tipR.x - midX) * 0.45];
  const times = [0, k(0.26), k(0.34), k(0.42), k(0.5), k(0.6)];
  const burstAt = 0.58;
  const burst = 120;
  const shards = Array.from({ length: 12 }, (_, i) => {
    const a = (i / 12) * Math.PI * 2 + 0.2;
    return { a, d: g.diag * (0.45 + (i % 3) * 0.12), rot: (i % 2 ? 1 : -1) * (90 + i * 17) };
  });
  return (
    <>
      <Actor at={g.L} g={g}><Figure s={SPEC.harry} /></Actor>
      <motion.div className="absolute" style={{ left: g.R.x, top: g.R.y, width: g.w }}
        initial={{ opacity: 0, y: 24, scale: 0.8 }}
        animate={{ opacity: [0, 1, 1, 0], y: [24, 0, 0, 8], x: [0, 0, 0, 22] }}
        transition={{ duration: PEAK, times: [0, 0.2, burstAt / PEAK, 1] }}>
        <div style={{ transform: "scaleX(-1)" }}><Figure s={SPEC.voldemort} /></div>
      </motion.div>
      <Svg g={g}>
        <motion.line x1={g.tipL.x} y1={y} stroke={gold} strokeWidth={10} strokeLinecap="round" filter="url(#duel-glow)"
          initial={{ x2: g.tipL.x, y2: y }} animate={{ x2: meet, y2: y, opacity: [1, 1, 0] }}
          transition={{ x2: { duration: DURATION, times }, opacity: { duration: DURATION, times: [0, k(0.6), k(0.7)] } }} />
        <motion.line x1={g.tipL.x} y1={y} stroke="#FFFFFF" strokeWidth={2.5} strokeLinecap="round"
          initial={{ x2: g.tipL.x, y2: y }} animate={{ x2: meet, y2: y, opacity: [1, 1, 0] }}
          transition={{ x2: { duration: DURATION, times }, opacity: { duration: DURATION, times: [0, k(0.6), k(0.7)] } }} />
        <motion.line x1={g.tipR.x} y1={y} stroke={green} strokeWidth={10} strokeLinecap="round" filter="url(#duel-glow)"
          initial={{ x2: g.tipR.x, y2: y }} animate={{ x2: [g.tipR.x, ...meet.slice(1)], y2: y, opacity: [1, 1, 0] }}
          transition={{ x2: { duration: DURATION, times }, opacity: { duration: DURATION, times: [0, k(0.56), k(0.62)] } }} />
        <motion.circle cy={y} fill="#FFF6D8" filter="url(#duel-glow)"
          initial={{ cx: midX, r: 0 }} animate={{ cx: meet, r: [0, 16, 22, 18, 26, 34] }}
          transition={{ duration: DURATION, times }} />
      </Svg>
      <Incantation x={g.L.x + g.w * 0.5} y={g.L.y - 10} color={gold} delay={0.08}>Expelliarmus!</Incantation>
      <Incantation x={g.R.x + g.w * 0.5} y={g.R.y - 10} color={green} delay={0.14}>Avada Kedavra!</Incantation>
      {/* shards of the night flying outward */}
      {shards.map((s, i) => (
        <motion.span key={i} className="duel-shard" style={{ left: meet[5] - 40, top: y - 40 }}
          initial={{ opacity: 0, x: 0, y: 0, rotate: 0, scale: 0.6 }}
          animate={{ opacity: [0, 1, 0], x: Math.cos(s.a) * s.d, y: Math.sin(s.a) * s.d, rotate: s.rot, scale: [0.6, 1.4, 1.8] }}
          transition={{ duration: 0.55, delay: burstAt, ease: [0.2, 0.7, 0.3, 1] }} />
      ))}
      {/* Lumos Maxima: sunburst whose interior is the daylight parchment */}
      <motion.span className="duel-sun" style={{ left: meet[5] - burst / 2, top: y - burst / 2, width: burst, height: burst }}
        initial={{ scale: 0, opacity: 1 }} animate={{ scale: [0, 0, (g.diag * 4) / burst], opacity: 0 }}
        transition={{ scale: { duration: PEAK, times: [0, burstAt / PEAK, 1], ease: [0.3, 0.6, 0.4, 1] }, opacity: REVEAL_FADE }} />
    </>
  );
}

/** Any -> Newt's Case: the case opens and an amber portal swirls over the screen. */
function SuitcaseVortex({ g }: { g: Geo }) {
  const cx = g.W / 2;
  const caseW = g.w * 1.25;
  const caseTop = g.H * 0.78 - caseW * 0.78;
  const lipY = caseTop + caseW * 0.38;
  const portal = 140;
  return (
    <>
      <Actor at={{ x: cx - caseW / 2 - g.w * 0.95, y: g.L.y }} g={g}><Figure s={SPEC.newt} /></Actor>
      <motion.div className="absolute" style={{ left: cx - caseW / 2, top: caseTop, width: caseW }}
        initial={{ opacity: 0, scale: 0.6, y: 20 }} animate={{ opacity: [0, 1, 1, 0], scale: [0.6, 1.08, 1, 1], y: [20, 0, 0, 0] }}
        transition={{ duration: PEAK, times: [0, 0.25, 0.85, 1] }}>
        <Suitcase />
      </motion.div>
      <motion.div className="absolute" style={{ left: cx - g.w * 0.3, top: lipY - g.w * 0.3, width: g.w * 0.6 }}
        initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0], y: [0, -g.H * 0.26, -g.H * 0.22, -g.H * 0.18], rotate: [0, -12, 8, 0] }}
        transition={{ duration: 0.6, delay: 0.26, times: [0, 0.45, 0.75, 1] }}>
        <svg viewBox="0 0 80 80" className="block h-auto w-full overflow-visible" aria-hidden="true"><Niffler /></svg>
      </motion.div>
      <Incantation x={cx - caseW / 2 - g.w * 0.45} y={g.L.y - 10} color="#D4A338" delay={0.1}>Into the Case!</Incantation>
      {/* the portal: a swirling amber rim whose interior is the leather of Newt's Case */}
      <motion.span className="duel-portal" style={{ left: cx - portal / 2, top: lipY - portal / 2, width: portal, height: portal }}
        initial={{ scale: 0, opacity: 1 }} animate={{ scale: [0, 0, (g.diag * 4) / portal], opacity: 0 }}
        transition={{ scale: { duration: PEAK, times: [0, k(0.36) / k(PEAK), 1], ease: [0.45, 0, 0.55, 1] }, opacity: REVEAL_FADE }}>
        <motion.span className="duel-portal-swirl" animate={{ rotate: 540 }} transition={{ duration: DURATION, ease: "linear" }} />
      </motion.span>
      <Particles n={22} x={cx} y={lipY} spread={g.W * 0.8} rise={g.H * 0.6} colors={["#FFD27A", "#FFE7A3", "#D4A338"]} delay={0.4} size={7} seed={3} />
    </>
  );
}

/** Newt's Case -> any: the Thunderbird flies across and a storm-mist wave sweeps diagonally. */
function StormSweep({ g, to }: { g: Geo; to: Theme }) {
  const bw = g.w * 0.95;
  const angle = (Math.atan2(g.H, g.W) * 180) / Math.PI; // top-left -> bottom-right
  const D = g.diag;
  return (
    <>
      <Actor at={g.L} g={g}><Figure s={SPEC.newt} /></Actor>
      <motion.div className="absolute" style={{ left: -bw, top: -bw * 0.2, width: bw }}
        initial={{ x: 0, y: 0, opacity: 0 }}
        animate={{ x: [0, g.W * 0.45, g.W + bw], y: [g.H * 0.15, g.H * 0.4, g.H * 0.8], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.0, delay: 0.12, times: [0, 0.5, 1] }}>
        <svg viewBox="0 0 80 80" className="tb-flap block h-auto w-full overflow-visible" aria-hidden="true"><Thunderbird /></svg>
      </motion.div>
      <Incantation x={g.L.x + g.w * 0.5} y={g.L.y - 10} color="#5EC8F2" delay={0.08}>Up, Frank!</Incantation>
      {/* diagonal wave: solid target-theme background trailing a gold-and-cerulean mist edge */}
      <div className="absolute" style={{ left: g.W / 2, top: g.H / 2, rotate: `${angle}deg` }}>
        <motion.span
          className="duel-storm"
          style={{ left: -3 * D, top: -D, width: 2 * D, height: 2 * D, "--to": BG[to] } as CSSProperties}
          initial={{ x: 0, opacity: 1 }}
          animate={{ x: [0, 0, 2.4 * D], opacity: 0 }}
          transition={{ x: { duration: PEAK, times: [0, k(0.3) / k(PEAK), 1], ease: [0.45, 0, 0.55, 1] }, opacity: REVEAL_FADE }}
        />
      </div>
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
        const impact = window.setTimeout(once, PEAK * 1000);
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
  const { scene, g, to } = run;
  return (
    <div key={run.id} aria-hidden="true" className="duel-stage pointer-events-none fixed inset-0 z-50 overflow-hidden">
      <motion.span className="duel-vignette" initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 1, 0] }} transition={{ duration: DURATION, times: [0, 0.08, k(PEAK), k(PEAK + 0.1)] }} />
      {scene === "tower" && <Nightfall g={g} />}
      {scene === "priori" && <DawnShatter g={g} />}
      {scene === "case" && <SuitcaseVortex g={g} />}
      {scene === "storm" && <StormSweep g={g} to={to} />}
    </div>
  );
}
