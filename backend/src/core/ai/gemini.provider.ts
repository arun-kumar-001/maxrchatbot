import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { AIProvider, AIMessage, AICompletionOptions, AIResponse } from './ai.interface';

/**
 * Google Gemini chat provider.
 *
 * Uses Gemini's OpenAI-compatible endpoint
 * (https://generativelanguage.googleapis.com/v1beta/openai) so we can reuse the
 * same `openai` SDK already used by the OpenAI and Groq providers. This keeps
 * chat completions, system prompts, and conversation history identical across
 * providers.
 */
@Injectable()
export class GeminiProvider implements AIProvider {
  name = 'gemini';
  private readonly logger = new Logger(GeminiProvider.name);
  private client: OpenAI;

  static readonly BASE_URL =
    'https://generativelanguage.googleapis.com/v1beta/openai/';

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      this.logger.warn('GEMINI_API_KEY not set — Gemini provider will fail at runtime');
    }
    this.client = new OpenAI({
      apiKey: apiKey || 'dummy',
      baseURL: GeminiProvider.BASE_URL,
    });
  }

  async generateCompletion(
    messages: AIMessage[],
    options?: AICompletionOptions,
  ): Promise<AIResponse> {
    const model = options?.model || process.env.GEMINI_MODEL || 'gemini-2.5-flash';

    // `messages` already carries the system prompt + full conversation history
    // (built by ChatService), so we forward them as-is.
    const completion = await this.client.chat.completions.create({
      model,
      messages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.maxTokens ?? 1024,
    });

    const choice = completion.choices[0];
    return {
      content: choice?.message?.content || '',
      provider: this.name,
      model,
      usage: completion.usage
        ? {
            promptTokens: completion.usage.prompt_tokens,
            completionTokens: completion.usage.completion_tokens,
            totalTokens: completion.usage.total_tokens,
          }
        : undefined,
    };
  }
}
