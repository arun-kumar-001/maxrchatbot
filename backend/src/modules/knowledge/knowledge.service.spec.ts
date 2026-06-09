import { Test, TestingModule } from '@nestjs/testing';
import { KnowledgeService } from './knowledge.service';
import { QdrantService } from '../../core/vector/qdrant.service';
import { EmbeddingsService } from '../../core/vector/embeddings.service';
import { SupabaseService } from '../../core/database/supabase.service';

describe('KnowledgeService', () => {
  let service: KnowledgeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        KnowledgeService,
        {
          provide: QdrantService,
          useValue: {
            ensureCollection: jest.fn(),
            upsert: jest.fn(),
            search: jest.fn().mockResolvedValue([]),
          },
        },
        {
          provide: EmbeddingsService,
          useValue: {
            generateEmbedding: jest.fn().mockResolvedValue(new Array(1536).fill(0.1)),
            generateEmbeddings: jest.fn().mockResolvedValue([new Array(1536).fill(0.1)]),
            chunkText: jest.fn().mockReturnValue(['chunk1', 'chunk2']),
          },
        },
        {
          provide: SupabaseService,
          useValue: {
            client: {
              from: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              order: jest.fn().mockResolvedValue({ data: [] }),
              insert: jest.fn().mockResolvedValue({ data: null, error: null }),
              delete: jest.fn().mockReturnThis(),
              single: jest.fn().mockResolvedValue({ data: { id: '123' }, error: null }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<KnowledgeService>(KnowledgeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return empty array', async () => {
      const articles = await service.findAll();
      expect(articles).toEqual([]);
    });
  });

  describe('search', () => {
    it('should return empty results', async () => {
      const results = await service.search('test query');
      expect(results).toEqual([]);
    });
  });
});