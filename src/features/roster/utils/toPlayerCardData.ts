import type { ProPlayer } from '../../players/types/ProPlayer';
import type { PlayerPerformance } from '../types/PlayerPerformance';

export interface PlayerCardData {
  id: string;
  name: string;
  team: string;
  role: string;
  kills: number | null;
  deaths: number | null;
  assists: number | null;
  fantasyPoints: number | null;
}

export function toPlayerCardData(
  player: ProPlayer,
  performance: PlayerPerformance | null,
  teamName: string,
): PlayerCardData {
  const validPerformance = performance?.playerId === player.id ? performance : null;
  return {
    id: player.id,
    name: player.name,
    team: teamName,
    role: player.role,
    kills: validPerformance?.kills ?? null,
    deaths: validPerformance?.deaths ?? null,
    assists: validPerformance?.assists ?? null,
    fantasyPoints: validPerformance?.fantasyPoints ?? null,
  };
}
