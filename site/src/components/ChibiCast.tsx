import { useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import type { Theme } from "../theme";
import { castAt } from "../spells";
import { Basilisk, Niffler, Owl } from "./animals";

/* ------------------------------------------------------------------ the figure */

type Hair = "messy" | "bushy" | "ginger" | "bald" | "wild" | "slick" | "tousled" | "bob" | "neat";
type Spec = {
  skin: string;
  hair: Hair;
  hairColor: string;
  eyes?: string;
  glasses?: boolean;
  scar?: boolean;
  freckles?: boolean;
  mustache?: boolean;
  snakeNose?: boolean;
  mouth?: "smile" | "grin" | "smirk" | "thin";
  robe: string;
  trim?: string;
  shirt?: string; // a vest over a shirt (Jacob)
  scarf?: [string, string];
  hat?: string; // cloche hat colour (Tina)
  long?: boolean; // long coat
  hand: "wand" | "pastry" | "none";
  glow?: string; // wand-tip glow
  book?: boolean;
  bowtruckle?: boolean;
};

const INK = "#231709";

function BackHair({ s }: { s: Spec }) {
  const c = s.hairColor;
  if (s.hair === "bushy") return <path d="M8 46 Q4 14 40 10 Q76 14 72 46 Q78 64 66 72 L14 72 Q2 64 8 46Z" fill={c} />;
  if (s.hair === "wild")
    return (
      <g fill={c}>
        {[
          [12, 30], [8, 46], [12, 62], [22, 72], [68, 30], [72, 46], [68, 62], [58, 72], [22, 14], [40, 9], [58, 14],
        ].map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={11} />
        ))}
      </g>
    );
  if (s.hair === "bob") return <path d="M13 40 Q13 12 40 12 Q67 12 67 40 L67 58 Q60 62 56 56 L56 42 L24 42 L24 56 Q20 62 13 58Z" fill={c} />;
  return null;
}

function FrontHair({ s }: { s: Spec }) {
  const c = s.hairColor;
  switch (s.hair) {
    case "messy":
      return <path d="M15 40 Q13 18 31 13 L29 6 L37 12 L41 4 L46 12 L54 7 L52 15 Q67 20 65 40 Q60 28 51 26 L47 33 L42 25 L36 32 L31 25 Q22 29 15 40Z" fill={c} />;
    case "bushy":
      return <path d="M15 40 Q16 16 40 14 Q64 16 65 40 Q58 25 47 27 Q40 22 33 27 Q22 25 15 40Z" fill={c} />;
    case "ginger":
      return <path d="M15 38 Q16 14 40 13 Q63 14 65 36 Q56 25 44 27 Q34 22 26 29 Q19 31 15 38Z" fill={c} />;
    case "wild":
      return <path d="M15 40 Q15 16 40 15 Q65 16 65 40 Q59 26 50 28 Q46 22 40 26 Q34 22 30 28 Q21 26 15 40Z" fill={c} />;
    case "slick":
      return (
        <g>
          <path d="M15 38 Q16 13 40 12 Q64 13 65 38 Q56 21 40 21 Q27 21 15 38Z" fill={c} />
          <path d="M24 22 Q40 15 56 22 M28 18 Q42 13 52 17" fill="none" stroke="#FFFFFF" strokeOpacity=".55" strokeWidth="1.2" />
        </g>
      );
    case "tousled":
      return <path d="M14 42 Q12 16 38 12 Q66 12 66 40 Q63 32 58 34 Q57 26 50 29 Q48 22 41 28 Q36 22 31 30 Q25 26 23 34 Q18 31 14 42Z" fill={c} />;
    case "bob":
      return <path d="M15 38 Q16 16 40 15 Q64 16 65 38 L65 30 Q52 32 40 30 Q28 32 15 30Z" fill={c} />;
    case "neat":
      return <path d="M15 36 Q16 14 40 13 Q64 14 65 36 Q60 24 46 24 L44 21 Q30 21 15 36Z" fill={c} />;
    default:
      return null;
  }
}

