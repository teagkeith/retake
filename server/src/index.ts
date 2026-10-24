import cors from 'cors';
import express from 'express';
import { Prisma } from '../generated/prisma/client.js';
import { normalizeDeadlockMatch } from './integrations/deadlock/deadlockAdapter.js';
import { getDeadlockMatch } from './integrations/deadlock/deadlockApi.js';
import { prisma } from './lib/prisma.js';
import { validateDraft, validateSubmission } from './services/lineupValidation.js';

import { getLatestObservedRoster } from './services/proTeamRosterService.js';
import proPlayerRoutes from './routes/proPlayerRoutes.js';

const app = express();
app.use(
  cors({
    origin: 'http://localhost:5173',
  }),
);
const PORT = 3001;

// app.use('/api/pro-teams', proTeamRoutes);
app.use('/api/pro-players', proPlayerRoutes);

app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    application: 'Rotate API',
  });
});

// Retrieve all fantasy lineups
app.get('/api/lineups', async (_req, res) => {
  try {
    const lineups = await prisma.fantasyLineup.findMany();

    res.json(lineups);
  } catch (error) {
    console.error('Failed to retrieve lineups:', error);

    res.status(500).json({
      error: 'Database query failed',
    });
  }
});

// Retrieve a fantasy team and its roster
app.get('/api/teams/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await prisma.fantasyTeam.findUnique({
      where: {
        id: teamId,
      },
      include: {
        roster: {
          include: {
            proPlayer: {
              include: {
                game: true,
              },
            },
          },
        },
      },
    });

    if (!team) {
      res.status(404).json({
        error: 'Fantasy team not found',
      });
      return;
    }

    res.json({
      id: team.id,
      name: team.name,

      // Keep this for the existing Redux integration.
      rosterPlayerIds: team.roster.map((entry) => entry.proPlayerId),

      // Detailed player information from the database.
      players: team.roster.map((entry) => ({
        id: entry.proPlayer.id,
        displayName: entry.proPlayer.displayName,
        gameId: entry.proPlayer.gameId,
        gameName: entry.proPlayer.game.name,
        verified: entry.proPlayer.verified,
      })),
    });
  } catch (error) {
    console.error('Failed to retrieve fantasy team:', error);

    res.status(500).json({
      error: 'Could not retrieve fantasy team',
    });
  }
});

// Retrieve professional esports teams
app.get('/api/pro-teams', async (req, res) => {
  try {
    const gameId = req.query.gameId;

    if (typeof gameId !== 'string' || !gameId.trim()) {
      res.status(400).json({
        error: 'A valid gameId query parameter is required',
      });
      return;
    }

    const teams = await prisma.proTeam.findMany({
      where: {
        gameId,
      },
      select: {
        id: true,
        name: true,
        shortName: true,
        region: true,
        logoUrl: true,
      },
      orderBy: {
        name: 'asc',
      },
      take: 50,
    });

    res.json(teams);
  } catch (error) {
    console.error('Failed to retrieve professional teams:', error);

    res.status(500).json({
      error: 'Could not retrieve professional teams',
    });
  }
});

// Retrieve a professional esports team and its roster
app.get('/api/pro-teams/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;

    const team = await prisma.proTeam.findUnique({
      where: {
        id: teamId,
      },

      include: {
        memberships: {
          include: {
            player: true,
          },
        },
        playerObservations: {
          include: {
            player: true,
          },
          orderBy: {
            observedAt: 'desc',
          },
        },
      },
    });

    if (!team) {
      res.status(404).json({
        error: 'Professional team not found',
      });
      return;
    }
    const currentTeamObservations = await getLatestObservedRoster(team.id);

    res.json({
      id: team.id,
      name: team.name,
      shortName: team.shortName,
      region: team.region,
      logoUrl: team.logoUrl,

      players: team.memberships.map((membership) => ({
        id: membership.player.id,
        displayName: membership.player.displayName,
        verified: membership.player.verified,
        joinedAt: membership.joinedAt,
        leftAt: membership.leftAt,
      })),

      observedPlayers: currentTeamObservations.map((observation) => ({
        id: observation.player.id,
        displayName: observation.player.displayName,
        verified: observation.player.verified,
        source: observation.source,
        observedAt: observation.observedAt,
      })),
    });
  } catch (error) {
    console.error('Failed to retrieve professional team:', error);

    res.status(500).json({
      error: 'Could not retrieve professional team',
    });
  }
});

// Retrieve raw Deadlock match data
app.get('/api/deadlock/matches/:matchId', async (req, res) => {
  try {
    const matchId = Number(req.params.matchId);

    if (!Number.isSafeInteger(matchId) || matchId <= 0) {
      res.status(400).json({
        error: 'Invalid match ID',
      });
      return;
    }

    const match = await getDeadlockMatch(matchId);

    res.json(match);
  } catch (error) {
    console.error('Deadlock API error:', error);

    res.status(502).json({
      error: 'Could not retrieve Deadlock match',
    });
  }
});

