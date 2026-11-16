import { useRef, type KeyboardEvent } from "react";
import { motion, useReducedMotion } from "motion/react";
import { Briefcase, Flame, Sparkles, type LucideIcon } from "lucide-react";
import { setTheme, THEMES, useTheme, type Theme } from "../theme";

const OPTIONS: Record<Theme, { label: string; Icon: LucideIcon }> = {
  auror: { label: "Auror Office", Icon: Sparkles },
  darkarts: { label: "Dark Arts", Icon: Flame },
  beasts: { label: "Newt’s Case", Icon: Briefcase },
};

/** Floating theme switcher: a radio group, reachable from anywhere on the page. */
export function ThemeDock() {
  const theme = useTheme();
  const reduce = useReducedMotion();
  const refs = useRef<Record<Theme, HTMLButtonElement | null>>({ auror: null, darkarts: null, beasts: null });

  const choose = (t: Theme) => {
    const el = refs.current[t];
    const r = el?.getBoundingClientRect();
    setTheme(t, r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : undefined);
  };

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = THEMES.indexOf(theme);
    const next =
      e.key === "ArrowRight" || e.key === "ArrowDown"
        ? THEMES[(i + 1) % THEMES.length]
        : e.key === "ArrowLeft" || e.key === "ArrowUp"
          ? THEMES[(i + THEMES.length - 1) % THEMES.length]
          : null;
    if (!next) return;
    e.preventDefault();
    choose(next);
    refs.current[next]?.focus();
  };

  return (
    <div className="pointer-events-none fixed right-4 bottom-[max(1rem,env(safe-area-inset-bottom))] z-50 sm:right-6 sm:bottom-6">
      <div
        role="radiogroup"
        aria-label="Theme"
        onKeyDown={onKey}
        className="pointer-events-auto flex items-center gap-0.5 rounded-full border border-line-strong bg-raised/85 p-1 shadow-[0_10px_30px_-12px_rgb(0_0_0/0.55)] backdrop-blur-md"
      >
        {THEMES.map((t) => {
          const { label, Icon } = OPTIONS[t];
          const active = t === theme;
          return (
            <button
              key={t}
              ref={(el) => {
                refs.current[t] = el;
              }}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={label}
              title={label}
              tabIndex={active ? 0 : -1}
              onClick={() => choose(t)}
              className={`relative isolate inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-1.5 rounded-full px-2.5 text-[0.8125rem] font-medium transition-colors sm:px-3 ${
                active ? "text-amber-ink" : "text-muted hover:text-text"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="dock-active"
                  aria-hidden="true"
                  className="absolute inset-0 -z-10 rounded-full bg-amber"
                  transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
                />
              )}
              <Icon aria-hidden="true" className="size-4 shrink-0" />
              <span aria-hidden="true" className="hidden font-display tracking-wide sm:inline">
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
