import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { QdrantClient } from '@qdrant/js-client-rest';

export interface QdrantPoint {
  id: string;
  vector: number[];
  payload: Record<string, any>;
}

@Injectable()
export class QdrantService implements OnModuleInit {
  private readonly logger = new Logger(QdrantService.name);
  private client: QdrantClient;
  /**
   * Whether Qdrant is reachable. When false, RAG features are disabled but the
   * rest of the application keeps working (see KnowledgeService).
   */
  private available = false;

  constructor() {
    const url = process.env.QDRANT_URL || 'http://localhost:6333';
    const apiKey = process.env.QDRANT_API_KEY;

    // Hosted Qdrant Cloud requires the API key; local dev typically runs
    // unauthenticated. Only pass apiKey when present so both modes work.
    this.client = apiKey
      ? new QdrantClient({ url, apiKey })
      : new QdrantClient({ url });

    this.logger.log(
      `Qdrant client configured for ${url} (${apiKey ? 'authenticated' : 'unauthenticated'} mode)`,
    );
  }

  async onModuleInit() {
    try {
      await this.client.getCollections();
      this.available = true;
      this.logger.log('Connected to Qdrant');
    } catch (err: any) {
      this.available = false;
      this.logger.warn(
        `Qdrant not available (${err?.message || err}). RAG features are disabled; the rest of the app will run normally.`,
      );
    }
  }

  /** True when Qdrant responded successfully during startup / last probe. */
  isAvailable(): boolean {
    return this.available;
  }

  /**
   * Probe Qdrant once and cache the result. Lets callers recover if Qdrant
   * came up after the backend started.
   */
  async ping(): Promise<boolean> {
    try {
      await this.client.getCollections();
      this.available = true;
    } catch {
      this.available = false;
    }
    return this.available;
  }

  async ensureCollection(name: string, vectorSize: number = 1536) {
    const collections = await this.client.getCollections();
    const exists = collections.collections.some((c) => c.name === name);
    if (!exists) {
      await this.client.createCollection(name, {
        vectors: { size: vectorSize, distance: 'Cosine' },
      });
      this.logger.log(`Created Qdrant collection: ${name} (size=${vectorSize})`);
    }
  }

  async upsert(collection: string, points: QdrantPoint[]) {
    await this.client.upsert(collection, { points });
  }

  async search(
    collection: string,
    vector: number[],
    limit: number = 5,
  ): Promise<QdrantPoint[]> {
    const result = await this.client.search(collection, {
      vector,
      limit,
      with_payload: true,
    });
    return result.map((r) => ({
      id: String(r.id),
      vector: [],
      payload: { ...(r.payload as Record<string, any>), score: r.score },
    }));
  }

  /** Delete all points belonging to an article (payload article_id match). */
  async deleteByArticle(collection: string, articleId: string) {
    await this.client.delete(collection, {
      filter: { must: [{ key: 'article_id', match: { value: articleId } }] },
    });
  }

  async deleteCollection(name: string) {
    await this.client.deleteCollection(name);
  }
}
