import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { TeamWorkspace } from "@/components/teams/TeamWorkspace";
import { GAMES } from "@/data/week1/games";
import { INJURIES, injuryForPlayer } from "@/data/week1/injuries";
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
  const injuries = INJURIES.filter((row) => row.teamId === teamId);

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 3 · Deep Dive"
        title={`${team.city} ${team.name}`}
        lede={`${team.abbr} · ${team.conference} ${team.division}. Overview is live. Offense / defense / pace / red zone / markets stay PENDING.`}
      />
      <TeamWorkspace
        teamName={`${team.city} ${team.name}`}
        abbr={team.abbr}
        game={game ?? null}
        matchup={game ? `${TEAM_BY_ID[game.awayTeamId].abbr} @ ${TEAM_BY_ID[game.homeTeamId].abbr}` : undefined}
        kickoff={game?.kickoffLabel}
        spread={game ? spreadLabel(TEAM_BY_ID[game.homeTeamId].abbr, game.spreadHome.value) : undefined}
        indoor={game?.indoor}
        tier={
          game
            ? environmentFor(game, {
                qbDowngrade: game.id === "atl-pit",
                weatherRisk: game.id === "cle-jax",
              })
            : undefined
        }
        weatherImpact={wx?.impact ?? "UNKNOWN"}
        live={game ? liveStatus(game) : undefined}
        players={players.map((player) => ({
          id: player.id,
          name: player.name,
          position: player.position,
          health: injuryForPlayer(player.id)?.health ?? "NO_KNOWN_LIMITATION",
          note: player.notes,
        }))}
        injuries={injuries}
      />
    </div>
  );
}
