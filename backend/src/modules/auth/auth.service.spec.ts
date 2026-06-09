import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { SupabaseService } from '../../core/database/supabase.service';

describe('AuthService', () => {
  let service: AuthService;

  const mockQueryBuilder: any = {
    select: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    single: jest.fn().mockResolvedValue({ data: { role: 'customer' }, error: null }),
  };

  const mockSupabase = {
    client: {
      auth: {
        signInWithPassword: jest.fn().mockResolvedValue({
          data: { user: { id: '123', email: 'test@test.com', user_metadata: { role: 'customer' } } },
          error: null,
        }),
        signUp: jest.fn().mockResolvedValue({
          data: { user: { id: '123', email: 'test@test.com' } },
          error: null,
        }),
      },
      from: jest.fn().mockReturnValue(mockQueryBuilder),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('test-token'),
            verify: jest.fn().mockReturnValue({ sub: '123', email: 'test@test.com', role: 'customer' }),
          },
        },
        { provide: SupabaseService, useValue: mockSupabase },
      ],
    }).compile();
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return token and user on success', async () => {
      const result = await service.login('test@test.com', 'password');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('user');
      expect(result.user.email).toBe('test@test.com');
    });

    it('should throw on invalid credentials', async () => {
      mockSupabase.client.auth.signInWithPassword.mockResolvedValueOnce({
        data: { user: null },
        error: { message: 'Invalid credentials' },
      });
      await expect(service.login('bad@test.com', 'wrong')).rejects.toThrow();
    });
  });

  describe('validateToken', () => {
    it('should validate and return payload', () => {
      const result = service.validateToken('valid-token');
      expect(result).toHaveProperty('sub');
      expect(result.sub).toBe('123');
    });

    it('should throw on invalid token', () => {
      const jwt = module.get<JwtService>(JwtService);
      jest.spyOn(jwt, 'verify').mockImplementationOnce(() => { throw new Error(); });
      expect(() => service.validateToken('bad-token')).toThrow();
    });
  });
});