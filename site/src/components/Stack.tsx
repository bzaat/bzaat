import { roadmap, stack } from "../data";
import { SectionHeading } from "./ui";

export function Stack() {
  return (
    <section aria-labelledby="stack" className="scroll-mt-20">
      <SectionHeading
        id="stack"
        title="Stack and research roadmap"
        intro="Tools listed on the left have been used in the projects above. The roadmap separates what I work on now from what I am learning next."
      />

      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <h3 className="mb-5 text-lg font-semibold">Used in projects</h3>
          <dl className="divide-y divide-line border-y border-line">
            {stack.map((g) => (
              <div key={g.group} className="grid gap-2 py-4 sm:grid-cols-[10rem_1fr]">
                <dt className="text-sm text-muted">{g.group}</dt>
                <dd className="flex flex-wrap gap-x-4 gap-y-1 font-mono text-sm">
                  {g.items.map((i) => (
                    <span key={i}>{i}</span>
                  ))}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5 lg:col-start-8">
          <h3 className="mb-5 text-lg font-semibold">Roadmap</h3>
          <ol className="relative space-y-8 border-l border-line-strong pl-6">
            {roadmap.map((r, idx) => (
              <li key={r.phase} className="relative">
                <span
                  aria-hidden="true"
                  className={`absolute top-1.5 -left-[1.95rem] size-3 rounded-full border-2 ${
                    idx === 0 ? "border-amber bg-amber" : "border-line-strong bg-bg"
                  }`}
                />
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="font-semibold">{r.phase}</span>
                  <span className="font-mono text-xs text-muted">{r.when}</span>
                </p>
                <ul className="mt-2 space-y-1.5 text-[0.9375rem] text-muted">
                  {r.items.map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
