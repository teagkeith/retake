import { useState } from 'react';
import { useEffect } from 'react';
import { mockFantasyTeams } from './features/league/data/mockFantasyTeams';
import { loadFantasyTeam } from './features/roster/store/lineupSlice';
// Redux 
import { useAppDispatch, useAppSelector } from './app/hooks';
import { toggleStarter, saveLineup } from './features/roster/store/lineupSlice';
import { selectRosterPlayerIds } from './features/roster/store/lineSelectors';

import {
  selectStarterIds,
  selectLineupError,
  selectLineupMatch,
  selectSavedPlayers,
} from './features/roster/store/lineSelectors';

import './App.css';
import OverviewPage from './features/dashboard/pages/OverviewPage';
import RosterPage from './features/roster/components/RosterPage';
import AppLayout from './layouts/AppLayout';

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
  }, [dispatch]);

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      <div className="leagueContent">
        {activeTab === 'overview' && <OverviewPage />}
        {activeTab === 'roster' && (
          <RosterPage
            starterIds={starterIds}
            toggleStarter={(playerId) => dispatch(toggleStarter(playerId))}
            saveLineup={() => dispatch(saveLineup())}
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
