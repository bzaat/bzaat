import { useEffect, useId, useState } from "react";

type MermaidApi = typeof import("mermaid").default;
let mermaidPromise: Promise<MermaidApi> | null = null;

/** Loads Mermaid on first use only, so it never weighs down the initial page. */
function loadMermaid(): Promise<MermaidApi> {
  if (!mermaidPromise) {
    mermaidPromise = import("mermaid").then(({ default: mermaid }) => {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "strict",
        theme: "base",
        fontFamily: '"Sora Variable", ui-sans-serif, system-ui, sans-serif',
        themeVariables: {
          darkMode: true,
          background: "#0a0e13",
          primaryColor: "#1b2430",
          primaryTextColor: "#e7ecf2",
          primaryBorderColor: "#4a5d74",
          secondaryColor: "#1b2430",
          tertiaryColor: "#1b2430",
          lineColor: "#8fa0b5",
          textColor: "#e7ecf2",
          edgeLabelBackground: "#0a0e13",
          fontSize: "14px",
        },
        flowchart: { curve: "basis", padding: 12, htmlLabels: true },
      });
      return mermaid;
    });
  }
  return mermaidPromise;
}

export function Mermaid({ code, label }: { code: string; label: string }) {
  const id = "m" + useId().replace(/[^a-zA-Z0-9]/g, "");
  const [svg, setSvg] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setSvg(null);
    setFailed(false);
    loadMermaid()
      .then((m) => m.render(id, code))
      .then(({ svg }) => !cancelled && setSvg(svg))
      .catch(() => !cancelled && setFailed(true));
    return () => {
      cancelled = true;
    };
  }, [code, id]);

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
