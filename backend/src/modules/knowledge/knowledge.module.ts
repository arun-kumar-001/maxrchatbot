import { Module } from '@nestjs/common';
import { KnowledgeController } from './knowledge.controller';
import { KnowledgeService } from './knowledge.service';
import { QdrantService } from '../../core/vector/qdrant.service';
import { EmbeddingsService } from '../../core/vector/embeddings.service';
import { SupabaseService } from '../../core/database/supabase.service';

@Module({
  controllers: [KnowledgeController],
  providers: [KnowledgeService, QdrantService, EmbeddingsService, SupabaseService],
  exports: [KnowledgeService],
})
export class KnowledgeModule {}