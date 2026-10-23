import 'dotenv/config';
import { prisma } from '../lib/prisma.js';

async function main() {
  const teams = await prisma.proTeam.findMany({
    where: {
      gameId: 'valorant',
      externalSource: 'balldontlie',
      externalId: '1010',
    },
    select: {
      id: true,
      name: true,
      shortName: true,
    },
  });

  console.table(teams);
}

main()
  .catch((error) => {
    console.error('Failed to retrieve teams:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
