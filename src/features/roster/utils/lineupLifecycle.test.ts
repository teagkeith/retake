import { describe, expect, it } from 'vitest';
import type { FantasyLineup } from '../types/FantasyLineup';
import { canEditLineup, lockLineup, saveLineupDraft, submitLineup } from './lineupLifecycle';

const testLineup: FantasyLineup = {
  id: 'lineup-1',
  fantasyTeamId: 'fantasy-team-1',
  scoringWeekId: 'week-1',
  starterPlayerIds: ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
  lockedAt: null,
  status: 'draft',
};

const weekStartsAt = '2026-11-01T18:00:00Z';

describe('Lineup lifecycle', () => {
  it('allows editing a draft before the scoring week starts', () => {
    expect(canEditLineup(testLineup, weekStartsAt, '2026-11-01T17:59:59Z')).toBe(true);
  });

  it('allows editing a submitted lineup before lock', () => {
    expect(
      canEditLineup({ ...testLineup, status: 'submitted' }, weekStartsAt, '2026-11-01T17:59:59Z'),
    ).toBe(true);
  });

  it('prevents editing at the scoring week start time', () => {
    expect(canEditLineup(testLineup, weekStartsAt, '2026-11-01T18:00:00Z')).toBe(false);
  });

  it('prevents editing an already locked lineup', () => {
    expect(
      canEditLineup({ ...testLineup, status: 'locked' }, weekStartsAt, '2026-11-01T17:00:00Z'),
    ).toBe(false);
  });

  it('saves an incomplete lineup draft', () => {
    const result = saveLineupDraft(
      testLineup,
      ['player-1', 'player-2', 'player-3'],
      ['player-1', 'player-2'],
      weekStartsAt,
      '2026-11-01T17:00:00Z',
    );

    expect(result.starterPlayerIds).toEqual(['player-1', 'player-2']);
    expect(result.status).toBe('draft');
    expect(testLineup.starterPlayerIds).toHaveLength(5);
  });

  it('rejects players not owned by the fantasy team', () => {
    expect(() =>
      saveLineupDraft(
        testLineup,
        ['player-1', 'player-2'],
        ['player-8'],
        weekStartsAt,
        '2026-11-01T17:00:00Z',
      ),
    ).toThrow('Invalid lineup draft');
  });

  it('rejects draft changes after lock time', () => {
    expect(() =>
      saveLineupDraft(
        testLineup,
        ['player-1', 'player-2'],
        ['player-1'],
        weekStartsAt,
        '2026-11-01T18:00:00Z',
      ),
    ).toThrow('Lineup can no longer be edited');
  });

  it('does not allow saving a submitted lineup as a draft', () => {
    expect(() =>
      saveLineupDraft(
        { ...testLineup, status: 'submitted' },
        ['player-1', 'player-2'],
        ['player-1'],
        weekStartsAt,
        '2026-11-01T17:00:00Z',
      ),
    ).toThrow('Only draft lineups can be saved');
  });

  it('submits a valid lineup with exactly five starters', () => {
    const result = submitLineup(
      testLineup,
      ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
      ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
      weekStartsAt,
      '2026-11-01T17:00:00Z',
    );

    expect(result.status).toBe('submitted');
    expect(result.starterPlayerIds).toHaveLength(5);
    expect(result.lockedAt).toBeNull();
  });

  it('rejects submitting fewer than five starters', () => {
    expect(() =>
      submitLineup(
        testLineup,
        ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
        ['player-1', 'player-2'],
        weekStartsAt,
        '2026-11-01T17:00:00Z',
      ),
    ).toThrow('Invalid lineup submission');
  });

  it('rejects submitting unowned players', () => {
    expect(() =>
      submitLineup(
        testLineup,
        ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
        ['player-1', 'player-2', 'player-3', 'player-4', 'player-8'],
        weekStartsAt,
        '2026-11-01T17:00:00Z',
      ),
    ).toThrow('Invalid lineup submission');
  });

  it('allows resubmitting a lineup before lock', () => {
    const submittedLineup: FantasyLineup = {
      ...testLineup,
      status: 'submitted',
    };

    const result = submitLineup(
      submittedLineup,
      ['player-1', 'player-2', 'player-3', 'player-4', 'player-5', 'player-6'],
      ['player-1', 'player-2', 'player-3', 'player-4', 'player-6'],
      weekStartsAt,
      '2026-11-01T17:00:00Z',
    );

    expect(result.status).toBe('submitted');
    expect(result.starterPlayerIds).toEqual([
      'player-1',
      'player-2',
      'player-3',
      'player-4',
      'player-6',
    ]);

    expect(submittedLineup.starterPlayerIds).toContain('player-5');
  });

  it('rejects submissions at the scoring week start time', () => {
    expect(() =>
      submitLineup(
        testLineup,
        ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
        ['player-1', 'player-2', 'player-3', 'player-4', 'player-5'],
        weekStartsAt,
        '2026-11-01T18:00:00Z',
      ),
    ).toThrow('Lineup can no longer be submitted');
  });

  it('locks a submitted lineup when the scoring week begins', () => {
    const submittedLineup: FantasyLineup = {
      ...testLineup,
      status: 'submitted',
    };

    const result = lockLineup(submittedLineup, weekStartsAt, '2026-11-01T18:00:00Z');

    expect(result.status).toBe('locked');
    expect(result.lockedAt).toBe('2026-11-01T18:00:00Z');
    expect(result.starterPlayerIds).toEqual(submittedLineup.starterPlayerIds);
  });

  it('rejects locking before the scoring week starts', () => {
    expect(() =>
      lockLineup({ ...testLineup, status: 'submitted' }, weekStartsAt, '2026-11-01T17:59:59Z'),
    ).toThrow('Cannot lock a lineup before');
  });

  it('does not change an already locked lineup', () => {
    const lockedLineup: FantasyLineup = {
      ...testLineup,
      status: 'locked',
      lockedAt: weekStartsAt,
    };

    const result = lockLineup(lockedLineup, weekStartsAt, '2026-11-01T19:00:00Z');

    expect(result).toBe(lockedLineup);
    expect(result.lockedAt).toBe(weekStartsAt);
  });

  it('locks a submitted lineup when the scoring week begins', () => {
    const submittedLineup: FantasyLineup = {
      ...testLineup,
      status: 'submitted',
    };

    const result = lockLineup(submittedLineup, weekStartsAt, '2026-11-01T18:00:00Z');

    expect(result.status).toBe('locked');
    expect(result.lockedAt).toBe('2026-11-01T18:00:00Z');
    expect(result.starterPlayerIds).toEqual(submittedLineup.starterPlayerIds);
  });

  it('rejects locking before the scoring week starts', () => {
    expect(() =>
      lockLineup({ ...testLineup, status: 'submitted' }, weekStartsAt, '2026-11-01T17:59:59Z'),
    ).toThrow('Cannot lock a lineup before');
  });

  it('does not change an already locked lineup', () => {
    const lockedLineup: FantasyLineup = {
      ...testLineup,
      status: 'locked',
      lockedAt: weekStartsAt,
    };

    const result = lockLineup(lockedLineup, weekStartsAt, '2026-11-01T19:00:00Z');

    expect(result).toBe(lockedLineup);
    expect(result.lockedAt).toBe(weekStartsAt);
  });
  it('rejects locking an unsubmitted draft', () => {
    expect(() => lockLineup(testLineup, weekStartsAt, '2026-11-01T18:00:00Z')).toThrow(
      'Only submitted lineups can be locked.',
    );
  });
});
