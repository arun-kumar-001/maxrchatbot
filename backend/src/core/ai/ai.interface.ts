export interface AIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface AICompletionOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AIProvider {
  name: string;
  generateCompletion(messages: AIMessage[], options?: AICompletionOptions): Promise<AIResponse>;
  generateStreamingCompletion?(messages: AIMessage[], options?: AICompletionOptions): AsyncIterable<string>;
}

export interface AIResponse {
  content: string;
  provider: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface ConversationContext {
  conversationId: string;
  messages: AIMessage[];
  confidence: number;
  metadata?: Record<string, any>;
}