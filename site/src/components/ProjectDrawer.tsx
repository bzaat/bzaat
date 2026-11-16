import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import type { Project } from "../data";
import { DataTable, Ext, Tag } from "./ui";
import { Mermaid } from "./Mermaid";

export function ProjectDrawer({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (project && !d.open) d.showModal();
    if (!project && d.open) d.close();
  }, [project]);

  return (
    <dialog
      ref={ref}
      className="drawer"
      aria-labelledby="drawer-title"
      onClose={onClose}
      onClick={(e) => {
        // click on the backdrop (the dialog box itself, outside the content) closes it
        if (e.target === e.currentTarget) e.currentTarget.close();
      }}
    >
      {project && (
        <div className="flex min-h-full flex-col">
          <header className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-line bg-raised/95 px-5 py-4 backdrop-blur md:px-8">
            <div className="min-w-0">
              <p className="text-sm text-muted">{project.category}</p>
              <h2 id="drawer-title" className="mt-1 text-xl font-semibold leading-snug tracking-tight md:text-2xl">
                {project.title}
              </h2>
            </div>
            <button
              type="button"
              onClick={() => ref.current?.close()}
              className="inline-flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-line-strong hover:border-amber hover:text-amber"
              aria-label="Close project details"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
          </header>

          <div className="space-y-10 px-5 py-6 md:px-8 md:py-8">
            <div className="space-y-4">
              <p className="max-w-[68ch] text-[1.0625rem] leading-relaxed">{project.summary}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {project.links.map((l) => (
                  <Ext key={l.href} href={l.href} className="min-h-11 text-sm">
                    {l.label}
                  </Ext>
                ))}
              </div>
            </div>

            <section aria-labelledby="d-arch" className="space-y-3">
              <h3 id="d-arch" className="text-lg font-semibold">
                System architecture
              </h3>
              <Mermaid code={project.diagram} label={project.diagramAlt} />
              <p className="max-w-[70ch] text-sm text-muted">{project.diagramAlt}</p>
            </section>

            <section aria-labelledby="d-results" className="space-y-6">
              <h3 id="d-results" className="text-lg font-semibold">
                Results
              </h3>
              {project.tables.map((t) => (
                <DataTable key={t.caption} table={t} />
              ))}
            </section>

            {project.figures && project.figures.length > 0 && (
              <section aria-labelledby="d-figures" className="space-y-3">
                <h3 id="d-figures" className="text-lg font-semibold">
                  Figures
                </h3>
                <div className="grid gap-5 sm:grid-cols-2">
                  {project.figures.map((f) => (
                    <figure key={f.src} className="space-y-2">
                      <a
                        href={`${import.meta.env.BASE_URL}${f.src}`}
                        target="_blank"
                        rel="noreferrer"
                        className="block overflow-hidden rounded-md border border-line-strong bg-white hover:border-amber"
                      >
                        <img
                          src={`${import.meta.env.BASE_URL}${f.src}`}
                          alt={f.alt}
                          width={f.w}
                          height={f.h}
                          loading="lazy"
                          className="h-auto w-full"
                        />
                        <span className="sr-only">Open full size (opens in a new tab)</span>
                      </a>
                      <figcaption className="text-sm text-muted">{f.caption}</figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            )}

            <section aria-labelledby="d-problem" className="space-y-3">
              <h3 id="d-problem" className="text-lg font-semibold">
                Problem and constraints
              </h3>
              <ul className="max-w-[70ch] list-disc space-y-2 pl-5 text-muted marker:text-line-strong">
                {project.problem.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </section>

            <section aria-labelledby="d-decisions" className="space-y-3">
              <h3 id="d-decisions" className="text-lg font-semibold">
                Key engineering decisions
              </h3>
              <dl className="grid gap-5 sm:grid-cols-2">
                {project.decisions.map((d) => (
                  <div key={d.title} className="border-l-2 border-line-strong pl-4">
                    <dt className="font-medium">{d.title}</dt>
                    <dd className="mt-1 text-sm leading-relaxed text-muted">{d.body}</dd>
                  </div>
                ))}
              </dl>
            </section>

            <section aria-labelledby="d-limits" className="space-y-2 pb-6">
              <h3 id="d-limits" className="text-lg font-semibold">
                Limitations
              </h3>
              <p className="max-w-[70ch] text-muted">{project.limitations}</p>
            </section>
          </div>
        </div>
      )}
    </dialog>
  );
}
