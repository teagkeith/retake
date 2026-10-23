
import 'dotenv/config';
import { prisma } from '../lib/prisma.js';

async function main() {
  const players = await prisma.proPlayer.findMany({
    where: {
      gameId: 'valorant',
      externalSource: 'balldontlie',
    },
    select: {
      id: true,
      displayName: true,
      externalPlayerId: true,
      verified: true,
    },
    orderBy: {
      externalPlayerId: 'asc',
    },
  });

  console.table(players);
  console.log(`Total VALORANT players: ${players.length}`);
}

main()
  .catch((error) => {
    console.error('Failed to retrieve players:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
