import { Moon, Sun } from "lucide-react";
import { setTheme, useTheme } from "../theme";

export function ThemeToggle() {
  const theme = useTheme();
  const next = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
      className="inline-flex size-11 cursor-pointer items-center justify-center rounded-md text-muted hover:text-text"
    >
      {theme === "dark" ? (
        <Sun aria-hidden="true" className="size-[1.125rem]" />
      ) : (
        <Moon aria-hidden="true" className="size-[1.125rem]" />
      )}
    </button>
  );
}
