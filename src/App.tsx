import { useEffect, useState } from 'react';

import { fetchFantasyTeam } from './features/league/api/fantasyTeamApi';

import { useAppDispatch, useAppSelector } from './app/hooks';

import {
  loadFantasyTeam,
  selectScoringWeek,
  toggleStarter,
  submitCurrentLineup,
  saveDraft,
  lockCurrentLineup,
} from './features/roster/store/lineupSlice';

import {
  selectRosterPlayerIds,
  selectStarterIds,
  selectLineupError,
  selectLineupMatch,
  selectSavedPlayers,
  selectDraftSaved,
} from './features/roster/store/lineSelectors';

import './App.css';
import OverviewPage from './features/dashboard/pages/OverviewPage';
import RosterPage from './features/roster/components/RosterPage';
import AppLayout from './layouts/AppLayout';

const activeScoringWeek = {
  id: 'week-1',
  startsAt: '2027-01-01T18:00:00Z',
};

function App() {
  const [activeTab, setActiveTab] = useState<'overview' | 'roster'>('overview');
  const [teamLoading, setTeamLoading] = useState(true);
  const [teamError, setTeamError] = useState(''); 


  const dispatch = useAppDispatch();
  const starterIds = useAppSelector(selectStarterIds);
  const err = useAppSelector(selectLineupError);

  const lineupMatch = useAppSelector(selectLineupMatch);

  const savedPlayers = useAppSelector(selectSavedPlayers);
  const rosterPlayerIds = useAppSelector(selectRosterPlayerIds);

  const draftSaved = useAppSelector(selectDraftSaved);

  const [currentTime, setCurrentTime] = useState(() => new Date().toISOString());
  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentTime(new Date().toISOString());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  const isLineupLocked =
    new Date(currentTime).getTime() >= new Date(activeScoringWeek.startsAt).getTime();

    useEffect(() => {
    let cancelled = false;

    async function initializeTeam() {
      try {
        const fantasyTeam = await fetchFantasyTeam('fantasy-team-1');

        if (cancelled) return;

        dispatch(
          loadFantasyTeam({
            fantasyTeamId: fantasyTeam.id,
            rosterPlayerIds: fantasyTeam.rosterPlayerIds,
          }),
        );

        dispatch(selectScoringWeek(activeScoringWeek.id));
        setTeamError('');
      } catch (error) {
        if (cancelled) return;

        setTeamError(
          error instanceof Error ? error.message : 'Could not load fantasy team.',
        );
      } finally {
        if (!cancelled) setTeamLoading(false);
      }
    }

    void initializeTeam();

    return () => {
      cancelled = true;
    };
  }, [dispatch]);

  useEffect(() => {
    if (!isLineupLocked) return;

    dispatch(
      lockCurrentLineup({
        scoringWeekStartsAt: activeScoringWeek.startsAt,
        currentTime: new Date().toISOString(),
      }),
    );
  }, [dispatch, isLineupLocked]);

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="leagueContent">
        {activeTab === 'overview' && <OverviewPage />}
        {activeTab === 'roster' && teamLoading && (
            <p role="status">Loading your fantasy roster...</p>
          )}

        {activeTab === 'roster' && !teamLoading && teamError && (
            <p role="alert">{teamError}</p>
          )}

        {activeTab === 'roster' && !teamLoading && !teamError && (
            <RosterPage
            starterIds={starterIds}
            toggleStarter={(playerId) =>
              dispatch(
                toggleStarter({
                  playerId,
                  scoringWeekStartsAt: activeScoringWeek.startsAt,
                  currentTime: new Date().toISOString(),
                }),
              )
            }
            saveDraft={() =>
              dispatch(
                saveDraft({
                  scoringWeekStartsAt: activeScoringWeek.startsAt,
                  currentTime: new Date().toISOString(),
                }),
              )
            }
            saveLineup={() =>
              dispatch(
                submitCurrentLineup({
                  scoringWeekStartsAt: activeScoringWeek.startsAt,
                  currentTime: new Date().toISOString(),
                }),
              )
            }
            lineupMatch={lineupMatch}
            err={err}
            savedPlayers={savedPlayers}
            rosterPlayerIds={rosterPlayerIds}
            draftSaved={draftSaved}
            isLineupLocked={isLineupLocked}
          />
        )}
      </div>
    </AppLayout>
  );
}

export default App;
