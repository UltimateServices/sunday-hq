import Link from "next/link";
import { EmptyState } from "@/components/ds/EmptyState";
import { HomeScanCard } from "@/components/homepage/HomeScanCard";
import type { HomepageVM } from "@/lib/homepage";

export function LiveHome({ vm }: { vm: HomepageVM }) {
  return (
    <div className="mx-auto max-w-[680px] space-y-12 pb-16">
      <header className="space-y-3">
        <p className="text-[13px] text-muted">
          Week {vm.week} · {vm.slateLabel}
        </p>
        <h1 className="text-[40px] font-semibold tracking-[-0.03em]">Top 10</h1>
        <p className="max-w-md text-[17px] leading-relaxed text-muted">
          {vm.live
            ? "Four lists. Highest grade, then edge. Who, what, line, edge, grade, why."
            : "Four lists stay up so you can share the page. Every card is labeled not live — do not bet from this page."}
        </p>
      </header>

      {vm.sections.map((section) => (
        <section key={section.id} id={section.id.toLowerCase()} className="space-y-4">
          <header className="space-y-1">
            <h2 className="text-[22px] font-semibold tracking-tight">{section.title}</h2>
            <p className="max-w-xl text-[13px] leading-relaxed text-muted">{section.lede}</p>
          </header>
          {section.rows.length === 0 ? (
            <EmptyState
              message={`No rankable ${section.title.replace("Top 10 ", "").toLowerCase()} yet.`}
              hint={
                vm.live
                  ? "We will not invent a play to fill the list."
                  : "Not live. Stub section kept so Home never looks like a missing product."
              }
            />
          ) : (
            <ol className="space-y-3">
              {section.rows.map((row, index) => (
                <li key={row.id}>
                  <HomeScanCard row={row} rank={index + 1} live={vm.live} />
                </li>
              ))}
            </ol>
          )}
        </section>
      ))}

      <p className="text-[13px] leading-relaxed text-muted">
        Everything else is in the menu.{" "}
        <Link href="/dashboard" className="text-ink underline decoration-line underline-offset-4 hover:text-gold">
          Command Center
        </Link>
      </p>
    </div>
  );
}
