import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { AIFactory } from '../../core/ai/ai.factory';
import { OpenAIProvider } from '../../core/ai/openai.provider';
import { GroqProvider } from '../../core/ai/groq.provider';
import { PromptInjectionFilter } from '../../core/security/prompt-injection.filter';
import { SupabaseService } from '../../core/database/supabase.service';

describe('ChatService', () => {
  let service: ChatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        OpenAIProvider,
        GroqProvider,
        AIFactory,
        PromptInjectionFilter,
        {
          provide: SupabaseService,
          useValue: {
            client: {
              from: jest.fn().mockReturnThis(),
              select: jest.fn().mockReturnThis(),
              eq: jest.fn().mockReturnThis(),
              order: jest.fn().mockResolvedValue({ data: [] }),
              insert: jest.fn().mockResolvedValue({ data: null, error: null }),
              update: jest.fn().mockResolvedValue({ data: null, error: null }),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getHistory', () => {
    it('should return empty array for new conversation', async () => {
      const history = await service.getHistory('new-conv');
      expect(history).toEqual([]);
    });
  });
});