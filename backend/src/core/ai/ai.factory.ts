import { Injectable, Logger } from '@nestjs/common';
import { AIProvider, AIMessage, AICompletionOptions, AIResponse } from './ai.interface';
import { OpenAIProvider } from './openai.provider';
import { GroqProvider } from './groq.provider';
import { GeminiProvider } from './gemini.provider';

@Injectable()
export class AIFactory {
  private readonly logger = new Logger(AIFactory.name);
  private providers: Map<string, AIProvider> = new Map();

  /**
   * Default fallback order. The primary provider (AI_PROVIDER) is tried first,
   * then the rest of this chain in order, skipping the primary. Overridable via
   * AI_FALLBACK_ORDER (comma-separated, e.g. "gemini,groq,openai").
   */
  private static readonly DEFAULT_CHAIN = ['gemini', 'groq', 'openai'];

  constructor(
    openAIProvider: OpenAIProvider,
    groqProvider: GroqProvider,
    geminiProvider: GeminiProvider,
  ) {
    this.providers.set('openai', openAIProvider);
    this.providers.set('groq', groqProvider);
    this.providers.set('gemini', geminiProvider);
  }

  getProvider(name?: string): AIProvider {
    const providerName = (name || process.env.AI_PROVIDER || 'openai').toLowerCase();
    const provider = this.providers.get(providerName);
    if (!provider) {
      this.logger.warn(`Provider "${providerName}" not found, falling back to openai`);
      return this.providers.get('openai')!;
    }
    return provider;
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys());
  }

  /** The configured primary provider name. */
  getPrimaryProviderName(): string {
    return (process.env.AI_PROVIDER || 'openai').toLowerCase();
  }

  /**
   * Build the ordered list of provider names to try: primary first, then the
   * remaining fallback chain, de-duplicated and filtered to registered ones.
   */
  getFallbackChain(primary?: string): string[] {
    const configured = process.env.AI_FALLBACK_ORDER
      ? process.env.AI_FALLBACK_ORDER.split(',').map((s) => s.trim().toLowerCase())
      : AIFactory.DEFAULT_CHAIN;

    const primaryName = (primary || this.getPrimaryProviderName()).toLowerCase();
    const ordered = [primaryName, ...configured];

    const seen = new Set<string>();
    return ordered.filter((n) => {
      if (seen.has(n) || !this.providers.has(n)) return false;
      seen.add(n);
      return true;
    });
  }

  /**
   * Determine whether an error from a provider is transient/retryable
   * (rate limit, quota exceeded, or temporary upstream outage) and therefore
   * worth retrying with the next provider in the chain.
   */
  static isRetryableError(err: any): boolean {
    const status = err?.status ?? err?.statusCode ?? err?.response?.status;
    if (status === 429) return true; // rate limit
    if (status === 500 || status === 502 || status === 503 || status === 504) return true;

    const msg = String(err?.message || err?.error?.message || '').toLowerCase();
    return (
      msg.includes('quota') ||
      msg.includes('rate limit') ||
      msg.includes('overloaded') ||
      msg.includes('temporarily') ||
      msg.includes('unavailable') ||
      msg.includes('timeout') ||
      msg.includes('econnreset') ||
      msg.includes('etimedout')
    );
  }

  /**
   * Generate a completion with automatic provider fallback.
   *
   * Tries the primary provider first; on a retryable error (429 / quota /
   * temporary outage) it transparently retries the next provider in the chain
   * (default: gemini → groq → openai) until one succeeds. The original error is
   * surfaced if every provider fails.
   */
  async generateWithFallback(
    messages: AIMessage[],
    options?: AICompletionOptions,
    primary?: string,
  ): Promise<AIResponse> {
    const chain = this.getFallbackChain(primary);
    if (chain.length === 0) {
      throw new Error('No AI providers are registered.');
    }

    let lastError: any;
    for (let i = 0; i < chain.length; i++) {
      const name = chain[i];
      const provider = this.providers.get(name)!;
      try {
        const response = await provider.generateCompletion(messages, options);
        if (i > 0) {
          this.logger.warn(
            `Primary provider failed; answered via fallback provider "${name}".`,
          );
        }
        return response;
      } catch (err: any) {
        lastError = err;
        const retryable = AIFactory.isRetryableError(err);
        const next = chain[i + 1];
        this.logger.warn(
          `Provider "${name}" failed (${err?.status || ''} ${err?.message || err})` +
            (next
              ? ` — ${retryable ? 'retryable, ' : ''}falling back to "${next}".`
              : ' — no more fallback providers.'),
        );
        // Continue to the next provider if there is one; the loop ends when the
        // chain is exhausted and we rethrow the last error.
      }
    }

    throw lastError;
  }
}