function Figure({ s }: { s: Spec }) {
  const hem = s.long ? 108 : 104;
  return (
    <svg viewBox="0 0 80 122" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <ellipse cx="40" cy="119" rx="22" ry="2.6" fill="#000" opacity=".18" />
      <BackHair s={s} />
      {/* legs + shoes */}
      <rect x="31" y="100" width="7" height="15" rx="3" fill={s.shirt ? "#4B4B4B" : "#2B2B33"} />
      <rect x="42" y="100" width="7" height="15" rx="3" fill={s.shirt ? "#4B4B4B" : "#2B2B33"} />
      <ellipse cx="34" cy="116" rx="6" ry="3" fill="#1E120F" />
      <ellipse cx="46" cy="116" rx="6" ry="3" fill="#1E120F" />
      {/* body */}
      {s.shirt ? (
        <g>
          <path d="M24 66 Q40 60 56 66 L60 102 Q40 107 20 102 Z" fill={s.shirt} stroke={INK} strokeOpacity=".25" />
          <path d="M24 66 L34 66 L38 100 L20 102 Z M56 66 L46 66 L42 100 L60 102 Z" fill={s.robe} />
          <circle cx="36" cy="80" r="1.2" fill="#D4A338" />
          <circle cx="36" cy="89" r="1.2" fill="#D4A338" />
        </g>
      ) : (
        <g>
          <path d={`M24 66 Q40 60 56 66 L63 ${hem} Q40 ${hem + 6} 17 ${hem} Z`} fill={s.robe} />
          {s.trim && <path d={`M40 64 L40 ${hem + 3}`} stroke={s.trim} strokeWidth="2" />}
          <path d={`M24 66 Q40 60 56 66 L63 ${hem} Q40 ${hem + 6} 17 ${hem} Z`} fill="none" stroke={INK} strokeOpacity=".3" />
        </g>
      )}
      {s.bowtruckle && (
        <g>
          <rect x="24" y="74" width="12" height="9" rx="2" fill="#2F4E73" stroke={INK} strokeOpacity=".35" />
          <g className="chibi-peek">
            <path d="M30 74 L30 66 M30 69 L27 66 M30 68 L33 65" stroke="#5E8C3A" strokeWidth="1.6" strokeLinecap="round" />
            <circle cx="28.8" cy="71" r=".9" fill="#1E120F" />
            <circle cx="31.2" cy="71" r=".9" fill="#1E120F" />
          </g>
        </g>
      )}
      {/* scarf */}
      {s.scarf && (
        <g>
          <path d="M27 61 Q40 68 53 61 L53 68 Q40 74 27 68Z" fill={s.scarf[0]} />
          <path d="M33 64 L33 71 M40 65 L40 72 M47 64 L47 71" stroke={s.scarf[1]} strokeWidth="2.2" />
          <rect x="45" y="66" width="7" height="20" rx="2" fill={s.scarf[0]} />
          <path d="M45 72 H52 M45 78 H52" stroke={s.scarf[1]} strokeWidth="2.2" />
        </g>
      )}
      {/* left arm (+ book) */}
      <ellipse cx="20" cy="80" rx="5" ry="10" fill={s.shirt ?? s.robe} transform="rotate(14 20 80)" />
      <circle cx="18" cy="90" r="3.6" fill={s.skin} />
      {s.book && (
        <g transform="rotate(-12 16 92)">
          <rect x="9" y="86" width="12" height="14" rx="1.5" fill="#6B4A2E" stroke={INK} strokeWidth=".8" />
          <path d="M11 90 H19 M11 93 H19 M11 96 H17" stroke="#EFE6DD" strokeWidth=".8" />
        </g>
      )}
      {/* right arm, raised, with wand or pastry */}
      <ellipse cx="60" cy="74" rx="5" ry="10" fill={s.shirt ?? s.robe} transform="rotate(-42 60 74)" />
      <circle cx="65" cy="67" r="3.6" fill={s.skin} />
      {s.hand === "wand" && (
        <g>
          <line x1="65" y1="67" x2="75" y2="50" stroke="#5B3A1E" strokeWidth="2.2" strokeLinecap="round" />
          <circle className="chibi-glow" cx="75.5" cy="49" r="4.5" fill={s.glow ?? "#FFF3C4"} opacity=".85" />
          <circle cx="75.5" cy="49" r="1.6" fill="#FFFFFF" />
        </g>
      )}
      {s.hand === "pastry" && (
        <g>
          <ellipse cx="68" cy="61" rx="7" ry="5" fill="#D9A15B" stroke="#8C5E2A" strokeWidth="1" />
          <path d="M63 61 Q68 56 73 61 M65 63 Q68 59 71 63" fill="none" stroke="#8C5E2A" strokeWidth=".9" />
          <circle cx="71" cy="57" r="1.2" fill="#FFF3C4" className="chibi-glow" />
        </g>
      )}
      {/* head */}
      <circle cx="40" cy="40" r="25" fill={s.skin} stroke={INK} strokeOpacity=".18" />
      <ellipse cx="15.5" cy="42" rx="3" ry="4" fill={s.skin} />
      <ellipse cx="64.5" cy="42" rx="3" ry="4" fill={s.skin} />
      {/* face */}
      <ellipse cx="32" cy="44" rx="3.2" ry="4" fill={s.eyes ?? "#231709"} />
      <ellipse cx="48" cy="44" rx="3.2" ry="4" fill={s.eyes ?? "#231709"} />
      <circle cx="33.2" cy="42.4" r="1.1" fill="#fff" />
      <circle cx="49.2" cy="42.4" r="1.1" fill="#fff" />
      <ellipse className="m-lid" cx="32" cy="44" rx="3.8" ry="4.6" fill={s.skin} />
      <ellipse className="m-lid" cx="48" cy="44" rx="3.8" ry="4.6" fill={s.skin} />
      <ellipse cx="26" cy="51" rx="3" ry="1.6" fill="#F28C8C" opacity=".45" />
      <ellipse cx="54" cy="51" rx="3" ry="1.6" fill="#F28C8C" opacity=".45" />
      {s.freckles && (
        <g fill="#B5523B" opacity=".6">
          <circle cx="27" cy="48" r=".7" />
          <circle cx="29" cy="50" r=".7" />
          <circle cx="51" cy="50" r=".7" />
          <circle cx="53" cy="48" r=".7" />
        </g>
      )}
      {s.snakeNose ? (
        <path d="M38.5 48 L38.5 50.5 M41.5 48 L41.5 50.5" stroke="#5E6B66" strokeWidth=".9" strokeLinecap="round" />
      ) : (
        <circle cx="40" cy="49" r=".9" fill="#C0806A" />
      )}
      {s.mustache && <path d="M33 53 Q36 50 40 52.5 Q44 50 47 53 Q44 55 40 54 Q36 55 33 53Z" fill="#4A2E1B" />}
      {(s.mouth ?? "smile") === "smile" && <path d="M37 54.5 Q40 57.5 43 54.5" fill="none" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />}
      {s.mouth === "grin" && <path d="M34 53 Q40 60 46 53 Z" fill="#7A1F2B" stroke={INK} strokeWidth=".8" />}
      {s.mouth === "grin" && <path d="M35.5 53.6 H44.5" stroke="#FFFFFF" strokeWidth="1.2" />}
      {s.mouth === "smirk" && <path d="M37 55 Q42 56 45 52.5" fill="none" stroke={INK} strokeWidth="1.2" strokeLinecap="round" />}
      {s.mouth === "thin" && <path d="M36 55 H44" stroke={INK} strokeWidth="1" strokeLinecap="round" />}
      <FrontHair s={s} />
      {s.scar && <path d="M45 24 L42 29 L45.5 29 L42.5 34" fill="none" stroke="#B5523B" strokeWidth="1.3" strokeLinejoin="round" />}
      {s.glasses && (
        <g fill="none" stroke={INK} strokeWidth="1.4">
          <circle cx="32" cy="44" r="6.2" />
          <circle cx="48" cy="44" r="6.2" />
          <path d="M38.2 43.5 Q40 42 41.8 43.5 M25.8 43 L16 41 M54.2 43 L64 41" />
        </g>
      )}
      {s.hat && (
        <g>
          <path d="M11 33 Q13 6 40 6 Q67 6 69 33 Q71 36 66 36 L14 36 Q9 36 11 33Z" fill={s.hat} stroke={INK} strokeOpacity=".3" />
          <path d="M14 30 H66" stroke="#2B2B33" strokeWidth="3" />
        </g>
      )}
    </svg>
  );
}

