import { prisma } from '../lib/prisma.js';

async function main() {
  const result = await prisma.proTeam.deleteMany({
    where: {
      gameId: 'valorant',
      externalSource: 'vlrgg',
      externalId: 'rotate-test-team',
      name: 'Rotate Test Team',
    },
  });

  console.log('Test teams deleted:', result.count);
}

main()
  .catch((error) => {
    console.error('Cleanup failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
