import { AIFactory } from './ai.factory';
import { AIProvider, AIResponse } from './ai.interface';

function stub(name: string, behavior: () => Promise<AIResponse>): AIProvider {
  return { name, generateCompletion: behavior } as AIProvider;
}

function ok(name: string): AIProvider {
  return stub(name, async () => ({ content: `hi from ${name}`, provider: name, model: 'stub' }));
}

function failing(name: string, status?: number, message = 'boom'): AIProvider {
  return stub(name, async () => {
    const e: any = new Error(message);
    if (status) e.status = status;
    throw e;
  });
}

describe('AIFactory', () => {
  const ORIG_ENV = { ...process.env };
  afterEach(() => {
    process.env = { ...ORIG_ENV };
  });

  describe('isRetryableError', () => {
    it('treats 429 as retryable', () => {
      expect(AIFactory.isRetryableError({ status: 429 })).toBe(true);
    });
    it('treats 5xx as retryable', () => {
      expect(AIFactory.isRetryableError({ status: 503 })).toBe(true);
    });
    it('treats quota / rate-limit messages as retryable', () => {
      expect(AIFactory.isRetryableError({ message: 'quota exceeded' })).toBe(true);
      expect(AIFactory.isRetryableError({ message: 'Rate limit reached' })).toBe(true);
      expect(AIFactory.isRetryableError({ message: 'model overloaded' })).toBe(true);
    });
    it('treats 4xx (non-429) as non-retryable', () => {
      expect(AIFactory.isRetryableError({ status: 400, message: 'bad request' })).toBe(false);
    });
  });

  describe('getProvider', () => {
    it('returns the requested registered provider', () => {
      const f = new AIFactory(ok('openai') as any, ok('groq') as any, ok('gemini') as any);
      expect(f.getProvider('gemini').name).toBe('gemini');
    });
    it('falls back to openai for an unknown provider', () => {
      const f = new AIFactory(ok('openai') as any, ok('groq') as any, ok('gemini') as any);
      expect(f.getProvider('mystery').name).toBe('openai');
    });
  });

  describe('getFallbackChain', () => {
    it('puts the primary first, de-dupes, and keeps only registered providers', () => {
      const f = new AIFactory(ok('openai') as any, ok('groq') as any, ok('gemini') as any);
      process.env.AI_PROVIDER = 'gemini';
      delete process.env.AI_FALLBACK_ORDER;
      expect(f.getFallbackChain()).toEqual(['gemini', 'groq', 'openai']);
    });
    it('honors AI_FALLBACK_ORDER override', () => {
      const f = new AIFactory(ok('openai') as any, ok('groq') as any, ok('gemini') as any);
      process.env.AI_PROVIDER = 'openai';
      process.env.AI_FALLBACK_ORDER = 'groq,gemini';
      expect(f.getFallbackChain()).toEqual(['openai', 'groq', 'gemini']);
    });
  });

  describe('generateWithFallback', () => {
    it('returns the primary provider result when it succeeds', async () => {
      const f = new AIFactory(ok('openai') as any, ok('groq') as any, ok('gemini') as any);
      process.env.AI_PROVIDER = 'gemini';
      const r = await f.generateWithFallback([{ role: 'user', content: 'hi' }]);
      expect(r.provider).toBe('gemini');
    });

    it('falls back Gemini(429) -> Groq', async () => {
      const f = new AIFactory(ok('openai') as any, ok('groq') as any, failing('gemini', 429) as any);
      process.env.AI_PROVIDER = 'gemini';
      process.env.AI_FALLBACK_ORDER = 'gemini,groq,openai';
      const r = await f.generateWithFallback([{ role: 'user', content: 'hi' }]);
      expect(r.provider).toBe('groq');
      expect(r.content).toContain('groq');
    });

    it('falls back across the whole chain to the last working provider', async () => {
      const f = new AIFactory(
        ok('openai') as any,
        failing('groq', 429) as any,
        failing('gemini', 429) as any,
      );
      process.env.AI_PROVIDER = 'gemini';
      process.env.AI_FALLBACK_ORDER = 'gemini,groq,openai';
      const r = await f.generateWithFallback([{ role: 'user', content: 'hi' }]);
      expect(r.provider).toBe('openai');
    });

    it('throws the last error when every provider fails', async () => {
      const f = new AIFactory(
        failing('openai', 429, 'openai quota') as any,
        failing('groq', 429, 'groq quota') as any,
        failing('gemini', 429, 'gemini quota') as any,
      );
      process.env.AI_PROVIDER = 'gemini';
      process.env.AI_FALLBACK_ORDER = 'gemini,groq,openai';
      await expect(f.generateWithFallback([{ role: 'user', content: 'hi' }])).rejects.toThrow(/quota/);
    });
  });
});