function Suitcase() {
  return (
    <svg viewBox="0 0 90 70" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <ellipse cx="45" cy="66" rx="40" ry="3" fill="#000" opacity=".2" />
      <path d="M8 30 L22 6 L84 10 L80 34 Z" fill="#5C4033" stroke="#1E120F" strokeWidth="1.5" />
      <ellipse className="chibi-glow" cx="46" cy="34" rx="34" ry="7" fill="#FFE7A3" opacity=".75" />
      <rect x="6" y="32" width="80" height="32" rx="5" fill="#76533F" stroke="#1E120F" strokeWidth="1.5" />
      <path d="M10 40 H82" stroke="#D4A338" strokeOpacity=".5" strokeDasharray="4 4" />
      <rect x="20" y="30" width="9" height="8" rx="1.5" fill="#D4A338" stroke="#8C6D12" />
      <rect x="62" y="30" width="9" height="8" rx="1.5" fill="#D4A338" stroke="#8C6D12" />
      <circle cx="40" cy="26" r="3.4" fill="#D4A338" stroke="#8C6D12" />
      <circle cx="52" cy="24" r="2.6" fill="#D4A338" stroke="#8C6D12" />
    </svg>
  );
}

/* --------------------------------------------------------------------- casts */

type Member = { id: string; name: string; line: string; w: string; node: ReactNode; delay: number; burstFrom?: "self" | "case" };

