import { useEffect, useId, useState } from "react";
import { useTheme, type Theme } from "../theme";

type MermaidApi = typeof import("mermaid").default;
let mermaidPromise: Promise<MermaidApi> | null = null;

/** Loads Mermaid on first use only, so it never weighs down the initial page. */
function loadMermaid(): Promise<MermaidApi> {
  if (!mermaidPromise) mermaidPromise = import("mermaid").then((m) => m.default);
  return mermaidPromise;
}

const PALETTE: Record<Theme, Record<string, string | boolean>> = {
  auror: {
    darkMode: false,
    background: "#efe3c8",
    primaryColor: "#fbf6ea",
    primaryTextColor: "#231709",
    primaryBorderColor: "#8f7b52",
    secondaryColor: "#fbf6ea",
    tertiaryColor: "#fbf6ea",
    lineColor: "#5b4a32",
    textColor: "#231709",
    edgeLabelBackground: "#efe3c8",
  },
  darkarts: {
    darkMode: true,
    background: "#050608",
    primaryColor: "#0f1419",
    primaryTextColor: "#d0d3d4",
    primaryBorderColor: "#2ecc71",
    secondaryColor: "#0f1419",
    tertiaryColor: "#0f1419",
    lineColor: "#557f67",
    textColor: "#d0d3d4",
    edgeLabelBackground: "#050608",
  },
  beasts: {
    darkMode: true,
    background: "#1e120f",
    primaryColor: "#3e2723",
    primaryTextColor: "#efe6dd",
    primaryBorderColor: "#d4a338",
    secondaryColor: "#3e2723",
    tertiaryColor: "#3e2723",
    lineColor: "#a08374",
    textColor: "#efe6dd",
    edgeLabelBackground: "#1e120f",
  },
};

export function Mermaid({ code, label }: { code: string; label: string }) {
  const baseId = "m" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const theme = useTheme();
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSvg(null);
    setFailed(false);
    loadMermaid()
      .then((m) => {
        m.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "base",
          fontFamily: '"Sora Variable", ui-sans-serif, system-ui, sans-serif',
          themeVariables: { ...PALETTE[theme], fontSize: "14px" },
          flowchart: { curve: "basis", padding: 12, htmlLabels: true },
        });
        return m.render(`${baseId}${theme}`, code);
      })
      .then(({ svg }) => !cancelled && setSvg(svg))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [code, baseId, theme]);

  if (failed) {
    return (
      <div className="rounded-md border border-line bg-sunken p-4 text-sm">
        <p className="mb-2 text-muted">The diagram could not be drawn. Its source is below.</p>
        <pre className="overflow-x-auto font-mono text-xs">{code}</pre>
      </div>
    );
  }

  return (
    <div
      className="overflow-x-auto rounded-md border border-line bg-sunken p-4"
      tabIndex={0}
      role="region"
      aria-label="Architecture diagram, scrollable"
    >
      {svg ? (
        <div role="img" aria-label={label} className="mermaid-host min-w-[300px]" dangerouslySetInnerHTML={{ __html: svg }} />
      ) : (
        <p className="py-16 text-center text-sm text-muted" aria-live="polite">
          Drawing diagram…
        </p>
      )}
    </div>
  );
}
