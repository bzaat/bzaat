import { useEffect, useState, type CSSProperties } from "react";
import { SPELL_EVENT, type SpellEvent } from "../../spells";

type Live = SpellEvent & { id: number; stars?: { dx: number; dy: number; d: number; s: number }[]; scale?: number };

let nextId = 1;

/**
 * Overlay for one-shot spells: the theme-switch ripple and click star bursts with an
 * incantation. Fixed, pointer-events: none, animated with transform/opacity only.
 */
export function SpellLayer() {
  const [live, setLive] = useState<Live[]>([]);

  useEffect(() => {
    const on = (e: Event) => {
      const d = (e as CustomEvent<SpellEvent>).detail;
      const id = nextId++;
      const item: Live =
        d.kind === "ripple"
          ? { ...d, id, scale: (Math.hypot(Math.max(d.x, innerWidth - d.x), Math.max(d.y, innerHeight - d.y)) * 2) / 120 }
          : {
              ...d,
              id,
              stars: Array.from({ length: 12 }, (_, i) => {
                const a = (i / 12) * Math.PI * 2 + Math.random() * 0.4;
                const dist = 26 + Math.random() * 30;
                return { dx: Math.cos(a) * dist, dy: Math.sin(a) * dist - 10, d: Math.random() * 80, s: 0.6 + Math.random() * 0.8 };
              }),
            };
      setLive((l) => [...l, item]);
      window.setTimeout(() => setLive((l) => l.filter((x) => x.id !== id)), d.kind === "ripple" ? 450 : 1250);
    };
    window.addEventListener(SPELL_EVENT, on);
    return () => window.removeEventListener(SPELL_EVENT, on);
  }, []);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[70] overflow-hidden">
      {live.map((s) =>
        s.kind === "ripple" ? (
          <span
            key={s.id}
            className="spell-ripple"
            style={{ left: s.x, top: s.y, "--c": s.color, "--s": s.scale } as CSSProperties}
          />
        ) : (
          <span key={s.id} className="absolute" style={{ left: s.x, top: s.y }}>
            {s.stars!.map((st, i) => (
              <span
                key={i}
                className="spell-star"
                style={
                  { "--c": s.color, "--dx": `${st.dx}px`, "--dy": `${st.dy}px`, "--k": st.s, animationDelay: `${st.d}ms` } as CSSProperties
                }
              />
            ))}
            {s.text && <span className="spell-text">{s.text}</span>}
          </span>
        ),
      )}
    </div>
  );
}
