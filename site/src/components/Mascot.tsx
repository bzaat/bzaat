import { useRef, useState } from "react";
import type { Theme } from "../theme";

/**
 * A small chibi companion per theme, perched on the top edge of the ResNet-50 card
 * (outside the card, so it never covers the chart). Breathes and blinks; a click
 * plays a one-off trick:
 *  auror     snowy owl in round glasses: drops a tiny envelope
 *  darkarts  coiled emerald basilisk: puffs a smoke ring
 *  beasts    Niffler hugging a coin: hides the coin and winks
 */
const LABEL: Record<Theme, string> = {
  auror: "Snowy owl mascot: drop a letter",
  darkarts: "Basilisk mascot: puff a smoke ring",
  beasts: "Niffler mascot: hide the coin",
};

function Owl() {
  const ink = "#5B4A32";
  return (
    <g className="m-breathe">
      <g className="m-tilt">
        <path d="M17 33 L20 17 L30 28 Z M63 33 L60 17 L50 28 Z" fill="#FFFDF6" stroke={ink} strokeWidth="1.4" strokeLinejoin="round" />
        <ellipse cx="40" cy="47" rx="25" ry="26" fill="#FFFDF6" stroke={ink} strokeWidth="1.5" />
        <path d="M18 52 Q14 62 22 68 M62 52 Q66 62 58 68" fill="none" stroke={ink} strokeWidth="1.3" strokeLinecap="round" />
        {[
          [32, 60],
          [40, 64],
          [48, 60],
          [36, 67],
          [44, 67],
        ].map(([x, y]) => (
          <path key={`${x}-${y}`} d={`M${x - 2} ${y} q2 2 4 0`} fill="none" stroke="#C9B98F" strokeWidth="1.2" strokeLinecap="round" />
        ))}
        <circle cx="31" cy="42" r="5.4" fill="#231709" />
        <circle cx="49" cy="42" r="5.4" fill="#231709" />
        <circle cx="33" cy="40" r="1.7" fill="#fff" />
        <circle cx="51" cy="40" r="1.7" fill="#fff" />
        <ellipse className="m-lid" cx="31" cy="42" rx="6.2" ry="6.2" fill="#FFFDF6" />
        <ellipse className="m-lid" cx="49" cy="42" rx="6.2" ry="6.2" fill="#FFFDF6" />
        <circle cx="31" cy="42" r="8.6" fill="none" stroke="#C59B27" strokeWidth="1.8" />
        <circle cx="49" cy="42" r="8.6" fill="none" stroke="#C59B27" strokeWidth="1.8" />
        <path d="M39.4 41.5 Q40 40.4 40.6 41.5" fill="none" stroke="#C59B27" strokeWidth="1.6" />
        <path d="M37.5 50 L42.5 50 L40 55 Z" fill="#D4A338" stroke="#8C6D12" strokeWidth="0.8" strokeLinejoin="round" />
        <ellipse cx="25" cy="52" rx="3" ry="1.6" fill="#F2C6B6" opacity=".7" />
        <ellipse cx="55" cy="52" rx="3" ry="1.6" fill="#F2C6B6" opacity=".7" />
      </g>
      <path d="M32 73 l-3 4 M32 73 l0 4.5 M32 73 l3 4 M48 73 l-3 4 M48 73 l0 4.5 M48 73 l3 4" stroke="#C59B27" strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
}

function Basilisk() {
  const dark = "#1A472A";
  const glow = "#2ECC71";
  return (
    <g className="m-breathe">
      <ellipse cx="40" cy="70" rx="27" ry="8" fill={dark} stroke={glow} strokeWidth="1.2" />
      <path d="M18 69 Q40 76 62 69" fill="none" stroke="#1E7A44" strokeWidth="1" strokeDasharray="2 3" />
      <ellipse cx="38" cy="60" rx="21" ry="7.5" fill="#1F5A34" stroke={glow} strokeWidth="1.2" />
      <ellipse cx="41" cy="51" rx="14" ry="6.5" fill={dark} stroke={glow} strokeWidth="1.2" />
      <path d="M44 49 Q50 42 46 34" fill="none" stroke="#1F5A34" strokeWidth="9" strokeLinecap="round" />
      <path d="M44 49 Q50 42 46 34" fill="none" stroke={glow} strokeWidth="1.2" strokeLinecap="round" opacity=".6" />
      <ellipse cx="44" cy="28" rx="15" ry="12" fill="#1F5A34" stroke={glow} strokeWidth="1.3" />
      <ellipse cx="44" cy="33" rx="9" ry="4" fill="#2A7A48" opacity=".7" />
      <g className="m-glow">
        <circle cx="38.5" cy="26" r="5" fill={glow} opacity=".35" />
        <circle cx="50" cy="26" r="5" fill={glow} opacity=".35" />
      </g>
      <circle cx="38.5" cy="26" r="3.6" fill="#A9F5C6" />
      <circle cx="50" cy="26" r="3.6" fill="#A9F5C6" />
      <rect x="38" y="23.6" width="1.1" height="4.8" rx=".5" fill="#04140A" />
      <rect x="49.5" y="23.6" width="1.1" height="4.8" rx=".5" fill="#04140A" />
      <ellipse className="m-lid" cx="38.5" cy="26" rx="4.3" ry="4.3" fill="#1F5A34" />
      <ellipse className="m-lid" cx="50" cy="26" rx="4.3" ry="4.3" fill="#1F5A34" />
      <path className="m-tongue" d="M44 37 L44 42 M44 42 l-2 2.5 M44 42 l2 2.5" stroke="#E0607E" strokeWidth="1.3" strokeLinecap="round" />
    </g>
  );
}

function Niffler() {
  const fur = "#4B3D35";
  const edge = "#A08374";
  return (
    <g className="m-breathe">
      <circle cx="24" cy="30" r="5" fill={fur} stroke={edge} strokeWidth="1.2" />
      <circle cx="56" cy="30" r="5" fill={fur} stroke={edge} strokeWidth="1.2" />
      <ellipse cx="40" cy="50" rx="24" ry="25" fill={fur} stroke={edge} strokeWidth="1.4" />
      <ellipse cx="40" cy="58" rx="14" ry="13" fill="#8C7A6B" />
      <circle cx="32" cy="40" r="3.3" fill="#1E120F" />
      <circle cx="48" cy="40" r="3.3" fill="#1E120F" />
      <circle cx="33.2" cy="38.8" r="1.1" fill="#fff" />
      <circle cx="49.2" cy="38.8" r="1.1" fill="#fff" />
      <ellipse className="m-lid" cx="32" cy="40" rx="3.9" ry="3.9" fill={fur} />
      <ellipse className="m-wink" cx="48" cy="40" rx="3.9" ry="3.9" fill={fur} />
      <path className="m-wink" d="M44.5 40.5 Q48 43 51.5 40.5" fill="none" stroke="#1E120F" strokeWidth="1.2" strokeLinecap="round" />
      <ellipse cx="40" cy="47" rx="7.5" ry="4.6" fill="#C99A8A" stroke="#8C5E52" strokeWidth=".8" />
      <circle cx="37.5" cy="46.4" r=".9" fill="#5E3A32" />
      <circle cx="42.5" cy="46.4" r=".9" fill="#5E3A32" />
      <g className="m-coin">
        <circle cx="40" cy="61" r="8.5" fill="#D4A338" stroke="#8C6D12" strokeWidth="1.2" />
        <circle cx="40" cy="61" r="5.6" fill="none" stroke="#F1D27A" strokeWidth="1" />
        <path d="M36 57.5 Q37.5 56 39.5 56.2" fill="none" stroke="#FFF3C4" strokeWidth="1.2" strokeLinecap="round" />
      </g>
      <ellipse cx="29" cy="61" rx="4.4" ry="3.2" fill={fur} stroke={edge} strokeWidth="1" />
      <ellipse cx="51" cy="61" rx="4.4" ry="3.2" fill={fur} stroke={edge} strokeWidth="1" />
      <ellipse cx="31" cy="75" rx="5" ry="2.6" fill={fur} stroke={edge} strokeWidth="1" />
      <ellipse cx="49" cy="75" rx="5" ry="2.6" fill={fur} stroke={edge} strokeWidth="1" />
    </g>
  );
}

export function Mascot({ theme }: { theme: Theme }) {
  const [act, setAct] = useState(0);
  const timer = useRef<number | undefined>(undefined);

  const play = () => {
    window.clearTimeout(timer.current);
    setAct((n) => n + 1);
    timer.current = window.setTimeout(() => setAct(0), 1300);
  };

  return (
    <button
      type="button"
      onClick={play}
      aria-label={LABEL[theme]}
      title={LABEL[theme]}
      data-act={act ? "" : undefined}
      className="mascot absolute -top-12 right-5 z-10 size-16 cursor-pointer rounded-full md:size-[4.5rem] md:-top-14"
    >
      <svg viewBox="0 0 80 80" className="size-full overflow-visible" aria-hidden="true">
        {theme === "auror" ? <Owl /> : theme === "darkarts" ? <Basilisk /> : <Niffler />}
        {act > 0 && theme === "auror" && (
          <g key={act} className="m-envelope" style={{ transformBox: "fill-box", transformOrigin: "center" }}>
            <g transform="translate(22 60)">
              <rect width="16" height="11" rx="1.5" fill="#FBF6EA" stroke="#5B4A32" strokeWidth="1" />
              <path d="M0.8 1 L8 6.5 L15.2 1" fill="none" stroke="#5B4A32" strokeWidth="1" />
              <circle cx="8" cy="7" r="1.8" fill="#8B1E1E" />
            </g>
          </g>
        )}
        {act > 0 && theme === "darkarts" && (
          <ellipse key={act} className="m-smoke" cx="44" cy="12" rx="9" ry="4.5" fill="none" stroke="#2ECC71" strokeWidth="2.4" opacity=".9" />
        )}
      </svg>
    </button>
  );
}
