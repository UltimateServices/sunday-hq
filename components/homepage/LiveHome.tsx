import Link from "next/link";
import { EmptyState } from "@/components/ds/EmptyState";
import { HomeScanCard } from "@/components/homepage/HomeScanCard";
import { Section } from "@/components/shared/Section";
import type { HomepageVM } from "@/lib/homepage";

export function LiveHome({ vm }: { vm: HomepageVM }) {
  return (
    <div className="mx-auto max-w-[640px] space-y-10 pb-12">
      <header className="space-y-2">
        <p className="text-[13px] text-muted">
          Week {vm.week} · {vm.slateLabel}
        </p>
        <h1 className="text-[34px] font-semibold tracking-tight">Top 10</h1>
        <p className="max-w-md text-[15px] leading-relaxed text-muted">
          {vm.live
            ? "Four lists. Highest grade, then edge. Who, what, line, edge, grade, why."
            : "Four lists stay up so you can share the page. Every card is labeled not live — do not bet from this page."}
        </p>
      </header>

      {vm.sections.map((section) => (
        <Section key={section.id} id={section.id.toLowerCase()} title={section.title} lede={section.lede}>
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
        </Section>
      ))}

      <p className="text-[13px] text-muted">
        Research dump lives in{" "}
        <Link href="/dashboard" className="text-gold hover:underline">
          Command Center
        </Link>
        . Props, parlays, and boards stay in the menu.
      </p>
    </div>
  );
}
