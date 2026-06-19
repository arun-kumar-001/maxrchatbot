/**
 * Pure helpers for multi-intent query decomposition used by ChatService.
 *
 * These are intentionally framework-free and side-effect-free so they can be
 * unit tested in isolation. The LLM-based decomposition lives in ChatService
 * (it needs the provider); everything deterministic lives here.
 */

/** Question/intent connector words that hint at multiple intents. */
const CONNECTORS = [
  ' and ',
  ' & ',
  ' also ',
  ' as well as ',
  ' plus ',
  ' along with ',
];

const QUESTION_WORDS = [
  'what',
  'where',
  'when',
  'who',
  'why',
  'how',
  'which',
  'do',
  'does',
  'can',
  'is',
  'are',
];

/**
 * Heuristic detector: does this message plausibly contain more than one intent?
 * Cheap pre-check so we only pay for LLM decomposition when it's worth it.
 */
export function looksMultiIntent(message: string): boolean {
  const text = message.toLowerCase().trim();
  if (text.length < 12) return false;

  // Multiple question marks → almost certainly multiple questions.
  const questionMarks = (text.match(/\?/g) || []).length;
  if (questionMarks >= 2) return true;

  // A connector word joining two clauses, where the second clause also looks
  // like a question/request (starts with or contains a question word).
  for (const c of CONNECTORS) {
    const idx = text.indexOf(c);
    if (idx > 0) {
      const after = text.slice(idx + c.length);
      if (QUESTION_WORDS.some((q) => after.startsWith(q + ' ') || after.includes(' ' + q + ' '))) {
        return true;
      }
    }
  }
  return false;
}

/**
 * Deterministic fallback splitter for when LLM decomposition is unavailable or
 * fails. Splits on question marks and top-level connectors, returning trimmed,
 * non-empty, de-duplicated fragments. Always returns at least the original.
 */
export function heuristicSplit(message: string): string[] {
  const trimmed = message.trim();
  if (!trimmed) return [];

  // Split on '?' first (keeping each question), then on connectors.
  let parts: string[] = trimmed
    .split('?')
    .map((p) => p.trim())
    .filter(Boolean);

  if (parts.length <= 1) {
    // No multiple questions — try connector split.
    let working = [trimmed];
    for (const c of CONNECTORS) {
      working = working.flatMap((p) => p.split(new RegExp(c, 'i')));
    }
    parts = working.map((p) => p.trim()).filter(Boolean);
  }

  const seen = new Set<string>();
  const out: string[] = [];
  for (const p of parts) {
    const key = p.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(p);
    }
  }
  return out.length ? out : [trimmed];
}

/**
 * Normalize and validate a list of candidate subqueries (e.g. from the LLM).
 * Drops empties/dupes, trims, and caps the count.
 */
export function normalizeSubqueries(
  candidates: unknown,
  original: string,
  maxQueries = 4,
): string[] {
  if (!Array.isArray(candidates)) return [original.trim()];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const c of candidates) {
    if (typeof c !== 'string') continue;
    const q = c.trim();
    if (!q) continue;
    const key = q.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(q);
    if (out.length >= maxQueries) break;
  }
  return out.length ? out : [original.trim()];
}

/**
 * Extract a JSON string array from a model response that may be wrapped in
 * markdown fences or surrounded by prose. Returns null when nothing parses.
 */
export function parseJsonArray(text: string): string[] | null {
  if (!text) return null;
  // Strip markdown code fences.
  const cleaned = text.replace(/```(?:json)?/gi, '').trim();
  // Grab the first [...] block.
  const start = cleaned.indexOf('[');
  const end = cleaned.lastIndexOf(']');
  if (start === -1 || end === -1 || end <= start) return null;
  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1));
    return Array.isArray(parsed) ? parsed.map(String) : null;
  } catch {
    return null;
  }
}

/**
 * Round-robin merge of per-subquery result lists with de-duplication, capped at
 * topK. Round-robin ensures every intent contributes its top hits even when one
 * intent has many strong matches — this is the core fix for multi-intent recall.
 */
export function mergeDedupeRoundRobin<T>(
  resultsPerQuery: T[][],
  topK: number,
  keyFn: (item: T) => string,
): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  const maxLen = Math.max(0, ...resultsPerQuery.map((r) => r.length));

  for (let rank = 0; rank < maxLen && out.length < topK; rank++) {
    for (const list of resultsPerQuery) {
      if (out.length >= topK) break;
      const item = list[rank];
      if (!item) continue;
      const key = keyFn(item);
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}
