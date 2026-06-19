import {
  looksMultiIntent,
  heuristicSplit,
  normalizeSubqueries,
  parseJsonArray,
  mergeDedupeRoundRobin,
} from './query-decomposition';

describe('query-decomposition', () => {
  describe('looksMultiIntent', () => {
    it('flags two questions joined by "and"', () => {
      expect(looksMultiIntent('Do you build WhatsApp bots and where are you located?')).toBe(true);
    });
    it('flags two question marks', () => {
      expect(looksMultiIntent('What do you do? How much is it?')).toBe(true);
    });
    it('does not flag a single-intent question', () => {
      expect(looksMultiIntent('Where is MAXR located?')).toBe(false);
    });
    it('does not flag short messages', () => {
      expect(looksMultiIntent('hi')).toBe(false);
    });
    it('does not flag "and" inside a single intent', () => {
      // "research and development" is one topic, no question word after "and".
      expect(looksMultiIntent('Tell me about research and development services')).toBe(false);
    });
  });

  describe('heuristicSplit', () => {
    it('splits on question marks', () => {
      expect(heuristicSplit('Do you build bots? Where are you located?')).toEqual([
        'Do you build bots',
        'Where are you located',
      ]);
    });
    it('splits on connectors when no question marks', () => {
      expect(heuristicSplit('pricing and contact info')).toEqual(['pricing', 'contact info']);
    });
    it('returns the original for a single fragment', () => {
      expect(heuristicSplit('Where is MAXR located')).toEqual(['Where is MAXR located']);
    });
    it('returns [] for empty input', () => {
      expect(heuristicSplit('   ')).toEqual([]);
    });
  });

  describe('normalizeSubqueries', () => {
    it('trims, dedupes, and caps', () => {
      expect(
        normalizeSubqueries(['  A ', 'a', 'B', 'C', 'D', 'E'], 'orig', 4),
      ).toEqual(['A', 'B', 'C', 'D']);
    });
    it('falls back to the original when not an array', () => {
      expect(normalizeSubqueries('nope', 'original query')).toEqual(['original query']);
    });
    it('falls back to the original when empty', () => {
      expect(normalizeSubqueries([], 'original query')).toEqual(['original query']);
    });
  });

  describe('parseJsonArray', () => {
    it('parses a plain JSON array', () => {
      expect(parseJsonArray('["a", "b"]')).toEqual(['a', 'b']);
    });
    it('parses a fenced JSON array with prose', () => {
      expect(parseJsonArray('Here you go:\n```json\n["x", "y"]\n```')).toEqual(['x', 'y']);
    });
    it('returns null for non-array text', () => {
      expect(parseJsonArray('not json at all')).toBeNull();
    });
  });

  describe('mergeDedupeRoundRobin', () => {
    const key = (x: { id: string }) => x.id;
    it('interleaves results so every query contributes', () => {
      const q1 = [{ id: 'a' }, { id: 'b' }, { id: 'c' }];
      const q2 = [{ id: 'x' }, { id: 'y' }];
      expect(mergeDedupeRoundRobin([q1, q2], 8, key).map((r) => r.id)).toEqual([
        'a',
        'x',
        'b',
        'y',
        'c',
      ]);
    });
    it('dedupes across queries', () => {
      const q1 = [{ id: 'a' }, { id: 'b' }];
      const q2 = [{ id: 'a' }, { id: 'c' }];
      expect(mergeDedupeRoundRobin([q1, q2], 8, key).map((r) => r.id)).toEqual(['a', 'b', 'c']);
    });
    it('caps at topK', () => {
      const q1 = [{ id: 'a' }, { id: 'b' }, { id: 'c' }, { id: 'd' }];
      expect(mergeDedupeRoundRobin([q1], 2, key).map((r) => r.id)).toEqual(['a', 'b']);
    });
    it('ensures a low-ranked second-intent hit survives a strong first intent', () => {
      // The bug this fixes: q1 floods the top, q2's only hit must still appear.
      const q1 = [{ id: 's1' }, { id: 's2' }, { id: 's3' }, { id: 's4' }];
      const q2 = [{ id: 'loc' }];
      const merged = mergeDedupeRoundRobin([q1, q2], 8, key).map((r) => r.id);
      expect(merged).toContain('loc');
    });
  });
});
