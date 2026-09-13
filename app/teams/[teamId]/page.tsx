import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { PlayerCard } from "@/components/ds/PlayerCard";
import { GameCard } from "@/components/ds/GameCard";
import { Section } from "@/components/shared/Section";
import { GAMES } from "@/data/week1/games";
import { injuryForPlayer } from "@/data/week1/injuries";
import { SUNDAY_PLAYERS } from "@/data/week1/players";
import { TEAMS, TEAM_BY_ID } from "@/data/week1/teams";
import { WEATHER_BY_GAME } from "@/data/week1/weather";
import { environmentFor } from "@/lib/team-totals";
import { liveStatus } from "@/lib/game-window";
import { spreadLabel } from "@/lib/format";

export function generateStaticParams() {
  const ids = new Set(GAMES.flatMap((g) => [g.awayTeamId, g.homeTeamId]));
  return TEAMS.filter((t) => ids.has(t.id)).map((t) => ({ teamId: t.id }));
}

export default async function TeamDeepDive({ params }: PageProps<"/teams/[teamId]">) {
  const { teamId } = await params;
  const team = TEAMS.find((t) => t.id === teamId);
  if (!team) notFound();
  const game = GAMES.find((g) => g.awayTeamId === teamId || g.homeTeamId === teamId);
  const players = SUNDAY_PLAYERS.filter((p) => p.teamId === teamId);
  const wx = game ? WEATHER_BY_GAME[game.id] : undefined;

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 3 · Deep Dive"
        title={`${team.city} ${team.name}`}
        lede={`${team.abbr} · ${team.conference} ${team.division}. Team profile skeleton — matchup engine PENDING.`}
      />
      {game ? (
        <GameCard
          id={game.id}
          matchup={`${TEAM_BY_ID[game.awayTeamId].abbr} @ ${TEAM_BY_ID[game.homeTeamId].abbr}`}
          kickoff={game.kickoffLabel}
          total={game.total.value}
          spread={spreadLabel(TEAM_BY_ID[game.homeTeamId].abbr, game.spreadHome.value)}
          indoor={game.indoor}
          tier={environmentFor(game, {
            qbDowngrade: game.id === "atl-pit",
            weatherRisk: game.id === "cle-jax",
          })}
          weatherImpact={wx?.impact ?? "UNKNOWN"}
          live={liveStatus(game)}
        />
      ) : (
        <p className="text-sm text-muted">No Sunday game on this slate.</p>
      )}
      <Section title="Players">
        <div className="grid gap-2 sm:grid-cols-2">
          {players.map((player) => (
            <PlayerCard
              key={player.id}
              id={player.id}
              name={player.name}
              team={team.abbr}
              position={player.position}
              health={injuryForPlayer(player.id)?.health ?? "NO_KNOWN_LIMITATION"}
              note={player.notes}
            />
          ))}
        </div>
      </Section>
      <p className="text-xs text-muted">
        <Link href="/games" className="text-info hover:underline">
          All games
        </Link>
      </p>
    </div>
  );
}
