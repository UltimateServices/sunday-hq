import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { CompareBoard } from "@/components/boards/CompareBoard";
import { PlayerCompareBoard } from "@/components/boards/PlayerCompareBoard";
import { TicketQuarantine } from "@/components/ds/TicketQuarantine";
import { getWeekCatalog } from "@/lib/catalog";

export const dynamic = "force-dynamic";

export default async function ComparePage({
  searchParams,
}: {
  searchParams: Promise<{ ids?: string | string[]; mode?: string | string[] }>;
}) {
  const catalog = await getWeekCatalog();
  const params = await searchParams;
  const rawMode = typeof params.mode === "string" ? params.mode : params.mode?.[0] ?? "";
  const raw = params.ids;
  const ids = (typeof raw === "string" ? raw : raw?.[0] ?? "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
    .slice(0, 4);
  const looksLikeProps = ids.some((id) => id.startsWith("prop-"));
  const mode = rawMode === "props" || (rawMode !== "players" && looksLikeProps) ? "props" : "players";

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 2 · Research Board"
        title="Compare"
        lede={
          mode === "players"
            ? "2–4 players. Usage and DraftKings prices stay DATA UNAVAILABLE. Seed lines are labeled research, not tickets."
            : catalog.liveGate.actionable
              ? "2–4 props side by side. Same player across markets, or different players on one market. DraftKings stays the decision book."
              : "Prop compare stays empty until live DraftKings tape is fresh. Use Players until then."
        }
      />
      <div className="flex flex-wrap gap-1">
        <Link href="/compare?mode=players" className={`action-btn ${mode === "players" ? "border-gold/60 text-gold" : ""}`}>
          Players
        </Link>
        <Link href="/compare?mode=props" className={`action-btn ${mode === "props" ? "border-gold/60 text-gold" : ""}`}>
          Props
        </Link>
      </div>
      {mode === "players" ? (
        <PlayerCompareBoard selectedIds={ids} />
      ) : (
        <TicketQuarantine gate={catalog.liveGate} noun="comparisons">
          <CompareBoard props={catalog.props} selectedIds={ids} />
        </TicketQuarantine>
      )}
    </div>
  );
}
