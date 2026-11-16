import { useState } from "react";
import { Check, ChevronDown, Copy } from "lucide-react";
import { publications, type Publication } from "../data";
import { Ext, SectionHeading } from "./ui";

async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

function PaperEntry({ p }: { p: Publication }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  const onCopy = async () => {
    const ok = await copyText(p.bibtex);
    setState(ok ? "copied" : "failed");
    if (ok) window.setTimeout(() => setState("idle"), 2400);
  };

  return (
    <article className="grid gap-4 border-b border-line py-8 md:grid-cols-12" aria-labelledby={`pub-${p.id}`}>
      <div className="md:col-span-3">
        <p className="font-mono text-lg text-amber">{p.venue}</p>
        <p className="mt-1 text-sm text-muted">
          {p.role}
          <br />
          {p.status}
        </p>
        {p.certificate && (
          <a
            href={`${import.meta.env.BASE_URL}${p.certificate.pdf}`}
            target="_blank"
            rel="noreferrer"
            className="group mt-4 block max-w-72"
          >
            <img
              src={`${import.meta.env.BASE_URL}${p.certificate.img}`}
              alt={p.certificate.alt}
              width={900}
              height={637}
              loading="lazy"
              className="h-auto w-full rounded-md border border-line-strong transition-[border-color] group-hover:border-amber"
            />
            <span className="mt-2 block text-xs text-muted group-hover:text-amber">
              Presentation certificate (PDF)<span className="sr-only"> (opens in a new tab)</span>
            </span>
          </a>
        )}
      </div>

      <div className="min-w-0 md:col-span-9">
        <h3 id={`pub-${p.id}`} className="font-title text-xl font-semibold leading-snug md:text-[1.6rem]">
          {p.title}
        </h3>
        <p className="mt-2 text-sm text-muted">
          {p.authors.map((a, i) => (
            <span key={a.name}>
              {a.me ? <strong className="font-semibold text-text">{a.name}</strong> : a.name}
              {i < p.authors.length - 1 ? ", " : ""}
            </span>
          ))}
        </p>
        <p className="mt-1 max-w-[70ch] text-sm text-muted">
          {p.venueDetail}
          {p.presented && <> {p.presented}</>}
        </p>
        <p className="mt-4 max-w-[68ch]">{p.keyResult}</p>
        {p.limitation && <p className="mt-2 max-w-[68ch] text-sm text-muted">Limitation: {p.limitation}</p>}

        <details className="group mt-5 rounded-md border border-line">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 px-4 text-sm font-medium [&::-webkit-details-marker]:hidden">
            Abstract
            <ChevronDown aria-hidden="true" className="size-4 text-muted transition-transform group-open:rotate-180" />
          </summary>
          <div className="space-y-3 border-t border-line px-4 py-4">
            <p className="max-w-[72ch] text-[0.9375rem] leading-relaxed text-muted">{p.abstract}</p>
            {p.abstractNote && <p className="text-xs text-muted italic">{p.abstractNote}</p>}
          </div>
        </details>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md border border-line-strong px-3.5 font-mono text-sm hover:border-amber hover:text-amber"
          >
            {state === "copied" ? (
              <Check aria-hidden="true" className="size-4 text-ok" />
            ) : (
              <Copy aria-hidden="true" className="size-4" />
            )}
            {state === "copied" ? "BibTeX copied" : "Copy BibTeX"}
          </button>
          {p.links.map((l) => (
            <Ext key={l.href} href={l.href} className="text-sm">
              {l.label}
            </Ext>
          ))}
        </div>
        <p aria-live="polite" className="sr-only">
          {state === "copied" ? "BibTeX copied to clipboard" : ""}
        </p>
        {state === "failed" && (
          <div className="mt-4">
            <p className="mb-2 text-sm text-muted">Clipboard access is blocked here. Select the entry below and copy it.</p>
            <pre className="overflow-x-auto rounded-md border border-line bg-sunken p-4 font-mono text-xs leading-relaxed">
              {p.bibtex}
            </pre>
          </div>
        )}
      </div>
    </article>
  );
}

export function Publications() {
  return (
    <section aria-labelledby="publications" className="scroll-mt-20">
      <SectionHeading
        id="publications"
        title="Publications"
        intro="Two accepted conference papers: one first-authored study on locality encoding, and a co-authored framework for uncertainty-aware UAV rescue."
      />
      <div className="border-t border-line">
        {publications.map((p) => (
          <PaperEntry key={p.id} p={p} />
        ))}
      </div>
    </section>
  );
}
