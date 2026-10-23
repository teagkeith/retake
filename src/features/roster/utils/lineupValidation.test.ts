import { describe, expect, it } from 'vitest';
import { validateLineupDraft, validateLineupSubmission } from './lineupValidation';

describe('Lineup Validation', () => {
  it('allows a valid five-player lineup to be submitted', () => {
    const roster = ['1', '2', '3', '4', '5', '6', '7'];
    const starters = ['1', '2', '3', '4', '5'];

    expect(validateLineupSubmission(roster, starters)).toBe(true);
  });
  it('A draft containing three valid starters should be true', () => {
    const roster = ['1', '2', '3', '4', '5', '6', '7'];
    const starters = ['1', '2', '3'];

    expect(validateLineupDraft(roster, starters)).toBe(true);
  });
  it('A submission containing only three starters should return false', () => {
    const roster = ['1', '2', '3', '4', '5', '6', '7'];
    const starters = ['1', '2', '3'];

    expect(validateLineupSubmission(roster, starters)).toBe(false);
  });
  it('Duplicate starters should fail ', () => {
    const roster = ['1', '2', '3', '4', '5', '6', '7'];
    const starters = ['1', '2', '2'];

    expect(validateLineupDraft(roster, starters)).toBe(false);
  });
  it('A unowned player in starting lineup should fail', () => {
    const roster = ['1', '2', '3', '4', '5', '6', '7'];
    const starters = ['1', '2', '3', '99', '5'];

    expect(validateLineupDraft(roster, starters)).toBe(false);
  });
  it('Too many starters should fail', () => {
    const roster = ['1', '2', '3', '4', '5', '6', '7'];
    const starters = ['1', '2', '3', '4', '5', '6'];

    expect(validateLineupDraft(roster, starters)).toBe(false);
  });
  it('allows an empty lineup draft', () => {
    const roster = ['1', '2', '3', '4', '5', '6', '7'];

    expect(validateLineupDraft(roster, [])).toBe(true);
  });
});
