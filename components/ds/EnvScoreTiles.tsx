import type { EnvScores } from "@/lib/env-scores";
import { InfoTip } from "./InfoTip";

export function EnvScoreTiles({ scores }: { scores: EnvScores }) {
  const tiles = [
    { label: "Game", value: scores.game },
    { label: "Passing", value: scores.passing },
    { label: "Rushing", value: scores.rushing },
    { label: "TD", value: scores.td },
  ];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-[12px] text-muted">
        <InfoTip term="Environment Score" />
        <span>ESTIMATE</span>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.label} className="surface px-3 py-3">
            <p className="text-[11px] text-muted">{tile.label}</p>
            <p className="num text-[26px] font-semibold tracking-tight text-gold">{tile.value}</p>
          </div>
        ))}
      </div>
      <p className="text-[13px] leading-relaxed text-muted">{scores.note}</p>
    </div>
  );
}
