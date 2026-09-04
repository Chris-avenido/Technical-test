import request from 'supertest';
import app from '../src/app';
import { OpenFoodFactsService } from '../src/services/openFoodFacts.service';
import { StripeService } from '../src/services/stripe.service';
import { SearchHistoryService } from '../src/services/searchHistory.service';

jest.mock('../src/services/openFoodFacts.service');
jest.mock('../src/services/stripe.service');
jest.mock('../src/services/searchHistory.service');

describe('ProductController Endpoints & Nutrition Gating', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /api/products/search', () => {
    it('returns empty list for blank query without calling external API', async () => {
      const res = await request(app).get('/api/products/search?q=');
      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.products).toEqual([]);
      expect(OpenFoodFactsService.searchProducts).not.toHaveBeenCalled();
    });

    it('returns product search results and logs search history', async () => {
      (OpenFoodFactsService.searchProducts as jest.Mock).mockResolvedValueOnce({
        totalCount: 1,
        products: [
          {
            code: '001',
            name: 'Oat Milk',
            brand: 'Oatly',
            imageUrl: 'https://example.com/oat.jpg',
            thumbnailUrl: 'https://example.com/oat-thumb.jpg',
            categories: ['Plant milk'],
            nutriscoreGrade: 'B',
          },
        ],
      });
      (SearchHistoryService.recordSearch as jest.Mock).mockResolvedValueOnce(undefined);

      const res = await request(app).get('/api/products/search?q=oat&lang=de');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.query).toBe('oat');
      expect(res.body.data.language).toBe('de');
      expect(res.body.data.products).toHaveLength(1);
      expect(res.body.data.products[0].name).toBe('Oat Milk');
      expect(SearchHistoryService.recordSearch).toHaveBeenCalledWith('oat', 'de', 1);
    });
  });

  describe('GET /api/products/:code (Subscription Gating)', () => {
    const mockRawProduct = {
      code: '3017620422003',
      name: 'Nutella',
      brand: 'Ferrero',
      imageUrl: 'https://example.com/nutella.jpg',
      thumbnailUrl: 'https://example.com/nutella-thumb.jpg',
      categories: ['Spreads'],
      nutriscoreGrade: 'E',
      quantity: '400g',
      ingredientsText: 'Sugar, Palm Oil, Hazelnuts',
      rawNutriments: {
        'energy-kcal_100g': 539,
        fat_100g: 30.9,
        sugars_100g: 56.3,
        proteins_100g: 6.3,
      },
    };

    it('locks detailed nutritional values when demo user is UNSUBSCRIBED', async () => {
      (OpenFoodFactsService.getProductByCode as jest.Mock).mockResolvedValueOnce(mockRawProduct);
      (StripeService.isDemoUserSubscribed as jest.Mock).mockResolvedValueOnce(false);

      const res = await request(app).get('/api/products/3017620422003?lang=en');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.code).toBe('3017620422003');
      expect(res.body.data.name).toBe('Nutella');
      expect(res.body.data.isSubscribed).toBe(false);
      expect(res.body.data.nutritionLocked).toBe(true);
      expect(res.body.data.nutriments).toBeNull();
      expect(res.body.data.subscriptionPrompt).toBeDefined();
    });

    it('unlocks full nutritional values when demo user is SUBSCRIBED', async () => {
      (OpenFoodFactsService.getProductByCode as jest.Mock).mockResolvedValueOnce(mockRawProduct);
      (StripeService.isDemoUserSubscribed as jest.Mock).mockResolvedValueOnce(true);
      (OpenFoodFactsService.parseNutriments as jest.Mock).mockReturnValueOnce({
        energyKcal100g: 539,
        fat100g: 30.9,
        sugars100g: 56.3,
        proteins100g: 6.3,
      });

      const res = await request(app).get('/api/products/3017620422003?lang=fr');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.isSubscribed).toBe(true);
      expect(res.body.data.nutritionLocked).toBe(false);
      expect(res.body.data.nutriments).toEqual({
        energyKcal100g: 539,
        fat100g: 30.9,
        sugars100g: 56.3,
        proteins100g: 6.3,
      });
    });

    it('returns 404 when product barcode does not exist', async () => {
      (OpenFoodFactsService.getProductByCode as jest.Mock).mockResolvedValueOnce(null);

      const res = await request(app).get('/api/products/000000000000');

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
      expect(res.body.error.code).toBe('PRODUCT_NOT_FOUND');
    });
  });
});
