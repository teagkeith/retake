import type { Player } from "../types/Player";


interface PlayerCardProps {
    player: Player;
    isStarter: boolean;
    onToggleStarter: () => void;
}

function PlayerCard({player, isStarter, onToggleStarter}: PlayerCardProps) {
    return(
        <div className="playerCard">
            <p>Name: {player.name}</p>
            <p>Team: {player.team}</p>
            <p>Role: {player.role}</p>
            <p>Points: {player.fantasyPoints}</p>
            <button onClick={() => onToggleStarter()}>{isStarter ? "Starter" : "Bench"}</button>
        </div>
    )
}

export default PlayerCard;