const GRYFFINDOR: [string, string] = ["#7A1F1F", "#D4A338"];

const CASTS: Record<Theme, Member[]> = {
  auror: [
    {
      id: "hermione", name: "Hermione", line: "Test set used once!", w: "w-[4.6rem]", delay: 0.3,
      node: <Figure s={{ skin: "#F3D2BC", hair: "bushy", hairColor: "#7A4B2A", robe: "#2B2B33", trim: "#7A1F1F", scarf: GRYFFINDOR, hand: "wand", book: true }} />,
    },
    {
      id: "harry", name: "Harry Potter", line: "Expecto Baseline!", w: "w-[5.2rem]", delay: 0,
      node: <Figure s={{ skin: "#F3D2BC", hair: "messy", hairColor: "#1E1A18", eyes: "#2E7D4F", glasses: true, scar: true, robe: "#2B2B33", trim: "#7A1F1F", scarf: GRYFFINDOR, hand: "wand", glow: "#C8E6F5" }} />,
    },
    {
      id: "ron", name: "Ron", line: "92.4% on test!", w: "w-[4.6rem]", delay: 0.55,
      node: <Figure s={{ skin: "#F6D9C6", hair: "ginger", hairColor: "#C2502B", eyes: "#2B5F86", freckles: true, robe: "#2B2B33", trim: "#7A1F1F", scarf: GRYFFINDOR, hand: "wand" }} />,
    },
    { id: "hedwig", name: "Hedwig", line: "Hoo! Owl post from SCI-2026!", w: "w-11", delay: 0.8, node: <svg viewBox="0 0 80 80" className="block h-auto w-full overflow-visible" aria-hidden="true"><Owl /></svg> },
  ],
  darkarts: [
    {
      id: "bellatrix", name: "Bellatrix", line: "Dark Arts Convergence!", w: "w-[4.8rem]", delay: 0.35,
      node: <Figure s={{ skin: "#EDE3DC", hair: "wild", hairColor: "#17141A", eyes: "#3A2A3F", mouth: "grin", robe: "#1A1620", trim: "#2ECC71", hand: "wand", glow: "#A9F5C6" }} />,
    },
    {
      id: "voldemort", name: "Voldemort", line: "Overfitting is inevitable...", w: "w-[5.2rem]", delay: 0,
      node: <Figure s={{ skin: "#E6EEE9", hair: "bald", hairColor: "transparent", eyes: "#C0392B", snakeNose: true, mouth: "thin", robe: "#0B0C10", trim: "#1A472A", long: true, hand: "wand", glow: "#2ECC71" }} />,
    },
    {
      id: "draco", name: "Draco", line: "73% train, 32% test. Pathetic.", w: "w-[4.6rem]", delay: 0.6,
      node: <Figure s={{ skin: "#F3E1D6", hair: "slick", hairColor: "#E9DFAF", eyes: "#7D8A93", mouth: "smirk", robe: "#1F2A26", trim: "#C5C6C7", scarf: ["#1A472A", "#AAAAAA"], hand: "wand", glow: "#A9F5C6" }} />,
    },
    { id: "snake", name: "Nagini", line: "Sssseed 42...", w: "w-11", delay: 0.85, node: <svg viewBox="0 0 80 80" className="block h-auto w-full overflow-visible" aria-hidden="true"><Basilisk /></svg> },
  ],
  beasts: [
    { id: "case", name: "Newt's suitcase", line: "Something escaped...", w: "w-[4.6rem]", delay: 0.9, burstFrom: "case", node: <Suitcase /> },
    {
      id: "tina", name: "Tina", line: "Leave-one-match-out, Newt.", w: "w-[4.6rem]", delay: 0.4, burstFrom: "case",
      node: <Figure s={{ skin: "#F3D2BC", hair: "bob", hairColor: "#2A1A16", robe: "#6E6E73", long: true, hat: "#55555B", hand: "wand" }} />,
    },
    {
      id: "newt", name: "Newt Scamander", line: "Studying wild neural nets!", w: "w-[5.2rem]", delay: 0, burstFrom: "case",
      node: <Figure s={{ skin: "#F3D2BC", hair: "tousled", hairColor: "#8B5A2B", freckles: true, robe: "#2F4E73", long: true, scarf: ["#ECB939", "#372E29"], hand: "wand", book: true, bowtruckle: true }} />,
    },
    {
      id: "jacob", name: "Jacob", line: "Found a shiny gradient!", w: "w-[4.8rem]", delay: 0.65, burstFrom: "case",
      node: <Figure s={{ skin: "#F0C8A8", hair: "neat", hairColor: "#3B2618", mustache: true, robe: "#6B4A2E", shirt: "#F2EDE4", hand: "pastry" }} />,
    },
    { id: "niffler", name: "Niffler", line: "Shiny! Mine!", w: "w-11", delay: 0.75, burstFrom: "case", node: <svg viewBox="0 0 80 80" className="block h-auto w-full overflow-visible" aria-hidden="true"><Niffler /></svg> },
  ],
};

