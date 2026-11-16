import { useMemo, useState } from "react";
import { categories, projects, type Category } from "../data";
import { SectionHeading, Tag } from "./ui";

type Filter = "All" | Category;

export function Projects({ onOpen }: { onOpen: (id: string) => void }) {
  const [filter, setFilter] = useState<Filter>("All");
  const visible = useMemo(
    () => (filter === "All" ? projects : projects.filter((p) => p.category === filter)),
    [filter],
  );
  const filters: Filter[] = ["All", ...categories];

  return (
    <section aria-labelledby="projects" className="scroll-mt-20">
      <SectionHeading
        id="projects"
        title="Projects"
        intro="Each project opens with its architecture, the full results tables, and the limitations that come with them."
      />

      <div role="group" aria-label="Filter projects by area" className="mb-8 flex flex-wrap gap-2">
        {filters.map((f) => {
          const count = f === "All" ? projects.length : projects.filter((p) => p.category === f).length;
          const active = f === filter;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm transition-colors ${
                active
                  ? "border-amber bg-amber text-amber-ink"
                  : "border-line-strong text-text hover:border-muted"
              }`}
            >
              {f}
              <span className={`num text-xs ${active ? "text-amber-ink/80" : "text-muted"}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <p className="sr-only" aria-live="polite">
        {visible.length} {visible.length === 1 ? "project" : "projects"} shown
      </p>

      <ul className="grid gap-5 md:grid-cols-2">
        {visible.map((p) => (
          <li key={p.id} className="flex">
            <button
              type="button"
              onClick={() => onOpen(p.id)}
              aria-haspopup="dialog"
              className="fx-card group flex h-full w-full cursor-pointer flex-col rounded-lg p-6 text-left md:p-8"
            >
              <span className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                <span>{p.category}</span>
                {p.status && (
                  <span className="rounded-sm border border-amber/50 px-1.5 font-mono text-xs text-amber">{p.status}</span>
                )}
              </span>
              <span className="mt-3 block font-title text-[1.375rem] font-semibold leading-snug group-hover:text-amber">
                {p.title}
              </span>
              <span className="mt-3 block max-w-[60ch] text-[0.9375rem] text-muted">{p.summary}</span>
              <span className="mt-6 block border-t border-line pt-4">
                <span className="block font-mono text-2xl text-amber tabular-nums">{p.headline.value}</span>
                <span className="mt-1 block text-sm text-muted">{p.headline.label}</span>
              </span>
              <span className="mt-5 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </span>
              <span className="mt-6 text-sm font-medium text-steel underline decoration-steel/40 underline-offset-4 group-hover:decoration-steel">
                Open architecture and results
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
