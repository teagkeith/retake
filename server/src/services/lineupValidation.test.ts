import { describe, expect, it } from 'vitest';
import { validateDraft, validateSubmission } from './lineupValidation.js';

const roster = ['player-1', 'player-2', 'player-3', 'player-4', 'player-5', 'player-6', 'player-7'];

describe('Draft validation', () => {
  it('accepts an incomplete draft', () => {
    expect(validateDraft(roster, ['player-1', 'player-2'])).toBe(true);
  });

  it('accepts an empty draft', () => {
    expect(validateDraft(roster, [])).toBe(true);
  });

  it('rejects more than five starters', () => {
    expect(validateDraft(roster, roster.slice(0, 6))).toBe(false);
  });

  it('rejects duplicate players', () => {
    expect(validateDraft(roster, ['player-1', 'player-1'])).toBe(false);
  });

  it('rejects players not on the roster', () => {
    expect(validateDraft(roster, ['player-8'])).toBe(false);
  });
});

describe('Submission validation', () => {
  it('accepts exactly five owned players', () => {
    expect(validateSubmission(roster, roster.slice(0, 5))).toBe(true);
  });

  it('rejects an incomplete lineup', () => {
    expect(validateSubmission(roster, roster.slice(0, 4))).toBe(false);
  });

  it('rejects duplicate starters', () => {
    expect(
      validateSubmission(roster, ['player-1', 'player-2', 'player-3', 'player-4', 'player-4']),
    ).toBe(false);
  });

  it('rejects unowned players', () => {
    expect(
      validateSubmission(roster, ['player-1', 'player-2', 'player-3', 'player-4', 'player-8']),
    ).toBe(false);
  });
});
