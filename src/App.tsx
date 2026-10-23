import { useEffect, useState } from 'react';

import {
  fetchFantasyTeam,
  type FantasyPlayer,
} from './features/league/api/fantasyTeamApi';

import { useAppDispatch, useAppSelector } from './app/hooks';

import {
  loadFantasyTeam,
  selectScoringWeek,
  toggleStarter,
  submitCurrentLineup,
  saveDraft,
  lockCurrentLineup,
  hydrateSavedLineup,
} from './features/roster/store/lineupSlice';

import {
  selectRosterPlayerIds,
  selectStarterIds,
  selectLineupError,
  selectLineupMatch,
  selectSavedStarterIds,
  selectDraftSaved,
  selectIsLineupFinalized,
} from './features/roster/store/lineSelectors';

import { fetchSavedLineup, saveLineup } from './features/roster/api/lineupApi';

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
  const [teamPlayers, setTeamPlayers] = useState<FantasyPlayer[]>([]);


  const dispatch = useAppDispatch();
  const starterIds = useAppSelector(selectStarterIds);
  const err = useAppSelector(selectLineupError);

  const lineupMatch = useAppSelector(selectLineupMatch);

  const savedStarterIds = useAppSelector(selectSavedStarterIds);
  const rosterPlayerIds = useAppSelector(selectRosterPlayerIds);
const isLineupFinalized = useAppSelector(selectIsLineupFinalized);
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

      setTeamPlayers(fantasyTeam.players);

      dispatch(
        loadFantasyTeam({
          fantasyTeamId: fantasyTeam.id,
          rosterPlayerIds: fantasyTeam.rosterPlayerIds,
        }),
      );

      dispatch(selectScoringWeek(activeScoringWeek.id));

      // Restore an existing lineup from MySQL.
      const savedLineup = await fetchSavedLineup(
        fantasyTeam.id,
        activeScoringWeek.id,
      );

      if (cancelled) return;

      if (savedLineup) {
        dispatch(hydrateSavedLineup(savedLineup));
      }

      setTeamError('');
    } catch (error) {
      if (cancelled) return;

      setTeamError(
        error instanceof Error
          ? error.message
          : 'Could not load fantasy team.',
      );
    } finally {
      if (!cancelled) {
        setTeamLoading(false);
      }
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

  const handleSaveDraft = async () => {
  try {
    const savedLineup = await saveLineup({
      fantasyTeamId: 'fantasy-team-1',
      scoringWeekId: activeScoringWeek.id,
      starterPlayerIds: starterIds,
      action: 'draft',
    });

    dispatch(hydrateSavedLineup(savedLineup));
  } catch (error) {
    console.error('Failed to save draft:', error);
  }
};


const handleSubmitLineup = async () => {
  try {
    const submittedLineup = await saveLineup({
      fantasyTeamId: 'fantasy-team-1',
      scoringWeekId: activeScoringWeek.id,
      starterPlayerIds: starterIds,
      action: 'submit',
    });

    dispatch(hydrateSavedLineup(submittedLineup));
  } catch (error) {
    console.error('Failed to submit lineup:', error);
  }
};

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
            isLineupFinalized={isLineupFinalized}
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
            saveDraft={handleSaveDraft}
            saveLineup={handleSubmitLineup}
            lineupMatch={lineupMatch}
            err={err}
            savedStarterIds={savedStarterIds}
            rosterPlayerIds={rosterPlayerIds}
            draftSaved={draftSaved}
            isLineupLocked={isLineupLocked}
            teamPlayers={teamPlayers}
            starterIds={starterIds} 
          />
        )}
      </div>
    </AppLayout>
  );
}

export default App;
