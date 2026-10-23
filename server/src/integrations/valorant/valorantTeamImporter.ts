import { prisma } from '../../lib/prisma.js';

export interface ImportedValorantTeam {
  externalId: string;
  name: string;
  shortName: string | null;
  region: string | null;
  logoUrl: string | null;
}



export async function importValorantTeam(
  team: ImportedValorantTeam,
) {
  if (!team.externalId.trim() || !team.name.trim()) {
    throw new Error('Team must have an external ID and name');
  }

  const savedTeam = await prisma.proTeam.upsert({
    where: {
      gameId_externalSource_externalId: {
        gameId: 'valorant',
        externalSource: 'balldontlie',
        externalId: team.externalId,
      },
    },

    create: {
      gameId: 'valorant',
      externalSource: 'balldontlie',
      externalId: team.externalId,
      name: team.name,
      shortName: team.shortName,
      region: team.region,
      logoUrl: team.logoUrl,
    },

    update: {
      name: team.name,
      shortName: team.shortName,
      region: team.region,
      logoUrl: team.logoUrl,
    },
  });

  return savedTeam;
}
