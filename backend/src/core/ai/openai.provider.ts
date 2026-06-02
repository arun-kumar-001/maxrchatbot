import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';
import { AIProvider, AIMessage, AICompletionOptions, AIResponse } from './ai.interface';

@Injectable()
export class OpenAIProvider implements AIProvider {
  name = 'openai';
  private readonly logger = new Logger(OpenAIProvider.name);
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      this.logger.warn('OPENAI_API_KEY not set — OpenAI provider will fail at runtime');
    }
    this.client = new OpenAI({ apiKey: apiKey || 'dummy' });
  }

  async generateCompletion(
    messages: AIMessage[],
    options?: AICompletionOptions,
  ): Promise<AIResponse> {
    const model = options?.model || process.env.OPENAI_MODEL || 'gpt-4o-mini';

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