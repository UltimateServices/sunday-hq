"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { INJURIES } from "@/data/week1/injuries";
import { PLAYER_BY_ID } from "@/data/week1/players";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { GAME_BY_ID } from "@/data/week1/games";
import { EmptyState } from "@/components/ds/EmptyState";
import { FilterDrawer } from "@/components/ds/FilterDrawer";
import { HealthBadge } from "@/components/ds/badges";
import { DataStatus } from "@/components/shared/DataStatus";
import { expectedAvailability, practiceTrendFor, practiceTrendLabel } from "@/lib/practice-trend";
import type { HealthState, Position } from "@/lib/types/domain";

const IMPACTS = ["ALL", "OUT", "GAME_TIME", "CONFLICT", "PLAYING"] as const;

export function InjuriesBoard() {
  const [team, setTeam] = useState("ALL");
  const [pos, setPos] = useState("ALL");
  const [status, setStatus] = useState("ALL");
  const [impact, setImpact] = useState<(typeof IMPACTS)[number]>("ALL");
  const [game, setGame] = useState("ALL");

  const teams = useMemo(() => Array.from(new Set(INJURIES.map((row) => row.teamId))), []);
  const games = useMemo(() => Array.from(new Set(INJURIES.map((row) => row.gameId))), []);

  const rows = useMemo(() => {
    return INJURIES.filter((inj) => {
      const player = PLAYER_BY_ID[inj.playerId];
      if (team !== "ALL" && inj.teamId !== team) return false;
      if (pos !== "ALL" && player?.position !== pos) return false;
      if (status !== "ALL" && inj.health !== status) return false;
      if (game !== "ALL" && inj.gameId !== game) return false;
      if (impact === "OUT" && inj.health !== "OUT" && inj.health !== "IR_PUP_NFI") return false;
      if (impact === "GAME_TIME" && inj.health !== "GAME_TIME_DECISION") return false;
      if (impact === "CONFLICT" && inj.quality !== "SOURCE_CONFLICT") return false;
      if (impact === "PLAYING" && (inj.health === "OUT" || inj.health === "IR_PUP_NFI")) return false;
      return true;
    });
  }, [team, pos, status, impact, game]);

  const filters = (
    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
      <Field label="Team" value={team} onChange={setTeam} options={["ALL", ...teams.map((id) => TEAM_BY_ID[id]?.abbr ?? id)]} raw={["ALL", ...teams]} />
      <Field
        label="Position"
        value={pos}
        onChange={setPos}
        options={["ALL", "QB", "RB", "WR", "TE"]}
      />
      <Field
        label="Status"
        value={status}
        onChange={setStatus}
        options={["ALL", "OUT", "GAME_TIME_DECISION", "QUESTIONABLE", "EXPECTED_LIMITED", "MINOR_CONCERN"]}
      />
      <Field label="Impact" value={impact} onChange={(v) => setImpact(v as (typeof IMPACTS)[number])} options={[...IMPACTS]} />
      <Field
        label="Game"
        value={game}
        onChange={setGame}
        options={["ALL", ...games.map((id) => {
          const g = GAME_BY_ID[id];
          return g ? `${TEAM_BY_ID[g.awayTeamId].abbr}@${TEAM_BY_ID[g.homeTeamId].abbr}` : id;
        })]}
        raw={["ALL", ...games]}
      />
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="hidden md:block">{filters}</div>
      <FilterDrawer title="Injury filters">{filters}</FilterDrawer>
      {rows.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="space-y-2">
          {rows.map((inj) => {
            const player = PLAYER_BY_ID[inj.playerId];
            const beneficiaries = inj.beneficiaryPlayerIds.map((id) => PLAYER_BY_ID[id]?.name ?? id);
            return (
              <article key={inj.id} className="surface p-4">
                <div className="mb-2 flex flex-wrap gap-2">
                  <HealthBadge state={inj.health} />
                  <DataStatus quality={inj.quality} />
                </div>
                <Link href={`/players/${inj.playerId}`} className="text-[17px] font-semibold tracking-tight hover:text-gold">
                  {player?.name ?? inj.playerId} — {inj.bodyPart}
                </Link>
                <p className="mt-1 text-[14px]">{inj.headline}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{inj.detail}</p>
                <dl className="mt-3 grid gap-2 text-[12px] sm:grid-cols-3">
                  <div>
                    <dt className="text-muted">Practice trend</dt>
                    <dd>{practiceTrendLabel(practiceTrendFor(inj))}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Expected availability</dt>
                    <dd>{expectedAvailability(inj.health as HealthState)}</dd>
                  </div>
                  <div>
                    <dt className="text-muted">Downstream</dt>
                    <dd>{beneficiaries.length ? beneficiaries.join(", ") : "None stored"}</dd>
                  </div>
                </dl>
                <p className="mt-2 text-[11px] text-muted">
                  {player?.position as Position} · {TEAM_BY_ID[inj.teamId]?.abbr} · Sources: {inj.sources.join(" · ")}
                </p>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  options,
  raw,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  raw?: string[];
}) {
  const values = raw ?? options;
  return (
    <label className="text-[11px]">
      <span className="mb-1 block text-muted">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-line bg-card px-2 py-1.5 text-sm"
      >
        {options.map((labelText, index) => (
          <option key={values[index]} value={values[index]}>
            {labelText}
          </option>
        ))}
      </select>
    </label>
  );
}
