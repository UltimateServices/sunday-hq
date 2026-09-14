"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { GameCard } from "@/components/ds/GameCard";
import { PlayerCard } from "@/components/ds/PlayerCard";
import { HealthBadge } from "@/components/ds/badges";
import { Section } from "@/components/shared/Section";
import { PLAYER_BY_ID } from "@/data/week1/players";
import type { TeamField, TeamWorkspaceVM } from "@/lib/team-workspace";

const TABS = ["OVERVIEW", "OFFENSE", "DEFENSE", "PACE", "RED ZONE", "INJURIES", "PLAYERS", "MARKETS"] as const;

export function TeamWorkspace({ vm }: { vm: TeamWorkspaceVM }) {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const requested = params.get("tab")?.toUpperCase().replaceAll("_", " ");
  const tab = (TABS as readonly string[]).includes(requested ?? "")
    ? (requested as (typeof TABS)[number])
    : "OVERVIEW";

  function setTab(next: (typeof TABS)[number]) {
    const search = new URLSearchParams(params.toString());
    if (next === "OVERVIEW") search.delete("tab");
    else search.set("tab", next.replaceAll(" ", "_"));
    const query = search.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-1">
        {TABS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`action-btn ${tab === item ? "text-gold" : ""}`}
            aria-pressed={tab === item}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "OVERVIEW" ? (
        <div className="space-y-6">
          {vm.game && vm.matchup && vm.kickoff && vm.spread && vm.tier && vm.weatherImpact && vm.live ? (
            <GameCard
              id={vm.game.id}
              matchup={vm.matchup}
              kickoff={vm.kickoff}
              total={vm.game.total.value}
              spread={vm.spread}
              indoor={Boolean(vm.indoor)}
              tier={vm.tier}
              weatherImpact={vm.weatherImpact}
              live={vm.live}
            />
          ) : (
            <p className="text-sm text-muted">No Sunday game on this slate.</p>
          )}
          <FieldGrid rows={vm.overview} />
        </div>
      ) : null}

      {tab === "OFFENSE" ? (
        <div className="space-y-6">
          <FieldGrid rows={vm.offense} />
          {vm.qb ? (
            <Section title="QB">
              <PlayerCard
                id={vm.qb.id}
                name={vm.qb.name}
                team={vm.abbr}
                position="QB"
                health={vm.qb.health}
                note={vm.qb.note}
              />
            </Section>
          ) : null}
          <Section title="RB committee" lede="Role ESTIMATE from volume tag. Snap % DATA UNAVAILABLE.">
            {vm.committee.length === 0 ? (
              <p className="text-[14px] text-muted">No RBs stored for this team on the Week 1 desk.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {vm.committee.map((player) => (
                  <PlayerCard
                    key={player.id}
                    id={player.id}
                    name={`${player.name} · ${player.role}`}
                    team={vm.abbr}
                    position="RB"
                    health={player.health}
                    note={player.note}
                  />
                ))}
              </div>
            )}
          </Section>
          <Section title="Target tree" lede="Share is DATA UNAVAILABLE. Names are desk players, not invented percentages.">
            {vm.targets.length === 0 ? (
              <p className="text-[14px] text-muted">No WR/TE rows stored for this team.</p>
            ) : (
              <div className="grid gap-2 sm:grid-cols-2">
                {vm.targets.map((player) => (
                  <PlayerCard
                    key={player.id}
                    id={player.id}
                    name={player.name}
                    team={vm.abbr}
                    position={player.position}
                    health={player.health}
                    note={`Target share ${player.share}`}
                  />
                ))}
              </div>
            )}
          </Section>
        </div>
      ) : null}

      {tab === "DEFENSE" ? <FieldGrid rows={vm.defense} /> : null}
      {tab === "PACE" ? <FieldGrid rows={vm.pace} /> : null}
      {tab === "RED ZONE" ? <FieldGrid rows={vm.redZone} /> : null}

      {tab === "PLAYERS" ? (
        <Section title="Players">
          <div className="grid gap-2 sm:grid-cols-2">
            {vm.players.map((player) => (
              <PlayerCard
                key={player.id}
                id={player.id}
                name={player.name}
                team={vm.abbr}
                position={player.position}
                health={player.health}
                note={player.note}
              />
            ))}
          </div>
        </Section>
      ) : null}

      {tab === "INJURIES" ? (
        <Section title="Injuries">
          {vm.injuries.length === 0 ? (
            <p className="text-[14px] text-muted">No stored injury rows for this team.</p>
          ) : (
            <div className="space-y-2">
              {vm.injuries.map((row) => (
                <article key={row.id} className="surface p-4">
                  <HealthBadge state={row.health} />
                  <p className="mt-2 font-semibold">{PLAYER_BY_ID[row.playerId]?.name}</p>
                  <p className="text-[13px] text-muted">{row.headline}</p>
                </article>
              ))}
            </div>
          )}
        </Section>
      ) : null}

      {tab === "MARKETS" ? <FieldGrid rows={vm.markets} /> : null}
    </div>
  );
}

function FieldGrid({ rows }: { rows: TeamField[] }) {
  return (
    <dl className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
      {rows.map((row) => (
        <div key={row.label} className="surface p-3">
          <dt className="text-[12px] text-muted">{row.label}</dt>
          <dd className="mt-1 text-[15px] font-semibold">{row.value}</dd>
          {row.hint ? <p className="mt-1 text-[12px] leading-relaxed text-muted">{row.hint}</p> : null}
        </div>
      ))}
    </dl>
  );
}
