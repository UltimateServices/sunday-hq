import Link from "next/link";
import { notFound } from "next/navigation";
import { DataStatus } from "@/components/shared/DataStatus";
import { HealthBadge } from "@/components/shared/HealthBadge";
import { PageHeader } from "@/components/shared/PageHeader";
import { PlayerCard } from "@/components/ds/PlayerCard";
import { PlayerTabs } from "@/components/players/PlayerTabs";
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
import { PROPS } from "@/data/week1/props";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return SUNDAY_PLAYERS.map((player) => ({ playerId: player.id }));
}

export default async function PlayerDeepDive({ params }: PageProps<"/players/[playerId]">) {
  const { playerId } = await params;
  const player = SUNDAY_PLAYERS.find((row) => row.id === playerId);
  if (!player) notFound();

  const catalog = await getWeekCatalog();
  const team = TEAM_BY_ID[player.teamId];
  const game =
    catalog.games.find((row) => row.awayTeamId === player.teamId || row.homeTeamId === player.teamId) ??
    GAMES.find((row) => row.awayTeamId === player.teamId || row.homeTeamId === player.teamId);
  const inj = injuryForPlayer(player.id);
  const fan = FANTASY_BY_PLAYER[player.id];
  const source = catalog.props.length > 0 ? catalog.props : PROPS;
  const props = source.filter((row) => row.playerId === player.id).map((row) => toPropView(row));
  const primary = props[0];
  const grade = catalog.matchups.find((row) => row.playerId === player.id);

  const overview = (
    <div className="space-y-6">
      {inj ? (
        <Section title="Health">
          <p className="text-[14px]">{inj.detail}</p>
          <p className="mt-2 text-[12px] text-muted">Sources: {inj.sources.join(" · ")}</p>
        </Section>
      ) : (
        <Section title="Health">
          <p className="text-[14px]">No injury row in the Week 1 seed. Rendered as NO KNOWN LIMITATION — never “100% healthy”.</p>
        </Section>
      )}
      <Section title="Overview">
        {fan ? (
          <div className="grid grid-cols-3 gap-2">
            <Tile label="PPR" value={formatMeasured(fan.ppr)} />
            <Tile label="Half" value={formatMeasured(fan.halfPpr)} />
            <Tile label="Std" value={formatMeasured(fan.standard)} />
          </div>
        ) : (
          <p className="text-[14px] text-muted">DATA UNAVAILABLE — no placeholder projection stored for this player.</p>
        )}
        {fan ? <p className="mt-2 text-[13px] text-muted">{fan.note}</p> : null}
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
    </div>
  );

  const propsPanel = (
    <Section title="Props">
      {props.length === 0 ? (
        <p className="text-[14px] text-muted">No seeded props. Route kept. Numbers are not fabricated.</p>
      ) : (
        <div className="grid gap-2 lg:grid-cols-2">
          {props.map((view) => (
            <PropCard key={view.id} view={view} />
          ))}
        </div>
      )}
    </Section>
  );

  const matchups = grade ? (
    <Section title="Matchup engine">
      <article className="surface p-4">
        <p className="num text-[28px] font-semibold">{grade.overall.value}</p>
        <p className="text-[14px] text-muted">{grade.note}</p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {grade.factors.map((factor) => (
            <div key={factor.id} className="surface p-3">
              <p className="text-[11px] text-muted uppercase">{factor.label}</p>
              <p className="num text-[15px]">{factor.score ?? "—"}</p>
              <p className="text-[12px] text-muted">{factor.note}</p>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <WhyDrawer title={`${player.name} matchup`} lenses={grade.lenses} sections={grade.why} />
        </div>
      </article>
    </Section>
  ) : (
    <Section title="Matchup">
      <p className="text-[14px] text-muted">Matchup row PENDING for this player. Board stays.</p>
    </Section>
  );

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
          <Link href={`/games/${game.id}`} className="text-[14px] text-info hover:underline">
            {TEAM_BY_ID[game.awayTeamId].abbr} @ {TEAM_BY_ID[game.homeTeamId].abbr}
          </Link>
        ) : (
          <span className="text-[14px] text-muted">No Sunday game mapping</span>
        )}
      </div>
      {player.notes ? <p className="text-[14px] text-muted">{player.notes}</p> : null}
      <PlayerTabs overview={overview} props={propsPanel} matchups={matchups} />
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="surface p-4">
      <p className="text-[11px] text-muted uppercase">{label}</p>
      <p className="num text-[22px] font-semibold">{value}</p>
    </div>
  );
}
