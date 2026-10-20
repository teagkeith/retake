import PlayerCard from '../components/PlayerCard';
import { players } from '../data/players';
import type { Player } from '../types/Player';

interface RosterPageProps {
  starterIds: number[];
  toggleStarter: (playerId: number) => void;
  saveLineup: () => void;
  lineupMatch: boolean;
  err: string;
  savedPlayers: Player[];
}

function RosterPage({
  starterIds,
  toggleStarter,
  saveLineup,
  lineupMatch,
  err,
  savedPlayers,
}: RosterPageProps) {
  return (
    <>
      <div className="rosterContent">
        <p>{err}</p>
        {players.map((player) => (
          <PlayerCard
            key={player.id}
            player={player}
            isStarter={starterIds.includes(player.id)}
            onToggleStarter={() => toggleStarter(player.id)}
          />
        ))}
      </div>
      {lineupMatch ? (
        <p className="status-saved">Lineup is up to date</p>
      ) : (
        <p className="status-warning">You have unsaved changes</p>
      )}

      <div className="savedLineup">
        {savedPlayers.map((player) => (
          <p key={player.id}>
            {player.name} - {player.team} - {player.fantasyPoints}
          </p>
        ))}
      </div>
      <button onClick={saveLineup} disabled={lineupMatch || starterIds.length !== 5}>
        Save Lineup
      </button>
    </>
  );
}

export default RosterPage;