/* ---------------------------------------------------------------------- cast */

/**
 * A chibi cast per theme, standing on the top edge of the ResNet-50 card (outside
 * the card, above its border, so they never cover the chart). They bounce and
 * blink; clicking one casts a theme-coloured spark burst and shows a speech bubble.
 * The cast pops in when the theme changes.
 */
export function ChibiCast({ theme }: { theme: Theme }) {
  const reduce = useReducedMotion();
  const [talk, setTalk] = useState<{ id: string; n: number } | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const caseRef = useRef<HTMLButtonElement | null>(null);
  const cast = CASTS[theme];
  const speaking = cast.find((m) => m.id === talk?.id);

  const onClick = (m: Member, el: HTMLButtonElement) => {
    castAt(m.burstFrom === "case" ? caseRef.current ?? el : el, "");
    window.clearTimeout(timer.current);
    setTalk((t) => ({ id: m.id, n: (t?.n ?? 0) + 1 }));
    timer.current = window.setTimeout(() => setTalk(null), 2000);
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-full z-20 flex justify-end px-2 sm:px-4">
      <p className="sr-only" aria-live="polite">
        {speaking ? `${speaking.name} says: ${speaking.line}` : ""}
      </p>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.ul
          key={theme}
          aria-label="Chibi cast"
          className="pointer-events-auto flex items-end gap-0.5 sm:gap-1"
          initial="hidden"
          animate="shown"
          exit="gone"
          variants={{
            hidden: {},
            shown: { transition: { staggerChildren: reduce ? 0 : 0.06 } },
            gone: { opacity: 0, transition: { duration: reduce ? 0 : 0.18 } },
          }}
        >
          {cast.map((m, i) => (
            <motion.li
              key={m.id}
              className={`relative ${m.w} shrink-0`}
              variants={{
                hidden: reduce ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.85 },
                shown: { opacity: 1, y: 0, scale: 1, transition: reduce ? { duration: 0 } : { type: "spring", stiffness: 380, damping: 22 } },
              }}
            >
              <AnimatePresence>
                {talk?.id === m.id && (
                  <motion.span
                    key={talk.n}
                    aria-hidden="true"
                    className={`chibi-bubble ${i >= cast.length - 2 ? "chibi-bubble-end" : ""}`}
                    initial={reduce ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: reduce ? 0 : 0.2 }}
                  >
                    {m.line}
                  </motion.span>
                )}
              </AnimatePresence>
              <button
                type="button"
                ref={m.id === "case" ? (el) => void (caseRef.current = el) : undefined}
                onClick={(e) => onClick(m, e.currentTarget)}
                aria-label={`${m.name}: cast a spell`}
                title={m.name}
                data-act={talk?.id === m.id ? "" : undefined}
                className="mascot chibi block w-full cursor-pointer rounded-lg"
                style={{ animationDelay: `${m.delay}s` }}
              >
                {m.node}
              </button>
            </motion.li>
          ))}
        </motion.ul>
      </AnimatePresence>
    </div>
  );
}
