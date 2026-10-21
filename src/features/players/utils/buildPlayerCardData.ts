import type { ProPlayer } from '../types/ProPlayer';
import type { ProTeam } from '../types/ProTeam';
import type { PlayerPerformance } from '../types/PlayerPerformance';

import { getProTeamById } from './getProTeamById';
import { toPlayerCardData, type PlayerCardData } from './toPlayerCardData';

export function buildPlayerCardData(
  players: ProPlayer[],
  teams: ProTeam[],
  performances: PlayerPerformance[],
  scoringWeekId: string,
): PlayerCardData[] {
  return players.map((player) => {
    const team = getProTeamById(teams, player.teamId);

    if (!team) {
      throw new Error(
        `Professional team with ID "${player.teamId}" could not be found for player "${player.id}".`,
      );
    }
    const performance =
      performances.find(
        (record) => record.playerId === player.id && record.scoringWeekId === scoringWeekId,
      ) ?? null;

    return toPlayerCardData(player, performance, team.name);
  });
}