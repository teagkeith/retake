
import { describe, expect, it } from 'vitest';
import { normalizeDeadlockMatch } from './deadlockAdapter.js';

const validMatch = {
  match_info: {
    duration_s: 2282,
    players: [
      {
        account_id: 95690114,
        hero_id: 80,
        kills: 16,
        deaths: 7,
        assists: 27,
      },
    ],
  },
};

describe('normalizeDeadlockMatch', () => {
  it('converts Deadlock data into Rotate format', () => {
    const result = normalizeDeadlockMatch(122924457, validMatch);

    expect(result).toEqual({
      game: 'deadlock',
      matchId: 122924457,
      durationSeconds: 2282,
      players: [
        {
          accountId: 95690114,
          heroId: 80,
          kills: 16,
          deaths: 7,
          assists: 27,
        },
      ],
    });
  });

  it('rejects invalid match data', () => {
    expect(() => normalizeDeadlockMatch(122924457, null)).toThrow();
  });

  it('rejects players with missing statistics', () => {
    const invalidMatch = {
      match_info: {
        duration_s: 2282,
        players: [{ account_id: 95690114 }],
      },
    };

    expect(() =>
      normalizeDeadlockMatch(122924457, invalidMatch),
    ).toThrow();
  });
});
