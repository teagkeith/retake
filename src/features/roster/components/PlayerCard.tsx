import type { PlayerCardData } from '../../players/utils/toPlayerCardData';
import './PlayerCard.css';
import { UserRound } from 'lucide-react';

interface PlayerCardProps {
  player: PlayerCardData;
  isStarter: boolean;
  onToggleStarter: () => void;
  disabled?: boolean;
}

function PlayerCard({ player, isStarter, onToggleStarter, disabled = false }: PlayerCardProps) {
  return (
    <div className={`playerCard ${isStarter ? 'selectedStarter' : ''}`}>
      <span className="playerStatus">{isStarter ? 'STARTER' : 'BENCH'}</span>
      <div className="playerIdentity">
        <div className="playerAvatar">
          <UserRound size={20} />
        </div>
        <div className="playerDetails">
          <p className="playerName">{player.name}</p>
          <p className="playerTeam">{player.team}</p>
          <p className="playerRole">{player.role}</p>
        </div>
      </div>
      <div className="playerCardFooter">
        <div className="playerFantasyPoints">
          <span>FANTASY POINTS</span>
          <p className="playerPoints">{player.fantasyPoints ?? '—'}</p>
        </div>

        <button type="button" onClick={onToggleStarter} disabled={disabled}>
          {isStarter ? 'Move to Bench' : 'Set Starter'}
        </button>
      </div>
    </div>
  );
}

export default PlayerCard;
