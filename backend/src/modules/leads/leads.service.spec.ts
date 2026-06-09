import { Test, TestingModule } from '@nestjs/testing';
import { LeadsService } from './leads.service';
import { SupabaseService } from '../../core/database/supabase.service';

describe('LeadsService', () => {
  let service: LeadsService;

  const mockQueryBuilder = {
    insert: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    order: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { id: 'test-id' }, error: null }),
    update: jest.fn().mockReturnThis(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LeadsService,
        {
          provide: SupabaseService,
          useValue: {
            client: {
              from: jest.fn().mockReturnValue(mockQueryBuilder),
            },
          },
        },
      ],
    }).compile();
    service = module.get<LeadsService>(LeadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return empty array', async () => {
      mockQueryBuilder.order.mockResolvedValueOnce({ data: [] });
      const leads = await service.findAll();
      expect(leads).toEqual([]);
    });
  });

  describe('create', () => {
    it('should create a lead', async () => {
      const lead = await service.create({
        conversation_id: 'conv-1',
        name: 'Test User',
        email: 'test@test.com',
      });
      expect(lead).toHaveProperty('id');
    });
  });

  describe('update', () => {
    it('should update a lead', async () => {
      const lead = await service.update('test-id', { status: 'qualified' });
      expect(lead).toHaveProperty('id');
    });
  });
});
