import { useEffect, useRef } from 'react';
import type { ProTeamDetails } from '../api/proTeamApi';

import './ProTeamModal.css';

interface ProTeamModalProps {
  team: ProTeamDetails;
  onClose: () => void;
}

export default function ProTeamModal({ team, onClose }: ProTeamModalProps) {
  const modalRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const onCloseRef = useRef(onClose);

  // Always use the latest close callback.
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;

    // Prevent the page behind the modal from scrolling.
    document.body.style.overflow = 'hidden';

    // Move keyboard focus into the dialog.
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusableElements = modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );

      if (!focusableElements?.length) {
        event.preventDefault();
        return;
      }

      const first = focusableElements[0];
      const last = focusableElements[focusableElements.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;

      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, []);

  return (
    <div
      className="proTeamModalBackdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        ref={modalRef}
        className="proTeamModal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="proTeamModalTitle"
        aria-describedby="proTeamModalDescription"
      >
        <header className="proTeamModalHeader">
          <div className="proTeamModalIdentity">
            <div className="proTeamBadge">
              {team.shortName ?? team.name.slice(0, 2).toUpperCase()}
            </div>

            <div>
              <h2 id="proTeamModalTitle">{team.name}</h2>
              <p>VALORANT · Professional Team</p>
            </div>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="proTeamModalClose"
            onClick={onClose}
            aria-label="Close team profile"
          >
            ×
          </button>
        </header>

        <div className="proTeamModalBody">
          <h3>Player Affiliations</h3>

          <p id="proTeamModalDescription">Latest reported affiliations from our data providers.</p>

          {team.observedPlayers.length === 0 ? (
            <p>No player affiliations recorded yet.</p>
          ) : (
            <div className="proTeamModalPlayers">
              {team.observedPlayers.map((player) => (
                <div className="proTeamModalPlayer" key={player.id}>
                  <strong>{player.displayName}</strong>
                  <span>Source: {player.source}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
