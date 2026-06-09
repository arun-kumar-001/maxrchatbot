import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import * as request from 'supertest';

describe('MAXR API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/health', () => {
    it('should return health status', () => {
      return request(app.getHttpServer())
        .get('/api/health')
        .expect(200)
        .expect((res) => {
          expect(res.body.status).toBe('ok');
          expect(res.body).toHaveProperty('timestamp');
          expect(res.body).toHaveProperty('uptime');
          expect(res.body).toHaveProperty('version');
        });
    });
  });

  describe('POST /api/auth/register', () => {
    it('should fail with missing fields', () => {
      return request(app.getHttpServer())
        .post('/api/auth/register')
        .send({})
        .expect(401);
    });
  });

  describe('POST /api/auth/login', () => {
    it('should fail with invalid credentials', () => {
      return request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ email: 'test@test.com', password: 'wrong' })
        .expect(401);
    });
  });

  describe('GET /api/admin/dashboard', () => {
    it('should return 401 without auth', () => {
      return request(app.getHttpServer())
        .get('/api/admin/dashboard')
        .expect(401);
    });
  });

  describe('GET /api/leads', () => {
    it('should return 401 without auth', () => {
      return request(app.getHttpServer())
        .get('/api/leads')
        .expect(401);
    });
  });

  describe('POST /api/knowledge/upload', () => {
    it('should return 401 without auth', () => {
      return request(app.getHttpServer())
        .post('/api/knowledge/upload')
        .send({ title: 'test', content: 'test content' })
        .expect(401);
    });
  });
});