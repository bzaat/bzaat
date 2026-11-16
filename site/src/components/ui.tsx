import type { ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import type { Table } from "../data";

/** External link: opens in a new tab and says so to screen readers. */
export function Ext({ href, children, className = "" }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={`inline-flex items-center gap-1 text-steel underline decoration-steel/40 hover:decoration-steel ${className}`}
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="size-3.5 shrink-0" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span translate="no" className="inline-block rounded-sm border border-line px-1.5 py-0.5 font-mono text-xs text-muted">
      {children}
    </span>
  );
}

export function SectionHeading({ id, title, intro }: { id: string; title: string; intro?: string }) {
  return (
    <div className="mb-10 grid gap-3 border-t border-line pt-6 md:grid-cols-12">
      <h2 id={id} className="glow-title font-display text-2xl font-semibold md:col-span-4 md:text-3xl">
        {title}
      </h2>
      {intro && <p className="max-w-[62ch] text-muted md:col-span-7 md:col-start-6">{intro}</p>}
    </div>
  );
}

export function DataTable({ table }: { table: Table }) {
  return (
    <div className="space-y-2">
      <div
        className="overflow-x-auto rounded-md border border-line bg-sunken"
        tabIndex={0}
        role="region"
        aria-label={table.caption}
      >
        <table className="data-table min-w-[520px]">
          <caption className="px-3 pt-3">{table.caption}</caption>
          <thead>
            <tr>
              {table.columns.map((c) => (
                <th key={c.label} scope="col" className={c.numeric ? "n" : undefined}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((r) => (
              <tr key={r.cells[0]} data-best={r.best ? "" : undefined}>
                {r.cells.map((cell, i) =>
                  i === 0 ? (
                    <th key={i} scope="row" className="text-left font-normal">
                      {cell}
                      {r.best && <span className="sr-only"> (best)</span>}
                    </th>
                  ) : (
                    <td key={i} className={table.columns[i]?.numeric ? "n" : undefined}>
                      {cell}
                    </td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && <p className="max-w-[70ch] text-sm text-muted">{table.note}</p>}
    </div>
  );
}
