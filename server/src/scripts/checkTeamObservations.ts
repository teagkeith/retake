
import 'dotenv/config';
import { prisma } from '../lib/prisma.js';

async function main() {
  const observations = await prisma.proTeamObservation.findMany({
    where: {
      source: 'balldontlie',
    },
    include: {
      player: true,
      team: true,
    },
    orderBy: {
      observedAt: 'desc',
    },
  });

  console.table(
    observations.map((observation) => ({
      player: observation.player.displayName,
      team: observation.team.name,
      observedAt: observation.observedAt,
    })),
  );

  console.log(`Total observations: ${observations.length}`);
}

main()
  .catch((error) => {
    console.error('Failed to retrieve team observations:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
