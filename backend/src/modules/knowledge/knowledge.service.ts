import { Injectable, Logger, ServiceUnavailableException } from '@nestjs/common';
import { QdrantService } from '../../core/vector/qdrant.service';
import { EmbeddingsService } from '../../core/vector/embeddings.service';
import { SupabaseService } from '../../core/database/supabase.service';

@Injectable()
export class KnowledgeService {
  private readonly logger = new Logger(KnowledgeService.name);
  private readonly COLLECTION = 'knowledge_chunks';
  /** RAG is enabled only when the Qdrant collection is ready. */
  private ragEnabled = false;

  constructor(
    private qdrant: QdrantService,
    private embeddings: EmbeddingsService,
    private supabase: SupabaseService,
  ) {}

  async onModuleInit() {
    // Qdrant must never crash backend startup. If it is unavailable we log a
    // warning, disable RAG, and let the rest of the application boot normally.
    try {
      if (!this.qdrant.isAvailable()) {
        await this.qdrant.ping();
      }
      if (!this.qdrant.isAvailable()) {
        this.logger.warn(
          'Qdrant unavailable at startup — RAG features (knowledge upload/search) are disabled.',
        );
        return;
      }
      await this.qdrant.ensureCollection(
        this.COLLECTION,
        this.embeddings.getDimensions(),
      );
      this.ragEnabled = true;
      this.logger.log('RAG features enabled (Qdrant collection ready).');
    } catch (err: any) {
      this.ragEnabled = false;
      this.logger.warn(
        `Failed to initialize Qdrant collection (${err?.message || err}). RAG features are disabled; backend will continue.`,
      );
    }
  }

  /** Whether knowledge upload/search is currently available. */
  isRagEnabled(): boolean {
    return this.ragEnabled;
  }

  /**
   * Lazily enable RAG if Qdrant became reachable after startup. Returns true
   * when RAG can be used.
   */
  private async ensureRagReady(): Promise<boolean> {
    if (this.ragEnabled) return true;
    if (!(await this.qdrant.ping())) return false;
    try {
      await this.qdrant.ensureCollection(
        this.COLLECTION,
        this.embeddings.getDimensions(),
      );
      this.ragEnabled = true;
      this.logger.log('RAG features enabled (Qdrant recovered).');
    } catch {
      this.ragEnabled = false;
    }
    return this.ragEnabled;
  }

  async upload(content: string, title: string, sourceType?: string) {
    if (!(await this.ensureRagReady())) {
      throw new ServiceUnavailableException(
        'Knowledge base (vector store) is unavailable. RAG features are disabled.',
      );
    }

    const { data: article, error } = await this.supabase.client
      .from('knowledge_articles')
      .insert({ title, content, source_type: sourceType || 'text' })
      .select()
      .single();
    if (error) throw new Error(error.message);

    await this.indexArticle(article.id, content);
    return article;
  }

  async indexArticle(articleId: string, content: string) {
    const chunks = this.embeddings.chunkText(content);
    const embeddings = await this.embeddings.generateEmbeddings(chunks);

    const points = chunks.map((chunk, i) => ({
      id: `${articleId}-${i}`,
      vector: embeddings[i],
      payload: { article_id: articleId, text: chunk, chunk_index: i },
    }));

    await this.qdrant.upsert(this.COLLECTION, points);

    for (let i = 0; i < chunks.length; i++) {
      await this.supabase.client.from('knowledge_chunks').insert({
        article_id: articleId,
        chunk_text: chunks[i],
        chunk_index: i,
      });
    }
  }

  async search(query: string, limit: number = 5) {
    // Search degrades gracefully: if RAG is unavailable we return no context
    // rather than throwing, so the chat flow can still answer without it.
    if (!(await this.ensureRagReady())) {
      this.logger.warn('search() called while RAG disabled — returning empty results.');
      return [];
    }
    const queryEmbedding = await this.embeddings.generateEmbedding(query);
    const results = await this.qdrant.search(this.COLLECTION, queryEmbedding, limit);
    return results.map((r) => ({
      text: r.payload.text,
      articleId: r.payload.article_id,
      score: r.payload.score,
    }));
  }

  async reindex() {
    if (!(await this.ensureRagReady())) {
      throw new ServiceUnavailableException(
        'Knowledge base (vector store) is unavailable. RAG features are disabled.',
      );
    }
    const { data: articles } = await this.supabase.client
      .from('knowledge_articles')
      .select('*');
    if (articles) {
      for (const article of articles) {
        await this.indexArticle(article.id, article.content);
      }
    }
    return { reindexed: articles?.length || 0 };
  }

  async findAll() {
    const { data } = await this.supabase.client
      .from('knowledge_articles')
      .select('*')
      .order('created_at', { ascending: false });
    return data || [];
  }

  async remove(id: string) {
    await this.supabase.client.from('knowledge_chunks').delete().eq('article_id', id);
    await this.supabase.client.from('knowledge_articles').delete().eq('id', id);
    return { deleted: true };
  }
}
