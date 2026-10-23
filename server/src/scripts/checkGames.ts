import { prisma } from '../lib/prisma.js';

async function main() {
  console.log('Script started!');

  const game = await prisma.game.upsert({
    where: {
      id: 'valorant',
    },
    create: {
      id: 'valorant',
      name: 'VALORANT',
    },
    update: {
      name: 'VALORANT',
    },
  });

  console.log('Saved game:', game);

  const games = await prisma.game.findMany();
  console.table(games);
}

main()
  .catch((error) => {
    console.error('Script failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
