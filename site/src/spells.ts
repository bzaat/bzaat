import { useSyncExternalStore } from "react";
import { prefersReducedMotion, registerThemeCast, type Theme } from "./theme";

/**
 * Spell effects on/off (navbar wand). Stored on <html data-spells="on|off"> and in
 * localStorage. Defaults to off for visitors who prefer reduced motion.
 */
const KEY = "spells";

function stored(): boolean | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "on" ? true : v === "off" ? false : null;
  } catch {
    return null;
  }
}

export function initSpells() {
  const on = stored() ?? !prefersReducedMotion();
  document.documentElement.dataset.spells = on ? "on" : "off";
}

const get = () => document.documentElement.dataset.spells !== "off";

function subscribe(cb: () => void) {
  const mo = new MutationObserver(cb);
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ["data-spells"] });
  return () => mo.disconnect();
}

export function useSpells(): boolean {
  return useSyncExternalStore(subscribe, get, () => true);
}

export function setSpells(on: boolean) {
  document.documentElement.dataset.spells = on ? "on" : "off";
  try {
    localStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    /* storage blocked: applies for this visit */
  }
}

/** Effects run only when spells are on and the visitor hasn't asked for reduced motion. */
export function spellsActive(): boolean {
  return get() && !prefersReducedMotion();
}

// ------------------------------------------------------------------ event bus
export type SpellEvent =
  | { kind: "ripple"; x: number; y: number; color: string }
  | { kind: "burst"; x: number; y: number; text: string; color: string };

export const SPELL_EVENT = "portfolio:spell";

export const SPELL_COLOR: Record<Theme, string> = { auror: "#C59B27", darkarts: "#2ECC71", beasts: "#D4A338" };

function emit(e: SpellEvent) {
  if (!spellsActive()) return;
  window.dispatchEvent(new CustomEvent<SpellEvent>(SPELL_EVENT, { detail: e }));
}

export function ripple(x: number, y: number, theme: Theme) {
  emit({ kind: "ripple", x, y, color: SPELL_COLOR[theme] });
}
registerThemeCast(ripple);

/** A star burst and a floating incantation above an element (e.g. "Accio BibTeX!"). */
export function castAt(el: Element | null, text: string) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  const theme = (document.documentElement.dataset.theme as Theme) || "darkarts";
  emit({ kind: "burst", x: r.left + r.width / 2, y: r.top, text, color: SPELL_COLOR[theme] ?? "#D4A338" });
}
