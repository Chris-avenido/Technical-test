import request from 'supertest';
import app from '../src/app';
import prisma from '../src/lib/prisma';
import { SearchHistoryService } from '../src/services/searchHistory.service';

jest.mock('../src/lib/prisma', () => ({
  __esModule: true,
  default: {
    user: {
      upsert: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
    searchHistory: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}));

describe('SearchHistory Persistence & User Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('SearchHistoryService', () => {
    it('records a search into MySQL database', async () => {
      (prisma.user.upsert as jest.Mock).mockResolvedValueOnce({ id: 'demo-user-1' });
      (prisma.searchHistory.create as jest.Mock).mockResolvedValueOnce({
        id: 'hist-1',
        userId: 'demo-user-1',
        query: 'chocolate',
        language: 'fr',
        resultCount: 42,
      });

      await SearchHistoryService.recordSearch('chocolate', 'fr', 42);

      expect(prisma.user.upsert).toHaveBeenCalled();
      expect(prisma.searchHistory.create).toHaveBeenCalledWith({
        data: {
          userId: 'demo-user-1',
          query: 'chocolate',
          language: 'fr',
          resultCount: 42,
        },
      });
    });

    it('retrieves and deduplicates recent searches', async () => {
      const mockHistories = [
        { id: '1', query: 'Pizza', language: 'en', createdAt: new Date('2026-09-04T10:00:00Z') },
        { id: '2', query: 'pizza', language: 'nl', createdAt: new Date('2026-09-04T09:30:00Z') },
        { id: '3', query: 'Pasta', language: 'de', createdAt: new Date('2026-09-04T09:00:00Z') },
      ];

      (prisma.searchHistory.findMany as jest.Mock).mockResolvedValueOnce(mockHistories);

      const results = await SearchHistoryService.getRecentSearches('demo-user-1', 5);

      expect(results).toHaveLength(2); // 'pizza' is deduplicated case-insensitively
      expect(results[0].query).toBe('Pizza');
      expect(results[1].query).toBe('Pasta');
    });
  });

  describe('GET /api/user/searches', () => {
    it('returns recent searches for demo user', async () => {
      (prisma.searchHistory.findMany as jest.Mock).mockResolvedValueOnce([
        { id: '10', query: 'Nutella', language: 'en', createdAt: new Date() },
      ]);

      const res = await request(app).get('/api/user/searches?limit=5');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].query).toBe('Nutella');
    });
  });
});
