import { useSyncExternalStore } from "react";

export type Theme = "auror" | "darkarts" | "beasts";
export const THEMES: Theme[] = ["auror", "darkarts", "beasts"];

const STORAGE_KEY = "theme";
export const META_COLOR: Record<Theme, string> = { auror: "#F6EEDB", darkarts: "#090A0F", beasts: "#2A1A16" };

function readStored(): Theme | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    if (v === "light") return "auror"; // values saved by the earlier two-theme switch
    if (v === "dark") return "darkarts";
    return THEMES.includes(v as Theme) ? (v as Theme) : null;
  } catch {
    return null;
  }
}

function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "auror" : "darkarts";
}

function apply(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", META_COLOR[theme]);
}

/** Current theme, as set on <html data-theme> (index.html sets it before first paint). */
export function getTheme(): Theme {
  const t = document.documentElement.dataset.theme as Theme | undefined;
  return t && THEMES.includes(t) ? t : "darkarts";
}

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const mq = window.matchMedia("(prefers-color-scheme: light)");
  const onSystem = () => {
    if (!readStored()) apply(systemTheme());
  };
  mq.addEventListener("change", onSystem);
  return () => {
    observer.disconnect();
    mq.removeEventListener("change", onSystem);
  };
}

export function useTheme(): Theme {
  return useSyncExternalStore(subscribe, getTheme, () => "darkarts");
}

export function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Switch theme. A registered transition (the duel cutscene) may take over and
 * call `commit` at its impact moment; otherwise colours cross-fade over 400ms with
 * a spell ripple from `origin`. Reduced motion: instant.
 */
export function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage blocked: the choice still applies for this visit */
  }
  const from = getTheme();
  if (theme === from) {
    transition?.cancel();
    return;
  }
  if (prefersReducedMotion()) {
    apply(theme);
    return;
  }
  const root = document.documentElement;
  const commit = () => {
    root.classList.add("theme-fade");
    apply(theme);
    window.setTimeout(() => root.classList.remove("theme-fade"), 420);
  };
  if (origin && transition?.play(from, theme, commit)) return;
  commit();
  if (origin) onThemeCast?.(origin.x, origin.y, theme);
}

/** Set by spells.ts so theme switches can cast a ripple without a circular import. */
let onThemeCast: ((x: number, y: number, theme: Theme) => void) | undefined;
export function registerThemeCast(fn: (x: number, y: number, theme: Theme) => void) {
  onThemeCast = fn;
}

/** A transition that can take over a theme switch and commit it later (the cutscene). */
type Transition = {
  /** Return true to take over; must eventually call `commit`. */
  play: (from: Theme, to: Theme, commit: () => void) => boolean;
  /** Finish any running transition immediately. */
  cancel: () => void;
};
let transition: Transition | undefined;
export function registerThemeTransition(t: Transition | undefined) {
  transition = t;
}
