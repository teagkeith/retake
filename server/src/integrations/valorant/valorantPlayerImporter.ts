
export interface ImportedValorantPlayer {
  externalId: string;
  displayName: string;
}


import { prisma } from '../../lib/prisma.js';

export async function importValorantPlayer(
  player: ImportedValorantPlayer,
) {
  if (!player.externalId.trim() || !player.displayName.trim()) {
    throw new Error('Player must have an external ID and display name');
  }

  return prisma.proPlayer.upsert({
    where: {
      gameId_externalSource_externalPlayerId: {
        gameId: 'valorant',
        externalSource: 'balldontlie',
        externalPlayerId: player.externalId,
      },
    },

    create: {
      gameId: 'valorant',
      externalSource: 'balldontlie',
      externalPlayerId: player.externalId,
      displayName: player.displayName,
      verified: false,
    },

    update: {
      displayName: player.displayName,
    },
  });
}
