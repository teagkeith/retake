import { useEffect, useRef, useState } from 'react';
import {
  fetchProTeams,
  fetchProTeamDetails,
  type ProTeamDetails,
  type ProTeamSummary,
} from '../api/proTeamApi';
import ProTeamModal from '../components/ProTeamModal';

import './ProTeamsPage.css';

export default function ProTeamsPage() {
  const [teams, setTeams] = useState<ProTeamSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [search, setSearch] = useState('');

  const [selectedTeam, setSelectedTeam] = useState<ProTeamDetails | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);

  const detailsRequestRef = useRef<AbortController | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadTeams() {
      try {
        const data = await fetchProTeams('valorant');

        if (!cancelled) {
          setTeams(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load teams');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadTeams();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    return () => {
      detailsRequestRef.current?.abort();
    };
  }, []);

  async function handleSelectTeam(teamId: string) {
    // Cancel any previous team-details request.
    detailsRequestRef.current?.abort();

    const controller = new AbortController();
    detailsRequestRef.current = controller;

    setDetailsLoading(true);
    setDetailsError(null);
    setSelectedTeam(null);

    try {
      const team = await fetchProTeamDetails(teamId, controller.signal);

      if (!controller.signal.aborted) {
        setSelectedTeam(team);
      }
    } catch (error) {
      if (!controller.signal.aborted) {
        setDetailsError(error instanceof Error ? error.message : 'Could not load team details');
      }
    } finally {
      if (detailsRequestRef.current === controller) {
        detailsRequestRef.current = null;
        setDetailsLoading(false);
      }
    }
  }

  const query = search.trim().toLowerCase();

  const filteredTeams = teams.filter((team) => {
    return (
      team.name.toLowerCase().includes(query) ||
      (team.shortName?.toLowerCase().includes(query) ?? false)
    );
  });

  if (loading) {
    return <p role="status">Loading professional teams...</p>;
  }

  if (error) {
    return <p role="alert">{error}</p>;
  }

  return (
    <section className="proTeamsPage">
      <header className="proTeamsHeader">
        <div>
          <h1>Professional Teams</h1>
          <p>Browse imported VALORANT esports teams.</p>
        </div>

        <span className="proTeamsGame">VALORANT</span>
      </header>

      <div className="proTeamsSearch">
        <input
          type="search"
          placeholder="Search teams..."
          aria-label="Search professional teams"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <span>
          {filteredTeams.length} {filteredTeams.length === 1 ? 'team' : 'teams'}
        </span>
      </div>

      <div className="proTeamsGrid">
        {filteredTeams.map((team) => (
          <button
            type="button"
            className="proTeamCard"
            key={team.id}
            onClick={() => void handleSelectTeam(team.id)}
          >
            <div className="proTeamBadge">
              {team.shortName ?? team.name.slice(0, 2).toUpperCase()}
            </div>

            <h2>{team.name}</h2>
            <p>VALORANT</p>
          </button>
        ))}
      </div>

      {filteredTeams.length === 0 && <p>No teams match your search.</p>}

      {detailsLoading && <p role="status">Loading team details...</p>}

      {detailsError && <p role="alert">{detailsError}</p>}

      {selectedTeam && <ProTeamModal team={selectedTeam} onClose={() => setSelectedTeam(null)} />}
    </section>
  );
}
