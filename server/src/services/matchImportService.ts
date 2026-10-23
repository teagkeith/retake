import { normalizeDeadlockMatch } from '../integrations/deadlock/deadlockAdapter.js';
import { getDeadlockMatch } from '../integrations/deadlock/deadlockApi.js';
import { prisma } from '../lib/prisma.js';

export async function importDeadlockMatch(matchId: number) {
  const rawMatch = await getDeadlockMatch(matchId);
  const match = normalizeDeadlockMatch(matchId, rawMatch);

  return prisma.$transaction(async (tx) => {
    await tx.game.upsert({
      where: { id: match.game },
      update: {},
      create: {
        id: match.game,
        name: 'Deadlock',
      },
    });

    const savedMatch = await tx.gameMatch.upsert({
      where: {
        gameId_externalMatchId: {
          gameId: match.game,
          externalMatchId: String(match.matchId),
        },
      },
      update: {
        durationSeconds: match.durationSeconds,
      },
      create: {
        gameId: match.game,
        externalMatchId: String(match.matchId),
        durationSeconds: match.durationSeconds,
      },
    });

    for (const player of match.players) {
      await tx.playerMatchStats.upsert({
        where: {
          gameMatchId_externalPlayerId: {
            gameMatchId: savedMatch.id,
            externalPlayerId: String(player.accountId),
          },
        },
        update: {
          kills: player.kills,
          deaths: player.deaths,
          assists: player.assists,
          stats: { heroId: player.heroId },
        },
        create: {
          gameMatchId: savedMatch.id,
          externalPlayerId: String(player.accountId),
          kills: player.kills,
          deaths: player.deaths,
          assists: player.assists,
          stats: { heroId: player.heroId },
        },
      });
    }

    return savedMatch;
  });
}
