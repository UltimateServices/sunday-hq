import { Suspense } from "react";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/shared/PageHeader";
import { PageSkeleton } from "@/components/ds/Skeleton";
import { TeamWorkspace } from "@/components/teams/TeamWorkspace";
import { GAMES } from "@/data/week1/games";
import { TEAMS } from "@/data/week1/teams";
import { buildTeamWorkspace } from "@/lib/team-workspace";

export function generateStaticParams() {
  const ids = new Set(GAMES.flatMap((g) => [g.awayTeamId, g.homeTeamId]));
  return TEAMS.filter((t) => ids.has(t.id)).map((t) => ({ teamId: t.id }));
}

export default async function TeamDeepDive({ params }: PageProps<"/teams/[teamId]">) {
  const { teamId } = await params;
  const vm = buildTeamWorkspace(teamId);
  if (!vm) notFound();

  return (
    <div className="space-y-6">
      <PageHeader
        layer="Layer 3 · Deep Dive"
        title={vm.teamName}
        lede={`${vm.abbr} · ${vm.conference} ${vm.division}. Implied total from captured DK spread + total. Offense splits, pace, red zone, and listed markets stay DATA UNAVAILABLE — not invented.`}
      />
      <Suspense fallback={<PageSkeleton />}>
        <TeamWorkspace vm={vm} />
      </Suspense>
    </div>
  );
}