// Retrieve normalized Deadlock match statistics
app.get('/api/deadlock/matches/:matchId/summary', async (req, res) => {
  const matchId = Number(req.params.matchId);

  if (!Number.isSafeInteger(matchId) || matchId <= 0) {
    res.status(400).json({
      error: 'Invalid match ID',
    });
    return;
  }

  try {
    const rawMatch = await getDeadlockMatch(matchId);
    const normalizedMatch = normalizeDeadlockMatch(matchId, rawMatch);

    res.json(normalizedMatch);
  } catch (error) {
    console.error('Failed to normalize Deadlock match:', error);

    res.status(502).json({
      error: 'Failed to retrieve or process Deadlock match',
    });
  }
});

// Create or update a fantasy lineup
app.post('/api/lineups', async (req, res) => {
  const { fantasyTeamId, scoringWeekId, starterPlayerIds, action } = req.body ?? {};

  // Validate incoming request structure.
  if (
    typeof fantasyTeamId !== 'string' ||
    !fantasyTeamId.trim() ||
    typeof scoringWeekId !== 'string' ||
    !scoringWeekId.trim() ||
    !Array.isArray(starterPlayerIds) ||
    !starterPlayerIds.every((id) => typeof id === 'string' && id.trim().length > 0) ||
    (action !== 'draft' && action !== 'submit')
  ) {
    res.status(400).json({
      error: 'Invalid lineup request',
    });
    return;
  }

  // Temporary scoring week configuration.
  // Later, scoring weeks will be retrieved from the database.
  const scoringWeek = {
    id: 'week-1',
    startsAt: new Date('2027-01-01T18:00:00Z'),
  };

  if (scoringWeekId !== scoringWeek.id) {
    res.status(400).json({
      error: 'Invalid scoring week',
    });
    return;
  }

  // Reject modifications once the scoring deadline has passed.
  if (Date.now() >= scoringWeek.startsAt.getTime()) {
    res.status(403).json({
      error: 'Lineup deadline has passed',
    });
    return;
  }

  try {
    // Retrieve the team's actual roster from MySQL.
    const team = await prisma.fantasyTeam.findUnique({
      where: {
        id: fantasyTeamId,
      },
      include: {
        roster: true,
      },
    });

    if (!team) {
      res.status(404).json({
        error: 'Fantasy team not found',
      });
      return;
    }

    const rosterPlayerIds = team.roster.map((player) => player.proPlayerId);

    // Validate selected players against roster ownership.
    const isValid =
      action === 'draft'
        ? validateDraft(rosterPlayerIds, starterPlayerIds)
        : validateSubmission(rosterPlayerIds, starterPlayerIds);

    if (!isValid) {
      res.status(400).json({
        error: 'Invalid lineup: check starter count, duplicates, and roster ownership',
      });
      return;
    }

    // Save the draft or submitted lineup.
    const savedLineup = await prisma.$transaction(async (tx) => {
      const existingLineup = await tx.fantasyLineup.findUnique({
        where: {
          fantasyTeamId_scoringWeekId: {
            fantasyTeamId,
            scoringWeekId,
          },
        },
      });

      // Explicitly locked lineups cannot be modified.
      if (existingLineup?.status === 'locked') {
        return null;
      }

      return tx.fantasyLineup.upsert({
        where: {
          fantasyTeamId_scoringWeekId: {
            fantasyTeamId,
            scoringWeekId,
          },
        },
        create: {
          fantasyTeamId,
          scoringWeekId,

          status: action === 'submit' ? 'submitted' : 'draft',

          // Only submitted players become official starters.
          starterPlayerIds: action === 'submit' ? starterPlayerIds : [],

          // Draft selections are stored separately.
          draftPlayerIds: action === 'draft' ? starterPlayerIds : Prisma.DbNull,
        },
        update:
          action === 'draft'
            ? {
                // Save unfinished edits without changing official starters.
                draftPlayerIds: starterPlayerIds,
              }
            : {
                // Commit the new official lineup.
                starterPlayerIds,
                draftPlayerIds: Prisma.DbNull,
                status: 'submitted',
              },
      });
    });

    if (!savedLineup) {
      res.status(409).json({
        error: 'This lineup is locked',
      });
      return;
    }

    res.json({
      message: 'Lineup saved successfully',
      lineup: savedLineup,
    });
  } catch (error) {
    console.error('Failed to save lineup:', error);

    res.status(500).json({
      error: 'Failed to save lineup',
    });
  }
});

// Retrieve a saved lineup for a particular team and scoring week
app.get('/api/lineups/:fantasyTeamId/:scoringWeekId', async (req, res) => {
  const { fantasyTeamId, scoringWeekId } = req.params;

  try {
    const lineup = await prisma.fantasyLineup.findUnique({
      where: {
        fantasyTeamId_scoringWeekId: {
          fantasyTeamId,
          scoringWeekId,
        },
      },
    });

    if (!lineup) {
      res.status(404).json({
        error: 'Lineup not found',
      });
      return;
    }

    res.json(lineup);
  } catch (error) {
    console.error('Failed to fetch lineup:', error);

    res.status(500).json({
      error: 'Failed to fetch lineup',
    });
  }
});

// Start the API server
app.listen(PORT, () => {
  console.log(`Rotate API running at http://localhost:${PORT}`);
});
