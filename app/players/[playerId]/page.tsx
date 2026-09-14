import Link from "next/link";
import { notFound } from "next/navigation";
import { DataStatus } from "@/components/shared/DataStatus";
import { HealthBadge } from "@/components/shared/HealthBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { PlayerCard } from "@/components/ds/PlayerCard";
import { PropCard } from "@/components/shared/PropCard";
import { Section } from "@/components/shared/Section";
import { WhyDrawer } from "@/components/shared/WhyDrawer";
import { FANTASY_BY_PLAYER } from "@/data/week1/fantasy";
import { GAMES } from "@/data/week1/games";
import { injuryForPlayer } from "@/data/week1/injuries";
import { SUNDAY_PLAYERS } from "@/data/week1/players";
import { TEAM_BY_ID } from "@/data/week1/teams";
import { getWeekCatalog } from "@/lib/catalog";
import { formatMeasured } from "@/lib/format";
import { toPropView } from "@/lib/prop-view";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return SUNDAY_PLAYERS.map((player) => ({ playerId: player.id }));
}

export default async function PlayerDeepDive({ params }: PageProps<"/players/[playerId]">) {
  const { playerId } = await params;
  const player = SUNDAY_PLAYERS.find((p) => p.id === playerId);
  if (!player) notFound();

  const catalog = await getWeekCatalog();
  const team = TEAM_BY_ID[player.teamId];
  const game = catalog.games.find((g) => g.awayTeamId === player.teamId || g.homeTeamId === player.teamId) ?? GAMES.find((g) => g.awayTeamId === player.teamId || g.homeTeamId === player.teamId);
  const inj = injuryForPlayer(player.id);
  const fan = FANTASY_BY_PLAYER[player.id];
  const props = catalog.props.filter((p) => p.playerId === player.id).map((p) => toPropView(p));
  const primary = props[0];

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 3 · Deep Dive"
        title={player.name}
        lede={`${team.abbr} ${player.position}${player.depth ? ` · depth ${player.depth}` : ""}. Four lenses stay separate.`}
      />
      <PlayerCard
        id={player.id}
        name={player.name}
        team={team.abbr}
        position={player.position}
        health={inj?.health ?? "NO_KNOWN_LIMITATION"}
        projection={fan?.ppr}
        note={player.notes}
      />
      <div className="flex flex-wrap gap-2">
        <HealthBadge state={inj?.health ?? "NO_KNOWN_LIMITATION"} />
        {inj ? <DataStatus quality={inj.quality} /> : null}
        {game ? (
          <Link href={`/games/${game.id}`} className="text-sm text-info hover:underline">
            {TEAM_BY_ID[game.awayTeamId].abbr} @ {TEAM_BY_ID[game.homeTeamId].abbr}
          </Link>
        ) : (
          <span className="text-sm text-muted">No Sunday game mapping</span>
        )}
      </div>
      {player.notes ? <p className="text-sm text-muted">{player.notes}</p> : null}

      {catalog.matchups.find((row) => row.playerId === player.id) ? (
        <Section title="Matchup engine">
          {(() => {
            const grade = catalog.matchups.find((row) => row.playerId === player.id)!;
            return (
              <article className="rounded-lg border border-line bg-card p-3">
                <p className="num text-xl text-gold">{grade.overall.value}</p>
                <p className="text-sm text-muted">{grade.note}</p>
                <div className="mt-3 grid grid-cols-2 gap-2">
                  {grade.factors.map((factor) => (
                    <div key={factor.id} className="rounded-md border border-line bg-bg-elev p-2">
                      <p className="text-[10px] text-muted uppercase">{factor.label}</p>
                      <p className="num text-sm">{factor.score ?? "—"}</p>
                      <p className="text-[11px] text-muted">{factor.note}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-3">
                  <WhyDrawer title={`${player.name} matchup`} lenses={grade.lenses} sections={grade.why} />
                </div>
              </article>
            );
          })()}
        </Section>
      ) : null}

      {inj ? (
        <Section title="Health">
          <p className="text-sm">{inj.detail}</p>
          <p className="mt-2 text-xs text-muted">Sources: {inj.sources.join(" · ")}</p>
        </Section>
      ) : (
        <Section title="Health">
          <p className="text-sm">
            No injury row in the Week 1 seed. Rendered as NO KNOWN LIMITATION — never “100% healthy”.
          </p>
        </Section>
      )}

      <Section title="Fantasy placeholder">
        {fan ? (
          <div className="grid grid-cols-3 gap-2">
            <Tile label="PPR" value={formatMeasured(fan.ppr)} />
            <Tile label="Half" value={formatMeasured(fan.halfPpr)} />
            <Tile label="Std" value={formatMeasured(fan.standard)} />
          </div>
        ) : (
          <p className="text-sm text-muted">DATA UNAVAILABLE — no placeholder projection stored for this player.</p>
        )}
        {fan ? <p className="mt-2 text-sm text-muted">{fan.note}</p> : null}
      </Section>

      <Section title="Why">
        <WhyDrawer
          title={player.name}
          lenses={
            primary?.lenses ?? {
              GOOD_PLAYER: "UNKNOWN",
              GOOD_MATCHUP: "UNKNOWN",
              GOOD_PROJECTION: "UNKNOWN",
              GOOD_BET: "UNKNOWN",
            }
          }
          sections={primary?.whySections}
          why={primary?.why ?? ["No seeded prop. Deep-dive route exists so research is not blocked."]}
          risks={primary?.risks ?? ["Do not invent a line or a bet."]}
        />
      </Section>

      <Section title="Props">
        {props.length === 0 ? (
          <p className="text-sm text-muted">No seeded props. Route kept. Numbers are not fabricated.</p>
        ) : (
          <div className="grid gap-2 lg:grid-cols-2">
            {props.map((view) => (
              <PropCard key={view.id} view={view} />
            ))}
          </div>
        )}
      </Section>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-line bg-card p-3">
      <p className="text-[10px] text-muted uppercase">{label}</p>
      <p className="num text-xl text-gold">{value}</p>
    </div>
  );
}
