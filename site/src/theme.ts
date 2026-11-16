import { useSyncExternalStore } from "react";
import { flushSync } from "react-dom";

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

type VTDocument = Document & {
  startViewTransition?: (cb: () => void) => { ready: Promise<void> };
};

/**
 * Switch theme. With `origin` (the clicked button's centre) and View Transitions
 * support, the new theme spreads out from that point like a cast spell;
 * otherwise colours cross-fade. Reduced motion: instant.
 */
export function setTheme(theme: Theme, origin?: { x: number; y: number }) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* storage blocked: the choice still applies for this visit */
  }
  if (theme === getTheme()) return;

  const doc = document as VTDocument;
  if (prefersReducedMotion()) {
    apply(theme);
    return;
  }
  if (origin && doc.startViewTransition) {
    const { x, y } = origin;
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    const vt = doc.startViewTransition(() => flushSync(() => apply(theme)));
    vt.ready
      .then(() => {
        document.documentElement.animate(
          { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
          { duration: 700, easing: "cubic-bezier(0.2, 0.8, 0.2, 1)", pseudoElement: "::view-transition-new(root)" },
        );
      })
      .catch(() => {});
    return;
  }
  const root = document.documentElement;
  root.classList.add("theme-fade");
  apply(theme);
  window.setTimeout(() => root.classList.remove("theme-fade"), 500);
}
