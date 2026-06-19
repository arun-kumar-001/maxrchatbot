import { Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

type EmbeddingProvider = 'openai' | 'gemini';

/**
 * Per-provider embedding configuration. `dimensions` MUST match the vector size
 * the Qdrant collection is created with (see KnowledgeService), so switching
 * providers also switches the collection's vector size.
 */
const EMBEDDING_CONFIG: Record<
  EmbeddingProvider,
  { model: string; dimensions: number }
> = {
  openai: { model: 'text-embedding-3-small', dimensions: 1536 },
  gemini: { model: 'gemini-embedding-001', dimensions: 3072 },
};

@Injectable()
export class EmbeddingsService {
  private readonly logger = new Logger(EmbeddingsService.name);
  private client: OpenAI;
  private readonly provider: EmbeddingProvider;
  private readonly model: string;
  private readonly dimensions: number;

  constructor() {
    // EMBEDDING_PROVIDER lets the embedding backend be chosen independently of
    // the chat provider (AI_PROVIDER). Defaults to following AI_PROVIDER when it
    // is gemini, otherwise openai.
    const configured = (
      process.env.EMBEDDING_PROVIDER ||
      (process.env.AI_PROVIDER === 'gemini' ? 'gemini' : 'openai')
    ).toLowerCase();
    this.provider = configured === 'gemini' ? 'gemini' : 'openai';

    const cfg = EMBEDDING_CONFIG[this.provider];
    this.model = process.env.EMBEDDING_MODEL || cfg.model;
    this.dimensions = cfg.dimensions;

    if (this.provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
      if (!apiKey) {
        this.logger.warn('GEMINI_API_KEY not set — Gemini embeddings will fail at runtime');
      }
      // Gemini's OpenAI-compatible endpoint serves embeddings too.
      this.client = new OpenAI({
        apiKey: apiKey || 'dummy',
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
      });
    } else {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        this.logger.warn('OPENAI_API_KEY not set — OpenAI embeddings will fail at runtime');
      }
      this.client = new OpenAI({ apiKey: apiKey || 'dummy' });
    }

    this.logger.log(
      `Embeddings using provider=${this.provider} model=${this.model} dimensions=${this.dimensions}`,
    );
  }

  /** Vector dimensions for the active embedding model. */
  getDimensions(): number {
    return this.dimensions;
  }

  getProvider(): EmbeddingProvider {
    return this.provider;
  }

  async generateEmbedding(text: string): Promise<number[]> {
    const response = await this.client.embeddings.create({
      model: this.model,
      input: text,
    });
    return response.data[0].embedding;
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    const response = await this.client.embeddings.create({
      model: this.model,
      input: texts,
    });
    return response.data.map((d) => d.embedding);
  }

  chunkText(text: string, maxChunkSize: number = 512): string[] {
    const chunks: string[] = [];
    const sentences = text.split(/(?<=[.!?])\s+/);
    let current = '';

    for (const sentence of sentences) {
      if ((current + ' ' + sentence).length > maxChunkSize && current) {
        chunks.push(current.trim());
        current = sentence;
      } else {
        current = current ? current + ' ' + sentence : sentence;
      }
    }
    if (current.trim()) chunks.push(current.trim());
    return chunks;
  }
}
