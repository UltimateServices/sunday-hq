import type { PropView } from "@/lib/prop-view";
import { PropRow } from "./PropRow";
import { PropCard } from "./PropCard";
import { EmptyState } from "./EmptyState";

const COLS = [
  "Player",
  "Market",
  "Book",
  "Line",
  "Odds",
  "Model",
  "Edge",
  "Prob",
  "EV",
  "Conf",
  "Matchup",
  "Health",
  "Wx",
  "Move",
  "Why",
];

export function RankingTable({ views }: { views: PropView[] }) {
  if (views.length === 0) return <EmptyState />;

  return (
    <>
      <div className="space-y-2 md:hidden">
        {views.map((view) => (
          <PropCard key={view.id} view={view} compact />
        ))}
      </div>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full min-w-[1200px] border-collapse text-left text-xs">
          <thead className="sticky top-0 z-10 bg-bg-elev text-[10px] tracking-wide text-muted uppercase">
            <tr className="border-b border-line">
              {COLS.map((h) => (
                <th key={h} className="px-2 py-2 font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {views.map((view) => (
              <PropRow key={view.id} view={view} />
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
