import { useEffect } from 'react';
import './ProPlayerModal.css';

interface ProPlayerModalProps {
  player: {
    id: string;
    displayName: string;
    verified: boolean;
    reportedTeam: string | null;
  };
  onClose: () => void;
}

export default function ProPlayerModal({ player, onClose }: ProPlayerModalProps) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = 'hidden';

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onClose();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="proPlayerModalOverlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="proPlayerModal"
        role="dialog"
        aria-modal="true"
        aria-label={`${player.displayName} player profile`}
      >
        <header className="proPlayerModalHeader">
          <div>
            <span className="proPlayerModalEyebrow">VALORANT PLAYER</span>

            <h2>{player.displayName}</h2>

            <p>{player.reportedTeam ?? 'No reported team'}</p>
          </div>

          <button
            type="button"
            className="proPlayerModalClose"
            onClick={onClose}
            aria-label="Close player profile"
          >
            ×
          </button>
        </header>

        <section className="proPlayerModalBody">
          <h3>Player information</h3>

          <div className="proPlayerModalInfo">
            <div>
              <span>Identity status</span>
              <strong>{player.verified ? 'Verified' : 'Not independently verified'}</strong>
            </div>

            <div>
              <span>Reported team</span>
              <strong>{player.reportedTeam ?? 'Unknown'}</strong>
            </div>
          </div>

          <div className="proPlayerModalStats">
            <h3>Fantasy statistics</h3>

            <p>Match statistics will appear here once we integrate competitive match data.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
