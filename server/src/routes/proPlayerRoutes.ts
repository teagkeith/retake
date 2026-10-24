import { Router } from 'express';
import { prisma } from '../lib/prisma.js';

const router = Router();

// GET /api/pro-players/:playerId
router.get('/:playerId', async (req, res) => {
  try {
    const playerId = req.params.playerId;

    if (typeof playerId !== 'string') {
      res.status(400).json({ error: 'Invalid player ID' });
      return;
    }

    const player = await prisma.proPlayer.findUnique({
      where: {
        id: playerId,
      },
      select: {
        id: true,
        displayName: true,
        verified: true,
        externalPlayerId: true,
        teamObservations: {
          orderBy: {
            observedAt: 'desc',
          },
          take: 1,
          select: {
            observedAt: true,
            team: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    if (!player) {
      res.status(404).json({ error: 'Player not found' });
      return;
    }

    res.json({
      id: player.id,
      displayName: player.displayName,
      verified: player.verified,
      externalPlayerId: player.externalPlayerId,
      reportedTeam: player.teamObservations[0]?.team.name ?? null,
    });
  } catch (error) {
    console.error('Failed to fetch player:', error);
    res.status(500).json({ error: 'Failed to fetch player' });
  }
});

export default router;
