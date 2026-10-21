import { useEffect, useState } from 'react';

import { mockFantasyTeams } from './features/league/data/mockFantasyTeams';

import { useAppDispatch, useAppSelector } from './app/hooks';

import {
  loadFantasyTeam,
  selectScoringWeek,
  toggleStarter,
  submitCurrentLineup,
} from './features/roster/store/lineupSlice';

import {
  selectRosterPlayerIds,
  selectStarterIds,
  selectLineupError,
  selectLineupMatch,
  selectSavedPlayers,
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

  const dispatch = useAppDispatch();
  const starterIds = useAppSelector(selectStarterIds);
  const err = useAppSelector(selectLineupError);

  const lineupMatch = useAppSelector(selectLineupMatch);

  const savedPlayers = useAppSelector(selectSavedPlayers);
  const rosterPlayerIds = useAppSelector(selectRosterPlayerIds);

  useEffect(() => {
    const fantasyTeam = mockFantasyTeams[0];

    if (!fantasyTeam) return;

    dispatch(
      loadFantasyTeam({
        fantasyTeamId: fantasyTeam.id,
        rosterPlayerIds: fantasyTeam.rosterPlayerIds,
      }),
    );

    dispatch(selectScoringWeek(activeScoringWeek.id));
  }, [dispatch]);

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="leagueContent">
        {activeTab === 'overview' && <OverviewPage />}
        {activeTab === 'roster' && (
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
          />
        )}
      </div>
    </AppLayout>
  );
}

export default App;
