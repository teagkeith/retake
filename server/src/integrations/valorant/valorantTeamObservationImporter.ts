
export interface ValorantTeamObservation {
  playerExternalId: string;
  teamExternalId: string;
  teamName: string;
  teamShortName: string | null;
}


import { prisma } from '../../lib/prisma.js';
import { importValorantTeam } from './valorantTeamImporter.js';

export async function importValorantTeamObservation(
  observation: ValorantTeamObservation,
) {
  const player = await prisma.proPlayer.findUnique({
    where: {
      gameId_externalSource_externalPlayerId: {
        gameId: 'valorant',
        externalSource: 'balldontlie',
        externalPlayerId: observation.playerExternalId,
      },
    },
  });

  if (!player) {
    throw new Error('Player must be imported before their team observation');
  }

  const team = await importValorantTeam({
    externalId: observation.teamExternalId,
    name: observation.teamName,
    shortName: observation.teamShortName,
    region: null,
    logoUrl: null,
  });

  
  // Check the most recent observation from this provider.
  const latestObservation = await prisma.proTeamObservation.findFirst({
    where: {
      playerId: player.id,
      source: 'balldontlie',
    },
    orderBy: {
      observedAt: 'desc',
    },
  });

  // Don't create another record if the team hasn't changed.
  if (latestObservation?.teamId === team.id) {
    return latestObservation;
  }

  // Save a new observation when the reported team changes.
  return prisma.proTeamObservation.create({
    data: {
      playerId: player.id,
      teamId: team.id,
      source: 'balldontlie',
    },
  });

}

