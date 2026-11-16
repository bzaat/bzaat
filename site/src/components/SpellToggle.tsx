import { WandSparkles } from "lucide-react";
import { setSpells, useSpells } from "../spells";

/** Navbar wand: turns spell particles and click effects on or off (remembered). */
export function SpellToggle() {
  const on = useSpells();
  return (
    <button
      type="button"
      onClick={() => setSpells(!on)}
      aria-pressed={on}
      aria-label="Spell effects"
      title={on ? "Spell effects on: click to turn off" : "Spell effects off: click to turn on"}
      className={`relative inline-flex size-11 cursor-pointer items-center justify-center rounded-md transition-colors ${
        on ? "text-amber hover:text-text" : "text-muted hover:text-text"
      }`}
    >
      <WandSparkles aria-hidden="true" className="size-[1.125rem]" />
      {!on && (
        <span aria-hidden="true" className="absolute h-[1.5px] w-5 rotate-45 rounded-full bg-current" />
      )}
    </button>
  );
}
