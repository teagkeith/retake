
import { prisma } from '../lib/prisma.js';


export function filterLatestTeamObservations<
  T extends {
    playerId: string;
    teamId: string;
    observedAt: Date;
    id: string;
  },
>(observations: T[], teamId: string): T[] {
  const sorted = [...observations].sort(
    (a, b) =>
      b.observedAt.getTime() - a.observedAt.getTime() ||
      b.id.localeCompare(a.id),
  );

  const seenPlayers = new Set<string>();

  return sorted.filter((observation) => {
    if (seenPlayers.has(observation.playerId)) {
      return false;
    }

    seenPlayers.add(observation.playerId);

    return observation.teamId === teamId;
  });
}



export async function getLatestObservedRoster(teamId: string) {
  // Find players who have been observed on this team.
  const playerIds = await prisma.proTeamObservation.findMany({
    where: {
      teamId,
      source: 'balldontlie',
    },
    select: {
      playerId: true,
    },
    distinct: ['playerId'],
  });

  if (playerIds.length === 0) {
    return [];
  }

  // Retrieve observations for those players, including transfers.
  const observations = await prisma.proTeamObservation.findMany({
    where: {
      source: 'balldontlie',
      playerId: {
        in: playerIds.map((entry) => entry.playerId),
      },
    },
    include: {
      player: true,
    },
    orderBy: [
      { observedAt: 'desc' },
      { id: 'desc' },
    ],
  });

  return filterLatestTeamObservations(observations, teamId);
}
